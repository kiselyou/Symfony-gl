
import MenuGeneral from './MenuGeneral';
import Tabs from './../tabs/Tabs';

import TabSounds from './../tabs/settings/TabSounds';
import TabDock from './../tabs/home/TabDock';

import {VIEW_NAME_MENU_GENERAL} from './../../ini/ejs.ini';

class MenuControls {

    constructor() {

        /**
         *
         * @type {MenuGeneral}
         */
        this.menuGeneral = new MenuGeneral(VIEW_NAME_MENU_GENERAL);

        this._menuHomeBlock =
            this.menuGeneral
                .addBlock('Home Page')
                .setBlockIcon('fa-home')
                .setActiveByDefault(true)
                .setOrder(10)
                .setLockStatus(MenuGeneral.SHOW_IF_LOCKED);

        this._menuSecurityBlock =
            this.menuGeneral
                .addBlock('Security')
                .setBlockTitle('Security')
                .setBlockIcon('fa-lock')
                .setOrder(30);

        this._menuSettingsBlock =
            this.menuGeneral
                .addBlock('Settings')
                .setBlockIcon('fa-cogs')
                .setOrder(20)
                .setLockStatus(MenuGeneral.SHOW_IF_LOCKED);

        /**
         *
         * @type {Tabs}
         * @private
         */
        this._tabsHome = new Tabs();

        /**
         *
         * @type {Tabs}
         * @private
         */
        this._tabsSettings = new Tabs();

        // Hide tabs before open any block menu
        this.menuGeneral.addEventBeforeOpen(() => {
            this._tabsHome.hideTabs(false);
            this._tabsSettings.hideTabs(false);
        });
    }

    /**
     * Start build menu
     *
     * @returns {MenuControls}
     */
    build() {
        this._menuSecurityBlock
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
        this._menuSecurityBlock
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
        this._menuSecurityBlock
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
        this._menuSecurityBlock
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

        this._tabsSettings
            .addTab('Sounds', true)
            .setIcon('fa-volume-up')
            .setContent((container) => {
                let sounds = new TabSounds(container);
                sounds.buildControls();
            });

        this._tabsSettings
            .addEventHideTabs(() => {
                this.menuGeneral.reset();
            })
            .buildTabs();

        this._menuSettingsBlock.addBlockEvent(() => {
            this._tabsSettings.showTabs();
        });
        return this;
    }

    /**
     * Create Item Home Page
     *
     * @returns {MenuControls}
     */
    openHomePage() {
        this._tabsHome
            .addTab('Dock', true)
            .setIcon('fa-cogs')
            .setContent((container) => {
                let dock = new TabDock(container);
                dock.buildControls();
            });

        this._tabsHome
            .addTab('Ship')
            .setIcon('fa-space-shuttle')
            .setContent('This is ship information');

        this._tabsHome
            .addTab('Map')
            .setIcon('fa-map-marker')
            .setContent('This is galaxy map');

        this._tabsHome
            .addEventHideTabs(() => {
                this.menuGeneral.reset();
            })
            .buildTabs();

        this._menuHomeBlock
            .addBlockEvent(() => {
                this._tabsHome.showTabs();
            });

        return this;
    }
}

export default MenuControls;
