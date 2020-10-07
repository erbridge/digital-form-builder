import React, { useContext, useState } from "react";
import { withI18n } from "./../i18n";
import { Input } from "@govuk-jsx/input";
import { Textarea } from "@govuk-jsx/textarea";
import { Label } from "@govuk-jsx/label";
import { Hint } from "@govuk-jsx/hint";
import { DataContext, PageContext } from "../context";
import { ListContext } from "../reducers/listReducer";
import { ListActions } from "../reducers/listActions";

export function ListItemEdit(props) {
  const [{ selectedItem }, dispatch] = useContext(ListContext);
  const { data, save } = useContext(DataContext);
  const { page } = useContext(PageContext);
  const {
    text = "",
    value = "",
    description = "",
    condition = "",
  } = selectedItem;

  const { i18n } = props;
  const { conditions } = data;
  // TODO:- refactor custom hook to work with reducer
  // const error = hasError ? { children: [i18n("errors.required")] } : undefined;
  let error;
  const [subComponent, setSubComponent] = useState();
  const handleSubComponentCreate = (update) => {
    // setIsEditingSubComponent(true);
    setSubComponent({ ...subComponent, ...update });
    handleSubmit();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const listItem = {
      text,
      value,
      description,
      condition,
    };
    await save(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          label={{
            className: "govuk-label--s",
            children: [i18n("list.item.title")],
          }}
          value={text}
          onChange={(e) =>
            dispatch({
              type: ListActions.EDIT_LIST_ITEM_TEXT,
              payload: e.target.value,
            })
          }
        />
        <Textarea
          label={{ children: [i18n("list.item.titleHint")] }}
          value={description}
          onChange={(e) =>
            dispatch({
              type: ListActions.EDIT_LIST_ITEM_DESCRIPTION,
              payload: e.target.value,
            })
          }
        />
        <Input
          label={{ children: [i18n("list.item.value")] }}
          hint={{ children: [i18n("list.item.valueHint")] }}
          value={value}
          errorMessage={error}
          onChange={(e) =>
            dispatch({
              type: ListActions.EDIT_LIST_ITEM_VALUE,
              payload: e.target.value,
            })
          }
        />

        <Label>{i18n("list.item.conditions")}</Label>
        <Hint>{i18n("list.item.conditionsHint")}</Hint>
        <select
          className="govuk-select"
          id="condition"
          name="options.condition"
          value={condition}
          onChange={(e) =>
            dispatch({
              type: ListActions.EDIT_LIST_ITEM_CONDITION,
              payload: e.target.value,
            })
          }
        >
          <option value="" />
          {conditions?.map((condition) => (
            <option key={condition.name} value={condition}>
              {condition.name}
            </option>
          ))}
        </select>
        <hr />
        <fieldset className="govuk-fieldset">
          <p className="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">
            {i18n("list.item.subComponent")}
          </p>
          <Hint>{i18n("list.item.subComponentHint")}</Hint>
          <a
            href="#"
            className="govuk-link"
            onClick={(e) =>
              dispatch({ type: ListActions.EDIT_SUBCOMPONENT, payload: null })
            }
          >
            {i18n("list.item.createSubComponent")}
          </a>
        </fieldset>

        <div className={"govuk-form-group"}>
          <button className="govuk-button" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default withI18n(ListItemEdit);
