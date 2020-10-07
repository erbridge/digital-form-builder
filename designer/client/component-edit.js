import React, { memo } from "react";
import ComponentTypeEdit from "./component-type-edit";
import { clone } from "@xgovformbuilder/model";
import { DataContext } from "./context";
import { ComponentContextProvider } from "./reducers/componentReducer";

export function componentEditFn(props) {
  const { component } = props;
  console.log("component edit fn", component);

  return (
    <ComponentContextProvider component={component}>
      <form autoComplete="off" onSubmit={(e) => this.onSubmit(e)}>
        <div className="govuk-form-group">
          <span className="govuk-label govuk-label--s" htmlFor="type">
            Type
          </span>
          <span className="govuk-body">{component.type}</span>
        </div>
        <ComponentTypeEdit />
        <button className="govuk-button" type="submit">
          Save
        </button>{" "}
        <button className="govuk-button" type="button">
          Delete
        </button>
      </form>
    </ComponentContextProvider>
  );
}

export const ComponentEditFn = memo(componentEditFn);

class ComponentEdit extends React.Component {
  static contextType = DataContext;
  constructor(props) {
    super(props);
    this.state = {
      component: props.component,
    };
  }

  async onSubmit(e) {
    e.preventDefault();
    const { page, component, handleUpdateComponent } = this.props;
    const { data, save } = this.context;
    const updatedComponent = this.state.component;
    const updatedData = data.updateComponent(
      page.path,
      component.name,
      updatedComponent
    );
    const savedData = await save(updatedData);
    this.props.onEdit({ data: savedData });
    if (handleUpdateComponent) {
      handleUpdateComponent(component);
    }
  }

  onClickDelete = (e) => {
    e.preventDefault();

    if (!window.confirm("Confirm delete")) {
      return;
    }

    const { data, page, component } = this.props;
    const componentIdx = page.components.findIndex((c) => c === component);
    const copy = clone(data);

    const copyPage = copy.findPage(page.path);
    const isLast = componentIdx === page.components.length - 1;

    // Remove the component
    copyPage.components.splice(componentIdx, 1);

    data
      .save(copy)
      .then((data) => {
        console.log(data);
        if (!isLast) {
          // We dont have an id we can use for `key`-ing react <Component />'s
          // We therefore need to conditionally report `onEdit` changes.
          this.props.onEdit({ data });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    const { page, data } = this.props;
    const { component } = this.state;

    const copyComp = JSON.parse(JSON.stringify(component));

    return (
      <div>
        <form autoComplete="off" onSubmit={(e) => this.onSubmit(e)}>
          <div className="govuk-form-group">
            <span className="govuk-label govuk-label--s" htmlFor="type">
              Type
            </span>
            <span className="govuk-body">{component.type}</span>
          </div>
          <ComponentTypeEdit
            page={page}
            component={copyComp}
            data={data}
            updateModel={this.storeComponent}
          />
          <button className="govuk-button" type="submit">
            Save
          </button>{" "}
          <button
            className="govuk-button"
            type="button"
            onClick={this.onClickDelete}
          >
            Delete
          </button>
        </form>
      </div>
    );
  }

  storeComponent = (component) => {
    this.setState({ component });
  };
}

export default ComponentEditFn;
