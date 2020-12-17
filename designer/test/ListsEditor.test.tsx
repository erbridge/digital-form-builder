import sinon from "sinon";
import React, { useReducer } from "react";
import { shallow, mount } from "enzyme";
import * as Code from "@hapi/code";
import * as Lab from "@hapi/lab";
import { initI18n } from "../client/i18n";

import { DataContext } from "../client/context";
import { Data } from "@xgovformbuilder/model";
import {
  initListsEditingState,
  ListsEditorContext,
  ListsEditorContextProvider,
  listsEditorReducer,
} from "../client/reducers/list/listsEditorReducer";
import ListsEdit from "../client/list/lists-edit";
import {
  ListContext,
  ListContextProvider,
} from "../client/reducers/listReducer";
import GlobalListSelect from "../client/list/global-list-select";
import ListEdit from "../client/list/list-edit-fn";
import ListItemEdit from "../client/list/list-item-edit";

const { expect } = Code;
const lab = Lab.script();
exports.lab = lab;
const { test, suite } = lab;

function HookWrapper(props) {
  const hook = props.hook ? props.hook() : undefined;
  return <div hook={hook} />;
}

suite("Lists (global)", () => {
  const sandbox = sinon.createSandbox();
  const data = new Data({
    lists: [
      {
        name: "myList",
        title: "My list",
        type: "number",
        items: [{ text: "An item", description: "A hint", value: 12 }],
      },
    ],
  });
  const dataValue = { data, save: sinon.spy() };

  const TestComponentContextProvider = ({ children, dataValue }) => {
    const [state, dispatch] = useReducer(
      listsEditorReducer,
      initListsEditingState()
    );
    const spied = sandbox.spy(dispatch);
    return (
      <DataContext.Provider value={dataValue}>
        <ListsEditorContext.Provider value={[state, spied]}>
          <ListContextProvider>{children}</ListContextProvider>
        </ListsEditorContext.Provider>
      </DataContext.Provider>
    );
  };

  test("GlobalListSelect is shown when not editing from component", () => {
    const wrapper = shallow(
      <TestComponentContextProvider dataValue={dataValue}>
        <ListsEdit />
      </TestComponentContextProvider>
    );
    const f = wrapper.find(ListsEdit);
    expect(f.find(GlobalListSelect)).to.exist();
    expect(wrapper.find("My list")).to.exist();
    expect(wrapper.find(ListEdit).isEmptyRender()).to.be.true();
    expect(wrapper.find(ListItemEdit).isEmptyRender()).to.be.true();
  });

  test("Clicking on a list renders LisEdit", () => {
    const wrapper = mount(
      <TestComponentContextProvider dataValue={dataValue}>
        <ListsEdit />
      </TestComponentContextProvider>
    );
    wrapper.find(ListsEdit).find("ul a").first().simulate("click");

    expect(wrapper.find(ListEdit).first().isEmptyRender()).to.be.false();
    expect(wrapper.find(ListItemEdit).first().isEmptyRender()).to.be.true();
  });
});
