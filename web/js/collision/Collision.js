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
     * @param {Mesh} mesh
     * @param {function} callback
     * @return {IW.Collision}
     */
    this.update = function ( mesh, callback ) {

        for (var vertexIndex = 0; vertexIndex < mesh.geometry.vertices.length; vertexIndex++) {

            var localVertex = mesh.geometry.vertices[ vertexIndex ].clone();
            var globalVertex = localVertex.applyMatrix4( mesh.matrix );
            var directionVector = globalVertex.sub( mesh.position );

            var ray = new THREE.Raycaster( mesh.position, directionVector.clone().normalize() );
            var intersect = ray.intersectObjects( scope.objectsCollision );

            if ( intersect.length > 0 && intersect[ 0 ].distance < directionVector.length() ) {
                callback.call( this, intersect[ 0 ][ 'object' ], mesh );
                break;
            }
        }

        return this;
    }
};