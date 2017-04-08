var api = {};

/**
 *
 * @class
 * @param {Array} [arr = []]
 * @constructor api.Array
 */
api.Array = function ( arr ) {

	/** @type {{ parent: string, children: string }} */
	this._index = {
		parent: 'UUID',
		children: 'parentUUID'
	};

	/** @type {Array} */
	this.elements = ( arr === undefined ) ? [] : arr;

	/** @const {string} */
	var MASK = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx';

	/**
	 * Get UUID for element
	 *
	 * @returns {string}
	 */
	this.UUID = function () {
		return MASK.replace( /[xy]/g, function( c ) {
			var r = Math.random() * 16 | 0;
			var v = ( c == 'x' ) ? r : ( r & 0x3 | 0x8 );
			return v.toString( 16 );
		});
	};

	/**
	 * Set elements
	 *
	 * @param {Array} arr
	 * @returns {!api.Array} - UUID of added data
	 */
	this.setArray = function ( arr ) {
		this.elements = arr;
		return this;
	};

	//noinspection JSUnusedGlobalSymbols

	/**
	 * Add element
	 *
	 * @param {*} data - It is data which need to add
	 * @param {?(number|string)} [parentUUID] - It is UUID of parent (relate on parent)
	 * @param {?(number|string)} [UUID] - It is UUID for element
	 * @returns {!(string|number)} - UUID of added data
	 */
	this.addToArray = function ( data, parentUUID, UUID ) {
		var element = data;
		element[ this._index.parent ] = ( UUID == undefined ? this.UUID() : UUID );
		element[ this._index.children ] = ( parentUUID == undefined ? null : parentUUID );
		this.elements.push( element );
		return element[ this._index.parent ];
	};

	/**
	 * Get UUID of element
	 *
	 * @param {(number|string)} key - possible values ( 'first' | 0, 1, 2, ..., | 'last' )
	 * @returns {?(string|number)}
	 */
	this.getUUID = function ( key ) {
		var uuid = null;
		switch ( key ) {
			case 'last':
				uuid = this.getUUID( this.elements.length - 1 );
				break;
			case 'first':
				uuid = this.getUUID( 0 );
				break;
			default:
				if ( this.elements[ key ] !== undefined ) {
					uuid = this.elements[ key ][ this._index.parent ];
				}
		}
		return uuid;
	};

	//noinspection JSUnusedGlobalSymbols

	/**
	 * Get element
	 *
	 * @param {!(number|string)} UUID
	 * @returns {?Object}
	 */
	this.findElement = function ( UUID ) {
		var len = this.elements.length;
		for ( var i = 0; i < len; i++ ) {
			if ( UUID === this.elements[ i ][ this._index.parent ] ) {
				return this.elements[ i ];
			}
		}
		return null;
	};

	/**
	 * Get children elements
	 *
	 * @param {!(number|string)} UUID
	 * @returns {Array}
	 */
	this.findChildren = function ( UUID ) {
		var children = [];
		var len = this.elements.length;
		for ( var a = 0; a < len; a++ ) {
			var element = this.elements[ a ];
			if ( UUID === element[ this._index.children ] ) {
				element[ 'children' ] = this.findChildren( element[ this._index.parent ] );
				children.push( element );
			}
		}
		return children;
	};

	/**
	 * Grouping elements. Children move to parent
	 *
	 * @returns {Array} - It is new array of grouped elements
	 */
	this.getGroups = function () {
		var group = [];
		var len = this.elements.length;
		for ( var i = 0; i < len; i++ ) {
			if ( this.elements[ i ][ this._index.children ] == undefined ) {
				var copyElement = this.elements[ i ];
				copyElement[ 'children' ] = this.findChildren( copyElement[ this._index.parent ] );
				group.push( copyElement );
			}
		}
		return group;
	};

	//noinspection JSUnusedGlobalSymbols

	/**
	 *
	 *
	 * @returns {Array.<api.Array.elements>}
	 */
	this.getNormalArray = function () {
		return this.elements;
	};

	/**
	 * This method is can do something with each element of group
	 *
	 * @param {Array.<api.Array.getGroups>} arr
	 * @param {eachElementCallback} callback - The callback that handles the data of current element
	 * @param {?Object} [parent = null]
	 * @returns {void}
	 */
	this.forEachElement = function ( arr, callback, parent ) {
		parent = ( parent === undefined ) ? null : parent;
		var len = arr.length;
		for ( var i = 0; i < len; i++ ) {
			var element = arr[ i ];
			callback.call( this, element, parent, i );
			if ( element.hasOwnProperty( 'children' ) && element[ 'children' ].length > 0 ) {
				this.forEachElement( element[ 'children' ], callback, element );
			}
		}
	};

	/**
	 * This callback type is called `eachElementCallback`
	 *
	 * @callback eachElementCallback
	 * @param {{}} element - It data of current element
	 * @param {number} parent - It is data of parent of current element
	 * @param {number} i - Counter group
	 */
};
