"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datetimeTimestamp = () => {
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return timestamp;
};
