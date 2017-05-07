var IW = IW || {};

/**
 *
 * @param {IW.Model} model
 * @constructor
 */
IW.Collision = function ( model ) {

    /**
     *
     * @type {IW.Model}
     */
    this.model = model;

    /**
     * The names of object which can collision
     *
     * @type {Array}
     */
    this.names = [];

    /**
     * The object which can collision
     *
     * @type {Array}
     */
    this.objectsCollision = [];

    /**
     *
     * @type {IW.Collision}
     */
    var scope = this;

    /**
     *
     * @return {IW.Collision}
     */
    this.addObjectCollision = function ( name ) {
        this.names.push( name );
        this.updateObjectCollision();
        return this;
    };

    /**
     *
     * @return {IW.Collision}
     */
    this.updateObjectCollision = function () {
        this.objectsCollision = this.model.scene.children.filter( function ( obj ) {
            return scope.names.indexOf( obj.name ) >= 0;
        } );
        return this;
    };

    /**
     *
     * @type {Box3}
     */
    var box1 = new THREE.Box3();

    /**
     *
     * @type {Box3}
     */
    var box2 = new THREE.Box3();

    /**
     *
     * @param {Mesh} mesh
     * @param {function} callback
     * @return {IW.Collision}
     */
    this.update = function ( mesh, callback ) {

        if (this.objectsCollision.length === 0) {
            return this;
        }

        for (var i = 0; i < scope.objectsCollision.length; i++) {

            box1.setFromObject( scope.objectsCollision[ i ] );
            box2.setFromObject( mesh );

            if ( box1.intersectsBox( box2 ) ) {
                // console.log( scope.objectsCollision[ i ].id );
                callback.call( this, scope.objectsCollision[ i ] );
                break;
            }
        }

        return this;
    };
};