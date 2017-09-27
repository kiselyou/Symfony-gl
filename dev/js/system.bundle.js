
import { insertAdjacentElement } from './libs/polyfill/insertAdjacentHTML.polyfill';
HTMLElement.prototype.insertAdjacentElement = HTMLElement.prototype.insertAdjacentElement || insertAdjacentElement;

import Text3D from './play/text/Text3D';
import Tunnel from './play/tunnel/Tunnel';
import InitScene from './play/scene/InitScene';
import ViewBundle from './view/ViewBundle';

import Loader from './play/loader/Loader';
import Lock from './system/Lock';

let view = new ViewBundle();
view.initSecurityForm();

let sceneControls = new InitScene('initialisation_main_scene');

let start = false;
let text = new Text3D();

text
    .setSize(60)
    .setFar(-1500)
    .showMirror(true)
    .write('IronWar');

let tunnel = new Tunnel(sceneControls.camera);
tunnel.render();

sceneControls
    .render()
    .addRenderEvent(() => {
        if (start) {
            tunnel.update();
        } else {
            text.animation();
        }
    });

let model = null;

Lock.get().addEventChangeStatus((status) => {
    start = status;
    if (start) {

        sceneControls.remove(text.get());

        // Loader.get().load((loader) => {
        //     model = loader.getModel('Wraith');
        //
        //     model.position.y = -300;
        //     model.position.z = -1500;
        //     model.rotation.x = 0.2;
        //     model.rotation.y = Math.PI;
        //     sceneControls.add(model);
        //     sceneControls.add(tunnel.get());
        //
        // }, 'Wraith');
    } else {

        sceneControls.remove(model);
        sceneControls.remove(tunnel.get());

        sceneControls.add(text.get());
    }
});

