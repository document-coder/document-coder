import React, { Component } from "react";
import { CONFIDENCE_LEVELS } from "src/constants";

/**
 * shows the various searchable status information about the question box
 * (answer, sentences highlighted, ect.)
 */
export default class QuestionBoxHeader extends Component {
  render() {
    return (
      <div className={`coding-form-header-info coding-form-has-answers-${this.props.value_strings.length > 0 ? 'yes': 'no'} coding-form-confidence-${this.props.confidence}`}>
        <div className="coding-form-sentence-count-header">
          {this.props.number_of_sentences} sentence{this.props.number_of_sentences == 1 ? "" : "s"}
        </div>
        <div className="coding-form-answers-header">
          {this.props.value_strings.length > 0 ? (
            <div>
              {this.props.value_strings.map((s, i) => (
                <span key={i} className="coding-form-response">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <div className="coding-form-uncoded-marker">Unanswered</div>
          )}
          {this.props.value_strings.length > 1 && this.props.question_type == "singleselect" ? (
            <div className="coding-form-uncoded-marker">Multiple Answers - should be one. </div>
          ) : (
            <div> </div>
          )}
        </div>
        <div className={this.props.comment ? `coding-form-comment-notification` : `hidden`}>
          has comment!
        </div>
        <div className={`coding-form-confidence`}>
          confidence: {CONFIDENCE_LEVELS[this.props.confidence - 1]}
        </div>
      </div>
    );
  }
}
