"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOperatorNames = getOperatorNames;
exports.getExpression = getExpression;
exports.getOperatorConfig = getOperatorConfig;
exports.relativeDateOrTimeOperatorNames = exports.absoluteDateOrTimeOperatorNames = exports.customOperators = void 0;

var _inlineConditionValues = require("./inline-condition-values");

const defaultOperators = {
  is: inline('=='),
  'is not': inline('!=')
};

function withDefaults(param) {
  return Object.assign({}, param, defaultOperators);
}

const textBasedFieldCustomisations = {
  'is longer than': lengthIs('>'),
  'is shorter than': lengthIs('<'),
  'has length': lengthIs('==')
};
const absoluteDateTimeOperators = {
  is: absoluteDateTime('=='),
  'is not': absoluteDateTime('!='),
  'is before': absoluteDateTime('<'),
  'is after': absoluteDateTime('>')
};

const relativeTimeOperators = units => ({
  'is at least': relativeTime('<=', '>=', units),
  'is at most': relativeTime('>=', '<=', units),
  'is less than': relativeTime('>', '<', units),
  'is more than': relativeTime('<', '>', units)
});

const customOperators = {
  CheckboxesField: {
    contains: reverseInline('in'),
    'does not contain': not(reverseInline('in'))
  },
  NumberField: withDefaults({
    'is at least': inline('>='),
    'is at most': inline('<='),
    'is less than': inline('<'),
    'is more than': inline('>')
  }),
  DateField: Object.assign({}, absoluteDateTimeOperators, relativeTimeOperators(_inlineConditionValues.dateUnits)),
  TimeField: Object.assign({}, absoluteDateTimeOperators, relativeTimeOperators(_inlineConditionValues.timeUnits)),
  DatePartsField: Object.assign({}, absoluteDateTimeOperators, relativeTimeOperators(_inlineConditionValues.dateUnits)),
  DateTimeField: Object.assign({}, absoluteDateTimeOperators, relativeTimeOperators(_inlineConditionValues.dateTimeUnits)),
  DateTimePartsField: Object.assign({}, absoluteDateTimeOperators, relativeTimeOperators(_inlineConditionValues.dateTimeUnits)),
  TextField: withDefaults(textBasedFieldCustomisations),
  MultilineTextField: withDefaults(textBasedFieldCustomisations),
  EmailAddressField: withDefaults(textBasedFieldCustomisations)
};
exports.customOperators = customOperators;

function getOperatorNames(fieldType) {
  return Object.keys(getConditionals(fieldType)).sort();
}

function getExpression(fieldType, fieldName, operator, value) {
  return getConditionals(fieldType)[operator].expression({
    type: fieldType,
    name: fieldName
  }, value);
}

function getOperatorConfig(fieldType, operator) {
  return getConditionals(fieldType)[operator];
}

function getConditionals(fieldType) {
  return customOperators[fieldType] || defaultOperators;
}

function inline(operator) {
  return {
    expression: (field, value) => `${field.name} ${operator} ${formatValue(field.type, value.value)}`
  };
}

function lengthIs(operator) {
  return {
    expression: (field, value) => `length(${field.name}) ${operator} ${value.value}`
  };
}

function reverseInline(operator) {
  return {
    expression: (field, value) => `${formatValue(field.type, value.value)} ${operator} ${field.name}`
  };
}

function not(operatorDefinition) {
  return {
    expression: (field, value) => `not (${operatorDefinition.expression(field, value)})`
  };
}

function formatValue(fieldType, value) {
  if (fieldType === 'NumberField' || fieldType === 'YesNoField') {
    return value;
  }

  return `'${value}'`;
}

const absoluteDateOrTimeOperatorNames = Object.keys(absoluteDateTimeOperators);
exports.absoluteDateOrTimeOperatorNames = absoluteDateOrTimeOperatorNames;
const relativeDateOrTimeOperatorNames = Object.keys(relativeTimeOperators(_inlineConditionValues.dateTimeUnits));
exports.relativeDateOrTimeOperatorNames = relativeDateOrTimeOperatorNames;

function absoluteDateTime(operator) {
  return {
    expression: (field, value) => {
      if (value instanceof _inlineConditionValues.ConditionValue) {
        return `${field.name} ${operator} '${value.toExpression()}'`;
      }

      throw Error('only Value types are supported');
    }
  };
}

function relativeTime(pastOperator, futureOperator, units) {
  return {
    units: units,
    expression: (field, value) => {
      if (value instanceof _inlineConditionValues.RelativeTimeValue) {
        const operator = value.direction === _inlineConditionValues.dateDirections.PAST ? pastOperator : futureOperator;
        return `${field.name} ${operator} ${value.toExpression()}`;
      }

      throw Error('time shift requires a TimeShiftValue');
    }
  };
}
//# sourceMappingURL=inline-condition-operators.js.map