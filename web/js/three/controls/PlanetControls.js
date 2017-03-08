/**
 *
 * @param {Scene} scene
 * @param {Camera} camera
 * @constructor
 */
THREE.PlanetControls = function ( scene, camera ) {

	/**
	 *
	 * @type {Array}
	 */
	var group = [];

	/**
	 *
	 * @type {Scene}
	 */
	this.scene = scene;

	/**
	 *
	 * @type {Camera}
	 */
	this.camera = camera;

	this._arr = new api.Array();

	/**
	 * It is array of settings for build objects of planets
	 *
	 * @type {Array}
	 */
	this.settings = [
		{
			UUID: 'sun',
			name: 'Sun',
			describe: '',
			radius: 69570, // км 695700
			parentUUID: null,
			inclineY: 45 * Math.PI / 180,
			degree: 0.1, // start degree
			speedDegree: 0.01,
			distance: 0,
			texture: 'images/textures/sun/texture_sun.jpg',
			position: new THREE.Vector3( 0, 0, 0 ),
			glow: {
				color: '#ffff00',
				side: THREE.FrontSide,
				blending: THREE.AdditiveBlending,
				scalar: 1.2,
				c: 0.1,
				p: 4
			}
		},
		{
			UUID: 'earth',
			name: 'Earth',
			describe: '',
			radius: 637.1, // км
			parentUUID: 'sun',
			inclineY: 45 * Math.PI / 180,
			degree: 3.5, // start degree
			speedDegree: 0.000029783,
			distance: 149600, // км 149600000
			texture: 'images/textures/earch/texture_earth_clouds.jpg',
			position: new THREE.Vector3( 0, 0, 0 ),
			glow: {
				color: '#13FAED',
				side: THREE.FrontSide,
				blending: THREE.AdditiveBlending,
				scalar: 1.1,
				c: 0.8,
				p: 4
			}
		},
		{
			UUID: 'moon',
			name: 'Moon',
			describe: '',
			radius: 173.7,
			parentUUID: 'earth',
			inclineY: 45 * Math.PI / 180,
			degree: 3, // start degree
			speedDegree: 0.000019,
			distance: 384.4, // км 384400
			texture: 'images/textures/earch/texture_moon.jpg',
			position: new THREE.Vector3( 0, 0, 0 )
		},


		{
			uuid: 'jupiter',
			name: 'Jupiter',
			describe: '',
			radius: 6991.1,
			parentUUID: 'sun',
			speedAxis: (Math.PI / 180) / 10,
			inclineY: 45 * Math.PI / 180,
			startDegree: Math.PI / 4,
			distance: 778500,
			texture: 'images/textures/jupiter/texture_jupiter.jpg',
			position: new THREE.Vector3( 0, 0, 0 )
		},
		{
			uuid: 'mars',
			name: 'Mars',
			describe: '',
			radius: 339,
			parentUUID: 'sun',
			speedAxis: (Math.PI / 180) / 10,
			inclineY: 45 * Math.PI / 180,
			startDegree: Math.PI / 4,
			distance: 227900,
			texture: 'images/textures/mars/texture_mars.jpg',
			position: new THREE.Vector3( 0, 0, 0 )
		},
		{
			UUID: 'mercury',
			name: 'Mercury',
			describe: '',
			radius: 244, // км
			parentUUID: 'sun',
			speedAxis: (Math.PI / 180) / 10,
			inclineY: 45 * Math.PI / 180,
			startDegree: Math.PI / 4,
			distance: 57910, // км
			texture: 'images/textures/mercury/texture_mercury.jpg',
			position: new THREE.Vector3( 0, 0, 0 ),
			glow: {
				color: '#13FAED',
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				scalar: 1.2,
				c: 0.5,
				p: 6
			}
		},
		{
			uuid: 'saturn',
			name: 'Saturn',
			describe: '',
			radius: 5823.2,
			parentUUID: 'sun',
			speedAxis: (Math.PI / 180) / 10,
			inclineY: 45 * Math.PI / 180,
			startDegree: Math.PI / 4,
			distance: 1429000,
			texture: 'images/textures/saturn/texture_saturn.jpg',
			position: new THREE.Vector3( 0, 0, 0 )
		}
	];

	/**
	 * It is array objects of planets which already loaded
	 *
	 * @type {Object}
	 */
	this.objects = {};

	/**
	 *
	 * @param {{ name: string, describe: string, radius: number, speedAxis: number, inclineY: number distance: number, texture: string, position: Vector3 }} setting
	 * Describe:    UUID: Угикальное значение ( * )
	 *				name: Название планеты (не обязательно)
	 *              describe: Описание планеты (не обязательно)
	 *              radius: Размер планеты ( * )
	 *              speedAxisX: Скорость вращения сферы вокруг оси X (не обязательно)
	 *				speedAxisY: Скорость вращения сферы вокруг оси Y (не обязательно)
	 *				speedAxisZ: Скорость вращения сферы вокруг оси Z (не обязательно)
	 *              inclineX: Наклон сферы относительно оси X (не обязательно)
	 * 				inclineY: Наклон сферы относительно оси Y (не обязательно)
	 *				inclineZ: Наклон сферы относительно оси Z (не обязательно)
	 *				degree: Угол расположения относительно родителя (не обязательно) по умолчанию 45 градусов (в радианах)
	 *              distance: Растояние от (солнца) центральной планеты ( * )
	 *              texture: Текстура планеты ( * )
	 *              position: Текущая позиция планеты (не обязательно)
	 * @returns {THREE.PlanetControls}
	 */
	this.addPlanet = function ( setting ) {
		this.settings.push( setting );
		return this;
	};

	/**
	 *
	 * @param {{c: float, p: float, color: string, side: (THREE.BackSide|THREE.FrontSide), blending: (THREE.AdditiveBlending|THREE.NormalBlending) }} params
	 * @returns {ShaderMaterial}
	 */
	function customMaterial( params ) {
		var map = {
		    uniforms: {
				'c': { type: 'f', value: empty( params.c, 0.5 ) },
				'p': { type: 'f', value: empty( params.p, 6 ) },
				glowColor: { type: 'c', value: new THREE.Color( empty( params.color, 0xffff00 ) ) },
				viewVector: { type: 'v3', value: scope.camera.position }
			},
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
			side: empty( params.side, THREE.BackSide ),
			blending: empty( params.blending, THREE.AdditiveBlending  ),
			transparent: true
		};

		return new THREE.ShaderMaterial( map );
	}

	function empty ( value, def ) {
		return value === undefined ? def : value;
	}

	/**
	 *
	 * @type {TextureLoader}
	 */
	this.loader = new THREE.TextureLoader();

	/**
	 *
	 * @type {function|null}
	 */
	this.callback = null;

	/**
	 *
	 * @type {THREE.PlanetControls}
	 */
	var scope = this;

	/**
	 *
	 * @type {number}
	 */
	var startLoad = 0;

	/**
	 *
	 * @type {Array}
	 */
	// var glows = [];

	/**
	 *
	 * @param {boolean} [calcPosition]
	 * @param {function} [callback]
	 * @returns {THREE.PlanetControls}
	 */
	this.load = function ( calcPosition, callback ) {

		fragmentShader();
		vertexShader();

		// if ( callback !== undefined ) {
		// 	this.callback = callback;
		// }

		this._arr.setArray( scope.settings );
		group = this._arr.getGroups();

		this._arr.forEachElement( group, function ( element, parent, i ) {

			element.distance += ( element.radius ) + ( parent ? parent.radius : 0 );
			var x, z;
			if ( parent ) {
				x = element.distance * Math.cos( element.degree ) + parent.position.x;
				z = element.distance * Math.sin( element.degree ) + parent.position.z;
			} else {
				x = element.distance * Math.cos( element.degree ) + element.radius;
				z = element.distance * Math.sin( element.degree ) + element.radius;
			}


			element.position.setX( x );
			element.position.setZ( z );
		} );

		loadPlanet( this._arr.getNormalArray() );
		return this;
	};

	/**
	 *
	 * @returns {void}
	 */
	function loadPlanet ( settings, index ) {
		if ( index === undefined ) {
			index = 0;
		}

		var setting = null;

		if ( index < settings.length ) {
			setting = settings[ index ];
		}

		if ( !setting ) {
			return;
		}

		// load a resource
		scope.loader.load(
			// resource URL
			setting.texture,
			// Function when resource is loaded
			function ( texture ) {
				var segments = 25;
				var radius = Math.round( setting.radius );
				var geometry = new THREE.SphereGeometry( radius, segments, segments );
				var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );

				var sphere = new THREE.Mesh( geometry, material );
				sphere.position.copy( setting.position );
				sphere.rotateY( setting.inclineY );
				scope.scene.add( sphere );
				setting['planet'] = sphere;

				if ( setting.glow != undefined ) {
					var glow = new THREE.Mesh( geometry.clone(), customMaterial( setting.glow ).clone() );
				    glow.position.copy( setting.position );
					glow.scale.multiplyScalar( empty( setting.glow.scalar, 1.2 ) );
					setting.glow['mesh'] = glow;
					scope.scene.add( glow );
				}
			},

			// Function called when download progresses
			function ( xhr ) {
				var percentLoaded = xhr.loaded / xhr.total * 100;
				if ( percentLoaded == 100 ) {
					loadPlanet( settings, ++index );
				}
			},

			// Function called when download errors
			function ( xhr ) {
				console.log( 'An error happened' );
			}
		);
	}

	/**
	 *
	 * @returns {void}
	 */
	function updatePosition () {

		scope._arr.forEachElement( group, function ( element, parent, i ) {
			if ( parent ) {

				element.degree += element.speedDegree;

				var x = parent.position.x + element.distance * Math.cos( element.degree );
				var z = parent.position.z + element.distance * Math.sin( element.degree );

				element.position.setX( x );
				element.position.setZ( z );

				if ( element['planet'] != undefined ) {
					element['planet'].position.setX( x );
					element['planet'].position.setZ( z );
				}

				if ( element.glow != undefined && element.glow['mesh'] != undefined ) {
					var glow = element.glow.mesh;
					glow.position.setX( x );
					glow.position.setZ( z );
					glow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors( scope.camera.position, glow.position );
				}
			}
		} );
	}

	this.update = function () {
		updatePosition();
	};

	/**
	 * This method add shader to page
	 *
	 * @returns {void}
	 */
	function fragmentShader () {
		var str = '';
	    str += 'uniform vec3 glowColor;';
	    str += 'varying float intensity;';
	    str += 'void main()';
	    str += '{';
	    	str += 'vec3 glow = glowColor * intensity;';
	        str += 'gl_FragColor = vec4( glow, 1.0 );';
	    str += '}';

		var el = document.createElement('script');
		el.setAttribute('id', 'fragmentShader');
		el.setAttribute('type', 'x-shader/x-vertex');
		el.innerHTML = str;
		document.body.appendChild( el );
	}

	/**
	 * This method add shader to page
	 *
	 * @returns {void}
	 */
	function vertexShader () {
		var str = '';
	    str += 'uniform vec3 viewVector;';
	    str += 'uniform float c;';
	    str += 'uniform float p;';
	    str += 'varying float intensity;';
	    str += 'void main()';
	    str += '{';
	        str += 'vec3 vNormal = normalize( normalMatrix * normal );';
	    	str += 'vec3 vNormel = normalize( normalMatrix * viewVector );';
	    	str += 'intensity = pow( c - dot(vNormal, vNormel), p );';
	        str += 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );';
	    str += '}';

		var el = document.createElement('script');
		el.setAttribute('id', 'vertexShader');
		el.setAttribute('type', 'x-shader/x-vertex');
		el.innerHTML = str;
		document.body.appendChild( el );
	}
};
