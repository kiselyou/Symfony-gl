
import { insertAdjacentElement } from './libs/polyfill/insertAdjacentHTML.polyfill';
HTMLElement.prototype.insertAdjacentElement = HTMLElement.prototype.insertAdjacentElement || insertAdjacentElement;

import ViewBundle from './view/ViewBundle';
import User from './system/user/User';

let view = new ViewBundle();
view.initSecurityForm();

User.get()
    .setBackground()
    .initScene();
