'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EJSController = function () {

    /**
     *
     * @param server
     */
    function EJSController(server) {
        _classCallCheck(this, EJSController);

        this.server = server;
    }

    _createClass(EJSController, [{
        key: 'render',
        value: function render(req, res, params) {
            var template = null;

            try {
                template = this.server.view.load(params['route'], req.body['path']);
            } catch (error) {
                this.err.exception(error).alert('Cannot upload template', 'EJSController', 'render');
                template = this.server.view.loadError();
            }

            res.writeHead(200, this.server.conf.contentType(2));
            res.end(template, this.server.conf.encoding, true);
        }
    }, {
        key: 'ejs',
        value: function ejs() {

            this.viewResponse('');
        }
    }]);

    return EJSController;
}();

exports.default = EJSController;