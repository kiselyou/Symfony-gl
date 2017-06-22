var IW = IW || {};

/**
 *
 * @augments IW.Prepare
 * @constructor
 */
IW.SkyBox = function () {

    // Parent constructor
    IW.Prepare.call(this);

    /**
     *
     * @type {number}
     */
    this.width = 100000;

    /**
     *
     * @type {number}
     */
    this.height = 100000;

    /**
     *
     * @type {number}
     */
    this.depth = 100000;

    /**
     *
     * @type {?THREE.Mesh}
     * @private
     */
    this.environment = null;

    /**
     * When skyBox was created
     *
     * @param {IW.SkyBox.environment} environment
     * @callback buildSkuBoxDone
     */

    /**
     * Build Sky Box and set link to position
     *
     * @param {THREE.Scene} scene
     * @returns {IW.SkyBox}
     */
    this.buildEnvironment = function ( scene ) {

        var materials = [];

        for ( var i = 0; i < this.skyBox.names.length; i++ ) {

            var texture = this.multiLoader.getTexture( this.skyBox.names[ i ] );
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            var material = new THREE.MeshBasicMaterial();
            material.map = texture;
            material.side = THREE.BackSide;
            materials.push( material );
        }

        var geometry = new THREE.BoxGeometry( this.width, this.height, this.depth, 1, 1, 1 );
        this.environment = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
        this.environment.position.copy( new THREE.Vector3() );

        this.environment.add( this.earth() );

        scene.add( this.environment );
        return this;
    };

    this.setPositionEnvironment = function ( v ) {
        if (this.environment) {
            this.environment.position.copy( v );
        }
        return this;
    };

    var earthMesh = null;
    var cloudMesh = null;

    this.earth = function ( position ) {

        var material=new THREE.MeshPhongMaterial();
        var r = 1000;
        var scalar = 1.02;
        var geometry =new THREE.SphereGeometry(r, 64, 64);

        material.map = this.multiLoader.getTexture('earth_map');

        earthMesh = new THREE.Mesh(geometry, material);
        earthMesh.rotation.y = Math.PI / 2;

        earthMesh.position.set(0, - ( r + 200 ), r + 5000);
        // earthMesh.receiveShadow = true;
        // earthMesh.castShadow = true;

        var geometry2   = new THREE.SphereGeometry(r, 64, 64);
        var material2  = new THREE.MeshPhongMaterial(
            {
                map     : this.multiLoader.getTexture('earth_clouds'),
                side        : THREE.DoubleSide,
                opacity     : 0.5,
                transparent : true,
                depthWrite  : false,
            }
        );

        cloudMesh = new THREE.Mesh( geometry2, material2 );
        cloudMesh.scale.multiplyScalar( scalar );
        earthMesh.add( cloudMesh );

        var earthGlowMaterial = new IW.Atmosphere().getMaterial();
        earthGlowMaterial.uniforms.glowColor.value.set( 0x00b3ff );
        earthGlowMaterial.uniforms.coeficient.value = 1;
        earthGlowMaterial.uniforms.power.value = 5;

        var earthGlow = new THREE.Mesh( geometry, earthGlowMaterial );
        earthGlow.scale.multiplyScalar( scalar );
        earthGlow.position = earthMesh.position;
        earthMesh.add( earthGlow );

        return earthMesh;
    };

    this.updateEnvironment = function ( delta ) {
        if (earthMesh) {
            earthMesh.rotation.y += 1 / 256 * delta;
            cloudMesh.rotation.y += 1 / 128 * delta;
        }
    };
};
