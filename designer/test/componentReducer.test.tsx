import sinon from "sinon";
import React from "react";
import { shallow, mount } from "enzyme";
import * as Code from "@hapi/code";
import * as Lab from "@hapi/lab";
import {
  componentReducer,
  getSubReducer,
} from "../client/reducers/component/componentReducer";
import { Actions, Meta } from "../client/reducers/component/types";
import { metaReducer } from "../client/reducers/component/componentReducer.meta";
import { optionsReducer } from "../client/reducers/component/componentReducer.options";
import { fieldsReducer } from "../client/reducers/component/componentReducer.fields";
import { schemaReducer } from "../client/reducers/component/componentReducer.schema";
import { componentListReducer } from "../client/reducers/component/componentReducer.list";
const { expect } = Code;
const lab = Lab.script();
exports.lab = lab;
const { test, suite } = lab;

suite("Component reducer", () => {
  test("getSubReducer returns correct reducer", () => {
    const metaAction = Actions.NEW_COMPONENT,
      schemaAction = Actions.EDIT_SCHEMA_MIN,
      fieldsAction = Actions.EDIT_TITLE,
      optionsAction = Actions.EDIT_OPTIONS_HIDE_TITLE,
      listAction = Actions.EDIT_LIST;

    expect(getSubReducer(metaAction)).to.equal(metaReducer);
    expect(getSubReducer(schemaAction)).to.equal(schemaReducer);
    expect(getSubReducer(optionsAction)).to.equal(optionsReducer);
    expect(getSubReducer(fieldsAction)).to.equal(fieldsReducer);
    expect(getSubReducer(listAction)).to.equal(componentListReducer);
  });

  test("componentReducer adds hasValidated flag correctly", () => {
    expect(
      componentReducer(
        {},
        { type: Actions.EDIT_TITLE, payload: "changing title" }
      )
    ).to.contain({
      hasValidated: false,
    });
  });
});
