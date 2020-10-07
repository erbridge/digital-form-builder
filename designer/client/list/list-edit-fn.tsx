import ListItems from "./list-items";
import Flyout from "../flyout";
import ListItemEdit from "./list-item-edit";
import { Hint } from "@govuk-jsx/hint";
import { Label } from "@govuk-jsx/label";
import { ErrorMessage } from "@govuk-jsx/error-message";
import React, { useContext, useState } from "react";
import {
  ComponentContext,
  ComponentListActions,
} from "../reducers/componentReducer";
import { DataContext } from "../context";
import { ListContext } from "../reducers/listReducer";
import { ListActions } from "../reducers/listActions";
import { withI18n } from "../i18n";

export function ListEdit(props) {
  // const [{ selectedComponent, isEditingList }, componentDispatch] = useContext(
  //   ComponentContext
  // );

  const [{ selectedList }, dispatch] = useContext(ListContext);

  // const dispatch = selectedList ? componentDispatch : listDispatch;

  const { data } = useContext(DataContext);
  const { i18n } = props;

  const [isEditingListItem, setIsEditingListItem] = useState(false);
  const [titleHasError, setTitleHasError] = useState(false);
  const isNew = !props.list?.name;
  /*
  let list;

  if (props.list) {
    list = {
      type: props.list?.type ?? "string",
      list: props.list || {
        title: "",
        name: nanoid(6),
        type: "string",
        items: [],
      },
    };
  } else {
    list = selectedComponent.values;
  } */

  /**
   * @description submit changes to list or component
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // submit to component or submit to list
  };

  const handleListChange = async (e) => {
    e.preventDefault();
  };

  const handleCreateListItem = (e) => {
    e.preventDefault();
  };

  const handleClickDelete = async (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div
          className={`govuk-form-group ${
            titleHasError ? "govuk-form-group--error" : ""
          }`}
        >
          <Label htmlFor="list-title">{i18n("list.title")}</Label>
          <Hint>{i18n("wontShow")}</Hint>
          {titleHasError && (
            <ErrorMessage>{i18n("errors.required")}</ErrorMessage>
          )}
          <input
            className={`govuk-input govuk-input--width-20 ${
              titleHasError ? "govuk-input--error" : ""
            }`}
            id="list-title"
            name="title"
            type="text"
            value={selectedList.title}
            onChange={(e) =>
              dispatch({
                type: ListActions.EDIT_TITLE,
                payload: e.target.value,
              })
            }
          />
        </div>
        <ListItems />
        {!isNew && (
          <a
            className="govuk-link govuk-body govuk-!-display-block govuk-!-margin-bottom-1"
            href="#"
            onClick={handleCreateListItem}
          >
            {i18n("list.createListItem")}
          </a>
        )}
        <button
          className="govuk-button"
          type="submit"
          disabled={titleHasError || !selectedList.title}
        >
          Save
        </button>{" "}
        {!isNew && (
          <a href="#" className="govuk-link" onClick={handleClickDelete}>
            {i18n("delete")}
          </a>
        )}
      </form>
    </div>
  );
}

export default withI18n(ListEdit);
