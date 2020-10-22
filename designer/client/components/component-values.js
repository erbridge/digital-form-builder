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
    const { component } = props;
    const { values } = component;
    this.state = {
      component,
      listName: values?.list,
    };
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
  * */

  initialiseValues = (e) => {
    const { component } = this.state;
    component.values = { type: e.target.value };
    this.setState({ component });
  };

  onCreateClick = async (e) => {
    e.preventDefault();
    const { component, page } = this.props;
    const newListTitle = component?.title ?? component?.name;
    console.log("page?", page);

    this.setState({
      isEditingList: true,
      selectedList: { title: newListTitle },
    });
  };

  setSelectedList = (e) => {
    this.setState({ listName: e.target.value });
  };

  render() {
    const { i18n, title } = this.props;
    const { data } = this.context;
    const { lists } = data;
    const { listName, component, isEditingList, selectedList } = this.state;
    const staticValues = data.valuesFor?.(component)?.toStaticValues();
    const type = component.values?.type;

    const onChangeType = (e) => {
      switch (type) {
        case "listRef":
        // addListValuesTo(component, data, e.target.value)
        case "static":
        // initialiseStaticValuesFrom(component, data, e.target.value)
      }
    };

    return (
      <div className="govuk-form-group">
        <Label htmlFor="field-options-list">{i18n("list.select")}</Label>
        <select
          className="govuk-select govuk-input--width-10"
          id="field-options-list"
          name="options.list"
          value={selectedList}
          onChange={this.setSelectedList}
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

        <a
          href="#"
          className="govuk-link govuk-!-display-block"
          onClick={this.onCreateClick}
        >
          {i18n("list.newTitle")}
        </a>
        {isEditingList && (
          <RenderInPortal>
            <Flyout title={"creating"} width={""} show={isEditingList}>
              <ListEdit
                list={selectedList}
                setSelectedList={this.setSelectedList}
              />
            </Flyout>
          </RenderInPortal>
        )}
      </div>
    );
  }
}

export default withI18n(ComponentValues);
