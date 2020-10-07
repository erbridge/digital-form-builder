import React, { memo, useContext, useState } from "react";
import Name from "./name";
import { ComponentTypes } from "@xgovformbuilder/model";
import {
  ComponentContext,
  ComponentActions,
} from "./reducers/componentReducer";
import { Textarea } from "@govuk-jsx/textarea";
import { withI18n } from "./i18n";

function FieldEdit({ i18n }) {
  const [{ selectedComponent }, dispatch] = useContext(ComponentContext);

  const { name, title, hint, attrs, type, options } = selectedComponent;
  const { hideTitle = false, optionalText = false, required = true } = options;
  const isFileUploadField = selectedComponent.type === "FileUploadField";

  return (
    <div>
      <div data-test-id="standard-inputs">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="field-title">
            Title
          </label>
          <span className="govuk-hint">
            This is the title text displayed on the page
          </span>
          <input
            className="govuk-input"
            id="field-title"
            name="title"
            type="text"
            value={title || ""}
            onChange={(e) => {
              dispatch({
                type: ComponentActions.EDIT_TITLE,
                payload: e.target.value,
              });
            }}
          />
        </div>

        <Textarea
          id="field-hint"
          name="hint"
          rows={2}
          label={{
            className: "govuk-label--s",
            children: ["Help Text (optional)"],
          }}
          hint={{
            children: ["Text can include HTML"],
          }}
          required={false}
          value={hint}
          onChange={(e) => {
            dispatch({
              type: ComponentActions.EDIT_HELP,
              payload: e.target.value,
            });
          }}
          {...attrs}
        />

        <div className="govuk-checkboxes govuk-form-group">
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="field-options-hideTitle"
              name="options.hideTitle"
              type="checkbox"
              checked={hideTitle}
              onChange={(e) =>
                dispatch({
                  type: ComponentActions.EDIT_OPTIONS_HIDE_TITLE,
                  payload: e.target.checked,
                })
              }
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="field-options-hideTitle"
            >
              Hide title
            </label>
            <span className="govuk-hint">Hide the title of the component</span>
          </div>
        </div>

        <Name
          labelText={i18n("component.name")}
          component={selectedComponent}
        />

        <div className="govuk-checkboxes govuk-form-group">
          <div className="govuk-checkboxes__item">
            <input
              type="checkbox"
              id="field-options-required"
              className={`govuk-checkboxes__input ${
                isFileUploadField ? "disabled" : ""
              }`}
              name="options.required"
              checked={!required}
              onChange={(e) =>
                dispatch({
                  type: ComponentActions.EDIT_OPTIONS_REQUIRED,
                  payload: !e.target.checked,
                })
              }
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="field-options-required"
            >
              {`Make ${
                ComponentTypes.find(
                  (componentType) => componentType.name === type
                )?.title ?? ""
              } optional`}
            </label>
            {isFileUploadField && (
              <span className="govuk-hint govuk-checkboxes__label">
                All file upload fields are optional to mitigate possible upload
                errors
              </span>
            )}
          </div>
        </div>

        <div
          className="govuk-checkboxes govuk-form-group"
          data-test-id="field-options.optionalText-wrapper"
          hidden={required}
        >
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="field-options-optionalText"
              name="options.optionalText"
              type="checkbox"
              checked={optionalText}
              onChange={(e) =>
                dispatch({
                  type: ComponentActions.EDIT_OPTIONS_HIDE_OPTIONAL,
                  payload: e.target.checked,
                })
              }
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="field-options-optionalText"
            >
              Hide &apos;(Optional)&apos; text
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(withI18n(FieldEdit));
