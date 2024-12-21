import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import PolicyInfoBox from "src/components/policy-app/PolicyInfoBox";
import PolicyInstanceList from "src/components/policy-app/PolicyInstanceList";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import Logger from "src/Logger";
const log = Logger("policy-admin", "blue");

class PolicyAdminOverview extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetPolicyAssociatedData(this.props.policy_id);
  }

  render() {
    const {
      model: { policy_instances, coding_instances, policies },
      policy_id,
    } = this.props;
    const policy = policies[policy_id];
    return (
      <div id="policy-instance-admin-container">
        <div id="policy-info-box">
          <h1> Overview </h1>
          <PolicyInfoBox policy={policy} />
        </div>
        <div id="policy-snapshot-list">
          <h1> Snapshots </h1>
          <PolicyInstanceList
            policy_instances={policy_instances}
            coding_instances={coding_instances}
            policy_id={policy_id}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PolicyAdminOverview);
