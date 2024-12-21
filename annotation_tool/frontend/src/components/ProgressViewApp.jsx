import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { PROJECT_NAME } from "src/constants";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import SortableTable from "src/components/widgets/SortableTable";
import withParams from "src/components/utils/withParams";

/**
 * @typedef PolicyAssignmentEntry
 */

/**
 * @typedef Policy
 * @property {string} company_name
 * @property {string} name
 * @property {number} alexa_rank
 * @property {number} alexa_rank_US
 * @property {string[]} categories
 * @property {Object} meta
 * @property {string} locale
 * @property {object} progress
 */

class ProgressViewApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetPolicies();
    this.props.apiGetPolicyInstancesMeta();
  }

  render() {
    const {
      model: {
        policies,
        policy_instances,
        project: { settings },
      },
      match: {
        params: { project_prefix },
      },
    } = this.props;
    const default_coding = settings?.default_coding;

    const _CODER_COLUMNS = [
      { name: "coder", display_fn: (coder) => coder.email },
      { name: "assigned", display_fn: (coder) => coder.assigned },
      { name: "complete", display_fn: (coder) => coder.complete },
      { name: "questions_answered", display_fn: (coder) => coder.questions_answered },
    ];
    const _OVERVIEW_COLUMNS = [
      { name: "category", display_fn: (policy) => "TODO" },
      { name: "loaded", display_fn: (policy) => "TODO" },
      { name: "codings", display_fn: (policy) => "TODO" },
      { name: "merged", display_fn: (policy) => "TODO" },
      { name: "count", display_fn: (policy) => "TODO" },
      { name: "complete", display_fn: (policy) => "TODO" },
    ];
    const _POLICY_INSTANCE_COLUMNS = [
      {
        name: "Document Source",
        display_fn: (policy_instance) => policies?.[policy_instance.policy_id]?.name,
      },
      {
        name: "Document Collection",
        display_fn: (policy_instance) => policy_instance.scan_dt,
      },
      // {
      //   name: "example progress tracking column",
      //   display_fn: (policy) => {
      //     const progress = policy.progress || _default_progress();
      //     return _complete_test(progress) ? "✅" : "🔁";
      //   },
      //   completed_fn: (policy) => _complete_test(policy.progress),
      // },
      {
        name: "links",
        display_fn: (policy_instance) => (
          <div>
            <a href={`/c/${PROJECT_NAME}/code-policy/${policy_instance.id}-annotations/${default_coding}`}>Code</a> |
            <a href={`/c/${PROJECT_NAME}/code-merge/${policy_instance.id}-annotations/${default_coding}`}>Review</a>
          </div>
        )
      },
    ];
    if (policies._unloaded) return <Loading />;
    if (policy_instances._unloaded) return <Loading />;
    const piArray = _.valuesIn(policy_instances);
    return (
      <div id="progress-view" className="page-root">
        <Heading title={`Project Status`} project_prefix={project_prefix} />
        <div id="project-progress-container" className="page-container">
          <SortableTable items={piArray} columns={_POLICY_INSTANCE_COLUMNS} sortColumnIdx={0} />
        </div>
      </div>
    );
  }
}

export default withParams(connect(mapStateToProps, mapDispatchToProps)(ProgressViewApp));
