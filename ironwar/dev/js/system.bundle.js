
import Lock from './system/Lock';
import InitScene from './scene/InitScene';


let lock = new Lock();
lock.controls();

let sceneControls = new InitScene('initialisation_main_scene');
sceneControls
    .helper()
    .draw();
