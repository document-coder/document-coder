import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { sentenceCount } from "src/components/utils/displayUtils";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import { MergeBoxHeader } from "./MergeElements";
import MultiselectActiveArea from "./MultiselectActiveArea";
import QuestionBoxHeader from "./QuestionBoxHeader";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class BreakoutOption extends Component {
    constructor(props, context) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userSelectQuestion(this.props.content.identifier);
      // @ts-ignore
      window.SESSION_TIMER.run_timer(this.props.content.identifier);
    }

    getMergeData() {
      const to_ret = { responses: [], authors: [] };
      for (var ci of _.values(this.props.model.coding_instances)) {
        const coding_values = ci.coding_values[this.props.content.identifier];
        if (coding_values) {
          to_ret.responses.push(coding_values);
          to_ret.authors.push(ci.coder_email);
        }
      }
      if (to_ret === undefined) console.log(to_ret);
      return to_ret;
    }

    render() {
      const mergeData = this.getMergeData();
      const cur_coding =
        this.props.localState.localCodingInstance[this.props.content.identifier] ||
        this.props.localState.localCodingInstance[this.props.idx] ||
        {};
      const sentences = cur_coding.sentences || {};
      const number_of_sentences = sentenceCount(sentences);
      const is_active =
        this.props.content.identifier == this.props.localState.selectedQuestionIdentifier;
      const is_active_breakout = this.props.content.identifier.startsWith(
        this.props.localState.selectedQuestionIdentifier.split("(")[0]
      );
      const cur_values = cur_coding.values || {};
      const cur_confidence = cur_coding.confidence || "unspecified";
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => (k === "OTHER" ? `OTHER:${cur_values[k]}` : k));
      const activity_classes = [
        is_active ? "active-question" : "inactive-question",
        is_active_breakout ? "active-breakout" : "inactive-breakout",
      ].join(" ");

      const active_area = (
        <MultiselectActiveArea
          content={this.props.content}
          idx={this.props.idx}
          is_active={is_active}
          sentences={sentences}
          cur_question={cur_coding}
          mergeData={mergeData}
        />
      );
      return (
        <div
          className={"coding-form-breakout-option-outer-container " + activity_classes}
          id={this.props.content.identifier}
        >
          <div className="coding-form-breakout-option-container">
            <div
              className={"coding-form-question " + activity_classes}
              onClick={is_active || (is_active && is_active_breakout) ? null : this.handleClick}
            >
              <div className="breakout-option-title">{this.props.content.question}</div>
              <div className="coding-form-question-sentence-count">
                {this.props.localState.merge_mode ? (
                  <MergeBoxHeader value_strings={value_strings} mergeData={mergeData} />
                ) : (
                  <QuestionBoxHeader
                    number_of_sentences={number_of_sentences}
                    value_strings={value_strings}
                    confidence={cur_confidence}
                  />
                )}
              </div>
              {is_active ? active_area : <div className="inactive-selection-area" />}
            </div>
          </div>
        </div>
      );
    }
  }
);
