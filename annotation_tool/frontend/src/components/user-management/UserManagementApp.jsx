import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import Heading from "src/components/widgets/Heading";
import { CURRENT_USER } from "src/constants";

class UserManagementApp extends Component {
  render() {
    return (
      <div id="home-app" className="page-root">
        <Heading title={"User Management"} />
        <div id="main-menu">
          <div className="menu-block">
            TODO: add a UI for adding users and adjusting their permissions
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

