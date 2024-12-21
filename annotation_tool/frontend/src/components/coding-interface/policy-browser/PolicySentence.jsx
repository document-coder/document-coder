import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import MD from "src/components/widgets/MarkdownedText";
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class PolicySentence extends Component {
    constructor(props, context) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userToggleSentence(
        this.props.doc_ordinal,
        this.props.paragraph_idx,
        this.props.idx
      );
      this.props.apiAutoSave();
    }

    _checkSentence(selected_sentences) {
      return (
        selected_sentences &&
        selected_sentences[this.props.paragraph_idx] &&
        (selected_sentences[this.props.paragraph_idx].indexOf(this.props.idx) >= 0 ||
          selected_sentences[this.props.paragraph_idx].indexOf(this.props.idx) >= 0)
      );
    }

    _get_selected_sentences(coding_instance, doc_ordinal) {
      const cur_question = coding_instance[this.props.localState.selectedQuestionIdentifier] ?? {};
      return (cur_question.sentences || {})[doc_ordinal];
    }

    _basicHighlightTest() {
      const selected_sentences = this._get_selected_sentences(
        this.props.localState.localCodingInstance,
        this.props.doc_ordinal
      );
      var extra_class = "unselected";
      if (this._checkSentence(selected_sentences)) extra_class = "selected";
      return extra_class;
    }

    _mergeHighlightTest() {
      // TODO: count the number of people who have highlighted this sentence
      var count = 0;
      var highlight_count = 0;
      for (var ci of _.values(this.props.model.coding_instances)) {
        count++;
        const sentences = this._get_selected_sentences(ci.coding_values, this.props.doc_ordinal);
        const old_sentences = this._get_selected_sentences(ci.coding_values, this.props.doc_title);
        if (this._checkSentence(sentences)) highlight_count++;
        else if (this._checkSentence(old_sentences)) highlight_count++;
      }
      var extra_class = "";
      if (highlight_count > 0) {
        extra_class = `highlight-count-${Math.min(highlight_count, 5)}`;
      }
      return extra_class;
    }

    _highlightTest() {
      var extra_class = this._basicHighlightTest();
      if (this.props.localState.merge_mode) extra_class += " " + this._mergeHighlightTest();
      return extra_class;
    }

    render() {
      const extra_class = this._highlightTest();
      return (
        <span
          className={"policy-browser-paragraph-sentence " + extra_class}
          onClick={this.handleClick}
        >
          <MD text={this.props.content} />
        </span>
      );
    }
  }
);
