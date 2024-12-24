import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

export const QuestionCheckbox = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class QuestionCheckbox extends Component {
    constructor(props, context) {
      super(props, context);
      this.toggle = this.toggle.bind(this);
    }
    is_selected() {
      const {
        value,
        localState: {
          selectedQuestionIdentifier,
          localCodingInstance: { [selectedQuestionIdentifier]: values = {} },
        },
      } = this.props;
      return values?.values?.[value];
    }
    toggle() {
      this.props.toggle(this.props.value, this.is_selected());
    }
    render() {
      return (
        <div
          className={
            "coding-form-question-checkbox " +
            (this.is_selected() ? "selected" : "unselected") +
            (this.props.display ? " has-display" : "")
          }
          onClick={this.toggle}
        >
          {this.props.display ?? this.props.value}{" "}
          {this.props.details ? ` - ${this.props.details}` : ""}
        </div>
      );
    }
  }
);

export const OtherField = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class OtherField extends Component {
    constructor(props, context) {
      super(props, context);
      this.inputRef = React.createRef();
      this.onClick = this.onClick.bind(this);
      this.onChange = this.onChange.bind(this);
    }
    componentDidUpdate() {
      const other = this.cur_values()["OTHER"];
      if (other && !this._lock_other_filler) {
        this.inputRef.current.value = other;
        this._lock_other_filler = true;
      }
    }
    cur_values() {
      return (
        (
          this.props.localState.localCodingInstance[
          this.props.localState.selectedQuestionIdentifier
          ] || {}
        ).values || {}
      );
    }
    is_selected() {
      const cur_values = this.cur_values();
      return cur_values["OTHER"];
    }
    onClick(e) {
      if (this.is_selected() || !e.target.value) this.props.setter(false);
      else this.props.setter(e.target.value);
    }
    onChange(e) {
      this.props.setter(e.target.value);
    }
    render() {
      // OTHER FIELD CURRENTLY DISABLED
      return <></>
      return (
        <div
          className={
            "coding-form-question-checkbox " + (this.is_selected() ? "selected" : "unselected")
          }
        >
          <input
            ref={this.inputRef}
            className="coding-form-question-other"
            type="text"
            placeholder="other (enter here)"
            onChange={this.onChange}
            onClick={this.onClick}
          />
        </div>
      );
    }
  }
);
