import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import SortableTable from "src/components/widgets/SortableTable";
import { DEFAULT_ROLES, ROLES } from "src/constants";

class UserManagementApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetProjectRoles();
  }
  addUser() {
    const email = document.getElementById("add-user-email").value;
    this.props.apiPostProjectRole({
      user_email: email,
      ...DEFAULT_ROLES
    });
    document.getElementById("add-user-email").value = '';
  }
  render() {
    const {
      apiPostProjectRole,
      model: { project_roles } } = this.props;
    if (project_roles._unloaded) {
      return <Loading />;
    }
    const role_columns = ROLES.map((role) => ({
      name: role.replace("can_", "").replaceAll("_", " "),
      display_fn: (project_role) => {
        return <label><input
          type="checkbox"
          checked={project_role[role]}
          onChange={() => {
            apiPostProjectRole({
              ...project_role,
              [role]: !project_role[role],
            });
          }}
          readOnly={true}
        /></label>;
      },
      sort_fn: (project_role) => project_role[role],

    }));
    const _COLUMNS = [
      {
        name: "Email",
        display_fn: (role) => role.user_email,
        sort_fn: (role) => role.user_email,
      },
      ...role_columns,
    ]
    return (
      <div id="user-management-app" className="page-root card-app-root">
        <Heading title={"User Management"} />
        <div className="card-app-content">
          <div id="user-management-table">
            <SortableTable id="coding-list-table" items={_.values(project_roles)} columns={_COLUMNS} />
            <div id="add-user-row">
              <input
                type="text"
                id="add-user-email"
                placeholder="Email"
                onKeyUp={
                  (event) => {
                    if (event.key === "Enter") {
                      this.addUser();
                    }
                  }
                } />
              <button
                onClick={() => this.addUser()}
              > add new user </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagementApp));

