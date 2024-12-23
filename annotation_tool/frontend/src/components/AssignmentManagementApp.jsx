import _, { get } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import SortableTable from "src/components/widgets/SortableTable";
import { CURRENT_USER } from "src/constants";
import AssignmentCreationDialog from "src/components/assignment-management/AssignmentCreationDialog";
import { get_assignment_column_list } from "src/components/assignment-management/assignmentManagementUtils";

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
    this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
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

  wrapRenderedContent(content) {
    const {
      match: { params: { project_prefix } }
    } = this.props;
    return (
      <div id="assignment-management" className="page-root card-app-root">
        <Heading
          title="Assignment Management"
          project_prefix={project_prefix}
        />
        <div className="card-app-content">
          {content}
        </div>
      </div>
    );
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
      return this.wrapRenderedContent(<div className="create-assignment-holder">
        {coder_email ? (
          `There is currently nothing assigned to ${coder_email}`
        ) : (
          "There are no assignments in this project"
        )}
      </div>);
    }
    const columns = get_assignment_column_list({
      annotators,
      setAssigneeCallback: this.handleAssignTo,
      statusChangeCallback: this.handleUpdateStatus
    })

    const createDiv = <div className="create-assignment-holder">
      {!this.state.showCreateForm ? (
        project_roles[CURRENT_USER].can_annotate &&
        <button
          onClick={() => this.setState({ showCreateForm: true })}
          className="create-button">
          Create New Assignment
        </button>
      ) : (
        <AssignmentCreationDialog
          policyInstances={policy_instances}
          policies={policies}
          projectPrefix={project_prefix}
          defaultCoding={project.settings.default_coding}
          onSubmit={this.handleCreateAssignment}
          onCancel={() => this.setState({ showCreateForm: false })}
        />
      )}
    </div>
    return this.wrapRenderedContent(<div className="assignments-table">
      <SortableTable
        items={_.values(filtered_assignments)}
        columns={columns}
        sortColumnIdx={1}
      />
      {!coder_email && createDiv}
    </div>
    );
  }
}

export default withParams(
  connect(mapStateToProps, mapDispatchToProps)(AssignmentManagementApp)
);