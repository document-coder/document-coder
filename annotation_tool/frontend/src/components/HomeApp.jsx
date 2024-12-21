import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import Heading from "src/components/widgets/Heading";
import { CURRENT_USER } from "src/constants";

class HomeApp extends Component {
  render() {
    const {
      model: {
        project: { name: project_name, settings: { meeting_notes, coding_documentation, question_info } = {} },
      },
      match: {
        params: { project_prefix }
      }
    } = this.props;
    return (
      <div id="home-app" className="page-root">
        <Heading title={project_name} project_prefix={project_prefix} />
        <div id="main-menu">
          <div className="menu-block">
            <h2> Annotate Documents: </h2>
            <ul>
              <li>
                <a href={`/c/${project_prefix}/coder-status/${CURRENT_USER}`}>Your Tasks</a>
              </li>
              <li>
                <a href={`/c/${project_prefix}/coder-status`}>Everyone's Tasks</a>
              </li>
              <li>
                <a href={`/c/${project_prefix}/progress`}>Project Progress</a>
              </li>
            </ul>
          </div>
          <div className="menu-block">
            <h2> Research Tools: </h2>
            <ul>
              <li>
                <a href={`/c/${project_prefix}/coding`}>Edit Annotation Scheme</a>
              </li>
              <li>
                <a href={`/c/${project_prefix}/policy`}>Upload & Manage Docs</a>
              </li>
              <li>
                <a href={`/c/${project_prefix}/data`}>Explore Data</a>
              </li>
              <li>
                <a href={`/c/${project_prefix}/user-management`}>User Management</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeApp));

