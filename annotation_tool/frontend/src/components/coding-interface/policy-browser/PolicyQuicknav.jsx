import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  {}
)(
  class PolicyQuicknav extends Component {
    scrollToPolicy(ordinal) {
      document
        .getElementById(`policy-doc-${ordinal}`)
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
    render() {
      const policy = this.props.model.policies[this.props.policy_id];
      if (!policy) {
        return <div />;
      }
      document.title = `${
        this.props.localState.updateSinceLastSave ? policy.company_name : "* " + policy.company_name
      }`;
      return (
        <div className="policy-quicknav">
          {_.map(_.values(this.props.content), (doc, i) => (
            <div
              className="policy-quicknav-item"
              key={i}
              onClick={() => this.scrollToPolicy(doc.ordinal)}
            >
              <div className="policy-quicknav-ordinal">
                {doc.ordinal}
                <div className="policy-quicknav-title">{doc.title}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
);
