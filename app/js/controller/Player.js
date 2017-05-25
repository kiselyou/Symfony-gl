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
     * @type {string}
     */
    this.socketConnect = 'http://localhost:3000/play';

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
     * @type {?IW.LabelControls}
     */
    this.labels = null;

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
     * Socket key
     *
     * @type {string}
     */
    var SOCKET_MODEL_FLY = 'update-model-fly';

    /**
     * Socket key
     *
     * @type {string}
     */
    var SOCKET_MODEL_SHOT = 'update-model-shot';

    /**
     * Socket key
     *
     * @type {string}
     */
    var SOCKET_SHOT_COLLISION = 'update-shot-collision';

    /**
     * Socket key
     *
     * @type {string}
     */
    var SOCKET_REMOVE_CLIENT = 'remove-client';

    /**
     * Socket key
     *
     * @type {string}
     */
    var SOCKET_TRADE_TO = 'trade-to';

    /**
     * Socket key
     *
     * @type {string}
     */
    var SOCKET_TRADE_FROM = 'trade-from';

    this.initModelPreview = function () {
        scope.model = new IW.Model( scope.multiLoader, scope.scene );
        scope.model.load( true );
        return this;
    };

    /**
     *
     * @returns {IW.Player}
     */
    this.setConnect = function () {

        this.socket = new IW.Socket(this.socketConnect);

        this.socket.connect(
            function ( response, resourceId ) {
                console.log(resourceId);
                scope.model = new IW.Model( scope.multiLoader, scope.scene, resourceId );
                scope.model.load( true );
                scope.setPlayerID( resourceId );
                scope.giveBack( response, resourceId );

                scope.panels = new IW.PanelControls( scope.model );
                scope.panels.initPanelAction();
                scope.panels.initPanelMap();

                scope.labels = new IW.LabelControls( scope.model, scope.camera );
                scope.labels.init();
            },
            function ( event, response ) {
                scope.receive( event, response );
            }
        );

        return this;
    };

    /**
     *
     * @returns {IW.Player}
     */
    this.giveBack = function ( response, resourceId ) {
        // Socket event when window are closing
        scope.socket.windowCloseControls( function () {
            scope.socket.sendToAll( SOCKET_REMOVE_CLIENT, { resourceId: scope.getPlayerID() }, true );
            scope.socket.unsubscribe();
        } );
        // Send to all information about model of new user
        scope.socket.sendToAll( SOCKET_TRADE_TO, {model: scope.model.objectToJSON(), resourceId: scope.getPlayerID() }, true );
        // Send info about position of user model
        scope.model.addFlyEvents( function ( moution ) {
            scope.socket.sendToAll(
                SOCKET_MODEL_FLY,
                {
                    modelFly: moution,
                    modelParam: {
                        angle: scope.model.angle,
                        position: scope.model.getPosition(),
                        speed: scope.model.getCurrentSpeed()
                    },
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
     * @param {string} event - It is name event
     * @param {{ key: (string|number), data: {}, resourceId: ?(string|number) }} response
     * @returns {IW.Player}
     */
    this.receive = function ( event, response ) {
        var data = response.data;

        switch ( response.key ) {

            // Get information about new client
            case SOCKET_TRADE_TO:
                // Initialisation client model to own browser
                scope.model.addClientModel( new IW.Model( scope.multiLoader, scope.scene ).load( true, data.model ) );
                // Send own model to browser of new client
                scope.socket.sendToSpecific( SOCKET_TRADE_FROM, { model: scope.model.objectToJSON() }, data.resourceId );
                break;

            // Get information about old client
            case SOCKET_TRADE_FROM:
                // Set model of old client to own browser
                scope.model.addClientModel( new IW.Model( scope.multiLoader, scope.scene ).load( true, data.model ) );
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

                        client.angle = data.modelParam.angle;
                        client.setPosition(data.modelParam.position);
                        client.setCurrentSpeed(data.modelParam.speed);
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

                // Current player
                if ( dataModel.clientName === scope.getPlayerID() ) {
                    //dataModel.param
                    scope.model
                        .setCurrentHull(dataModel.param.hull)
                        .setCurrentArmor(dataModel.param.armor);

                    if ( dataModel.destroy ) {
                        // Unsubscribe if client was killed
                        scope.model.destroyModel( true, scope.model.id );
                        scope.labels.removeLabels();
                        scope.socket.unsubscribe();
                    }
                // Any players except current player
                } else {
                    scope.model.findClientModel(
                        dataModel.clientName,
                        /**
                         * Set parameters to client model
                         *
                         * @param {IW.Model} client
                         */
                        function ( client ) {

                            client
                                .setCurrentHull(dataModel.param.hull)
                                .setCurrentArmor(dataModel.param.armor);

                            if ( dataModel.destroy ) {
                                client.destroyModel( true, client.id );
                            }
                        }
                    );
                }
                break;

            // Unsubscribe client. Remove model from scene and model controls
            case SOCKET_REMOVE_CLIENT:
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

        if ( scope.labels ) {
            scope.labels.update();
        }
    }
};
