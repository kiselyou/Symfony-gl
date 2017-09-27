
import MenuGeneral from './MenuGeneral';
import Tabs from './../tabs/Tabs';

import TabSounds from './../tabs/settings/TabSounds';

import {VIEW_NAME_MENU_GENERAL} from './../../ini/ejs.ini';

class MenuControls {

    constructor() {

        /**
         *
         * @type {MenuGeneral}
         */
        this.menuGeneral = new MenuGeneral(VIEW_NAME_MENU_GENERAL);

        // this._homeBlock = this.menuGeneral
        //     .addBlock('Home Page')
        //     .setBlockTitle('Home Page')
        //     .setBlockIcon('fa-home')
        //     .setOrder(10)
        //     .setLockStatus(MenuGeneral.SHOW_IF_LOCKED);

        this._securityBlock = this.menuGeneral
            .addBlock('Security')
            .setBlockTitle('Security')
            .setBlockIcon('fa-lock')
            .setOrder(20);

        this._settingsBlock = this.menuGeneral
            .addBlock('Settings')
            // .setBlockTitle('Settings')
            .setBlockIcon('fa-wrench')
            .setOrder(10)
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
        this._securityBlock
            .addItem('Close Menu')
            .setOrder(100);

        // this._homeBlock
        //     .addItem('Close Menu')
        //     .setOrder(100);

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
                sounds.buildTab();
            });

        this._tabsSettings
            .addTab('Sounds - 2')
            .setIcon('fa-volume-up')
            .setContent('Setting of sound2');

        this._tabsSettings
            .addEventHideTabs(() => {
                this.menuGeneral.reset();
            })
            .buildTabs();

        this._settingsBlock.addBlockEvent(() => {
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
        // this._tabsHome
        //     .addTab('Home1', true)
        //     .setIcon('fa-home')
        //     .setContent('1');
        //
        // this._tabsHome
        //     .addTab('Home2', true)
        //     .setIcon('fa-home')
        //     .setContent('2');
        //
        // this._tabsHome
        //     .addTab('Home3', true)
        //     .setIcon('fa-home')
        //     .setContent('3');
        //
        // this._tabsHome
        //     .addTab('Home4', true)
        //     .setIcon('fa-home')
        //     .setContent('4');
        //
        // this._tabsHome
        //     .addTab('Home5', true)
        //     .setIcon('fa-home')
        //     .setContent('5');
        //
        // this._tabsHome
        //     .addTab('Home6', true)
        //     .setIcon('fa-home')
        //     .setContent('6');
        //
        // this._tabsHome.buildTabs();
        //
        // this._homeBlock
        //     .addItem('Home Page')
        //     .setOrder(10)
        //     .setLockStatus(MenuGeneral.SHOW_IF_LOCKED)
        //     .addEvent(() => {
        //         this._tabsHome.showTabs();
        //     });
        return this;
    }
}

export default MenuControls;
