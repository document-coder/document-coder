import { _ } from "lodash";
import React from "react";
import { insert, replace, deleteItem } from "src/components/utils/util";
import InputBox from "src/components/widgets/InputBox";
import QuestionEditor from "./QuestionEditor";

/**
 * @returns {Question}
 */
function defaultQuestion() {
  return {
    label: "",
    description: "",
    info: "",
    type: "singleselect",
    questionOptions: [
      {
        label: "",
        value: "",
        details: "",
        meta: {
          notes: "", //"We can add invisible comments here if needed in the future...",
        },
      },
    ],
    meta: {
      notes: "",
      source: "",
    },
  };
}

/**
 * @param {Category} category
 * @param {number} questionIdx
 * @returns {Category} - the category (to replace the original props)
 */
function insertQuestion(category, questionIdx) {
  return {
    ...category,
    questions: insert(category.questions, defaultQuestion(), questionIdx),
  };
}

/**
 * @param {Category} category
 * @param {number} questionIdx
 * @returns {Category} - the category (to replace the original props)
 */
function deleteQuestion(category, questionIdx) {
  return {
    ...category,
    questions: deleteItem(category.questions, questionIdx),
  };
}

/**
 * @param {Category} category
 * @param {number} questionIdx
 * @param {Question} newQuestionContent
 * @returns {Category} - the category (to replace the original props)
 */
function updateQuestion(category, questionIdx, newQuestionContent) {
  return {
    ...category,
    questions: replace(category.questions, newQuestionContent, questionIdx),
  };
}

/**
 * @param {Object} params
 * @param {Category} params.category
 * @param {function} params.categoryChanged
 * @returns
 */
export default function CategoryEditor({ category, categoryChanged, deleteCategory }) {
  return (
    <div className="category-editor">
      <div className="category-title">
        Category:
        <InputBox
          value={category.label}
          placeholder="Category Title"
          callback={(value) => {
            categoryChanged({
              ...category,
              label: value,
            });
          }}
        />
      </div>
      {category.questions.map((question, questionIdx) => (
        <div className="question-edit-container" key={questionIdx}>
          <button onClick={() => categoryChanged(insertQuestion(category, questionIdx))}>add question</button>
          <QuestionEditor
            question={question}
            questionChanged={(newQuestionContent) =>
              categoryChanged(updateQuestion(category, questionIdx, newQuestionContent))
            }
            deleteQuestion={() => categoryChanged(deleteQuestion(category, questionIdx))}
          />
        </div>
      ))}
      <button onClick={() => categoryChanged(insertQuestion(category, category.questions.length))}>
        add question
      </button>
      <button className="delete-button" onClick={deleteCategory}>
        delete category (CAREFUL - WILL DELETE ALL QUESTIONS)
      </button>
    </div>
  );
}
