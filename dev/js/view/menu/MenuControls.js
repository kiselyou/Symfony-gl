import MenuGeneral from './MenuGeneral';
import {VIEW_PATH_MENU_GENERAL} from './../view-path';

class MenuControls {

    /**
     *
     * @param {Lock} locker
     */
    constructor(locker) {

        /**
         *
         * @type {Lock}
         * @private
         */
        this._locker = locker;

        /**
         *
         * @type {MenuGeneral}
         */
        this.menuGeneral = new MenuGeneral(VIEW_PATH_MENU_GENERAL);

        this.menuGeneral.render(() => {
            this.menuGeneral.show(false);
            this.menuGeneral.initEvents();
        });
    }

    /**
     *
     * @returns {MenuControls}
     */
    checkLock() {
        this.menuGeneral.lockControls(this._locker);
        return this;
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
            this.checkLock();
            listener();
        });
        return this;
    }
}

export default MenuControls;
