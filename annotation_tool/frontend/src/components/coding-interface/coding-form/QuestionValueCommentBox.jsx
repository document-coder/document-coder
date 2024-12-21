import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import { CONFIDENCE_LEVELS } from "src/constants";

class ConfidenceSilder extends Component {
  constructor(props, context) {
    super(props);
    this.optionChanged = this.optionChanged.bind(this);
  }

  optionChanged(e) {
    this.props.changeHandler(e.target.value);
  }

  render() {
    return (
      <div className="coding-form-confidence-options-container">
        confidence:
        <div className="coding-form-confidence-options">
          {CONFIDENCE_LEVELS.map((confidence_level, value) => [
            <input
              key={value}
              onChange={this.optionChanged}
              className="coding-form-confidence-option"
              type="radio"
              id={confidence_level.replace(" ", "_")}
              name="confidence"
              value={value + 1}
              checked={this.props.selected == value + 1}
            />,
            <label key={confidence_level} htmlFor={confidence_level.replace(" ", "_")}>
              {confidence_level}
            </label>,
          ])}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class QuestionValueCommentBox extends Component {
    constructor(props, context) {
      super(props);
      this.commentChanged = _.debounce(this.commentChanged.bind(this), 1000);
      this.handleCommentChange = this.handleCommentChange.bind(this);
      this.confidenceChanged = this.confidenceChanged.bind(this);
    }

    handleCommentChange(e) {
      const comment = e.target.value;
      this.commentChanged(comment);
    }

    commentChanged(comment) {
      this.props.userChangeQuestionMeta(this.props.question_identifier, "comment", comment);
      this.props.apiAutoSave();
    }

    confidenceChanged(confidence_level) {
      this.props.userChangeQuestionMeta(
        this.props.question_identifier,
        "confidence",
        confidence_level
      );
      this.props.apiAutoSave();
    }

    render() {
      return (
        <div className="coding-form-question-meta">
          <hr />
          <ConfidenceSilder
            changeHandler={this.confidenceChanged}
            selected={this.props.values.confidence}
          />
          <textarea
            className="coding-form-comment-box-textarea"
            placeholder="additional comments"
            onChange={this.handleCommentChange}
            defaultValue={this.props.values.comment}
          />
        </div>
      );
    }
  }
);
