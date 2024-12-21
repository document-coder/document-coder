import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import SortableAssignmentTable from "src/components/assignment-list/SortableAssignmentTable";
import mapStateToProps from "src/components/utils/mapStateToProps";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import withParams from "src/components/utils/withParams";

class AssignmentListApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetAssignments();
    // do stuff
  }

  render() {
    // Props matcher
    const {
      model: { assignments },
      match: {
        params: { coder_email = undefined, project_prefix },
      },
    } = this.props;
    console.log("ASSIGNMENTS", assignments);
    if (assignments._unloaded) return <Loading />;

    const coder_assignments = _.groupBy(assignments, "coder_email");
    const coder_emails = coder_email ? [coder_email] : _.sortBy(_.keys(coder_assignments));
    console.log(coder_emails);
    return (
      <div id="assignment-list" className="page-root">
        <Heading
          title={`Assignments for ${coder_email || "everyone"}`}
          project_prefix={project_prefix}
        />
        <div id="contents">
          {coder_emails.map((coder) => (
            <div className="coder-assignments" key={coder}>
              <h2>
                <a href={coder}>{coder}</a>
              </h2>
              <SortableAssignmentTable assignments={coder_assignments[coder]} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withParams(connect(mapStateToProps, mapDispatchToProps)(AssignmentListApp));
