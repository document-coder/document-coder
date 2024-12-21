/**
 * A CodingForm is one of the two panes shown to coders. It shows the questions and provides
 * nagivation tools for hopping around the questions.
 */
import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import CodingOverview from "src/components/coding-interface/coding-form/CodingOverview";
import CodingCategory from "src/components/coding-interface/coding-form/CodingCategory";
import FloatingControls from "src/components/coding-interface/coding-form/FloatingControls";
import ProgressBar from "src/components/coding-interface/coding-form/ProgressBar";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class CodingForm extends Component {
    constructor(props, context) {
      super(props, context);
      this.userSave = this.userSave.bind(this);
      this.userSubmit = this.userSubmit.bind(this);
      this.localStore = this.localStore.bind(this);
      this.restoreStore = this.restoreStore.bind(this);
      this.__checkTheRightHeadingIsActiveOnScroll =
        this.__checkTheRightHeadingIsActiveOnScroll.bind(this);
    }
    componentDidMount() {
      this._cfc = document.getElementById("coding-form-pane");
      this._cfc = this._cfc.onscroll = _.throttle(
        this.__checkTheRightHeadingIsActiveOnScroll.bind(this),
        100,
        {
          leading: true,
        }
      );
    }
    __checkTheRightHeadingIsActiveOnScroll(e) {
      this._cfc = document.getElementById("coding-form-pane");
      // this element in CodingCategory
      const headings = document.getElementsByClassName("coding-container");
      const idx = _.sum(_.map(headings, (h) => this._cfc.scrollTop - h.offsetTop > 0)) - 1;
      for (var _i = 0; _i < headings.length; _i++) {
        const h = headings[_i];
        if (_i === idx) {
          h.classList.add("active-coding");
        } else {
          h.classList.remove("active-coding");
        }
      }
    }

    fun() {
      alert("whee 🤓");
    }
    userSave() {
      this.props.apiPostCodingInstance(
        this.props.policy_instance_id,
        this.props.coding_id,
        this.props.localState.localCodingInstance
      );
    }
    userSubmit() {
      this.props.apiPostCodingInstance(
        this.props.policy_instance_id,
        this.props.coding_id,
        this.props.localState.localCodingInstance
      );
      window.location.assign(`/c/${this.props.model.project.prefix}/`);
    }
    localStore() {
      window.localStorage.setItem(
        location.pathname,
        JSON.stringify(this.props.localState.localCodingInstance)
      );
      alert("The current state of this page has been saved to your browser's memory.");
    }
    restoreStore() {
      const warning_msg =
        "This will revert to the last time you clicked 'offline save' on this computer." +
        "\n\nAnything you've done since then (on any computer) will be lost forever. \n\ncontinue?";
      if (!window.confirm(warning_msg)) return;
      this.props.localState.localCodingInstance = JSON.parse(
        window.localStorage.getItem(window.location.pathname)
      );
      this.props.userNullOp();
    }
    render() {
      const {
        coding_id,
        localState: { localCodingInstance },
        model: { coding_instances },
      } = this.props;
      const coding = this.props.model?.codings[coding_id];
      if (coding == undefined || !coding?.categories) {
        return <div id="coding-form-pane">loading...</div>;
      }
      if (coding_instances._unloaded) return <div id="coding-form-pane"> coding instance not loaded.</div>
      const serverCodingInstance = _.values(coding_instances)?.[0]?.coding_values;
      const saved = JSON.stringify(serverCodingInstance) == JSON.stringify(localCodingInstance);
      let counter = 0;
      let questionCounter = 0;
      return (
        <div id="coding-form-pane">
          <CodingOverview coding={coding} />
          <div id="coding-form-container">
            {coding.categories.map((category, i) => (
              <CodingCategory
                category={category}
                counterOffset={
                  (questionCounter += category.questions.length) - category.questions.length
                }
                idx={i}
                key={i}
              />
            ))}
            <div className="coding-form-button-container">
              <button onClick={this.userSave} className="coding-form-submit-button">
                Save
              </button>
              <button onClick={this.userSubmit} className="coding-form-submit-button">
                Save and return home
              </button>
              <button onClick={this.localStore} className="coding-form-submit-button">
                [danger!] Offline Save
              </button>
              <button onClick={this.restoreStore} className="coding-form-submit-button">
                [danger!] Restore Last Offline Save
              </button>
              <button onClick={this.fun} className="coding-form-submit-button">
                fun button
              </button>
            </div>
            <div id="save-alert" className={saved ? "progress-saved" : "progress-unsaved"}>
              there are unsaved changes.
            </div>
            <ProgressBar coding={coding} />
            <FloatingControls userSubmit={this.userSubmit} />
          </div>
        </div>
      );
    }
  }
);
