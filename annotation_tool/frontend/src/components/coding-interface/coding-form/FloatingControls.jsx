// @ts-nocheck
import { Component, default as React } from "react";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  {}
)(
  class FloatingControls extends Component {
    constructor(props, context) {
      super(props, context);
      this.scroll_to_current = this._scroll_to_current.bind(this);
      this.scroll_to_next_disagreement = this._scroll_to_next_disagreement.bind(this);
      this.scroll_to_next_unanswered = this._scroll_to_next_unanswered.bind(this);
    }

    _scroll_to_current() {
      const cur_question_elem = document.getElementById(
        this.props.localState.selectedQuestionIdentifier
      );
      if (cur_question_elem)
        cur_question_elem.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    _scroll_to_next_disagreement() {
      const cur_question_elem = document.getElementById(
        this.props.localState.selectedQuestionIdentifier
      );
      /** @type {HTMLCollectionOf<HTMLElement>} */
      const unencoded = document.getElementsByClassName("unmatching-answer-merge");
      if (unencoded.length == 0) {
        alert("you've answered all the questions!");
      }
      if (!cur_question_elem) {
        unencoded[0].scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const cur_question_offset = cur_question_elem.offsetTop + cur_question_elem.offsetHeight;
      console.log(cur_question_offset);
      for (var elem of unencoded) {
        if (elem.offsetTop > cur_question_offset) {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
      unencoded[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }

    _scroll_to_next_unanswered() {
      const cur_question_elem = document.getElementById(
        this.props.localState.selectedQuestionIdentifier
      );
      const unencoded = document.getElementsByClassName("coding-form-uncoded-marker");
      if (unencoded.length == 0) {
        alert("you've answered all the questions!");
      }
      if (!cur_question_elem) {
        unencoded[0].scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const cur_question_offset = cur_question_elem.offsetTop + cur_question_elem.offsetHeight;
      console.log(cur_question_offset);
      for (var elem of unencoded) {
        if (elem.offsetTop > cur_question_offset) {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
      unencoded[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }

    render() {
      return (
        <div className="coding-form-floating-controls">
          <div className="coding-form-control-buttons">
            <div className="scroll-to-note"> scroll to: </div>
            <div className="coding-form-action-button" onClick={this.scroll_to_current}>
              Current Question
            </div>
            {this.props.localState.merge_mode ? (
              <div className="coding-form-action-button" onClick={this.scroll_to_next_disagreement}>
                Next Unresolved
              </div>
            ) : (
              <div className="coding-form-action-button" onClick={this.scroll_to_next_unanswered}>
                Next Unanswered
              </div>
            )}
            <div className="coding-form-action-button" onClick={this.props.userSubmit}>
              Save and return home
            </div>
          </div>
        </div>
      );
    }
  }
);
