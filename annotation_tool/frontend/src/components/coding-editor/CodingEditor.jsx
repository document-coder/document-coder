import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import { deleteItem, insert, replace } from "src/components/utils/util";
import Loading from "src/components/widgets/Loading";
import CategoryEditor from "./CategoryEditor";

/**
 * @returns {Category}
 */
function defaultCategory() {
  return {
    label: "",
    id: "",
    notes: { description: "" },
    questions: [],
  };
}

class SidebarPreview extends Component {
  // show a sidebar with categories and questions, and highlight the current onscreen category
  constructor(props) {
    super(props);
    this.state = {
      currentCategory: 0,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    // get the ID of any "question-edit-form" currently onscreen
    const question_id = Array.from(document.getElementsByClassName("question-edit-form"))
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top >= -64 && rect.top <= window.innerHeight;
      }).map((e) => (e.id))[0];
    Array.from(document.getElementsByClassName("sidebar-link"))
      .map((el) => {
        el.classList.remove("selected");
        if (el.id === `link-to-${question_id}`) {
          el.classList.add("selected");
          el.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
        }
      })
  }

  handleClick(event) {
    const question_id = event.target.id.split("-")[2];
    console.log(document.getElementById(question_id), question_id);
    document.getElementById(question_id)
      .scrollIntoView({ behavior: "smooth" });
  }

  render() {
    if (this.props.coding._unloaded) return <Loading />;
    const {
      coding: { categories },
    } = this.props;

    return <div id='coding-editor-sidebar'>
      <div className="sidebar-title">Quick Nav</div>
      {categories.map((category, idx) => {
        return <div key={idx} className="sidebar-category">
          <div className="sidebar-category-title">{category.label}</div>
          {category.questions.map((question, idx) => (
            <div
              className='sidebar-link'
              id={`link-to-${`${question.id}`.replace(/[^a-zA-Z0-9]/g, "_")}`}
              key={idx}
              onClick={this.handleClick}>
              [{question.id}] {question.label}
            </div>
          ))}
        </div>
      })}
    </div>
  }
}

class CodingEditor extends Component {
  constructor(props) {
    super(props);
    this.addCat = this._addCat.bind(this);
    this.deleteCat = this._deleteCat.bind(this);
    this.updateCat = this._updateCat.bind(this);
    this.replaceCategoryQuestions = this._replaceCategoryQuestions.bind(this);
    this.validateCategories = this.validateCategories.bind(this);
  }

  _replaceCategoryQuestions(newQuestions) {
    const {
      coding_id,
      localState: {
        localCodings: { [coding_id]: coding },
      },
    } = this.props;
    this.props.userUpdateCoding({
      ...coding,
      categories: newQuestions,
    });
  }

  _addCat(idx) {
    const coding = this.props.localState.localCodings[this.props.coding_id];
    this.replaceCategoryQuestions(insert(coding.categories, defaultCategory(), idx));
  }

  _updateCat(categoryIdx, newCategoryContent) {
    const coding = this.props.localState.localCodings[this.props.coding_id];
    this.replaceCategoryQuestions(replace(coding.categories, newCategoryContent, categoryIdx));
  }

  _deleteCat(categoryIdx) {
    console.log("delete category", categoryIdx);
    const coding = this.props.localState.localCodings[this.props.coding_id];
    this.replaceCategoryQuestions(deleteItem(coding.categories, categoryIdx));
  }

  validateCategories(categories) {
    const errors = [];
    const seenIds = new Set();
    const duplicateIds = new Set();

    categories.forEach((category, categoryIdx) => {
      category.questions.forEach((question, questionIdx) => {
        if (!question.id) {
          errors.push(`Category ${category.label || categoryIdx} has a question without an ID.`);
        } else if (seenIds.has(question.id)) {
          duplicateIds.add(question.id);
        } else {
          seenIds.add(question.id);
        }
      });
    });

    if (duplicateIds.size > 0) {
      errors.push(`Duplicate question IDs found: ${Array.from(duplicateIds).join(", ")}.`);
    }

    return errors;
  }

  render() {
    const { coding_id } = this.props;
    const coding = this.props.localState.localCodings[coding_id];
    if (coding._unloaded) return <Loading />;

    const serverCoding = this.props.model.codings[coding_id];
    const equalityTest = JSON.stringify(serverCoding.categories) == JSON.stringify(coding.categories);
    const validationErrors = this.validateCategories(coding.categories);

    const isSaveDisabled = validationErrors.length > 0;

    return (
      <div id="coding-editor">
        <div id="coding-edit-sidebar-preview"><SidebarPreview coding={coding} /></div>
        <div id="coding-edit-area">
          <div id="coding-edit-content">
            {coding.categories.map((category, categoryIdx) => {
              return (
                <div className="category-edit-holder" key={categoryIdx}>
                  <button onClick={() => this.addCat(categoryIdx)}> add category  </button>
                  <CategoryEditor
                    category={category}
                    categoryChanged={(newCategoryContent) =>
                      this.updateCat(categoryIdx, newCategoryContent)
                    }
                    deleteCategory={() => this.deleteCat(categoryIdx)}
                  />
                </div>
              );
            })}
            <div className="action-buttons-container">
              <button onClick={() => this.addCat(coding.categories.length)}>
                add category
              </button>
            </div>
          </div>
          <div id="save-buttons">
            <button
              onClick={() => this.props.apiUpdateCoding(coding_id, coding)}
              disabled={isSaveDisabled}>
              Save
            </button>
            <button
              onClick={() => {
                this.props.apiSaveCoding(coding, true);
              }}
              disabled={isSaveDisabled}>
              Save as Copy
            </button>
          </div>
          <div id="changes-alert" className={`${equalityTest ? "saved" : "unsaved"} ${validationErrors.length ? "invalidated" : "validated"}`}>
            {validationErrors.length > 0
              ? `${validationErrors.join("\n")}`
              : equalityTest
                ? " everything is up to date. "
                : " THERE ARE UNSAVED CHANGES "}
          </div>
          <a href="..">back to coding list...</a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodingEditor);
