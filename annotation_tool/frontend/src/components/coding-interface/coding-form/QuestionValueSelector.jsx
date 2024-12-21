import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  OtherField,
  QuestionCheckbox,
} from "src/components/coding-interface/coding-form/QuestionCheckbox";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class QuestionValueSelector extends Component {
    constructor(props, context) {
      super(props);
      this.toggle = this.toggle.bind(this);
      this.otherChanged = _.throttle(this.otherChanged.bind(this), 500, {
        leading: true,
        trailing: true,
      });
    }

    toggle(value, is_selected) {
      const cur_coding =
        this.props.localState.localCodingInstance[
          this.props.localState.selectedQuestionIdentifier
        ] ?? {};
      const cur_coding_values = this.props.singleselect ? {} : cur_coding.values ?? {};
      const new_values = {
        ...(cur_coding_values ?? {}),
        ...{ [value]: !is_selected },
      };
      this.props.userChangeValue(this.props.question_identifier, new_values);
      this.props.apiAutoSave();
    }

    otherChanged(value) {
      const cur_coding =
        this.props.localState.localCodingInstance[
          this.props.localState.selectedQuestionIdentifier
        ] ?? {};
      const cur_coding_values = this.props.singleselect ? {} : cur_coding.values ?? {};
      const new_values = {
        ...(cur_coding_values ?? {}),
        ...{ ["OTHER"]: value },
      };
      this.props.userChangeValue(this.props.question_identifier, new_values);
      this.props.apiAutoSave();
    }

    handleClick(e) {}

    render() {
      const { values, question_identifier } = this.props;
      return (
        <div className="coding-form-question-value-selector" onClick={this.handleClick}>
          <div>
            {values.map(({ details, label, meta, value }, i) => {
              return (
                <QuestionCheckbox
                  key={i}
                  display={label}
                  value={value}
                  question_identifier={question_identifier}
                  toggle={this.toggle}
                  details={details}
                />
              );
            })}
            <OtherField setter={this.otherChanged} />
          </div>
        </div>
      );
    }
  }
);
