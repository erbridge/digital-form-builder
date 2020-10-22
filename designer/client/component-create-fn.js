import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import ComponentTypeEdit from "./component-type-edit";
import { clone, ComponentTypes } from "@xgovformbuilder/model";
import { DataContext, PageContext } from "./context";
import { nanoid } from "nanoid";

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
  const name = nanoid(6);
  const [component, setComponent] = useState({ name });
  const [isSaving, setIsSaving] = useState(false);

  const handleTypeChange = (e) => {
    setComponent({ ...component, type: e.target.value });
  };

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

        {component.type && (
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
