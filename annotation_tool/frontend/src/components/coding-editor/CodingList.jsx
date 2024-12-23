import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import SortableTable from "src/components/widgets/SortableTable";

/**
 * @param {object} params
 * @param {Coding[]} params.codings
 * @returns
 */
class CodingList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      codings,
      default_coding = 1,
      model: { project_settings },
      project_prefix,
      apiUpdateProjectSettings,
    } = this.props;
    const _COLUMNS = [
      {
        name: "Default",
        display_fn: (coding) => (
          <input
            type="checkbox"
            checked={coding.id == default_coding}
            onClick={() => {
              apiUpdateProjectSettings(project_prefix, {
                ...project_settings,
                default_coding: coding.id,
              });
            }}
            readOnly={true}
          />
        ),
        sort_fn: (coding) => coding.id,
      },
      {
        name: "id",
        display_fn: (coding) => `${coding.id}`,
        sort_fn: (coding) => coding.id,
      },
      {
        name: "Link",
        display_fn: (coding) => <a href={`/c/${project_prefix}/coding/${coding.id}`}>edit</a>,
        sort_fn: (coding) => coding.id,
      },
      {
        name: "created",
        display_fn: (coding) => new Date(coding.created_dt).toDateString(),
        sort_fn: (coding) => coding.created_dt,
      },
      {
        name: "categories",
        display_fn: (coding) => coding.categories.length,
        sort_fn: (coding) => coding.categories.length,
      },
      {
        name: "questions",
        display_fn: (coding) => `${_.sum(coding.categories.map((e) => e.questions.length))}`,
        sort_fn: (coding) => _.sum(coding.categories.map((e) => e.questions.length)),
      },
    ];

    return (
      <div id="coding-list">
        <div id="coding-table-container">
          <h2> Saved Question Lists </h2>
          <SortableTable id="coding-list-table" items={_.values(codings)} columns={_COLUMNS} />
          <div className="coding-list-actions">
            <button
              className="coding-create-button"
              onClick={() => {
                this.props.apiSaveCoding();
              }}
            >
              Create New Coding
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CodingList);
