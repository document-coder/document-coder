import React, { Component } from "react";
import { connect } from "react-redux";
import QuestionBox from "src/components/coding-interface/coding-form/QuestionBox";
import { randomColor } from "src/components/utils/displayUtils";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class CodingCategory extends Component {
    constructor(props, context) {
      super(props, context);
    }
    render() {
      const {
        category: { id, label, notes, questions },
        counterOffset = 0,
        idx,
      } = this.props;
      let counter = counterOffset;
      const headingStyle = { backgroundColor: randomColor(label, 30, 80), zIndex: idx };
      return (
        <div className="coding-container" style={headingStyle}>
          <h1>{label}</h1>
          <div className="coding-form-section-container" style={headingStyle}>
            <h1>{label}</h1>
          </div>
          {questions.map((question_content, i) => (
            <QuestionBox
              key={"question-box-" + i}
              count={++counter}
              category_id={this.props.idx /** TODO: CATEGORIES SHOULD HAVE IDs */}
              category_label={label}
              content={question_content}
            />
          ))}
        </div>
      );
    }
  }
);
