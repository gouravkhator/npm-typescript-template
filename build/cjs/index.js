'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var os = require('os');

function getHostName() {
    const host_name = os.hostname();
    return host_name;
}

exports.getHostName = getHostName;
