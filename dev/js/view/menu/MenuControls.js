
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

        this._homeBlock = this.menuGeneral
            .addBlock('Home Page')
            .setBlockTitle('Home Page')
            .setBlockIcon('fa-home')
            .setOrder(10)
            .setLockStatus(MenuGeneral.SHOW_IF_LOCKED);

        this._securityBlock = this.menuGeneral
            .addBlock('Security')
            .setBlockTitle('Security')
            .setBlockIcon('fa-lock')
            .setOrder(20);

        this._settingsBlock = this.menuGeneral
            .addBlock('Settings')
            .setBlockTitle('Settings')
            .setBlockIcon('fa-wrench')
            .setOrder(10)
            .setLockStatus(MenuGeneral.SHOW_IF_LOCKED);

        /**
         *
         * @type {Tabs}
         */
        this.tabs = new Tabs();

        // Hide tabs before open any block menu
        this.menuGeneral.addEventBeforeOpen(() => {
            this.tabs.hideView();
        });
    }

    /**
     * Start build menu
     *
     * @returns {MenuControls}
     */
    build() {
        this._securityBlock
            .addItem('Close Menu')
            .setOrder(100);
        this._homeBlock
            .addItem('Close Menu')
            .setOrder(100);
        this._settingsBlock
            .addItem('Close Menu')
            .setOrder(100);
        this.menuGeneral
            .sortFull()
            .initialisationMenu();
        return this;
    }

    /**
     * @callback listenItemsMenu
     */

    /**
     * Add event open form login
     *
     * @param {listenItemsMenu} [listener]
     * @returns {MenuControls}
     */
    openFormLogin(listener) {
        this._securityBlock
            .addItem('Login', listener)
            .setOrder(10)
            .setLockStatus(MenuGeneral.HIDE_IF_LOCKED);
        return this;
    }

    /**
     * Add event open form registration
     *
     * @param {listenItemsMenu} [listener]
     * @returns {MenuControls}
     */
    openFormRegistration(listener) {
        this._securityBlock
            .addItem('Registration', listener)
            .setOrder(20)
            .setLockStatus(MenuGeneral.HIDE_IF_LOCKED);
        return this;
    }

    /**
     * Add event logout
     *
     * @param {listenItemsMenu} [listener]
     * @returns {MenuControls}
     */
    logout(listener) {
        this._securityBlock
            .addItem('Logout', listener)
            .setOrder(30)
            .setLockStatus(MenuGeneral.SHOW_IF_LOCKED);
        return this;
    }

    /**
     * Add event open menu
     *
     * @param {eventsBeforeBlockOpen} listener
     * @returns {MenuControls}
     */
    openMenu(listener) {
        this.menuGeneral.addEventBeforeOpen(() => {
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
        this._settingsBlock
            .addItem('Settings')
            .setOrder(40)
            .addEvent(() => {
                this.tabs
                    .addTab('Settings', true)
                    .setIcon('fa-volume-up')
                    .setContent('Setting of sound');

                this.tabs
                    .buildTabs()
                    .showView();
            })
            .setLockStatus(MenuGeneral.SHOW_IF_LOCKED);
        return this;
    }

    /**
     * Create Item Home Page
     *
     * @returns {MenuControls}
     */
    openHomePage() {
        this._homeBlock
            .addItem('Home Page')
            .setOrder(10)
            .setLockStatus(MenuGeneral.SHOW_IF_LOCKED)
            .addEvent(() => {
                this.tabs
                    .addTab('Home', true)
                    .setIcon('fa-home')
                    .setContent('ssssssssssssssss');

                this.tabs
                    .buildTabs()
                    .showView();
            });
        return this;
    }
}

export default MenuControls;
