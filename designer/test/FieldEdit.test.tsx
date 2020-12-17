import React from "react";
import sinon from "sinon";
import { shallow, mount } from "enzyme";
import * as Code from "@hapi/code";
import * as Lab from "@hapi/lab";
import { ComponentContextProvider } from "../client/reducers/component/componentReducer";
import FieldEdit from "../client/field-edit";
const { expect } = Code;
const lab = Lab.script();
exports.lab = lab;
const { test, suite } = lab;

suite("FieldEdit renders correctly when", () => {
  const wrapper = mount(
    <ComponentContextProvider>
      <FieldEdit />
    </ComponentContextProvider>
  );

  test("title changes", () => {
    const newTitle = "test title";
    const field = wrapper.find("#field-title");
    field.simulate("change", { target: { value: newTitle } });
    expect(wrapper.find("#field-title").props().value).to.equal(newTitle);
  });

  test("name changes", () => {
    const newName = "the-new-name";
    const field = () => wrapper.find("#field-name").first();
    field().simulate("change", { target: { value: newName } });
    expect(field().props().value).to.equal(newName);
  });

  test("help changes", () => {
    const newHelp = "help";
    const field = () => wrapper.find("#field-hint").first();
    field().simulate("change", { target: { value: newHelp } });
    expect(field().props().value).to.equal(newHelp);
  });

  test("hide title is checked", () => {
    const field = wrapper.find("#field-options-optionalText");
    field.simulate("change", { target: { checked: true } });
    expect(field.props().checked).to.equal(false);
  });
});
