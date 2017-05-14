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
    this.actionConfig = this.model.multiLoader.getFile(IW.Prepare.CONFIG_KEY_ACTION);

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
        this.panelMap.appendMapTo();
        return this;
    };

    /**
     * This method show panel action and add actions
     *
     * @returns {IW.PanelControls}
     */
    this.initPanelAction = function () {
        for ( var action in this.actionConfig ) {
            if ( this.actionConfig.hasOwnProperty( action ) ) {

                var actions = this.actionConfig[ action ];

                for (var i = 0; i < actions.length; i++) {
                    setAction( actions[ i ], action );
                }
            }
        }

        this.panelAction.addProgress( 1, 'energy', this.model.getMaxEnergy(), this.model.getReductionEnergy(), '#FF9900' );
        this.panelAction.addProgress( 2, 'armor', this.model.getMaxArmor(), this.model.getReductionArmor(), '#008AFA' );
        this.panelAction.addProgress( 3, 'hull', this.model.getMaxHull(), this.model.getReductionHull(), '#C10020' );
        this.panelAction.addProgress( 4, 'speed', this.model.getMaxSpeed(), 0, '#FFFFFF' );

        this.panelAction.addCallback( 1, function ( param ) {
            scope.model.addEnergy( param.reduction );
        });

        // this.panelAction.addCallback( 2, function ( param ) {
        //     scope.model.addArmor( param.reduction );
        // });
        //
        // this.panelAction.addCallback( 3, function ( param ) {
        //     scope.model.addHull( param.reduction );
        // });

        this.panelAction.appendActionsTo();

        return this;
    };

    /**
     * This method are updating panel progress
     *
     * @return {void}
     */
    this.update = function () {

        if ( this.model.enabled ) {
            this.panelAction.updateProgress( 1, this.model.getCurrentEnergy() );
            this.panelAction.updateProgress( 2, this.model.getCurrentArmor() );
            this.panelAction.updateProgress( 3, this.model.getCurrentHull() );
            this.panelAction.updateProgress( 4, this.model.getCurrentSpeed() );
        }
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
            // Add action - Full Screen
            case IW.PanelControls.ACTION_FULL_SCREEN:
                scope.panelAction.addAction( function () {

                    new IW.FullScreen().toggle();

                }, param.name, param.icon, param.keyCode, param.active );
                break;
        }
    }
};

/**
 *
 * @type {string}
 */
IW.PanelControls.ACTION_SHOT = 'shot';

/**
 *
 * @type {string}
 */
IW.PanelControls.ACTION_FULL_SCREEN = 'fullscreen';