"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

class Logger {
  constructor(server, name) {
    (0, _defineProperty2.default)(this, "server", void 0);
    (0, _defineProperty2.default)(this, "name", void 0);
    this.server = server;
    this.name = name;
  }

  error(message) {
    this.log('error', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  info(message) {
    this.log('info', message);
  }

  debug(message) {
    this.log('debug', message);
  }

  log(level, message) {
    this.server.log([level, this.name], message);
  }

}

exports.Logger = Logger;
//# sourceMappingURL=logger.js.map