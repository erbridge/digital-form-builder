import _defineProperty from "@babel/runtime/helpers/defineProperty";
export class Logger {
  constructor(server, name) {
    _defineProperty(this, "server", void 0);

    _defineProperty(this, "name", void 0);

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
//# sourceMappingURL=logger.js.map