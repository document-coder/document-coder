import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import SortableTable from "src/components/widgets/SortableTable";
import { CURRENT_USER } from "src/constants";

const getPolicyInstanceLabel = (policyInstance, policies) => {
  const policy = policies[policyInstance.policy_id];
  return `${policy.name} - ${policyInstance.scan_dt}`;
};

const AssignToSelect = ({ assignment, annotators, onAssign }) => {
  const [selectedEmail, setSelectedEmail] = React.useState('');

  const handleChange = (e) => {
    const email = e.target.value;
    setSelectedEmail(email);
    onAssign(assignment, email || null);
  };

  return (
    <select
      value={selectedEmail}
      onChange={handleChange}>
      <option value="">Select annotator...</option>
      {annotators.map(role => (
        <option key={role.user_email} value={role.user_email}>
          {role.user_email}
        </option>
      ))}
    </select>
  );
};


const CreateAssignmentDialog = ({
  onSubmit,
  onCancel,
  policyInstances,
  policies,
  projectPrefix,
  defaultCoding
}) => {
  const [policyInstanceId, setPolicyInstanceId] = React.useState('');
  const [label, setLabel] = React.useState('');

  if (policyInstances._unloaded) {
    return <Loading />;
  }

  const handleSubmit = () => {
    const url = `/c/${projectPrefix}/code-policy/${policyInstanceId}-${label}/${defaultCoding}`;

    onSubmit({
      url,
      label,
      status: "UNASSIGNED"
    });
  };

  return (
    <div className="create-assignment-form">
      <select
        value={policyInstanceId}
        onChange={(e) => {
          setPolicyInstanceId(e.target.value);
          setLabel(getPolicyInstanceLabel(policyInstances[e.target.value], policies).slice(0, 30));
        }}>
        <option value="">Select document collection...</option>
        {_.map(
          _.sortBy(policyInstances, (pi) => -pi.id), pi => (
            <option key={pi.id} value={pi.id}>{
              getPolicyInstanceLabel(pi, policies)
            }</option>
          ))}
      </select>

      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Document Collection Name..."
      />

      <button
        onClick={handleSubmit}
        disabled={!policyInstanceId || !label}>
        Create Assignment
      </button>

      <button onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

class AssignmentManagementApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetAssignments();
    this.props.apiGetPolicyInstancesMeta();
    this.props.apiGetProjectRoles();
    this.props.apiGetPolicies();
    this.state = {
      showCreateForm: false
    };

    this.handleCreateAssignment = this.handleCreateAssignment.bind(this);
    this.handleAssignTo = this.handleAssignTo.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
  }

  handleCreateAssignment(assignmentData) {
    console.log(assignmentData)
    this.props.apiPostAssignment(assignmentData);
    this.setState({ showCreateForm: false });
  }

  handleAssignTo(assignment, coderEmail) {
    this.props.apiPostAssignment({
      ...assignment,
      coder_email: coderEmail,
      status: coderEmail ? "ASSIGNED" : "UNASSIGNED"
    });
  }

  handleUpdateStatus(assignment, status) {
    this.props.apiPostAssignment({
      ...assignment,
      status
    });
  }

  renderColumns(annotators) {
    return [
      {
        name: "Document Collection",
        display_fn: (assignment) => assignment.label,
        sort_fn: (assignment) => assignment.label
      },
      {
        name: "Status",
        display_fn: (assignment) => assignment.status,
        sort_fn: (assignment) => assignment.status
      },
      {
        name: "Assigned To",
        display_fn: (assignment) => {
          if (assignment.status === "UNASSIGNED") {
            return (
              <AssignToSelect
                assignment={assignment}
                annotators={annotators}
                onAssign={(assignment, email) => this.handleAssignTo(assignment, email)}
              />
            );
          } else {
            return <div className="assignee-cell">
              <span> {assignment.coder_email}</span>
              <button
                onClick={() => this.handleAssignTo(assignment, null)}
                className="unassign-button">
                Unassign
              </button>
            </div>
          }
          return;
        },
        sort_fn: (assignment) => assignment.coder_email || "zzz"
      },
      {
        name: "Link",
        display_fn: (assignment) => {
          return <>
            {(assignment.coder_email === CURRENT_USER) &&
              <a href={assignment.url} target="_blank" rel="noreferrer">
                Go to annotation screen
              </a>}
          </>
        }
      }, {
        name: "Actions",
        display_fn: (assignment) => (
          <div className="assignment-actions">
            {assignment.coder_email === CURRENT_USER && <>
              <div><button onClick={() => this.handleUpdateStatus(assignment, "COMPLETE")}> Complete </button></div>
              <div><button onClick={() => this.handleUpdateStatus(assignment, "IN_PROGRESS")}> In Progress </button></div>
            </>}
          </div>
        )
      }
    ];
  }

  render() {
    const {
      model: { assignments, policy_instances, project_roles, project, policies },
      match: { params: { coder_email, project_prefix } }
    } = this.props;

    if (assignments._unloaded || project_roles._unloaded) {
      return <Loading />;
    }

    const annotators = _.filter(project_roles, role => role.can_annotate);
    const filtered_assignments = coder_email ?
      _.filter(assignments, a => a.coder_email === coder_email) :
      assignments;

    if (filtered_assignments.length === 0) {
      return <div className="create-assignment-holder">
        {coder_email ? (
          `There is currently nothing assigned to ${coder_email}`
        ) : (
          "There are no assignments in this project"
        )}
      </div>
    }

    const createDiv = <div className="create-assignment-holder">
      {!this.state.showCreateForm ? (
        project_roles[CURRENT_USER].can_annotate &&
        <button
          onClick={() => this.setState({ showCreateForm: true })}
          className="create-button">
          Create New Assignment
        </button>
      ) : (
        <CreateAssignmentDialog
          policyInstances={policy_instances}
          policies={policies}
          projectPrefix={project_prefix}
          defaultCoding={project.settings.default_coding}
          onSubmit={this.handleCreateAssignment}
          onCancel={() => this.setState({ showCreateForm: false })}
        />
      )}
    </div>
    return (
      <div id="assignment-management" className="page-root card-app-root">
        <Heading
          title="Assignment Management"
          project_prefix={project_prefix}
        />
        <div className="card-app-content">
          <div className="assignments-table">
            <SortableTable
              items={_.values(filtered_assignments)}
              columns={this.renderColumns(annotators)}
              sortColumnIdx={1}
            />
            {!coder_email && createDiv}
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(
  connect(mapStateToProps, mapDispatchToProps)(AssignmentManagementApp)
);