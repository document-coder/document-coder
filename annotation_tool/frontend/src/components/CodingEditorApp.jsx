import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import CodingEditor from "src/components/coding-editor/CodingEditor";
import CodingList from "src/components/coding-editor/CodingList";
import mapStateToProps from "src/components/utils/mapStateToProps";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import withParams from "src/components/utils/withParams";

class CodingEditorApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetCodingList();
  }

  render() {
    const {
      model: {
        codings,
        project: { settings: project_settings = { _unloaded: true } },
      },
      match: {
        params: { coding_id = undefined, project_prefix },
      },
    } = this.props;
    if (codings._unloaded || project_settings?._unloaded) return <Loading />;
    return (
      <div id="coding-editor-list" className="page-root">
        {coding_id ? (
          <Heading title={`Editing Annotation Scheme ${coding_id}`} project_prefix={project_prefix} />
        ) : (
          <Heading title={`Annotation Editor`} project_prefix={project_prefix} />
        )}
        <div id="coding-list">
          {coding_id ? (
            <CodingEditor coding_id={coding_id} />
          ) : (
            <CodingList
              project_prefix={project_prefix}
              codings={codings}
              default_coding={project_settings.default_coding}
            />
          )}
        </div>
      </div>
    );
  }
}

log(mapDispatchToProps);
export default withParams(connect(mapStateToProps, mapDispatchToProps)(CodingEditorApp));
