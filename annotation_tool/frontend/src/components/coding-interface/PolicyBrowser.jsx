import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import PolicyOverview from "src/components/coding-interface/policy-browser/PolicyOverview";
import PolicyQuicknav from "src/components/coding-interface/policy-browser/PolicyQuicknav";
import PolicyPage from "src/components/coding-interface/policy-browser/PolicyPage";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  {} // functions
)(
  class PolicyBrowser extends Component {
    componentDidMount() {
      this._pbc = document.getElementById("policy-browser-container");
      this._pbc = this._pbc.onscroll = _.throttle(
        this.__checkTheRightHeadingIsActiveOnScroll.bind(this),
        100,
        {
          leading: true,
        }
      );
    }
    __checkTheRightHeadingIsActiveOnScroll(e) {
      this._pbc = document.getElementById("policy-browser-container");
      const headings = document.getElementsByClassName("policy-browser-section-container");
      const idx = _.sum(_.map(headings, (h) => this._pbc.scrollTop - h.offsetTop > 0)) - 1;
      for (var _i = 0; _i < headings.length; _i++) {
        const h = headings[_i];
        if (_i === idx) {
          h.classList.add("active-policy");
        } else {
          h.classList.remove("active-policy");
        }
      }
    }
    render() {
      const {
        policy_instance_id,
        coding_id,
        model: {
          policy_instances: { [policy_instance_id]: policy_instance },
          policies: { [policy_instance?.policy_id]: policy },
        },
      } = this.props;
      if (policy == undefined || policy_instance == undefined) {
        return (
          <div className="policy-browser-container" id="policy-browser-container">
            loading...
          </div>
        );
      }
      return (
        <div className="policy-browser-container" id="policy-browser-container">
          <PolicyOverview
            policy_id={policy.id}
            policy_instance={policy_instance}
            content={policy_instance.content}
          />
          {policy_instance.content.map((policy_doc, key) => (
            <PolicyPage
              key={key}
              coding_id={coding_id}
              policy_id={policy.id}
              policy_instance={policy_instance}
              policy_doc={policy_doc}
            />
          ))}
          <div id="scrollbar-dots"></div>
          <PolicyQuicknav
            policy_id={policy.id}
            policy_instance={policy_instance}
            content={policy_instance.content}
          />
        </div>
      );
    }
  }
);
