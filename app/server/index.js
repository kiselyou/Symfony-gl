'use strict';

var _Server = require('./core/Server');

var _Server2 = _interopRequireDefault(_Server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(process.argv[2]);
new _Server2.default().init();