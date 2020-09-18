import _defineProperty from "@babel/runtime/helpers/defineProperty";
export class FormConfiguration {
  constructor(Key, DisplayName, LastModified, feedbackForm) {
    _defineProperty(this, "Key", void 0);

    _defineProperty(this, "DisplayName", void 0);

    _defineProperty(this, "LastModified", void 0);

    _defineProperty(this, "feedbackForm", void 0);

    if (!Key) {
      throw Error('Form configuration must have a key');
    }

    this.Key = Key;
    this.DisplayName = DisplayName || Key;
    this.LastModified = LastModified;
    this.feedbackForm = feedbackForm || false;
  }

}
//# sourceMappingURL=form-configuration.js.map