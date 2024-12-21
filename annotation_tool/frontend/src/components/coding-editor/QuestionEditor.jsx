import React from "react";
import InputBox from "src/components/widgets/InputBox";
import QuestionOptionListEditor from "./QuestionOptionListEditor";
import RadioButtons from "src/components/widgets/RadioButtons";

const _QUESTION_TYPES = [
  { value: "singleselect", label: "Select Exactly One" },
  { value: "multiselect", label: "Select Multiple" },
];



/**
 *
 * @param {{Question, function}} params
 * @returns
 */
export default function QuestionEditor({ question, questionChanged, deleteQuestion }) {
  return (
    <div className="question-edit-form" id={`${question.id}`}>

      <button className="delete-button" onClick={deleteQuestion}>
        delete question
      </button>
      <InputBox
        className="question-edit-id"
        value={question.id}
        placeholder="unique_question_id"
        callback={(value) => questionChanged({ ...question, id: value })}
      />
      <InputBox
        className="question-edit-label"
        value={question.label}
        placeholder="Question Title"
        callback={(value) => questionChanged({ ...question, label: value })}
      />
      <InputBox
        area={true}
        className="question-edit-description"
        value={question.description}
        placeholder="Question Content"
        callback={(value) => questionChanged({ ...question, description: value })}
      />
      <div className="question-option-list">
        <div className="question-option-list-heading">Response Choices:</div>
        <RadioButtons
          options={_QUESTION_TYPES}
          selected={question.type}
          callback={(value) => questionChanged({ ...question, type: value })}
        />
        <QuestionOptionListEditor
          questionOptions={question.questionOptions}
          questionOptionsChanged={(newQuestionOptions) =>
            questionChanged({ ...question, questionOptions: newQuestionOptions })
          }
        />
      </div>
    </div>
  );
}
