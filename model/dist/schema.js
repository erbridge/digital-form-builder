"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

const sectionsSchema = _joi.default.object().keys({
  name: _joi.default.string().required(),
  title: _joi.default.string().required()
});

const conditionFieldSchema = _joi.default.object().keys({
  name: _joi.default.string().required(),
  type: _joi.default.string().required(),
  display: _joi.default.string().required()
});

const conditionValueSchema = _joi.default.object().keys({
  type: _joi.default.string().required(),
  value: _joi.default.string().required(),
  display: _joi.default.string().required()
});

const relativeTimeValueSchema = _joi.default.object().keys({
  type: _joi.default.string().required(),
  timePeriod: _joi.default.string().required(),
  timeUnit: _joi.default.string().required(),
  direction: _joi.default.string().required(),
  timeOnly: _joi.default.boolean().required()
});

const conditionRefSchema = _joi.default.object().keys({
  conditionName: _joi.default.string().required(),
  conditionDisplayName: _joi.default.string().required(),
  coordinator: _joi.default.string().optional()
});

const conditionSchema = _joi.default.object().keys({
  field: conditionFieldSchema,
  operator: _joi.default.string().required(),
  value: _joi.default.alternatives().try(conditionValueSchema, relativeTimeValueSchema),
  coordinator: _joi.default.string().optional()
});

const conditionGroupSchema = _joi.default.object().keys({
  conditions: _joi.default.array().items(_joi.default.alternatives().try(conditionSchema, conditionRefSchema, _joi.default.any()
  /** Should be a joi.link('#conditionGroupSchema') */
  ))
});

const conditionsModelSchema = _joi.default.object().keys({
  name: _joi.default.string().required(),
  conditions: _joi.default.array().items(_joi.default.alternatives().try(conditionSchema, conditionRefSchema, conditionGroupSchema))
});

const conditionsSchema = _joi.default.object().keys({
  name: _joi.default.string().required(),
  displayName: _joi.default.string(),
  value: _joi.default.alternatives().try(_joi.default.string(), conditionsModelSchema).required()
});

const localisedString = _joi.default.alternatives().try(_joi.default.object({
  a: _joi.default.any()
}).unknown(), _joi.default.string().allow(''));

const staticValueSchema = _joi.default.object().keys({
  label: _joi.default.string().required(),
  value: _joi.default.alternatives().try(_joi.default.number(), _joi.default.string(), _joi.default.boolean()).required(),
  hint: _joi.default.string().allow('').optional(),
  condition: _joi.default.string().optional(),
  children: _joi.default.array().items(_joi.default.any()
  /** Should be a joi.link('#componentSchema') */
  ).unique('name')
}); // represents the 'children' which would appear e.g. under a radio option with the specified value


const valueChildrenSchema = _joi.default.object().keys({
  value: _joi.default.alternatives().try(_joi.default.number(), _joi.default.string(), _joi.default.boolean()).required(),
  children: _joi.default.array().items(_joi.default.any()
  /** Should be a joi.link('#componentSchema') */
  ).unique('name')
});

const componentValuesSchema = _joi.default.object().keys({
  type: _joi.default.string().allow('static', 'listRef').required(),
  // allow extension support for dynamically looked up types later
  valueType: _joi.default.when('type', {
    is: _joi.default.string().valid('static'),
    then: _joi.default.string().allow('string', 'number', 'boolean').required()
  }),
  items: _joi.default.when('type', {
    is: _joi.default.string().valid('static'),
    then: _joi.default.array().items(staticValueSchema).unique('value')
  }),
  list: _joi.default.when('type', {
    is: _joi.default.string().valid('listRef'),
    then: _joi.default.string().required()
  }),
  valueChildren: _joi.default.when('type', {
    is: _joi.default.string().valid('listRef'),
    then: _joi.default.array().items(valueChildrenSchema).unique('value')
  })
});

const componentSchema = _joi.default.object().keys({
  type: _joi.default.string().required(),
  name: _joi.default.string(),
  title: localisedString,
  hint: localisedString.optional(),
  options: _joi.default.object().default({}),
  schema: _joi.default.object().default({}),
  errors: _joi.default.object({
    a: _joi.default.any()
  }).optional(),
  values: componentValuesSchema.optional()
}).unknown(true);

const nextSchema = _joi.default.object().keys({
  path: _joi.default.string().required(),
  condition: _joi.default.string().allow('').optional()
});

const pageSchema = _joi.default.object().keys({
  path: _joi.default.string().required(),
  title: localisedString,
  section: _joi.default.string(),
  controller: _joi.default.string(),
  components: _joi.default.array().items(componentSchema),
  next: _joi.default.array().items(nextSchema),
  repeatField: _joi.default.string().optional()
});

const listItemSchema = _joi.default.object().keys({
  text: localisedString,
  value: _joi.default.alternatives().try(_joi.default.number(), _joi.default.string()),
  description: localisedString.optional(),
  conditional: _joi.default.object().keys({
    components: _joi.default.array().required().items(componentSchema.unknown(true)).unique('name')
  }).allow(null).optional(),
  condition: _joi.default.string().allow('').optional()
});

const listSchema = _joi.default.object().keys({
  name: _joi.default.string().required(),
  title: localisedString,
  type: _joi.default.string().required().valid('string', 'number'),
  items: _joi.default.array().items(listItemSchema)
});

const feeSchema = _joi.default.object().keys({
  description: _joi.default.string().required(),
  amount: _joi.default.number().required(),
  multiplier: _joi.default.string().optional(),
  condition: _joi.default.string().optional()
});

const notifySchema = _joi.default.object().keys({
  apiKey: _joi.default.string().allow('').optional(),
  templateId: _joi.default.string(),
  personalisation: _joi.default.array().items(_joi.default.string()),
  emailField: _joi.default.string()
});

const emailSchema = _joi.default.object().keys({
  emailAddress: _joi.default.string()
});

const webhookSchema = _joi.default.object().keys({
  url: _joi.default.string()
});

const sheetItemSchema = _joi.default.object().keys({
  name: _joi.default.string(),
  id: _joi.default.string()
});

const sheetsSchema = _joi.default.object().keys({
  credentials: _joi.default.object().keys({
    private_key: _joi.default.string(),
    client_email: _joi.default.string()
  }),
  project_id: _joi.default.string(),
  scopes: _joi.default.array().items(_joi.default.string()),
  sheets: _joi.default.array().items(sheetItemSchema),
  spreadsheetIdField: _joi.default.string()
});

const outputSchema = _joi.default.object().keys({
  name: _joi.default.string(),
  title: _joi.default.string().optional(),
  type: _joi.default.string().allow('notify', 'email', 'webhook', 'sheets'),
  outputConfiguration: _joi.default.alternatives().try(notifySchema, emailSchema, webhookSchema, sheetsSchema)
});

const feedbackSchema = _joi.default.object().keys({
  feedbackForm: _joi.default.boolean().default(false),
  url: _joi.default.when('feedbackForm', {
    is: _joi.default.boolean().valid(false),
    then: _joi.default.string().optional()
  })
});

const schema = _joi.default.object().required().keys({
  name: localisedString.optional(),
  feedback: feedbackSchema,
  startPage: _joi.default.string().required(),
  pages: _joi.default.array().required().items(pageSchema).unique('path'),
  sections: _joi.default.array().items(sectionsSchema).unique('name').required(),
  conditions: _joi.default.array().items(conditionsSchema).unique('name'),
  lists: _joi.default.array().items(listSchema).unique('name'),
  fees: _joi.default.array().items(feeSchema).optional(),
  metadata: _joi.default.object({
    a: _joi.default.any()
  }).unknown().optional(),
  declaration: _joi.default.string().allow('').optional(),
  outputs: _joi.default.array().items(outputSchema),
  payApiKey: _joi.default.string().allow('').optional(),
  skipSummary: _joi.default.boolean().default(false),
  version: _joi.default.number().default(0)
});

var _default = schema;
/**
 *  Schema versions:
 *  Undefined / 0 - initial version as at 28/8/20. Conditions may be in object structure or string form.
 *  1 - Relevant components (radio, checkbox, select, autocomplete) now contain
 *      options as 'values' rather than referencing a data list
 **/

exports.default = _default;
//# sourceMappingURL=schema.js.map