import MenuGeneral from './MenuGeneral';
import Tabs from './../tabs/Tabs';
import {VIEW_NAME_MENU_GENERAL} from './../../ini/ejs.ini';

class MenuControls {

    constructor() {

        /**
         *
         * @type {MenuGeneral}
         */
        this.menuGeneral = new MenuGeneral(VIEW_NAME_MENU_GENERAL);

        /**
         *
         * @type {Tabs}
         */
        this.tabs = new Tabs();
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
            this.tabs.hideView();
            listener();
        });
        return this;
    }

    /**
     * Add event open settings
     *
     * @returns {MenuControls}
     */
    openSettings() {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, MenuGeneral.ACTION_SETTINGS, () => {
            this.tabs
                .addItem('Settings', 'ssssssssssssssss', 'fa-cog', true)
                .buildTabs()
                .showView();

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


















    /**
     * Add event open settings
     *
     * @returns {MenuControls}
     */
    openTest1() {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, 'test-1', () => {
            this.tabs
                .addItem('Tab Name Test-1', 'ssssssssssssssss', 'fa-cog', true)
                .buildTabs()
                .showView();

        });
        return this;
    }

    /**
     * Add event open settings
     *
     * @returns {MenuControls}
     */
    openTest2() {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, 'test-2', () => {
            this.tabs
                .addItem('Tab Name Test-2', '8888888888', 'fa-cog', true)
                .buildTabs()
                .showView();

        });
        return this;
    }


    /**
     * Add event open settings
     *
     * @returns {MenuControls}
     */
    openTest3() {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, 'test-3', () => {
            this.tabs
                .addItem('Tab Name Test-3', 'ZXZxzXZXZX', 'fa-cog', true)
                .buildTabs()
                .showView();

        });
        return this;
    }

    /**
     * Add event open settings
     *
     * @returns {MenuControls}
     */
    openTest4() {
        this.menuGeneral.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, 'test-4', () => {
            this.tabs
                .addItem('Tab Name Test-4', 'retretrertretreter', 'fa-cog', true)
                .buildTabs()
                .showView();

        });
        return this;
    }



}

export default MenuControls;
