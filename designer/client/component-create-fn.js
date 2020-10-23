import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import ComponentTypeEdit from "./component-type-edit";
import { clone, ComponentTypes } from "@xgovformbuilder/model";
import { DataContext, PageContext } from "./context";
import { nanoid } from "nanoid";

function initComponent(type) {
  const initialFields = {
    name: nanoid(6),
    title: "",
    schema: {},
    options: { required: true },
    type,
  };
  // if (
  //   [
  //     "SelectField",
  //     "RadiosField",
  //     "CheckboxesField",
  //     "AutocompleteField",
  //   ].includes(type)
  // ) {
  //   initialFields.values = {
  //     type: "static",
  //     items: [],
  //   };
  // }
  return initialFields;
}

function ComponentCreate(props) {
  const { data, save } = useContext(DataContext);
  const { page } = props;
  const { update } = useContext(PageContext);
  useLayoutEffect(() => {
    update(page);
    return () => {
      update();
    };
  }, []);
  const [component, setComponent] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [type, setType] = useState("");
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  useEffect(() => {
    if (type) {
      setComponent(initComponent(type));
      console.log("setting component");
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (page) {
      data.addComponent(page.path, component);
      await save(data.toJSON());
    } else {
      props.handleSubComponentCreate(component);
    }
    setIsSaving(false);
  };

  const handleUpdateComponent = (update) => {
    setComponent({ ...component, ...update });
    console.log("set comp", component);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="type">
            Type
          </label>
          <select
            className="govuk-select"
            id="type"
            name="type"
            required
            onChange={handleTypeChange}
          >
            <option />
            {ComponentTypes.sort((a, b) =>
              (a.title ?? "").localeCompare(b.title)
            ).map((type) => {
              return (
                <option key={type.name} value={type.name}>
                  {type.title}
                </option>
              );
            })}
          </select>
        </div>

        {component?.type && (
          <ComponentTypeEdit
            data={data}
            component={component}
            handleUpdateComponent={handleUpdateComponent}
            page={page}
          />
        )}
        <div>
          <button type="submit" className="govuk-button" disabled={isSaving}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default ComponentCreate;
