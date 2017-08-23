import View from '../../system/View';

import {
    ACTION_MAIN_MENU
} from '../view-actions.js';

class MenuGeneral extends View {
    /**
     *
     * @param {string} path It is path to template
     */
    constructor(path) {
        super(path);

        this.viewOptions = [
            {
                name: 'Main Menu IronWar',
                action: 'main-menu',
                subitems: [
                    {name: 'Login', action: 'main-menu-login'},
                    {name: 'Registration', action: 'main-menu-registration'},
                    {name: 'Logout', action: 'main-menu-logout'},
                    {name: 'Settings', action: 'main-menu-settings'},
                    {name: 'Close Menu', action: 'main-menu-close'}
                ]
            }
        ];

        this.upload((el) => {
            this.show(false);
            this.addEventMainMenu();
            console.log(el);
        });

        this.blockMainMenu = null;
    }

    addEventMainMenu() {
        let btn = this.el.getElementByActionName(ACTION_MAIN_MENU);
        btn.addEvent('click', () => {
            this.showBlockMainMenu();
        });
    }

    showBlockMainMenu() {
        if (!this.blockMainMenu) {
            this.blockMainMenu = this.el.getElementByBlockName(ACTION_MAIN_MENU);
        }
        this.blockMainMenu.show();
    }

    hideBlockMainMenu() {
        this.blockMainMenu.hide();
    }
}

export default MenuGeneral;