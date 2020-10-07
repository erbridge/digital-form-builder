import React, { useReducer, createContext } from "react";
import { ListActions } from "./listActions";
export const ComponentContext = createContext({});

export enum ComponentActions {
  EDIT_TITLE = "EDIT_TITLE",
  EDIT_NAME = "EDIT_NAME",
  EDIT_CONDITION = "EDIT_CONDITION",
  EDIT_HELP = "EDIT_HELP",

  /**
   * @description adding list items to a component differs to adding one to a list.
   */

  EDIT_OPTIONS_HIDE_TITLE = "EDIT_OPTIONS_HIDE_TITLE",
  EDIT_OPTIONS_REQUIRED = "EDIT_OPTIONS_REQUIRED",
  EDIT_OPTIONS_HIDE_OPTIONAL = "EDIT_OPTIONS_HIDE_OPTIONAL",
  EDIT_OPTIONS_FILE_UPLOAD_MULTIPLE = "EDIT_OPTIONS_FILE_UPLOAD_MULTIPLE",
  EDIT_OPTIONS_CLASSES = "EDIT_OPTIONS_CLASSES",

  SUBMIT = "SUBMIT",
}

export enum ComponentListActions {
  /**
   * @description adding list items to a component differs to adding one to a list.
   */
  ADD_STATIC_LIST = "ADD_STATIC_LIST",
}

function componentReducer(
  state,
  action: {
    type: ComponentActions | ListActions | ComponentListActions;
    payload: any;
  }
) {
  const { type, payload } = action;
  const {
    selectedComponent = {
      options: { required: false, hideTitle: false, optionalText: false },
    },
  } = state;
  const { options } = selectedComponent;
  switch (type) {
    case ComponentActions.EDIT_TITLE:
      return { selectedComponent: { ...selectedComponent, title: payload } };
    case ComponentActions.EDIT_NAME:
      return { selectedComponent: { ...selectedComponent, name: payload } };
    case ComponentActions.EDIT_CONDITION:
      break;
    case ComponentActions.EDIT_HELP:
      return { selectedComponent: { ...selectedComponent, help: payload } };
    case ComponentActions.EDIT_OPTIONS_HIDE_TITLE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, hideTitle: payload },
        },
      };
    case ComponentActions.EDIT_OPTIONS_REQUIRED:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: {
            ...options,
            required:
              selectedComponent.type === "FileUploadField" ? false : payload,
          },
        },
      };
    case ComponentActions.EDIT_OPTIONS_HIDE_OPTIONAL:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, optionalText: payload },
        },
      };
    case ComponentActions.EDIT_OPTIONS_FILE_UPLOAD_MULTIPLE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, multiple: payload },
        },
      };
    case ComponentActions.EDIT_OPTIONS_CLASSES:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, classes: payload },
        },
      };

    case ListActions.EDIT_LIST_ITEM:
      const {
        values = { type: "static", valueType: "string", items: [] },
      } = selectedComponent;

      return {
        selectedComponent: {
          ...selectedComponent,
          values,
        },
        isEditingList: payload,
      };
    case ListActions.EDIT_SELECTED_LIST:
      return {
        selectedComponent: {
          ...selectedComponent,
          values: { type: "listRef", list: payload },
        },
      };

    case ListActions.EDIT_LIST:
      return {
        selectedComponent: {
          ...selectedComponent,
        },
        isEditingList: payload,
      };

    case ComponentListActions.ADD_STATIC_LIST:
      return {
        selectedComponent: {
          ...selectedComponent,
          values: { type: "static", items: [] },
        },
        isEditingList: payload,
      };
  }
}

export const ComponentContextProvider = (props) => {
  const selectedComponent = props?.component;
  const [state, dispatch] = useReducer(componentReducer, { selectedComponent });

  return (
    <ComponentContext.Provider value={[state, dispatch]}>
      {props.children}
    </ComponentContext.Provider>
  );
};
