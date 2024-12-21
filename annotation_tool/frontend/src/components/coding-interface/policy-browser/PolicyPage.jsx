import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import PolicyParagraph from "./PolicyParagraph";
import Logger from "src/Logger";
import { get } from "lodash";
const log = Logger("policyPage", "light-blue");

class SectionCounter {
  constructor() {
    this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.current = "1";
  }
  get_next(level) {
    this.state[level - 1]++;
    for (let i = level; i < this.state; i++) {
      this.state[i] = 1;
    }
    this.current = this.state.slice(0, level).join(".");
    return this.current;
  }
  get_current() {
    return this.current;
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class PolicyPage extends Component {
    scrollToTop() {
      document
        .querySelector(`.policy-browser-overview`)
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
    render() {
      const {
        policy_id,
        policy_doc,
        model: {
          policies: { [policy_id]: policy },
        },
      } = this.props;
      if (!policy || !policy_doc) {
        return <div> not loaded </div>;
      }
      const href = policy_doc?.href;
      const pageSettings = policy_doc?.settings || {};
      const counter = new SectionCounter();
      return (
        <div className={`policy-browser-section-container ${pageSettings.hideSectionNumbers ? "hide-section-numbers" : ""}`}>
          <div className="policy-browser-section-overview">
            <h3 id={`policy-doc-${policy_doc.ordinal}`}> {policy_doc.title} </h3>
            <div className='policy-browser-go-to-top' onClick={() => this.scrollToTop()}> top </div>
            {/* <div>
              URL of source document:
              <a href={href} target="_blank">
                {href}
              </a>
            </div>
            <div>
              Reference Snapshot (turned off for now)
              <a href={`/raw-policy/${this.props.policy_instance.id}/${policy_doc.ordinal}`}>
                View Original Snapshot
              </a>
            </div> */}
          </div>
          <div className="policy-browser-major-section">
            {policy_doc.content.map((paragraph, i) => (
              <PolicyParagraph
                idx={i}
                paragraph={paragraph}
                doc={policy_doc}
                key={i}
                sectionCounter={counter}
              />
            ))}
          </div>
        </div>
      );
    }
  }
);
