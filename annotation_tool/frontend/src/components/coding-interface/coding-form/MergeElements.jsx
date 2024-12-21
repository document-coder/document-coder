// @ts-ignore
import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { scrollToSentenceTarget, stringifySentences } from "src/components/utils/displayUtils";
import mapStateToProps from "src/components/utils/mapStateToProps";

class MergeItem extends Component {
  render() {
    const selectedValues = _.map(this.props.values, (v, k) =>
      v ? (k == "OTHER" ? "OTHER:" + v : k) : undefined
    ).filter((e) => e);
    return (
      <div>
        {this.props.fmw_answer ? (
          <div className="merge-tool-response-header">
            <b>FMW's response</b>
          </div>
        ) : (
          ""
        )}
        <div className={"merge-tool-response" + (this.props.fmw_answer ? " fmw-answer" : "")}>
          <div className="merge-tool-coder-email">{this.props.author}</div>
          <div className="merge-tool-response-values">
            {selectedValues.map((value, i) => (
              <span key={i}>{value}</span>
            ))}
          </div>
          <div className="merge-tool-sentence-count">
            {this.props.sentences.length + this.props.agreed_sentences.length} sentences flagged
          </div>
          <div className="merge-tool-confidence">confidence: {this.props.confidence || "unspecified"}</div>
          <div className="merge-tool-comment">{this.props.comment ? this.props.comment : ""}</div>
          <div className="merge-tool-sentences">
            {this.props.sentences.map((s, i) => (
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
        </div>
      </div>
    );
  }
}

const MergeTool = connect(
  mapStateToProps,
  {} // functions
)(
  class MergeTool extends Component {
    render() {
      if (!this.props.mergeData) {
        return <div> (there are no responses for this question) </div>;
      }
      const responses = this.props.mergeData.responses;
      const sentence_strings = _.map(responses, (r) => {
        return stringifySentences(r.sentences);
      });
      const agreed_sentences = _.intersection(...sentence_strings);
      return (
        <div className="merge-tool-response-list">
          {responses.map((vals, idx_) => {
            if (!vals) return;
            return (
              <MergeItem
                key={idx_}
                values={vals.values}
                confidence={vals.confidence}
                comment={vals.comment}
                sentences={_.difference(sentence_strings[idx_], agreed_sentences)}
                agreed_sentences={agreed_sentences}
                author={this.props.mergeData.authors[idx_]}
                fmw_answer={this.props.mergeData.authors[idx_] == "florencia.m.wurgler@gmail.com"}
              />
            );
          })}
          {agreed_sentences ? (
            <div className="merge-tool-agreed-sentences">
              Sentences highlighted by everyone:
              {agreed_sentences.map((s, i) => (
                <div
                  onClick={scrollToSentenceTarget}
                  key={i}
                  // @ts-ignore
                  target={`paragraph-${s.policy_type}-${s.paragraph_idx}`}
                >
                  {s.pretty_string}
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      );
    }
  }
);

class MergeBoxHeader extends Component {
  render() {
    const responses = this.props.mergeData.responses;
    const answers_match =
      _.uniqBy(
        _.map(responses, (r) => {
          return _.filter(_.keys(r.values), (k) => {
            return r.values[k];
          });
        }),
        (u) => u.join("--")
      ).length == 1;
    const sentence_strings = _.map(responses, (r) => {
      return stringifySentences(r.sentences);
    });
    const sentences_match = _.uniqBy(sentence_strings, (ss) => ss.join("--")).length == 1;
    const comments = _.filter(
      _.map(responses, (r) => {
        return r.comment || undefined;
      })
    );
    return (
      <div>
        <div
          className={`merge-header-answers-match ${
            answers_match ? "matching-answer-merge" : "unmatching-answer-merge"
          }`}
        >
          {answers_match ? `answers match` : `answers do not match`}
        </div>
        <div
          className={`merge-header-sentence-overlap ${sentences_match ? "matching-sentences" : "unmatching-sentences"}`}
        >
          {sentences_match ? `sentences match` : `sentences do not match`}
        </div>
        <div className={`merge-header-has-comments ${comments.length ? "has-comments" : "hidden"}`}>
          {comments.length} comment{comments.length > 1 ? "s" : ""}
        </div>
        <div> {this.props.mergeData.authors.join(", ")}</div>
      </div>
    );
  }
}

export { MergeTool, MergeItem, MergeBoxHeader };
