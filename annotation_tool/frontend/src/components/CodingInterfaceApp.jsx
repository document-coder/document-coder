// @ts-ignore
import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import CodingForm from "src/components/coding-interface/CodingForm";
import PolicyBrowser from "src/components/coding-interface/PolicyBrowser";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import SessionTimer from "src/components/utils/SessionTimer";
import Logger from "src/Logger";
import withParams from "src/components/utils/withParams";
const log = Logger("coding_interface", "pink");

class CodingInterfaceApp extends Component {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { mode, coding_id, policy_instance_id },
      },
    } = this.props;
    this.props.apiGetPolicyInstance(policy_instance_id);
    this.props.apiGetCoding(coding_id);
    this.props.apiGetCodingInstance(policy_instance_id, coding_id);
    this.props.appSetCurrentView(policy_instance_id, coding_id, mode == "merge");
    if (mode == "merge") {
      this.props.apiGetAllCodingInstances(policy_instance_id, coding_id);
    }
    // @ts-ignore
    window.SESSION_TIMER = new SessionTimer(CURRENT_USER, coding_id, policy_instance_id);
    // @ts-ignore
    window.setInterval(_.throttle(window.SESSION_TIMER.post_update, 29 * 1000), 30 * 1000);
  }

  render() {
    const {
      match: {
        params: { mode, coding_id, policy_instance_id },
      },
    } = this.props;
    return (
      <div className="container">
        <PolicyBrowser coding_id={coding_id} policy_instance_id={policy_instance_id} />
        <CodingForm coding_id={coding_id} policy_instance_id={policy_instance_id} />
      </div>
    );
  }
}

export default withParams(connect(mapStateToProps, mapDispatchToProps)(CodingInterfaceApp));
