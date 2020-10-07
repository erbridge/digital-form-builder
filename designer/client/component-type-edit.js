import React, { memo, useContext } from "react";
import Editor from "./editor";
import { ComponentTypes } from "@xgovformbuilder/model";
import ComponentValues from "./components/component-values";
import { ComponentContext } from "./reducers/componentReducer";
import FieldEditFn from "./field-edit";
import ListFieldEdit from "./list-field-edit";
import { Classes } from "./classes";

function updateComponent(component, modifier, updateModel) {
  modifier(component);
  updateModel(component);
}

function FileUploadFieldEdit(props) {
  const { component, updateModel } = props;
  component.options = component.options || {};

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">more</span>
      </summary>

      <div className="govuk-checkboxes govuk-form-group">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id="field-options.multiple"
            name="options.multiple"
            type="checkbox"
            checked={component.options.multiple === false}
            onChange={() =>
              updateComponent(
                component,
                (component) => {
                  component.options.multiple = !component.options.multiple;
                },
                updateModel
              )
            }
          />
          <label
            className="govuk-label govuk-checkboxes__label"
            htmlFor="field-options.multiple"
          >
            Allow multiple
          </label>
        </div>
      </div>

      <Classes component={component} updateModel={updateModel} />
    </details>
  );
}

function TextFieldEdit(props) {
  const { component, updateModel } = props;
  component.schema = component.schema || {};

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">more</span>
      </summary>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-max"
        >
          Max length
        </label>
        <span className="govuk-hint">
          Specifies the maximum number of characters
        </span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-schema-max"
          name="schema.max"
          defaultValue={component.schema.max}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.schema.max = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-min"
        >
          Min length
        </label>
        <span className="govuk-hint">
          Specifies the minimum number of characters
        </span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-schema-min"
          name="schema.min"
          defaultValue={component.schema.min}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.schema.min = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-length"
        >
          Length
        </label>
        <span className="govuk-hint">Specifies the exact text length</span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-schema-length"
          name="schema.length"
          defaultValue={component.schema.length}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.schema.length = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-regex"
        >
          Regex
        </label>
        <span className="govuk-hint">
          Specifies a regex against which input will be validated
        </span>
        <input
          className="govuk-input"
          id="field-schema-regex"
          name="schema.regex"
          defaultValue={component.schema.regex}
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.schema.regex = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <Classes component={component} updateModel={updateModel} />
    </details>
  );
}

function MultilineTextFieldEdit(props) {
  const { component, updateModel } = props;
  component.schema = component.schema || {};
  component.options = component.options || {};

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">more</span>
      </summary>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-max"
        >
          Max length
        </label>
        <span className="govuk-hint">
          Specifies the maximum number of characters
        </span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-schema-max"
          name="schema.max"
          defaultValue={component.schema.max}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.schema.max = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-min"
        >
          Min length
        </label>
        <span className="govuk-hint">
          Specifies the minimum number of characters
        </span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-schema-min"
          name="schema.min"
          defaultValue={component.schema.min}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.schema.min = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-options-rows"
        >
          Rows
        </label>
        <input
          className="govuk-input govuk-input--width-3"
          id="field-options-rows"
          name="options.rows"
          type="text"
          data-cast="number"
          defaultValue={component.options.rows}
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.options.rows = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <Classes component={component} updateModel={updateModel} />
    </details>
  );
}

function NumberFieldEdit(props) {
  const { component, updateModel } = props;
  component.schema = component.schema || {};

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">more</span>
      </summary>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-min"
        >
          Min
        </label>
        <span className="govuk-hint">Specifies the minimum value</span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-schema-min"
          name="schema.min"
          defaultValue={component.schema.min}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.schema.min = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-max"
        >
          Max
        </label>
        <span className="govuk-hint">Specifies the maximum value</span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-schema-max"
          name="schema.max"
          defaultValue={component.schema.max}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.schema.max = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-precision"
        >
          Precision
        </label>
        <span className="govuk-hint">
          How many decimal places can users enter?
        </span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-schema-precision"
          name="schema.precision"
          defaultValue={component.schema.precision || 0}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.schema.precision = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <Classes component={component} updateModel={updateModel} />
    </details>
  );
}

function DateFieldEdit(props) {
  const { component, updateModel } = props;
  component.options = component.options || {};

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">more</span>
      </summary>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-options-maxDaysInPast"
        >
          Maximum days in the past
        </label>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-options-maxDaysInPast"
          name="options.maxDaysInPast"
          defaultValue={component.options.maxDaysInPast}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.options.maxDaysInPast = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-options-maxDaysInFuture"
        >
          Maximum days in the future
        </label>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-options-maxDaysInFuture"
          name="options.maxDaysInFuture"
          defaultValue={component.options.maxDaysInFuture}
          type="number"
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.options.maxDaysInFuture = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <Classes component={component} updateModel={updateModel} />
    </details>
  );
}

function ParaEdit(props) {
  const { component, data, updateModel } = props;
  component.options = component.options || {};
  const componentCondition = component.options.condition || "";
  const { conditions } = data;

  return (
    <div>
      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="para-content">
          Content
        </label>
        <span className="govuk-hint">
          The content can include HTML and the `govuk-prose-scope` css class is
          available. Use this on a wrapping element to apply default govuk
          styles.
        </span>
        <Editor
          name="content"
          value={component.content}
          valueCallback={(content) =>
            updateComponent(
              component,
              (component) => {
                component.content = content;
              },
              updateModel
            )
          }
        />
      </div>
      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="condition">
          Condition (optional)
        </label>
        <span className="govuk-hint">
          Only show this content if the condition is truthy.{" "}
        </span>
        <select
          className="govuk-select"
          id="condition"
          name="options.condition"
          value={componentCondition}
          onChange={(e) =>
            updateComponent(
              component,
              (component) => {
                component.options.condition = e.target.value;
              },
              updateModel
            )
          }
        >
          <option value="" />
          {conditions.map((condition) => (
            <option key={condition.name} value={condition.name}>
              {condition.displayName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ListContentEdit(props) {
  const { component, data, updateModel, page } = props;
  component.options = component.options || {};

  return (
    <div>
      <ComponentValues
        data={data}
        component={component}
        updateModel={updateModel}
        page={page}
        EditComponentView={ComponentTypeEdit}
      />

      <div className="govuk-checkboxes govuk-form-group">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id="field-options-type"
            name="options.type"
            value="numbered"
            type="checkbox"
            checked={component.options.type === "numbered"}
            onChange={() =>
              updateComponent(
                component,
                (component) => {
                  component.options.type =
                    component.options.type === "numbered"
                      ? undefined
                      : "numbered";
                },
                updateModel
              )
            }
          />
          <label
            className="govuk-label govuk-checkboxes__label"
            htmlFor="field-options-type"
          >
            Numbered
          </label>
        </div>
      </div>
    </div>
  );
}

function DetailsEdit(props) {
  const { component, updateModel } = props;

  return (
    <div>
      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="details-title">
          Title
        </label>
        <input
          className="govuk-input"
          id="details-title"
          name="title"
          defaultValue={component.title}
          required
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.title = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>

      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="details-content">
          Content
        </label>
        <span className="govuk-hint">
          The content can include HTML and the `govuk-prose-scope` css class is
          available. Use this on a wrapping element to apply default govuk
          styles.
        </span>
        <textarea
          className="govuk-textarea"
          id="details-content"
          name="content"
          defaultValue={component.content}
          rows="10"
          required
          onBlur={(e) =>
            updateComponent(
              component,
              (component) => {
                component.content = e.target.value;
              },
              updateModel
            )
          }
        />
      </div>
    </div>
  );
}

const componentTypeEditors = {
  TextFieldEdit: TextFieldEdit,
  EmailAddressFieldEdit: TextFieldEdit,
  TelephoneNumberFieldEdit: TextFieldEdit,
  NumberFieldEdit: NumberFieldEdit,
  MultilineTextFieldEdit: MultilineTextFieldEdit,
  AutocompleteFieldEdit: ListFieldEdit,
  SelectFieldEdit: ListFieldEdit,
  RadiosFieldEdit: ListFieldEdit,
  CheckboxesFieldEdit: ListFieldEdit,
  ParaEdit: ParaEdit,
  HtmlEdit: ParaEdit,
  InsetTextEdit: ParaEdit,
  WarningTextEdit: ParaEdit,
  DetailsEdit: DetailsEdit,
  FlashCardEdit: ListFieldEdit,
  FileUploadFieldEdit: FileUploadFieldEdit,
  DatePartsFieldEdit: DateFieldEdit,
  ListEdit: ListContentEdit,
};

function ComponentTypeEdit(props) {
  const [{ selectedComponent }] = useContext(ComponentContext);
  const type = ComponentTypes.find(
    (t) => t.name === selectedComponent?.type ?? ""
  );

  const needsFieldInputs = type?.subType !== "content";
  const TagName = componentTypeEditors[`${selectedComponent?.type}Edit`];
  // const { update } = useContext(PageContext);
  // useLayoutEffect(() => {
  //   update(page);
  //   return () => {
  //     update();
  //   };
  // }, []);

  return (
    <div>
      {needsFieldInputs && <FieldEditFn />}
      {type && <TagName />}
    </div>
  );
}

export default memo(ComponentTypeEdit);
