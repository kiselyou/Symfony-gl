import MenuGeneral from './MenuGeneral';
import {VIEW_NAME_MENU_GENERAL} from './../../ini/ejs-ini';

class MenuControls {

    constructor() {

        /**
         *
         * @type {MenuGeneral}
         */
        this.menuGeneral = new MenuGeneral(VIEW_NAME_MENU_GENERAL);

        this.menuGeneral.render(() => {
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
}

export default MenuControls;
