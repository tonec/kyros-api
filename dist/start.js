"use strict";

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var port = process.env.API_PORT || 8080;

if (port) {
  _app["default"].listen(port, function (err) {
    if (err) {
      console.error(err);
    }

    console.info("API is running on port ".concat(port));
    console.info("Send requests to http://localhost:".concat(port));
  });
} else {
  console.error('No APIPORT environment variable has been specified');
}