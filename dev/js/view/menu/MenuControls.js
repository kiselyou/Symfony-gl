import MenuGeneral from './MenuGeneral';
import {VIEW_NAME_MENU_GENERAL} from './../../ini/ejs.ini';

class MenuControls {

    constructor() {

        /**
         *
         * @type {MenuGeneral}
         */
        this.menuGeneral = new MenuGeneral(VIEW_NAME_MENU_GENERAL);
    }

    /**
     * Add event open form login
     *
     * @param {listenItemsMenu} listener
     * @returns {MenuControls}
     */
    openFormLogin(listener) {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, MenuGeneral.ACTION_LOGIN, listener);
        return this;
    }

    /**
     * Add event open form registration
     *
     * @param {listenItemsMenu} listener
     * @returns {MenuControls}
     */
    openFormRegistration(listener) {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, MenuGeneral.ACTION_REGISTRATION, listener);
        return this;
    }

    /**
     * Add event logout
     *
     * @param {listenItemsMenu} [listener]
     * @returns {MenuControls}
     */
    logout(listener) {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, MenuGeneral.ACTION_LOGOUT, listener);
        return this;
    }

    /**
     * Add event open menu
     *
     * @param {eventsBeforeBlockOpen} listener
     * @returns {MenuControls}
     */
    openMenu(listener) {
        this.menuGeneral.addEventBeforeBlockOpen(MenuGeneral.BLOCK_MAIN_MENU, () => {
            listener();
        });
        return this;
    }

    /**
     * Add event close menu
     *
     * @param {listenItemsMenu} listener
     * @returns {MenuControls}
     */
    closeMenu(listener) {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, MenuGeneral.ACTION_CLOSE_MENU, listener);
        return this;
    }
}

export default MenuControls;
