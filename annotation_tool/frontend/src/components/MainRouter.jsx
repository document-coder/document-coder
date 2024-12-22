import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssignmentListApp from "src/components/AssignmentListApp";
import CodingEditorApp from "src/components/CodingEditorApp";
import CodingInterfaceApp from "src/components/CodingInterfaceApp";
import HomeApp from "src/components/HomeApp";
import ProgressViewApp from "src/components/ProgressViewApp";
import ProjectListApp from "src/components/ProjectListApp";
import DataApp from "src/components/DataApp";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import PolicyManagementApp from "src/components/policy-management/PolicyManagement";
import UserManagementApp from "src/components/UserManagementApp";
import AssignmentManagementApp from "src/components/AssignmentManagementApp";

const PREFIX = `/c/:project_prefix`;

const MainURLSwitch = withParams(connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class MainURLSwitch extends Component {
    render() {
      const {
        model: { project },
      } = this.props;
      if (!project) {
        return <div>one sec...</div>;
      }
      const path = this.props.match.params["*"];
      return (
        <Routes>
          {/* CODING TOOL */}
          <Route
            path={`code-policy/:_policy_instance_info/:_coding_info`}
            element={<CodingInterfaceApp mode="policy" />}
          />
          <Route
            path={`code-merge/:_policy_instance_info/:_coding_info`}
            element={<CodingInterfaceApp mode="merge" />}
          />
          <Route path={`code-policy/:policy_instance_info`} element={<CodingInterfaceApp />} />
          <Route path={`code-merge/:policy_instance_info`} element={<CodingInterfaceApp />} />
          {/* DOWNLOADING TOOLS */}
          <Route path={`policy`} element={<PolicyManagementApp />} />
          <Route path={`coder-status/:coder_email`} element={<AssignmentManagementApp />} />
          <Route path={`coder-status`} element={<AssignmentManagementApp />} />
          {/* CODING STATUS PAGES */}
          <Route path={`progress`} element={<ProgressViewApp />} />
          {/* CODING EDITOR */}
          <Route path={`coding/:coding_id`} element={<CodingEditorApp />} />
          <Route path={`coding/`} element={<CodingEditorApp />} />
          <Route path={`data/`} element={<DataApp />} />
          <Route path={`user-management/`} element={<UserManagementApp />} />
        </Routes>
      );
    }
  }
));

export default withParams(connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class MainRouter extends Component {
    constructor(props) {
      super(props);
      const project_id = window.location.pathname.match(/^\/c\/([^\/]+)/)?.[1];
      if (project_id !== undefined)
        this.props.apiGetProjectSettings(project_id);
    }
    render() {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProjectListApp />} />
            <Route path="/c/:project_prefix/*" element={<MainURLSwitch />} />
            <Route path="/c/:project_prefix/" element={<HomeApp />} />
          </Routes>
        </BrowserRouter>
      );
    }
  }
));