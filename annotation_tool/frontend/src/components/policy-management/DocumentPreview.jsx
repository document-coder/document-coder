import React, { Component } from "react";
import { marked } from 'marked';
import _ from "lodash";
import { all } from "axios";

const FormattedSentences = ({ sentences }) => {
  const unicodeDelimeter = '\u2028';
  const fullText = sentences.join(unicodeDelimeter);
  const lexer = new marked.Lexer();
  const rules_to_remove = [
    // "_backpedal",
    // "anyPunctuation",
    // "autolink",
    // "blockSkip",
    // "br",
    // "code",
    // "del",
    // "emStrongLDelim",
    // "emStrongRDelimAst",
    // "emStrongRDelimUnd",
    // "escape",
    "link",
    "nolink",
    // "punctuation",
    // "reflink",
    // "reflinkSearch",
    // "tag",
    // "text",
    "url"
  ];
  for (const lrule of rules_to_remove) {
    if (lexer.tokenizer.rules.inline[lrule] !== undefined) {
      lexer.tokenizer.rules.inline[lrule] = { exec: () => { } };
    }
  }
  const formattedText = marked.parseInline(fullText, lexer);
  const formattedSentences = formattedText.split(unicodeDelimeter);
  const sentenceSpans = formattedSentences.reduce((accumulator, sentence, idx) => {
    var { strong, em } = accumulator;
    const { sentences } = accumulator;
    const tagRegex = new RegExp(`(<\/?em>|<\/?strong>)`, "gv");
    const tagLocations = [
      { index: 0 },
      ...sentence.matchAll(tagRegex),
      { index: sentence.length },
    ];
    const sentenceChunks = [];
    var cur_idx = 0;
    for (const match of tagLocations) {
      const tag = match?.[0] || "";
      if (tag === "<em>") em = true;
      if (tag === "<strong>") strong = true;
      sentenceChunks.push({
        strong, em, text: sentence.slice(cur_idx, match.index),
      });
      if (tag === "</em>") em = false;
      if (tag === "</strong>") strong = false;
      cur_idx = match.index + tag.length;
    }
    const sentenceSpan = <span key={idx} className="sentence-span">
      {sentenceChunks.map(({ strong, em, text }, idx) => {
        if (strong && em)
          return <strong key={idx}><em dangerouslySetInnerHTML={{ __html: text }} /></strong>;
        else if (em)
          return <em key={idx} dangerouslySetInnerHTML={{ __html: text }} />;
        else if (strong)
          return <strong key={idx} dangerouslySetInnerHTML={{ __html: text }} />;
        else
          return <span key={idx}
            dangerouslySetInnerHTML={{ __html: text }}
          />
      })}
    </span>;
    sentences.push(sentenceSpan);
    return { sentences, strong, em };
  }, { strong: false, em: false, sentences: [] }).sentences;
  return sentenceSpans;
}

const PreviewParagraph = ({ paragraph, onUpdate, index, allowEdits }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState('');

  const handleEditClick = () => {
    // Combine sentences back into raw markdown
    const rawText = paragraph.content.join(' ');
    setEditText(rawText);
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      onUpdate(index, editText);
      setIsEditing(false);
    } catch (error) {
      alert(`Error parsing the edited paragraph: ${error.message}`);
      throw error;
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText('');
  };
  const rangeString = paragraph.content.length === 1 ? 1 : `1-${paragraph.content.length}`;
  const typeClasses = [`paragraph-type-${paragraph.type}`];
  if (paragraph.type === 'section')
    typeClasses.push(`paragraph-level-${paragraph.level}`);
  if (paragraph.type === 'list_item')
    typeClasses.push(`paragraph-depth-${paragraph.depth}`);
  return (
    <div className={`preview-paragraph`}>
      <div className="paragraph-info">
        <div>
          {`¶${index + 1}.${rangeString}`}
        </div>
      </div>

      <div className={`paragraph-content ${typeClasses.join(" ")}`}>
        <FormattedSentences sentences={paragraph.content} />
      </div>
      {(isEditing && allowEdits) && (
        <div className="editing-container">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        </div>
      )}
      {allowEdits && (
        <div className="paragraph-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave}>
                Save
              </button>
              <button onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEditClick}>
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const DocumentPreview = ({ content, onUpdateParagraph, allowEdits = true }) => {
  return (
    <div className="preview-content">
      {content.map((paragraph, idx) => (
        <PreviewParagraph
          key={idx}
          index={idx}
          paragraph={paragraph}
          onUpdate={onUpdateParagraph}
          allowEdits={allowEdits}
        />
      ))}
    </div>
  );
};

export default DocumentPreview;