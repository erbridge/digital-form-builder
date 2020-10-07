import React, { useContext } from "react";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
  SortableHandle,
} from "react-sortable-hoc";
import { clone } from "@xgovformbuilder/model";
import { withI18n } from "../i18n";
import { RenderInPortal } from "../components/render-in-portal";
import { DataContext } from "../context";
import { ListContext } from "../reducers/listReducer";
import { ListActions } from "../reducers/listActions";

const DragHandle = SortableHandle(() => (
  <span className="drag-handle-list">&#9776;</span>
));

const SortableItem = SortableElement(
  ({ index, item, type, removeItem, selectListItem }) => {
    return (
      <tr className="govuk-table__row" scope="row">
        <td className="govuk-table__cell" width="20px">
          <DragHandle />
        </td>
        <td className="govuk-table__cell">{item.text}</td>
        <td className="govuk-table__cell" width="50px">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              selectListItem(item);
            }}
          >
            Edit
          </a>
        </td>
        <td className="govuk-table__cell" width="50px">
          <a href="#" onClick={() => removeItem(index)}>
            Delete
          </a>
        </td>
      </tr>
    );
  }
);

const SortableList = SortableContainer(
  ({ items, selectListItem, removeItem }) => {
    return (
      <tbody className="govuk-table__body">
        {items.map((item, index) => (
          <SortableItem
            key={`item-${index}`}
            item={item}
            index={index}
            selectListItem={selectListItem}
            removeItem={removeItem}
          />
        ))}
      </tbody>
    );
  }
);

function ListItems(_props) {
  const [{ selectedList }, dispatch] = useContext(ListContext);
  const selectListItem = (payload) =>
    dispatch({ type: ListActions.EDIT_LIST_ITEM, payload });
  const onSortEnd = () => {};

  return (
    <div>
      <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th className="govuk-table__header" scope="col" />
            <th className="govuk-table__header" scope="col" />
            <th className="govuk-table__header" scope="col" />
            <th className="govuk-table__header" scope="col" />
          </tr>
        </thead>
        <SortableList
          items={selectedList?.items || []}
          conditions={[]}
          selectListItem={selectListItem}
          removeItem={() => {}}
          onSortEnd={onSortEnd}
          helperClass="dragging"
          lockToContainerEdges
          useDragHandle
        />
      </table>
    </div>
  );
}

class ListItemsC extends React.Component {
  static contextType = ListContext;

  constructor(props) {
    super(props);

    // this.state = {
    //   list: props.list,
    //   items: props.list?.items ?? [],
    // };
    this.state = {};
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
  };

  onClickAddItem = (e) => {
    e.preventDefault();
  };

  removeItem = (idx) => {
    this.setState({
      items: this.state.items.filter((s, i) => i !== idx),
    });
  };

  onClickDelete = (e) => {
    e.preventDefault();

    if (!window.confirm("Confirm delete")) {
      return;
    }

    const { data, list } = this.props;
    const copy = clone(data);

    // Remove the list
    copy.lists.splice(data.lists.indexOf(list), 1);

    // Update any references to the list
    copy.pages.forEach((p) => {
      if (p.list === list.name) {
        delete p.list;
      }
    });

    data
      .save(copy)
      .then((data) => {
        console.log(data);
        this.props.onEdit({ data });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  selectListItem(payload) {
    const [_, dispatch] = this.context;
    dispatch({ type: ListActions.EDIT_LIST_ITEM, payload });
  }

  render() {
    console.log("rendering list item");
    const [{ selectedList }, dispatch] = this.context;

    // const { items } = this.state;
    // const { type, conditions, selectListItem } = this.props;
    return (
      <div>
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th className="govuk-table__header" scope="col" />
              <th className="govuk-table__header" scope="col" />
              <th className="govuk-table__header" scope="col" />
              <th className="govuk-table__header" scope="col" />
            </tr>
          </thead>
          <SortableList
            items={selectedList?.items || []}
            conditions={[]}
            selectListItem={this.selectListItem}
            removeItem={this.removeItem}
            onBlur={this.onBlur}
            onSortEnd={this.onSortEnd}
            helperClass="dragging"
            lockToContainerEdges
            useDragHandle
          />
        </table>
      </div>
    );
  }
}

export default withI18n(ListItems);
