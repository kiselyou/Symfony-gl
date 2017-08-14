'use strict';

var _Lock = require('./system/Lock');

var _Lock2 = _interopRequireDefault(_Lock);

var _Text3D = require('./components/text/Text3D');

var _Text3D2 = _interopRequireDefault(_Text3D);

var _Tunnel = require('./components/tunnel/Tunnel');

var _Tunnel2 = _interopRequireDefault(_Tunnel);

var _InitScene = require('./components/scene/InitScene');

var _InitScene2 = _interopRequireDefault(_InitScene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lock = new _Lock2.default();
lock.controls();

var sceneControls = new _InitScene2.default('initialisation_main_scene');

var text = new _Text3D2.default();

text.setFar(-1000).showMirror(true).write('IronWar', function (text) {
    sceneControls.add(text);
});

var tunnel = new _Tunnel2.default(sceneControls.camera);

tunnel.render(function (element) {
    sceneControls.add(element);
});

sceneControls.render().addRenderEvent(function () {
    text.animation();
    tunnel.update();
});