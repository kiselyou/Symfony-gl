import MenuGeneral from './MenuGeneral';
import {VIEW_PATH_MENU_GENERAL} from './../view-path';

class MenuControls {
    constructor() {

        this.menuGeneral = new MenuGeneral(VIEW_PATH_MENU_GENERAL);

        this.menuGeneral.upload(() => {
            this.menuGeneral.show(false);
            this.menuGeneral.initEvents();
        });
    }

    /**
     *
     * @param {listenItemsMenu} listener
     * @returns {MenuControls}
     */
    openFormLogin(listener) {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, MenuGeneral.ACTION_LOGIN, listener);
        return this;
    }

    /**
     *
     * @param {listenItemsMenu} listener
     * @returns {MenuControls}
     */
    openFormRegistration(listener) {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, MenuGeneral.ACTION_REGISTRATION, listener);
        return this;
    }

    /**
     * Close block menu
     *
     * @param {listenItemsMenu} [listener]
     * @returns {MenuControls}
     */
    closeMenu(listener) {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, MenuGeneral.ACTION_CLOSE, () => {
            this.menuGeneral.hideBlock(MenuGeneral.BLOCK_MAIN_MENU);
            listener ? listener() : null;
        });
        return this;
    }
}

export default MenuControls;
