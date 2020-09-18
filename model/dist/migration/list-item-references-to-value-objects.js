"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _logger = require("../logger");

const MIGRATABLE_COMPONENT_TYPES = ['RadiosField', 'CheckboxesField', 'YesNoField', 'SelectField', 'AutocompleteField', 'List', 'FlashCard'];

class ListItemReferencesToValueObjects {
  constructor(server) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = new _logger.Logger(server, 'ListItemReferencesToValueObjects');
  }

  getInitialVersion() {
    return 0;
  }

  migrate(formDef) {
    formDef.version = formDef.version || 1;
    formDef.pages.forEach(page => {
      page.components.forEach(component => {
        this.migrateComponent(component, formDef);
      });
    });
    return formDef;
  }

  migrateComponent(component, formDef) {
    var _component$options;

    if (MIGRATABLE_COMPONENT_TYPES.includes(component.type) && ((_component$options = component.options) === null || _component$options === void 0 ? void 0 : _component$options.list)) {
      const listName = component.options.list;
      const list = formDef.lists.find(list => list.name === listName);

      if (list) {
        component.values = {
          type: 'listRef',
          list: list.name,
          valueChildren: list.items.filter(item => {
            var _item$conditional;

            return (_item$conditional = item.conditional) === null || _item$conditional === void 0 ? void 0 : _item$conditional.components;
          }).map(item => ({
            value: item.value,
            children: item.conditional.components.map(it => this.migrateComponent(it, formDef))
          }))
        };
        delete component.options.list;
      } else {
        this.logger.error(`Unable to migrate component with list name ${listName} as the corresponding list does not exist`);
      }
    }

    return component;
  }

}

exports.default = ListItemReferencesToValueObjects;
//# sourceMappingURL=list-item-references-to-value-objects.js.map