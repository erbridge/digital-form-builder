import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import ListEdit from "./list-edit-fn";
import { RenderInPortal } from "../components/render-in-portal";
import Flyout from "./../flyout";
import { withI18n } from "./../i18n";
import { ListContext } from "../reducers/listReducer";
import { DataContext } from "../context";
import { ListActions } from "../reducers/listActions";
import ListItemEdit from "./list-item-edit";
import ComponentCreateFn from "../component-create-fn";
import { ComponentTypes } from "@xgovformbuilder/model";

export function ListsEdit(props) {
  const [listContext, dispatch] = useContext(ListContext);
  const { data, save } = useContext(DataContext);

  const { i18n } = props;
  // const [selectedList, setSelectedList] = useState();
  // const [isEditingList, setIsEditingList] = useState(false);
  const { lists } = data;

  const {
    selectedList,
    isEditingList = false,
    isEditingListItem = false,
    isEditingSubComponent = false,
  } = listContext;

  const allowedTypes = ComponentTypes.filter(
    (type) =>
      ![
        "RadiosField",
        "CheckboxesField",
        "SelectField",
        "AutocompleteField",
        "YesNoField",
      ].includes(type.name)
  );

  const closeFlyout = () => {};

  return (
    <div className="govuk-body">
      <ul className="govuk-list">
        {lists.map((list) => (
          <li key={list.name}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: ListActions.SET_SELECTED_LIST,
                  payload: list,
                });
              }}
            >
              {list.title}
            </a>
          </li>
        ))}
        <li>
          <hr />
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              dispatch({ type: ListActions.ADD_NEW_LIST });
            }}
          >
            {i18n("list.newTitle")}
          </a>
        </li>
      </ul>

      {isEditingList && (
        <RenderInPortal>
          {selectedList?.title}
          <Flyout
            title={
              selectedList?.title
                ? i18n("list.editingTitle", { title: selectedList.title })
                : i18n("list.newTitle")
            }
            onHide={closeFlyout}
            width={""}
            show={isEditingList}
          >
            <ListEdit />
          </Flyout>
        </RenderInPortal>
      )}

      {isEditingListItem && (
        <RenderInPortal>
          <Flyout
            title="Add Item"
            show={isEditingListItem}
            width={""}
            onHide={() => {}}
          >
            <ListItemEdit />
          </Flyout>
        </RenderInPortal>
      )}

      {isEditingSubComponent && (
        <RenderInPortal>
          <Flyout onHide={() => {}} width={""} show={isEditingSubComponent}>
            <ComponentCreateFn allowedTypes={allowedTypes} />
          </Flyout>
        </RenderInPortal>
      )}
    </div>
  );
}

export default withI18n(ListsEdit);
