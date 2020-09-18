import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classPrivateFieldGet from "@babel/runtime/helpers/classPrivateFieldGet";
import _classPrivateFieldSet from "@babel/runtime/helpers/classPrivateFieldSet";
import ComponentTypes from '../component-types';
import { getExpression } from './inline-condition-operators';
import { AbstractConditionValue, valueFrom } from './inline-condition-values';
export const coordinators = {
  AND: 'and',
  OR: 'or'
};

var _groupedConditions = new WeakMap();

var _userGroupedConditions = new WeakMap();

var _conditionName = new WeakMap();

export class ConditionsModel {
  constructor() {
    _groupedConditions.set(this, {
      writable: true,
      value: void 0
    });

    _userGroupedConditions.set(this, {
      writable: true,
      value: void 0
    });

    _conditionName.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _groupedConditions, []);

    _classPrivateFieldSet(this, _userGroupedConditions, []);
  }

  clone() {
    const toReturn = new ConditionsModel();

    _classPrivateFieldSet(toReturn, _groupedConditions, _classPrivateFieldGet(this, _groupedConditions).map(it => it.clone()));

    _classPrivateFieldSet(toReturn, _userGroupedConditions, _classPrivateFieldGet(this, _userGroupedConditions).map(it => it.clone()));

    _classPrivateFieldSet(toReturn, _conditionName, _classPrivateFieldGet(this, _conditionName));

    return toReturn;
  }

  clear() {
    _classPrivateFieldSet(this, _userGroupedConditions, []);

    _classPrivateFieldSet(this, _groupedConditions, []);

    _classPrivateFieldSet(this, _conditionName, undefined);

    return this;
  }

  set name(name) {
    _classPrivateFieldSet(this, _conditionName, name);
  }

  get name() {
    return _classPrivateFieldGet(this, _conditionName);
  }

  add(condition) {
    const coordinatorExpected = _classPrivateFieldGet(this, _userGroupedConditions).length !== 0;

    if (condition.getCoordinator() && !coordinatorExpected) {
      throw Error('No coordinator allowed on the first condition');
    } else if (!condition.getCoordinator() && coordinatorExpected) {
      throw Error('Coordinator must be present on subsequent conditions');
    }

    _classPrivateFieldGet(this, _userGroupedConditions).push(condition);

    _classPrivateFieldSet(this, _groupedConditions, this._applyGroups(_classPrivateFieldGet(this, _userGroupedConditions)));

    return this;
  }

  replace(index, condition) {
    const coordinatorExpected = index !== 0;

    if (condition.getCoordinator() && !coordinatorExpected) {
      throw Error('No coordinator allowed on the first condition');
    } else if (!condition.getCoordinator() && coordinatorExpected) {
      throw Error('Coordinator must be present on subsequent conditions');
    } else if (index >= _classPrivateFieldGet(this, _userGroupedConditions).length) {
      throw Error(`Cannot replace condition ${index} as no such condition exists`);
    }

    _classPrivateFieldGet(this, _userGroupedConditions).splice(index, 1, condition);

    _classPrivateFieldSet(this, _groupedConditions, this._applyGroups(_classPrivateFieldGet(this, _userGroupedConditions)));

    return this;
  }

  remove(indexes) {
    _classPrivateFieldSet(this, _userGroupedConditions, _classPrivateFieldGet(this, _userGroupedConditions).filter((condition, index) => !indexes.includes(index)).map((condition, index) => index === 0 ? condition.asFirstCondition() : condition));

    _classPrivateFieldSet(this, _groupedConditions, this._applyGroups(_classPrivateFieldGet(this, _userGroupedConditions)));

    return this;
  }

  addGroups(groupDefs) {
    _classPrivateFieldSet(this, _userGroupedConditions, this._group(_classPrivateFieldGet(this, _userGroupedConditions), groupDefs));

    _classPrivateFieldSet(this, _groupedConditions, this._applyGroups(_classPrivateFieldGet(this, _userGroupedConditions)));

    return this;
  }

  splitGroup(index) {
    _classPrivateFieldSet(this, _userGroupedConditions, this._ungroup(_classPrivateFieldGet(this, _userGroupedConditions), index));

    _classPrivateFieldSet(this, _groupedConditions, this._applyGroups(_classPrivateFieldGet(this, _userGroupedConditions)));

    return this;
  }

  moveEarlier(index) {
    if (index > 0 && index < _classPrivateFieldGet(this, _userGroupedConditions).length) {
      _classPrivateFieldGet(this, _userGroupedConditions).splice(index - 1, 0, _classPrivateFieldGet(this, _userGroupedConditions).splice(index, 1)[0]);

      if (index === 1) {
        this.switchCoordinators();
      }

      _classPrivateFieldSet(this, _groupedConditions, this._applyGroups(_classPrivateFieldGet(this, _userGroupedConditions)));
    }

    return this;
  }

  moveLater(index) {
    if (index >= 0 && index < _classPrivateFieldGet(this, _userGroupedConditions).length - 1) {
      _classPrivateFieldGet(this, _userGroupedConditions).splice(index + 1, 0, _classPrivateFieldGet(this, _userGroupedConditions).splice(index, 1)[0]);

      if (index === 0) {
        this.switchCoordinators();
      }

      _classPrivateFieldSet(this, _groupedConditions, this._applyGroups(_classPrivateFieldGet(this, _userGroupedConditions)));
    }

    return this;
  }

  switchCoordinators() {
    _classPrivateFieldGet(this, _userGroupedConditions)[1].setCoordinator(_classPrivateFieldGet(this, _userGroupedConditions)[0].getCoordinator());

    _classPrivateFieldGet(this, _userGroupedConditions)[0].setCoordinator(undefined);
  }

  get asPerUserGroupings() {
    return [..._classPrivateFieldGet(this, _userGroupedConditions)];
  }

  get hasConditions() {
    return _classPrivateFieldGet(this, _userGroupedConditions).length > 0;
  }

  get lastIndex() {
    return _classPrivateFieldGet(this, _userGroupedConditions).length - 1;
  }

  toPresentationString() {
    return _classPrivateFieldGet(this, _groupedConditions).map(condition => toPresentationString(condition)).join(' ');
  }

  toExpression() {
    return _classPrivateFieldGet(this, _groupedConditions).map(condition => toExpression(condition)).join(' ');
  }

  _applyGroups(userGroupedConditions) {
    const correctedUserGroups = userGroupedConditions.map(condition => condition instanceof ConditionGroup && condition.conditions.length > 2 ? new ConditionGroup(this._group(condition.conditions, this._autoGroupDefs(condition.conditions))) : condition);
    return this._group(correctedUserGroups, this._autoGroupDefs(correctedUserGroups));
  }

  _group(conditions, groupDefs) {
    return conditions.reduce((groups, condition, index, conditions) => {
      const groupDef = groupDefs.find(groupDef => groupDef.contains(index));

      if (groupDef) {
        if (groupDef.startsWith(index)) {
          const groupConditions = groupDef.applyTo(conditions);
          groups.push(new ConditionGroup(groupConditions));
        }
      } else {
        groups.push(condition);
      }

      return groups;
    }, []);
  }

  _ungroup(conditions, splitIndex) {
    if (conditions[splitIndex].isGroup()) {
      const copy = [...conditions];
      copy.splice(splitIndex, 1, ...conditions[splitIndex].getGroupedConditions());
      return copy;
    }

    return conditions;
  }

  _autoGroupDefs(conditions) {
    const orPositions = [];
    conditions.forEach((condition, index) => {
      if (condition.getCoordinator() === coordinators.OR) {
        orPositions.push(index);
      }
    });
    const hasAnd = !!conditions.find(condition => condition.getCoordinator() === coordinators.AND);
    const hasOr = orPositions.length > 0;

    if (hasAnd && hasOr) {
      let start = 0;
      const groupDefs = [];
      orPositions.forEach((position, index) => {
        if (start < position - 1) {
          groupDefs.push(new GroupDef(start, position - 1));
        }

        const thisIsTheLastOr = orPositions.length === index + 1;
        const thereAreMoreConditions = conditions.length - 1 > position;

        if (thisIsTheLastOr && thereAreMoreConditions) {
          groupDefs.push(new GroupDef(position, conditions.length - 1));
        }

        start = position;
      });
      return groupDefs;
    }

    return [];
  }

  toJSON() {
    const name = _classPrivateFieldGet(this, _conditionName);

    const conditions = _classPrivateFieldGet(this, _userGroupedConditions);

    return {
      name: name,
      conditions: conditions.map(it => it.clone())
    };
  }

  static from(obj) {
    if (obj instanceof ConditionsModel) {
      return obj;
    }

    const toReturn = new ConditionsModel();

    _classPrivateFieldSet(toReturn, _conditionName, obj.name);

    _classPrivateFieldSet(toReturn, _userGroupedConditions, obj.conditions.map(it => conditionFrom(it)));

    _classPrivateFieldSet(toReturn, _groupedConditions, toReturn._applyGroups(_classPrivateFieldGet(toReturn, _userGroupedConditions)));

    return toReturn;
  }

}

function conditionFrom(it) {
  if (it.conditions) {
    return new ConditionGroup(it.conditions.map(condition => conditionFrom(condition)));
  }

  if (it.conditionName) {
    return new ConditionRef(it.conditionName, it.conditionDisplayName, it.coordinator);
  }

  return new Condition(Field.from(it.field), it.operator, valueFrom(it.value), it.coordinator);
}

export class GroupDef {
  constructor(first, last) {
    _defineProperty(this, "first", void 0);

    _defineProperty(this, "last", void 0);

    if (typeof first !== 'number' || typeof last !== 'number') {
      throw Error(`Cannot construct a group from ${first} and ${last}`);
    } else if (first >= last) {
      throw Error(`Last (${last}) must be greater than first (${first})`);
    }

    this.first = first;
    this.last = last;
  }

  contains(index) {
    return this.first <= index && this.last >= index;
  }

  startsWith(index) {
    return this.first === index;
  }

  applyTo(conditions) {
    return [...conditions].splice(this.first, this.last - this.first + 1);
  }

}

class ConditionGroup {
  constructor(conditions) {
    _defineProperty(this, "conditions", void 0);

    if (!Array.isArray(conditions) || conditions.length < 2) {
      throw Error('Cannot construct a condition group from a single condition');
    }

    this.conditions = conditions;
  }

  coordinatorString() {
    return this.conditions[0].coordinatorString();
  }

  conditionString() {
    const copy = [...this.conditions];
    copy.splice(0, 1);
    return `(${this.conditions[0].conditionString()} ${copy.map(condition => toPresentationString(condition)).join(' ')})`;
  }

  conditionExpression() {
    const copy = [...this.conditions];
    copy.splice(0, 1);
    return `(${this.conditions[0].conditionExpression()} ${copy.map(condition => toExpression(condition)).join(' ')})`;
  }

  asFirstCondition() {
    this.conditions[0].asFirstCondition();
    return this;
  }

  getCoordinator() {
    return this.conditions[0].getCoordinator();
  }

  setCoordinator(coordinator) {
    this.conditions[0].setCoordinator(coordinator);
  }

  isGroup() {
    return true;
  }

  getGroupedConditions() {
    return this.conditions.map(condition => condition.clone());
  }

  clone() {
    return new ConditionGroup(this.conditions.map(condition => condition.clone()));
  }

}

export function toPresentationString(condition) {
  return `${condition.coordinatorString()}${condition.conditionString()}`;
}
export function toExpression(condition) {
  return `${condition.coordinatorString()}${condition.conditionExpression()}`;
}
export class Field {
  constructor(name, type, display) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "display", void 0);

    if (!name || typeof name !== 'string') {
      throw Error(`name ${name} is not valid`);
    }

    if (!ComponentTypes.find(componentType => componentType.name === type)) {
      throw Error(`type ${type} is not valid`);
    }

    if (!display || typeof display !== 'string') {
      throw Error(`display ${display} is not valid`);
    }

    this.name = name;
    this.type = type;
    this.display = display;
  }

  static from(obj) {
    return new Field(obj.name, obj.type, obj.display);
  }

}

class AbstractCondition {
  constructor(coordinator) {
    _defineProperty(this, "coordinator", void 0);

    if (coordinator && !Object.values(coordinators).includes(coordinator)) {
      throw Error(`coordinator ${coordinator} is not a valid coordinator`);
    }

    this.coordinator = coordinator;
  }

  coordinatorString() {
    return this.coordinator ? `${this.coordinator} ` : '';
  }

  getCoordinator() {
    return this.coordinator;
  }

  setCoordinator(coordinator) {
    this.coordinator = coordinator;
  }

  isGroup() {
    return false;
  }

  getGroupedConditions() {
    return [this];
  }

  _asFirstCondition() {
    delete this.coordinator;
  }

  asFirstCondition() {
    throw Error('Implement on the subclass (Why do we have to have this method here at all?!)');
  }

  clone() {
    throw Error('Implement on the subclass (Why do we have to have this method here at all?!)');
  }

  conditionString() {
    throw Error('Implement on the subclass (Why do we have to have this method here at all?!)');
  }

  conditionExpression() {
    throw Error('Implement on the subclass (Why do we have to have this method here at all?!)');
  }

}

export class Condition extends AbstractCondition {
  constructor(field, operator, value, coordinator) {
    super(coordinator);

    _defineProperty(this, "field", void 0);

    _defineProperty(this, "operator", void 0);

    _defineProperty(this, "value", void 0);

    if (!(field instanceof Field)) {
      throw Error(`field ${field} is not a valid Field object`);
    }

    if (typeof operator !== 'string') {
      throw Error(`operator ${operator} is not a valid operator`);
    }

    if (!(value instanceof AbstractConditionValue)) {
      throw Error(`value ${value} is not a valid value type`);
    }

    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  asFirstCondition() {
    this._asFirstCondition();

    return this;
  }

  conditionString() {
    return `'${this.field.display}' ${this.operator} '${this.value.toPresentationString()}'`;
  }

  conditionExpression() {
    return getExpression(this.field.type, this.field.name, this.operator, this.value);
  }

  clone() {
    return new Condition(Field.from(this.field), this.operator, this.value.clone(), this.coordinator);
  }

}
export class ConditionRef extends AbstractCondition {
  constructor(conditionName, conditionDisplayName, coordinator) {
    super(coordinator);

    _defineProperty(this, "conditionName", void 0);

    _defineProperty(this, "conditionDisplayName", void 0);

    if (typeof conditionName !== 'string') {
      throw Error(`condition name ${conditionName} is not valid`);
    }

    if (typeof conditionDisplayName !== 'string') {
      throw Error(`condition display name ${conditionDisplayName} is not valid`);
    }

    this.conditionName = conditionName;
    this.conditionDisplayName = conditionDisplayName;
  }

  asFirstCondition() {
    this._asFirstCondition();

    return this;
  }

  conditionString() {
    return `'${this.conditionDisplayName}'`;
  }

  conditionExpression() {
    return this.conditionName;
  }

  clone() {
    return new ConditionRef(this.conditionName, this.conditionDisplayName, this.coordinator);
  }

}
//# sourceMappingURL=inline-condition-model.js.map