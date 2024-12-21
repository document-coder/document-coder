import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  {}
)(
  class PolicyOverview extends Component {
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
        <div className="policy-browser-overview">
          <h1> {policy.company_name} </h1>
          <div> Alexa Rank: {policy.alexa_rank} </div>
          <div>
            Policies Included:
            {_.map(_.values(this.props.content), (doc, i) => (
              <div
                className="policy-browser-overview-token"
                key={i}
                id={`document-${doc.ordinal}`}
                onClick={() => this.scrollToPolicy(doc.ordinal)}
              >
                {doc.title}
              </div>
            ))}
          </div>
          {(policy.urls._robot_rules || "").indexOf("ia_archiver") >= 0 ? (
            <b>
              NOTE: site has explicit anti-archival code in robots.txt, archival data is suspect.
            </b>
          ) : (
            ""
          )}
        </div>
      );
    }
  }
);
