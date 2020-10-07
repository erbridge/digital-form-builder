import React, { memo, useContext, useReducer, useState } from "react";
import { icons } from "../icons";
import Flyout from "../flyout";
import DefineComponentValue from "./define-component-value";
import { clone } from "@xgovformbuilder/model";
import { RenderInPortal } from "./render-in-portal";
import { Label } from "@govuk-jsx/label";
import { DataContext } from "../context";
import { withI18n } from "../i18n/i18n";
import ListEdit from "../list/list-edit";
import {
  ComponentActions,
  ComponentContext,
  ComponentListActions,
} from "../reducers/componentReducer";

function addListValuesTo(component, data, listName) {
  const list = data.lists.find((list) => list.name === listName);

  if (list) {
    component.values = {
      type: "listRef",
      list: listName,
    };
    return component;
  } else {
    component.values = {
      type: "listRef",
    };
  }
}

function initialiseStaticValuesFrom(component, data, listName) {
  const list = data.lists.find((list) => list.name === listName);

  function itemFrom(item) {
    const newItem = {
      label: item.text,
      value: item.value,
      children: item.conditional?.components ?? [],
    };

    Object.assign(newItem, item.description && { hint: item.description });
    Object.assign(newItem, item.condition && { condition: item.condition });

    return newItem;
  }

  if (list) {
    component.values = {
      type: "static",
      valueType: list.type,
      items: list.items.map(itemFrom),
    };
    return component;
  } else {
    component.values = {
      type: "static",
    };
  }
}

function ComponentValues({ i18n }) {
  const [{ selectedComponent, isEditingList }, dispatch] = useContext(
    ComponentContext
  );
  const { data } = useContext(DataContext);
  const { values } = selectedComponent;

  return (
    <div className="govuk-form-group">
      <Label htmlFor="field-options-list">{i18n("list.select")}</Label>
      <select
        className="govuk-select govuk-input--width-10"
        id="field-options-list"
        name="options.list"
        value={values.list}
        onChange={(e) =>
          dispatch({
            type: ComponentListActions.EDIT_SELECTED_LIST,
            payload: e.target.value,
          })
        }
      >
        <option />
        {data.lists.map((list, index) => {
          return (
            <option key={`${list.name}-${index}`} value={list.name}>
              {list.title}
            </option>
          );
        })}
      </select>

      {values?.items.length && (
        <a
          href="#"
          className="govuk-link govuk-!-display-block"
          onClick={(e) => dispatch({ type: ComponentListActions.EDIT_LIST })}
        >
          {i18n("list.edit")}
        </a>
      )}

      <a
        href="#"
        className="govuk-link govuk-!-display-block"
        onClick={(e) => {
          e.preventDefault();
          console.log("add new");
          dispatch({
            type: ComponentListActions.ADD_STATIC_LIST,
            payload: true,
          });
        }}
      >
        {i18n("list.newTitle")}
      </a>
      {isEditingList && (
        <Flyout title={"creating"} width={""} show={isEditingList}>
          <ListEdit />
        </Flyout>
      )}
    </div>
  );
}
/*
 *  values: {
         type: 'static',
         valueType: 'string',
         items: [
           { label: 'My item', value: '12', children: [] },
           { label: 'Item 2', hint: 'My hint', value: '11', condition: 'Abcewdad', children: [] },
           { label: 'Item 3', value: '11', children: [{ type: 'TextField' }] }
         ]
       }
       *
       *   const { component } = this.state;
       * component.values = { type: e.target.value };
 * */

export default memo(withI18n(ComponentValues));
