import React from "react";
import { icons } from "../icons";
import Flyout from "../flyout";
import DefineComponentValue from "./define-component-value";
import { clone } from "@xgovformbuilder/model";
import { RenderInPortal } from "./render-in-portal";
import { Label } from "@govuk-jsx/label";
import { DataContext } from "../context";
import { withI18n } from "../i18n/i18n";
import ListEdit from "../list/list-edit";

function updateComponent(component, modifier, updateModel) {
  modifier(component);
  updateModel(component);
}

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

export class ComponentValues extends React.Component {
  static contextType = DataContext;
  constructor(props) {
    super(props);
    const values = props.component.values;
    this.state = {
      component: clone(props.component),
      listName: values?.list,
    };

    this.formAddItem = React.createRef();
    this.formEditItem = React.createRef();
  }

  removeItem = (index) => {
    const { updateModel } = this.props;
    const { component } = this.state;
    updateComponent(
      component,
      (component) => component.values.items.splice(index, 1),
      updateModel
    );
    this.setState(component);
  };

  addItem = (item) => {
    const { updateModel } = this.props;
    const { component } = this.state;
    const isFormValid = this.formAddItem.current.reportValidity();

    if (isFormValid) {
      updateComponent(
        component,
        (component) => {
          component.values.items = component.values.items || [];
          component.values.items.push(item);
        },
        updateModel
      );
      this.setState({
        showAddItem: false,
      });
    }
  };

  initialiseValues = (e) => {
    const { component } = this.state;
    component.values = { type: e.target.value };
    this.setState({ component });
  };

  onCreateClick = (e) => {
    e.preventDefault();
    this.setState({ isEditingList: true });
  };

  render() {
    const { updateModel, page, i18n } = this.props;
    const { data } = this.context;
    const { lists } = data;
    const { listName, component, isEditingList, selectedList } = this.state;
    const staticValues = data.valuesFor?.(component)?.toStaticValues();
    const type = component.values?.type;

    const listSelectionOnChangeFunctions = {
      listRef: (e) => {
        updateComponent(
          component,
          (component) => addListValuesTo(component, data, e.target.value),
          updateModel
        );
        this.setState({ listName: e.target.value });
      },
      static: (e) => {
        updateComponent(
          component,
          (component) =>
            initialiseStaticValuesFrom(component, data, e.target.value),
          updateModel
        );
        this.setState({ listName: e.target.value });
      },
    };

    return (
      <div>
        <Label htmlFor="field-options-list">Select list</Label>
        <select
          className="govuk-select govuk-input--width-10"
          id="field-options-list"
          name="options.list"
          value={listName}
          required={type === "listRef"}
          onChange={listSelectionOnChangeFunctions[type]}
        >
          <option />
          {lists.map((list) => {
            return (
              <option key={list.name} value={list.name}>
                {list.title}
              </option>
            );
          })}
        </select>
        <a href="#" onClick={this.onCreateClick}>
          {i18n("list.newTitle")}
        </a>
        {isEditingList && (
          <RenderInPortal>
            <Flyout title={"creating"} width={""} show={isEditingList}>
              <ListEdit list={selectedList} />
            </Flyout>
          </RenderInPortal>
        )}
      </div>
    );
  }
}

export default withI18n(ComponentValues);
