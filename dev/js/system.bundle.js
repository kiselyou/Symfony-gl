
import Text3D from './play/text/Text3D';
import Tunnel from './play/tunnel/Tunnel';
import InitScene from './play/scene/InitScene';
import ViewBundle from './view/ViewBundle';

import Loader from './play/Loader/Loader';
import Lock from './system/Lock';

let view = new ViewBundle();
view.initSecurityForm();

let sceneControls = new InitScene('initialisation_main_scene');

let start = true;
let text = new Text3D();
let tunnel = new Tunnel(sceneControls.camera);

text
    .setSize(100)
    .setFar(-1500)
    .showMirror(true)
    .write('IronWar');

// tunnel.render();

sceneControls
    .render()
    .addRenderEvent(() => {
        if (start) {
            // text.animation();
            tunnel.update();
        }
    });

Loader.get().start((loader) => {
    let obj = loader.getObj('Wraith');
    // console.log(obj);

    obj.position.y = -200;
    obj.position.z = -1500;
    obj.rotation.x = 0.2;
    // obj.rotation.y = Math.PI;
    sceneControls.add(obj);
    console.log(obj);
});

Lock.get().addEventChangeStatus((status) => {
    start = !status;
    if (start) {
        // sceneControls.add(text.get());
        // sceneControls.add(tunnel.get());
    } else {
        sceneControls.remove(text.get());
        // sceneControls.remove(tunnel.get());
    }
});

