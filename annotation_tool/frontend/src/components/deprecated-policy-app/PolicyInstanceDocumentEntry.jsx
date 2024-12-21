import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "• ", style: "unordered-list-item" },
  { label: "1.", style: "ordered-list-item" },
];

const INLINE_STYLES = [
  { label: "b", style: "BOLD" },
  { label: "i", style: "ITALIC" },
];

class EditorBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.focus = () => this.refs.editor.focus();
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  _handleKeyCommand(command, editorState) {
    console.log("handle key command: " + command)
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.props.onEditorChange(newState);
      return true;
    }
    return false;
  }

  _mapKeyToEditorCommand(e) {
    console.log("map key to editor command: " + e.keyCode)
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, this.props.editorState, 4 /* maxDepth */);
      if (newEditorState !== this.props.editorState) {
        this.props.onEditorChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType) {
    console.log("toggle block type: " + blockType)
    this.props.onEditorChange(RichUtils.toggleBlockType(this.props.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    console.log("toggle inline style: " + inlineStyle)
    this.props.onEditorChange(RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle));
  }

  render() {
    const { editorState } = this.props;
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " RichEditor-hidePlaceholder";
      }
    }
    console.log("rendering editor box")
    return (
      <div className="RichEditor-root">
        <StyleControls
          editorState={editorState}
          onToggleInline={this.toggleInlineStyle}
          onToggleBlock={this.toggleBlockType}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            ref="editor"
            editorState={this.props.editorState}
            onChange={this.props.onEditorChange}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            placeholder="Copy your policy document here."
          />
        </div>
      </div>
    );
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) className += " RichEditor-activeButton";

    return (
      <div className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </div>
    );
  }
}

const StyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggleBlock}
          style={type.style}
        />
      ))}
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggleInline}
          style={type.style}
        />
      ))}
    </div>
  );
};

/**
 * displays an "add new document" button.
 * Once clicked, the button is replaced with a form to add a new document.
 *
 * The title field is a text input box. The document entry field uses the draft-js editor.
 * the submit button calls a callback with the html content of the document entry and the title.
 **/
class PolicyInstanceDocumentEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: true,
      title: "",
      editorState: EditorState.createEmpty(),
    };
    this.onEditorChange = (editorState) => this.setState({ editorState });
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const rawContentState = convertToRaw(this.state.editorState.getCurrentContent());

    this.props.apiPostPolicyInstanceDocument(
      this.props.policy_instance_id,
      this.state.title,
      draftToHtml(rawContentState)
    );
    this.setState({
      editorState: EditorState.createEmpty(),
      enabled: false,
      title: "",
    });
  }
  render() {
    if (!this.state.enabled) {
      return <button onClick={() => this.setState({ enabled: true })}>Add new document</button>;
    }
    return (
      <div className="policy-doc-input-container">
        <input
          className="title-box"
          type="text"
          value={this.state.title}
          placeholder="Document Title"
          onChange={(e) => this.setState({ title: e.target.value })}
        />
        <EditorBox editorState={this.state.editorState} onEditorChange={this.onEditorChange} />
        <button onClick={this.onSubmit}>Save to Snapshot</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PolicyInstanceDocumentEntry);
