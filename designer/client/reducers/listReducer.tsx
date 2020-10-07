import { nanoid } from "nanoid";
import React, { createContext, useReducer } from "react";
import { ListActions } from "./listActions";

export const ListContext = createContext({});

/**
 * @desc this reducer is for "global" list types.
 */
function listReducer(state, action: { type: ListActions; payload: any }) {
  const { type, payload } = action;
  const { selectedList, selectedItem, selectedItemIndex } = state;
  switch (type) {
    case ListActions.ADD_NEW_LIST:
      return {
        selectedList: {
          title: "",
          name: nanoid(6),
          type: "string",
          items: [],
        },
        isEditingList: true,
      };

    case ListActions.SET_SELECTED_LIST:
      return { selectedList: payload, isEditingList: true };

    case ListActions.EDIT_TITLE:
      return { ...state, selectedList: { ...selectedList, title: payload } };
    case ListActions.EDIT_LIST_VALUE_TYPE:
      return { ...state, selectedList: { ...selectedList, type: payload } };

    case ListActions.ADD_LIST_ITEM:
      return { ...state, isEditingListItem: true };
    case ListActions.EDIT_LIST_ITEM:
      return {
        ...state,
        isEditingListItem: true,
        selectedItem: payload,
        selectedItemIndex: selectedList.items.findIndex(
          (item) => item === payload
        ),
      };
    case ListActions.EDIT_LIST_ITEM_TEXT:
      return {
        ...state,
        selectedItem: { ...selectedItem, text: payload },
      };
    case ListActions.EDIT_LIST_ITEM_DESCRIPTION: {
      return {
        ...state,
        selectedItem: { ...selectedItem, description: payload },
      };
    }
    case ListActions.EDIT_LIST_ITEM_VALUE: {
      return { ...state, selectedItem: { ...selectedItem, value: payload } };
    }
    case ListActions.EDIT_LIST_ITEM_CONDITION: {
      return {
        ...state,
        selectedItem: { ...selectedItem, condition: payload },
      };
    }

    case ListActions.EDIT_SUBCOMPONENT:
      return {
        ...state,
        isEditingSubcomponent: true,
        selectedSubComponent: payload,
      };

    case ListActions.ADD_SUBCOMPONENT:
      return {
        ...state,
        isEditingSubcomponent: true,
      };

    case ListActions.SUBMIT_LIST_ITEM: {
      const items = selectedList.items.splice(
        selectedItemIndex,
        1,
        selectedItem
      );

      // not returning anything else so flyouts will close..
      return { selectedList: { ...selectedList, items } };
    }
  }
}

export const ListContextProvider = (props) => {
  const [state, dispatch] = useReducer(listReducer, {});
  return (
    <ListContext.Provider value={[state, dispatch]}>
      {props.children}
    </ListContext.Provider>
  );
};
