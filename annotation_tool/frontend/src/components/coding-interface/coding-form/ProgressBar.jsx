import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class ProgressBar extends Component {
    scrollToQuestion(question_id) {
      document.getElementById(question_id).scrollIntoView({ behavior: "smooth", block: "center" });
    }
    questionToProgressClass(question, localCodingInstance) {
      const questionCoding = localCodingInstance?.[question.id];
      if (!questionCoding) return "not-started";
      if (!questionCoding.confidence) return "not-finished";
      return `complete confidence-${questionCoding.confidence}`;
    }
    render() {
      const {
        coding,
        localState: { localCodingInstance, selectedQuestionIdentifier },
      } = this.props;
      return (
        <div id="progress-bar-container">
          <div id="progress-bar">
            <div id="progress-bar-label"> Progress: </div>
            {coding?.categories.map((category, c_idx) => (
              <div
                key={c_idx}
                className="category-progress-bar"
                style={{ flexGrow: category.questions.length }}
              >
                {category.questions.map((question, q_idx) => (
                  <div
                    key={q_idx}
                    className={`question-progress-bar ${this.questionToProgressClass(
                      question,
                      localCodingInstance
                    )} ${selectedQuestionIdentifier == question.id ? "current-question" : ""}`}
                    onClick={() => this.scrollToQuestion(question.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
);
