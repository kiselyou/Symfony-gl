var IW = IW || {};

/**
 *
 * @augments IW.Scene
 * @constructor
 */
IW.Player = function ( idScene ) {

    // Parent constructor
    IW.Scene.call( this, idScene );

    /**
     *
     * @type {?(string|null)}
     * @private
     */
    this._playerID = null;

    /**
     *
     * @type {?IW.PanelControls}
     */
    this.panels = null;

    /**
     *
     * @type {?IW.Socket}
     */
    this.socket = null;

    /**
     *
     * @type {?IW.Model}
     */
    this.model = null;

    /**
     *
     * @type {IW.Player}
     */
    var scope = this;

    /**
     * Set ID for current user
     *
     * @param {?(string|number)} id
     * @returns {IW.Player}
     */
    this.setPlayerID = function ( id ) {
        this._playerID = id;
        return this;
    };

    /**
     * Get ID current user
     *
     * @returns {?(string|number)}
     */
    this.getPlayerID = function () {
        return this._playerID
    };

    /**
     *
     * @returns {IW.Player}
     */
    this.setConnect = function () {
        this.socket = new IW.Socket();
        this.socket.connect(
            function ( response, resourceId ) {

                scope.model = new IW.Model( scope.multiLoader, scope.scene );
                scope.model.load( true );
                scope.model.setID( resourceId );
                scope.setPlayerID( resourceId );
                scope.giveBack( response, resourceId );

                scope.panels = new IW.PanelControls( scope.model );
                scope.panels.initPanelAction();
                scope.panels.initPanelMap();
            },
            function ( response ) {
                scope.receive( response );
            }
        );

        return this;
    };

    var SOCKET_MODEL_FLY = 'update-model-fly';
    var SOCKET_MODEL_SHOT = 'update-model-shot';
    var SOCKET_SHOT_COLLISION = 'update-shot-collision';
    var SOCKET_UNSUBSCRIBE = 'unsubscribe-client';
    var SOCKET_TRADE_TO = 'trade-to';
    var SOCKET_TRADE_FROM = 'trade-from';

    /**
     *
     * @returns {IW.Player}
     */
    this.giveBack = function ( response, resourceId ) {

        scope.socket.windowCloseControls( function () {
            scope.socket.sendToAll( SOCKET_UNSUBSCRIBE, { resourceId: scope.getPlayerID() }, true );
        } );

        // Send to all information about model of new user
        scope.socket.sendToAll( SOCKET_TRADE_TO, {model: scope.model.objectToJSON(), resourceId: scope.getPlayerID() }, true );

        // Send info about position of user model
        scope.model.addFlyEvents( function ( moution ) {
            scope.socket.sendToAll(
                SOCKET_MODEL_FLY,
                {
                    modelFly: moution,
                    modelParam: scope.model.paramsToJSON( ['position', 'positionTo', 'incline', 'angle', 'speed'] ),
                    resourceId: scope.getPlayerID()
                },
                true
            );
        } );

        // Send to all information about shot of user model
        scope.model.modelShot.setShotCallback( function ( weaponType ) {
            scope.socket.sendToAll( SOCKET_MODEL_SHOT, { weaponType: weaponType, resourceId: scope.getPlayerID() }, true );
        } );

        // Send info about shot collision
        scope.model.modelShot.setCollisionShotCallback( function ( paramToClient ) {
            scope.socket.sendToAll(
                SOCKET_SHOT_COLLISION,
                {
                    model: paramToClient,
                    resourceId: resourceId
                },
                true
            );
        } );

        return this;
    };

    /**
     *
     * @param {{ key: (string|number), data: {}, resourceId: ?(string|number) }} response
     * @returns {IW.Player}
     */
    this.receive = function ( response ) {
        var data = response.data;
        var clientModel = null;
        switch ( response.key ) {

            // Get information about new client
            case SOCKET_TRADE_TO:
                // Initialisation client model to own browser
                clientModel = new IW.Model( scope.multiLoader, scope.scene );
                clientModel.load( true, data.model );
                scope.model.addClientModel( clientModel );
                // Send own model to browser of new client
                scope.socket.sendToSpecific( SOCKET_TRADE_FROM, { model: scope.model.objectToJSON() }, data.resourceId );
                break;

            // Get information about old client
            case SOCKET_TRADE_FROM:
                // Set model of old client to own browser
                clientModel = new IW.Model( scope.multiLoader, scope.scene );
                clientModel.load( true, data.model );
                scope.model.addClientModel( clientModel );
                break;

            case SOCKET_MODEL_FLY:
                scope.model.findClientModel(
                    data.resourceId,
                    /**
                     * Move client model in own browser
                     *
                     * @param {IW.Model} client
                     */
                    function ( client ) {
                        client.paramsJSONToObject( data.modelParam );
                        client.setPositionTo( client.getPositionTo() );
                        client.modelFly.setMotion( data.modelFly );
                    }
                );
                break;

            // Set information about event of shot client model
            case SOCKET_MODEL_SHOT:
                scope.model.findClientModel(
                    data.resourceId,
                    /**
                     * Set shot to client model in own browser
                     *
                     * @param {IW.Model} client
                     */
                    function ( client ) {
                        client.modelShot.shot( data.weaponType );
                    }
                );
                break;

            case SOCKET_SHOT_COLLISION:

                var dataModel = data.model;
                var clientName = data.clientName;

                scope.model.findClientModel(
                    data.resourceId,
                    /**
                     * Remove shot of client model
                     *
                     * @param {IW.Model} client
                     */
                    function ( client ) {
                        client.modelShot.destroyShot( dataModel.weaponKey );
                    }
                );

                if ( clientName === scope.getPlayerID() ) {
                    scope.model.paramsJSONToObject( dataModel.param );
                    if ( dataModel.destroy ) {
                        scope.model.destroyModel( true, scope.model.id );
                        // scope.labelControl.removeLabels();
                        // Unsubscribe if client was killed
                        scope.socket.windowCloseControls( function () {
                            scope.socket.sendToAll( SOCKET_UNSUBSCRIBE, { resourceId: scope.getPlayerID() }, true );
                        } );
                    }
                } else {
                    scope.model.findClientModel(
                        clientName,
                        /**
                         * Set parameters to client model
                         *
                         * @param {IW.Model} client
                         */
                        function ( client ) {
                            client.paramsJSONToObject( dataModel.param );
                            if ( dataModel.destroy ) {
                                client.destroyModel( true, client.id );
                            }
                        }
                    );
                }
                break;

            // Unsubscribe client. Remove model from scene and model controls
            case SOCKET_UNSUBSCRIBE:
                scope.model.removeClientModel( true, data.resourceId );
                break;
        }
        return this;
    };

    /**
     * Call to this method in request animation frame
     *
     * @param {number} delta
     * @returns {void}
     */
    this.updateModel = function ( delta ) {
        if ( scope.model ) {
            scope.model.update( delta );
            scope.orbitControl.target.copy( scope.model.getPosition() );
            scope.environment.position.copy( scope.model.getPosition() );
        }

        if ( scope.panels ) {
            scope.panels.update();
        }
    }
};