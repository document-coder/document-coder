import React, { Component } from "react";
import { connect } from "react-redux";
import PolicyAdminOverview from "src/components/policy-app/PolicyAdminOverview";
import PolicyList from "src/components/policy-app/PolicyList";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import withParams from "src/components/utils/withParams";

class PolicyApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
    this.props.apiGetPolicies();
  }

  render() {
    const {
      model: {
        policies,
        project: { settings: project_settings = {} },
      },
      match: {
        params: { policy_id = undefined, project_prefix },
      },
    } = this.props;
    if (policies._unloaded || project_settings._unloaded) return <Loading />;
    return (
      <div id="policy-admin" className="page-root">
        <Heading title="Manage Documents" project_prefix={project_prefix} />
        <div id="policy-admin-container">
          {policy_id ? (
            <PolicyAdminOverview policy_id={policy_id} />
          ) : (
            <PolicyList policies={policies} project_prefix={project_prefix} />
          )}
        </div>
      </div>
    );
  }
}

export default withParams(connect(mapStateToProps, mapDispatchToProps)(PolicyApp));
