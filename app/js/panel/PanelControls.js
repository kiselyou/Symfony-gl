var IW = IW || {};

/**
 *
 * @param {IW.Model} model
 * @constructor
 */
IW.PanelControls = function ( model ) {

    this.active = false;

    /**
     *
     * @type {IW.Model}
     */
    this.model = model;

    /**
     *
     * @type {IW.PanelAction}
     */
    this.panelAction = new IW.PanelAction();

    /**
     *
     * @type {IW.PanelMap}
     */
    this.panelMap = new IW.PanelMap();

    /**
     *
     * @type {{}}
     */
    this.actionConfig = this.model.multiLoader.getFile( IW.Prepare.CONFIG_KEY_ACTION );

    /**
     *
     * @type {IW.PanelControls}
     */
    var scope = this;

    /**
     * This method show panel map
     *
     * @returns {IW.PanelControls}
     */
    this.initPanelMap = function () {
        this.panelMap.show();
        return this;
    };

    /**
     * This method show panel action and add actions
     *
     * @returns {IW.PanelControls}
     */
    this.initPanelAction = function () {

        var actions = this.actionConfig[ IW.PanelControls.ACTION_SHOT ];

        for (var i = 0; i < actions.length; i++) {
            setAction( actions[ i ], IW.PanelControls.ACTION_SHOT );
        }

        this.panelAction.setProgress( IW.PanelAction.ENERGY, this.model.getCurrentEnergy(), this.model.getMaxEnergy() );
        this.panelAction.setProgress( IW.PanelAction.ARMOR, this.model.getCurrentArmor(), this.model.getMaxArmor() );
        this.panelAction.setProgress( IW.PanelAction.HULL, this.model.getCurrentHull(), this.model.getMaxHull() );
        this.panelAction.setProgress( IW.PanelAction.SPEED, this.model.getCurrentSpeed(), this.model.getMaxSpeed() );

        this.panelAction.reductionProgress( IW.PanelAction.ENERGY, this.model.getReductionEnergy() );
        this.panelAction.reductionProgress( IW.PanelAction.ARMOR, this.model.getReductionArmor() );
        this.panelAction.reductionProgress( IW.PanelAction.HULL, this.model.getReductionHull() );

        this.panelAction.show();
        return this;
    };

    /**
     *
     * @returns {IW.PanelControls}
     */
    this.updateEnergy = function () {
        this.panelAction.updateProgress( IW.PanelAction.ENERGY, this.model.getCurrentEnergy() );
        return this;
    };

    /**
     *
     * @returns {IW.PanelControls}
     */
    this.updateArmor = function () {
        this.panelAction.updateProgress( IW.PanelAction.ARMOR, this.model.getCurrentArmor() );
        return this;
    };

    /**
     *
     * @returns {IW.PanelControls}
     */
    this.updateHull = function () {
        this.panelAction.updateProgress( IW.PanelAction.HULL, this.model.getCurrentHull() );
        return this;
    };

    /**
     *
     * @returns {IW.PanelControls}
     */
    this.updateSpeed = function () {
        this.panelAction.updateProgress( IW.PanelAction.SPEED, this.model.getCurrentSpeed() );
        return this;
    };

    /**
     * Set action
     *
     * @param {{ name: [(?string|number)], icon: [(?string|number)], keyCode: [?number], active: [boolean], weapon: string|number }} param
     * @param {number|string} type
     */
    function setAction( param, type ) {

        switch ( type ) {
            // Add actions - Shot
            case IW.PanelControls.ACTION_SHOT:
                scope.panelAction.addAction( function () {

                    scope.model.modelShot.shot( param.weapon );

                }, param.name, param.icon, param.keyCode, param.active );
                break;
            // // Add action - Full Screen
            // case IW.PanelControls.ACTION_MAP_TOP:
            //     scope.panelAction.addAction( function () {
            //
            //         new IW.FullScreen().toggle();
            //
            //     }, param.name, param.icon, param.keyCode, param.active );
            //     break;
        }
    }
};

/**
 *
 * @type {string}
 */
IW.PanelControls.ACTION_SHOT = 'shot';

// /**
//  *
//  * @type {string}
//  */
// IW.PanelControls.ACTION_MAP_TOP = 'map_top';
