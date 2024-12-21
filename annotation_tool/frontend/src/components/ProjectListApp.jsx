import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import Loading from "src/components/widgets/Loading";
import Heading from "src/components/widgets/Heading";
/**
 * renders the landing page for logged in users. Shows a list of projects they are a part of, a list of projects they
 * are not a part of, links to documentation. logout button is in the header bar.
 */
class ProjectListApp extends Component {
  constructor(props, context) {
    super(props, context);
    this.props.apiGetProjectList();
  }
  render() {
    const {
      model: { projects },
    } = this.props;
    if (projects._unloaded) {
      return <Loading />;
    }
    const project_list = _.sortBy(_.values(projects));
    console.log("PROJECTS", projects);
    return (
      <div id="project-list-app" className="page-root">
        <Heading
          title={`Project List`}
          project_prefix={undefined}
        />
        <div className="project-list-menu">
          <div className="menu-block">
            <h1> Projects </h1>
            <ul>
              {project_list.map((project) => (
                <li key={project.id}>
                  <a href={`/c/${project.prefix}`}>{project.name}</a>
                </li>
              ))}
              {projects.length === 0 && <li> (no projects found) </li>}
            </ul>
          </div>
          <div className="menu-block">
            <h1> Documentation </h1>
            <ul>
              <li>
                To add a new project, please contact the administrator of this server: ADMIN_NAME_HERE!
              </li>
              <li>
                Futher documentation can be found here, once someone writes it: LINK_GOES_HERE!
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}


export default withParams(connect(mapStateToProps, mapDispatchToProps)(ProjectListApp));