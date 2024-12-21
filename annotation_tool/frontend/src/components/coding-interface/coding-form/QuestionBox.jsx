import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { randomColor, sentenceCount } from "src/components/utils/displayUtils";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import { MergeBoxHeader } from "./MergeElements";
import MultiselectActiveArea from "./MultiselectActiveArea";
import QuestionBoxHeader from "./QuestionBoxHeader";

/**
 * A question box contains a single question, and behaves and appears differently depending on
 * if it has focus.
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class QuestionBox extends Component {
    constructor(props, context) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userSelectQuestion(this.props.content.id, this.props.category_id);
      // @ts-ignore
      window.SESSION_TIMER.run_timer(this.props.content.id);
    }

    getMergeData() {
      const {
        model: { coding_instances },
        content: { id: identifier },
      } = this.props;
      const to_ret = { responses: [], authors: [] };
      for (var ci of _.values(coding_instances)) {
        const coding_values = ci.coding_values[identifier];
        if (coding_values) {
          to_ret.responses.push(coding_values);
          to_ret.authors.push(ci.coder_email);
        }
      }
      return to_ret;
    }

    render() {
      const {
        count,
        category_id,
        category_label,
        content: {
          info,
          id: identifier,
          meta: { notes, source },
          type: { label: question_type_label, value: question_type },
          label,
          description,
          questionOptions,
        },
        localState: {
          localCodingInstance: { [identifier]: cur_question_state = {} },
          merge_mode,
        },
      } = this.props;
      const mergeData = this.getMergeData();
      const sentences = cur_question_state.sentences ?? {};
      const number_of_sentences = sentenceCount(sentences);
      const is_active = identifier == this.props.localState.selectedQuestionIdentifier;
      const cur_values = cur_question_state.values ?? {};
      const cur_confidence = cur_question_state.confidence ?? "unspecified";
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => (k === "OTHER" ? `OTHER:${cur_values[k]}` : k));
      const classes =
        "coding-form-question " + (is_active ? "active-question" : "inactive-question");

      const active_area = (
        <MultiselectActiveArea
          content={{ identifier, description, questionOptions, question_type, notes, source, info }}
          is_active={is_active}
          sentences={sentences}
          cur_question={cur_question_state}
          mergeData={mergeData}
        />
      );

      return (
        <div className="coding-form-question-container">
          <div className={classes} id={identifier} onClick={is_active ? null : this.handleClick}>
            <div
              className="coding-form-question-title"
              style={is_active ? { backgroundColor: randomColor(category_label, 70, 40) } : {}}
            >
              {count}. {label} (<i>{identifier}</i>)
            </div>
            <div className="coding-form-question-sentence-count">
              {merge_mode ? (
                <MergeBoxHeader value_strings={value_strings} mergeData={mergeData} />
              ) : (
                <QuestionBoxHeader
                  number_of_sentences={number_of_sentences}
                  value_strings={value_strings}
                  confidence={cur_confidence}
                  comment={cur_question_state.comment}
                  question_type={question_type}
                />
              )}
              <hr />
              <div className="coding-form-question-info">{description}</div>
            </div>
            {is_active ? active_area : <div className="inactive-selection-area" />}
          </div>
        </div>
      );
    }
  }
);
