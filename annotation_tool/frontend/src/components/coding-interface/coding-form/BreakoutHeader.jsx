import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { userSelectQuestion } from "src/actions/userActions";
import { sentenceCount } from "src/components/utils/displayUtils";
import mapStateToProps from "src/components/utils/mapStateToProps";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import MultiselectActiveArea from "./MultiselectActiveArea";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class BreakoutHeader extends Component {
    constructor(props, context) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userSelectQuestion(this.props.idx, this.props.content.identifier);
      // @ts-ignore
      window.SESSION_TIMER.run_timer(this.props.content.identifier);
    }

    render() {
      const cur_question =
        this.props.localState.localCodingInstance[this.props.content.identifier] ||
        this.props.localState.localCodingInstance[this.props.idx] ||
        {};
      const sentences = cur_question.sentences || {};
      const number_of_sentences = sentenceCount(sentences);
      const is_active = this.props.content.identifier.startsWith(
        this.props.localState.selectedQuestionIdentifier.split("(")[0]
      );
      const cur_values = cur_question.values || {};
      const cur_confidence = cur_question.confidence || "unspecified";
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => (k === "OTHER" ? `OTHER:${cur_values[k]}` : k));
      const classes =
        "coding-form-question " + (is_active ? "active-question" : "inactive-question");

      const active_area = (
        <MultiselectActiveArea
          content={this.props.content}
          idx={this.props.idx}
          is_active={is_active}
          sentences={sentences}
          cur_question={cur_question}
        />
      );

      return (
        <div className="coding-form-breakout-master-container">
          <div className={classes} onClick={is_active ? null : this.handleClick}>
            <div className="coding-form-question-title">
              {this.props.count}. {this.props.content.question}
            </div>
            <div className="coding-form-question-sentence-count">
              <hr />
              <div className="coding-form-question-info">{this.props.content.info}</div>
            </div>
          </div>
        </div>
      );
    }
  }
);
