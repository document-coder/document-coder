import React, { Component } from "react";
import { connect } from "react-redux";
import { scrollToSentenceTarget, stringifySentences } from "src/components/utils/displayUtils";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import { MergeTool } from "./MergeElements";
import QuestionValueCommentBox from "./QuestionValueCommentBox";
import QuestionValueSelector from "./QuestionValueSelector";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class MultiselectActiveArea extends Component {
    render() {
      const {
        is_active,
        sentences,
        cur_question,
        mergeData,
        content: { identifier, info: details, questionOptions: values, question_type },
        localState: { merge_mode },
      } = this.props;
      return (
        <div className={is_active ? "active-selection-area" : "inactive-selection-area"}>
          <hr />
          <div className="coding-form-question-info">{details ?? ""}</div>
          {merge_mode ? (
            <MergeTool question_identifier={identifier} mergeData={mergeData} />
          ) : (
            <div />
          )}
          <div className="coding-form-sentence-list">
            {stringifySentences(sentences).map((s, i) => (
              <div
                key={i}
                onClick={scrollToSentenceTarget}
                className="sentence-index-button"
                // @ts-ignore
                target={`paragraph-${s.policy_type}-${s.paragraph_idx}`}
              >
                {s.pretty_string}
              </div>
            ))}
          </div>
          <QuestionValueSelector
            question_identifier={identifier}
            values={values}
            singleselect={["singleselect"].indexOf(question_type) > -1}
          />
          <QuestionValueCommentBox question_identifier={identifier} values={cur_question} />
        </div>
      );
    }
  }
);
