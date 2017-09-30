
import { insertAdjacentElement } from './libs/polyfill/insertAdjacentHTML.polyfill';
HTMLElement.prototype.insertAdjacentElement = HTMLElement.prototype.insertAdjacentElement || insertAdjacentElement;

import InitScene from './play/scene/InitScene';
import ViewBundle from './view/ViewBundle';

let view = new ViewBundle();
view.initSecurityForm();

let sceneControls = InitScene.get();

sceneControls
    .setBackground('/src/img/background/default.jpg')
    .render()
    .show();
