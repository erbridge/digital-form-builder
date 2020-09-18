"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = exports.serialiseAndDeserialise = void 0;

const serialiseAndDeserialise = obj => {
  return JSON.parse(JSON.stringify(obj));
};

exports.serialiseAndDeserialise = serialiseAndDeserialise;

const clone = obj => {
  if (obj) {
    if (typeof obj.clone === 'function') {
      return obj.clone();
    }

    return serialiseAndDeserialise(obj);
  }

  return obj;
};

exports.clone = clone;
//# sourceMappingURL=helpers.js.map