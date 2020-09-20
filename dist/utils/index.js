"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailAddress = exports.datetimeTimestamp = void 0;
exports.datetimeTimestamp = () => {
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return timestamp;
};
exports.validateEmailAddress = (s) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(s);
};
