"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormConfiguration = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

class FormConfiguration {
  constructor(Key, DisplayName, LastModified, feedbackForm) {
    (0, _defineProperty2.default)(this, "Key", void 0);
    (0, _defineProperty2.default)(this, "DisplayName", void 0);
    (0, _defineProperty2.default)(this, "LastModified", void 0);
    (0, _defineProperty2.default)(this, "feedbackForm", void 0);

    if (!Key) {
      throw Error('Form configuration must have a key');
    }

    this.Key = Key;
    this.DisplayName = DisplayName || Key;
    this.LastModified = LastModified;
    this.feedbackForm = feedbackForm || false;
  }

}

exports.FormConfiguration = FormConfiguration;
//# sourceMappingURL=form-configuration.js.map