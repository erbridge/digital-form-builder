import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classPrivateFieldGet from "@babel/runtime/helpers/classPrivateFieldGet";
import _classPrivateFieldSet from "@babel/runtime/helpers/classPrivateFieldSet";
import { StaticValues, valuesFrom, yesNoValues } from './values';
import { clone } from './helpers';
import { ConditionsModel } from './conditions';

function filter(obj, predicate) {
  const result = {};
  let key;

  for (key in obj) {
    if (obj[key] && predicate(obj[key])) {
      result[key] = obj[key];
    }
  }

  return result;
}

var _parentItemName = new WeakMap();

class Input {
  constructor(rawData, page, options = {}) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "title", void 0);

    _defineProperty(this, "propertyPath", void 0);

    _defineProperty(this, "page", void 0);

    _parentItemName.set(this, {
      writable: true,
      value: void 0
    });

    Object.assign(this, rawData);
    const myPage = clone(page);
    delete myPage.components;
    this.page = myPage;
    this.propertyPath = !options.ignoreSection && page.section ? `${page.section}.${this.name}` : this.name;

    _classPrivateFieldSet(this, _parentItemName, options.parentItemName);
  }

  get displayName() {
    const titleWithContext = _classPrivateFieldGet(this, _parentItemName) ? `${this.title} under ${_classPrivateFieldGet(this, _parentItemName)}` : this.title;
    return this.page.section ? `${titleWithContext} in ${this.page.section}` : titleWithContext;
  }

}

export class Condition {
  constructor(rawData) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "displayName", void 0);

    _defineProperty(this, "value", void 0);

    Object.assign(this, rawData);
    this.displayName = rawData.displayName || rawData.name;
  }

  get expression() {
    if (typeof this.value === 'string') {
      return this.value;
    } else {
      return ConditionsModel.from(this.value).toExpression();
    }
  }

  clone() {
    return new Condition(this);
  }

}

class ValuesWrapper {
  constructor(values, data) {
    _defineProperty(this, "values", void 0);

    _defineProperty(this, "data", void 0);

    this.values = values;
    this.data = data;
  }

  toStaticValues() {
    return this.values.toStaticValues(this.data);
  }

}

var _conditions = new WeakMap();

var _name = new WeakMap();

var _feedback = new WeakMap();

export class Data {
  /**
   * FIXME: Ideally I'd have made this part of feedback-context-info.js and moved that inside model
   * That, however uses relative-url.js, which utilises a URL and the shims for that don't work
   */
  constructor(rawData) {
    _defineProperty(this, "startPage", void 0);

    _defineProperty(this, "pages", void 0);

    _defineProperty(this, "lists", void 0);

    _defineProperty(this, "sections", void 0);

    _conditions.set(this, {
      writable: true,
      value: void 0
    });

    _name.set(this, {
      writable: true,
      value: void 0
    });

    _feedback.set(this, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "updateLinksTo", function (oldPath, newPath) {
      this.pages.filter(p => p.next && p.next.find(link => link.path === oldPath)).forEach(page => {
        page.next.find(link => link.path === oldPath).path = newPath;
      });
      return this;
    });

    const rawDataClone = rawData instanceof Data ? rawData._exposePrivateFields() : Object.assign({}, rawData);

    _classPrivateFieldSet(this, _conditions, (rawDataClone.conditions || []).map(it => new Condition(it)));

    _classPrivateFieldSet(this, _feedback, rawDataClone.feedback);

    delete rawDataClone.conditions;
    delete rawDataClone.feedback;
    Object.assign(this, rawDataClone);
    this.pages = this.pages || [];
    this.lists = this.lists || [];
    this.sections = this.sections || [];
  }

  _listInputsFor(page, input) {
    var _this$valuesFor;

    const values = (_this$valuesFor = this.valuesFor(input)) === null || _this$valuesFor === void 0 ? void 0 : _this$valuesFor.toStaticValues();
    return values ? values.items.flatMap(listItem => {
      var _listItem$children$fi, _listItem$children, _listItem$children$fi2;

      return (_listItem$children$fi = (_listItem$children = listItem.children) === null || _listItem$children === void 0 ? void 0 : (_listItem$children$fi2 = _listItem$children.filter(it => it.name)) === null || _listItem$children$fi2 === void 0 ? void 0 : _listItem$children$fi2.map(it => new Input(it, page, {
        parentItemName: listItem.label
      }))) !== null && _listItem$children$fi !== void 0 ? _listItem$children$fi : [];
    }) : [];
  }

  allInputs() {
    const inputs = this.pages.flatMap(page => (page.components || []).filter(component => component.name).flatMap(it => [new Input(it, page)].concat(this._listInputsFor(page, it))));

    if (this.feedbackForm) {
      const startPage = this.findPage(this.startPage);
      const options = {
        ignoreSection: true
      };
      Data.FEEDBACK_CONTEXT_ITEMS.forEach(it => {
        inputs.push(new Input({
          type: 'TextField',
          title: it.display,
          name: it.key
        }, startPage, options));
      });
    }

    const names = new Set();
    return inputs.filter(input => {
      const isPresent = !names.has(input.propertyPath);
      names.add(input.propertyPath);
      return isPresent;
    });
  }

  inputsAccessibleAt(path) {
    const precedingPages = this._allPathsLeadingTo(path);

    return this.allInputs().filter(it => precedingPages.includes(it.page.path) || path === it.page.path);
  }

  findPage(path) {
    return this.getPages().find(p => p.path === path);
  }

  findList(listName) {
    return this.lists.find(list => list.name === listName);
  }

  addLink(from, to, condition) {
    const fromPage = this.pages.find(p => p.path === from);
    const toPage = this.pages.find(p => p.path === to);

    if (fromPage && toPage) {
      var _fromPage$next;

      const existingLink = (_fromPage$next = fromPage.next) === null || _fromPage$next === void 0 ? void 0 : _fromPage$next.find(it => it.path === to);

      if (!existingLink) {
        const link = {};
        link.path = to;

        if (condition) {
          link.condition = condition;
        }

        fromPage.next = fromPage.next || [];
        fromPage.next.push(link);
      }
    }

    return this;
  }

  addSection(name, title) {
    if (!this.sections.find(s => s.name === name)) {
      this.sections.push({
        name,
        title
      });
    }

    return this;
  }

  updateLink(from, to, condition) {
    const fromPage = this.findPage(from);
    const toPage = this.pages.find(p => p.path === to);

    if (fromPage && toPage) {
      var _fromPage$next2;

      const existingLink = (_fromPage$next2 = fromPage.next) === null || _fromPage$next2 === void 0 ? void 0 : _fromPage$next2.find(it => it.path === to);

      if (existingLink) {
        if (condition) {
          existingLink.condition = condition;
        } else {
          delete existingLink.condition;
        }
      }
    }

    return this;
  }

  addPage(page) {
    this.pages.push(page);
    return this;
  }

  getPages() {
    return this.pages;
  }

  valuesFor(input) {
    const values = this._valuesFor(input);

    if (values) {
      return new ValuesWrapper(values, this);
    }
  }

  _valuesFor(input) {
    if (input.type === 'YesNoField') {
      return yesNoValues;
    }

    if (input.values) {
      return valuesFrom(input.values);
    }
  }

  _allPathsLeadingTo(path) {
    return this.pages.filter(page => page.next && page.next.find(next => next.path === path)).flatMap(page => [page.path].concat(this._allPathsLeadingTo(page.path)));
  }

  addCondition(name, displayName, value) {
    _classPrivateFieldSet(this, _conditions, _classPrivateFieldGet(this, _conditions));

    if (_classPrivateFieldGet(this, _conditions).find(it => it.name === name)) {
      throw Error(`A condition already exists with name ${name}`);
    }

    _classPrivateFieldGet(this, _conditions).push({
      name,
      displayName,
      value
    });

    return this;
  }

  addComponent(pagePath, component) {
    const page = this.findPage(pagePath);

    if (page) {
      page.components = page.components || [];
      page.components.push(component);
    } else {
      throw Error(`No page exists with path ${pagePath}`);
    }

    return this;
  }

  updateComponent(pagePath, componentName, component) {
    const page = this.findPage(pagePath);

    if (page) {
      page.components = page.components || [];
      const index = page.components.findIndex(it => it.name === componentName);

      if (index < 0) {
        throw Error(`No component exists with name ${componentName} with in page with path ${pagePath}`);
      }

      page.components[index] = component;
    } else {
      throw Error(`No page exists with path ${pagePath}`);
    }

    return this;
  }

  updateCondition(name, displayName, value) {
    const condition = _classPrivateFieldGet(this, _conditions).find(condition => condition.name === name);

    if (condition) {
      condition.displayName = displayName;
      condition.value = value;
    }

    return this;
  }

  removeCondition(name) {
    const condition = this.findCondition(name);

    if (condition) {
      _classPrivateFieldGet(this, _conditions).splice(_classPrivateFieldGet(this, _conditions).findIndex(condition => condition.name === name), 1); // Update any references to the condition


      this.getPages().forEach(p => {
        Array.isArray(p.next) && p.next.forEach(n => {
          if (n.if === name) {
            delete n.if;
          }
        });
      });
    }

    return this;
  }

  findCondition(name) {
    return this.conditions.find(condition => condition.name === name);
  }

  get hasConditions() {
    return this.conditions.length > 0;
  }

  get conditions() {
    return _classPrivateFieldGet(this, _conditions).map(it => clone(it));
  }

  get name() {
    return _classPrivateFieldGet(this, _name);
  }

  set name(name) {
    if (typeof name === 'string' || name === undefined) {
      _classPrivateFieldSet(this, _name, name);
    } else {
      throw Error('name must be a string');
    }
  }

  get feedbackForm() {
    var _classPrivateFieldGet2, _classPrivateFieldGet3;

    return (_classPrivateFieldGet2 = (_classPrivateFieldGet3 = _classPrivateFieldGet(this, _feedback)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.feedbackForm) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : false;
  }

  set feedbackForm(feedbackForm) {
    if (typeof feedbackForm === 'boolean') {
      _classPrivateFieldSet(this, _feedback, _classPrivateFieldGet(this, _feedback) || {});

      _classPrivateFieldGet(this, _feedback).feedbackForm = feedbackForm;
    } else {
      throw Error('feedbackForm must be a boolean');
    }
  }

  setFeedbackUrl(feedbackUrl) {
    if (feedbackUrl && this.feedbackForm) {
      throw Error('Cannot set a feedback url on a feedback form');
    }

    if (typeof feedbackUrl === 'string' || feedbackUrl === undefined) {
      _classPrivateFieldSet(this, _feedback, _classPrivateFieldGet(this, _feedback) || {});

      _classPrivateFieldGet(this, _feedback).url = feedbackUrl;
    } else {
      throw Error('feedbackUrl must be a string');
    }
  }

  get feedbackUrl() {
    var _classPrivateFieldGet4;

    return (_classPrivateFieldGet4 = _classPrivateFieldGet(this, _feedback)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.url;
  }

  clone() {
    return new Data(this._exposePrivateFields());
  }

  toJSON() {
    const withoutFunctions = filter(this._exposePrivateFields(), field => typeof field !== 'function');
    return Object.assign({}, withoutFunctions);
  }

  _exposePrivateFields() {
    const toSerialize = Object.assign({}, this);
    toSerialize.conditions = this.conditions.map(it => clone(it));
    toSerialize.name = this.name;
    toSerialize.feedback = _classPrivateFieldGet(this, _feedback);
    return toSerialize;
  }

}

_defineProperty(Data, "FEEDBACK_CONTEXT_ITEMS", [{
  key: 'feedbackContextInfo_formTitle',
  display: 'Feedback source form name',
  get: contextInfo => contextInfo.formTitle
}, {
  key: 'feedbackContextInfo_pageTitle',
  display: 'Feedback source page title',
  get: contextInfo => contextInfo.pageTitle
}, {
  key: 'feedbackContextInfo_url',
  display: 'Feedback source url',
  get: contextInfo => contextInfo.url
}]);
//# sourceMappingURL=data-model.js.map