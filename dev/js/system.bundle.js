
import Text3D from './components/text/Text3D';
import Tunnel from './components/tunnel/Tunnel';
import InitScene from './components/scene/InitScene';
import ViewBundle from './view/ViewBundle';

let view = new ViewBundle();
view.initSecurityForm();

let sceneControls = new InitScene('initialisation_main_scene');

let text = new Text3D();

text
    .setFar(-1500)
    .showMirror(true)
    .write('IronWar', (text) => {
        sceneControls.add(text);
    });

let tunnel = new Tunnel(sceneControls.camera);

tunnel
    .render((element) => {
        sceneControls.add(element);
    });

sceneControls
    .render()
    .addRenderEvent(() => {
        text.animation();
        tunnel.update();
    });

