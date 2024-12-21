import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class ParagraphSelectArea extends Component {
    constructor(props, context) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
      this.__draw_scrollbar_dots = this.__draw_scrollbar_dots.bind(this);
    }
    componentDidMount() {
      this.__draw_scrollbar_dots();
    }
    componentDidUpdate() {
      this.__draw_scrollbar_dots();
    }
    __draw_scrollbar_dots() {
      const _pbc = document.getElementById("policy-browser-container");
      const dots = _.toArray(_pbc.getElementsByClassName("selected-true"));
      const select_dots = this.props.localState.merge_mode
        ? _.toArray(_pbc.getElementsByClassName("selected-count"))
        : [];
      document.getElementById("scrollbar-dots")?.replaceChildren(
        ...dots.map((para_elem, i) => {
          const dot = document.createElement("div");
          dot.setAttribute("class", "scroll-dot");
          dot.setAttribute(
            "style",
            `top: ${
              (100 * (para_elem.getBoundingClientRect().y + _pbc.scrollTop)) / _pbc.scrollHeight
            }%`
          );
          dot.onclick = (e) => {
            para_elem.scrollIntoView({ behavior: "smooth", block: "center" });
          };
          return dot;
        }),
        ...select_dots.map((para_elem, i) => {
          const dot = document.createElement("div");
          dot.setAttribute("class", `merge-scroll-dot`);
          dot.setAttribute(
            "style",
            `top: ${
              (100 * (para_elem.getBoundingClientRect().y + _pbc.scrollTop)) / _pbc.scrollHeight
            }%`
          );
          dot.onclick = (e) => {
            para_elem.scrollIntoView({ behavior: "smooth", block: "center" });
          };
          return dot;
        })
      );
    }
    handleClick() {
      this.props.userToggleParagraph(this.props.doc.ordinal, this.props.idx);
      this.props.apiAutoSave();
    }
    render() {
      const { idx, doc } = this.props;
      return <div className="highlight-paragraph" onClick={this.handleClick} />;
    }
  }
);
