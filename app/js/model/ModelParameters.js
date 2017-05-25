var IW = IW || {};

/**
 *
 * @constructor
 */
IW.ModelParameters = function () {

    /**
     * It is reserved name of model. Are using in model loader "IW.MultiLoader"
     *
     * @type {string|number}
     */
    this.name = IW.Prepare.MODEL_EXPLORER;

    /**
     * It is angle direction of model
     *
     * @type {number}
     */
    this.angle = 0;

	/**
     * It is configuration of speed of current model
     *
	 * @type {{acceleration: number, deceleration: number, current: number, max: number, min: number, speedRadiusForward: number, speedRadiusBackward: number}}
	 */
	this.speed = {
        acceleration: 55,    // m.s
        deceleration: 80,    // m.s
        current: 0,         // m.s Can not be less than zero. Default 0
        max:  1550,          // m.s It is maximum speed the model
        min: -250,	        // m.s If less than zero. The model is moving back
        speedRadiusForward: 0.02,
        speedRadiusBackward: 0.05
    };

	/**
     * It is configuration of incline of current model
     *
	 * @type {{angle: number, speed: number, maxAngle: number, minSpeed: number}}
	 */
	this.incline = {
        angle: 0,                       // It is angle incline
        speed: 0.05,                     // It is speed incline ( radian )
        maxAngle: 45 / 180 * Math.PI,   // It is max angle incline ( radian )
        minSpeed: 10                    // It is min speed of model where will begin inclines
    };

	/**
     * It is configuration of energy of current model
     *
	 * @type {{current: number, max: number, min: number, reduction: number}}
	 */
	this.energy = {
        current: 9000,
        max: 9000,
        min: 0,
        reduction: 5
    };

	/**
     * It is configuration of armor of current model
     *
	 * @type {{current: number, max: number, min: number, reduction: number}}
	 */
	this.armor = {
        current: 9000,
        max: 9000,
        min: 0,
        reduction: 50
    };

	/**
     * It is configuration of hull of current model
     *
	 * @type {{current: number, max: number, min: number, reduction: number}}
	 */
	this.hull = {
        current: 9000,
        max: 9000,
        min: 0,
        reduction: 50
    };

    /**
     * It is configuration action for current model
     *
     * @type {{}}
     */
    this.actions = [
	    {
            id: 1,                                  // It is unique id of action
            name: '1',                              // It is name action for client. Can see in user panel
            icon: 'move',                           // It is icon action for client. Can see in user panel
            keyCode: 49,                            // Keyboard key
            active: false,                          // Active action or not. Can see in user panel
            type: IW.ModelParameters.GUN_1,         // It is type of gun - for system
            action: IW.ModelParameters.ACTION_SHOT  // It is name action - for system
        }
    ];

	/**
     * It is configuration keyboard for current model
     *
	 * @type {{fly: {forward: {keyName: string, keyCode: number}, left: {keyName: string, keyCode: number}, right: {keyName: string, keyCode: number}, backward: {keyName: string, keyCode: number}}}}
	 */
	this.keyboard = {
		fly: {
			forward: {
				keyName: 'W',
				keyCode: 87
			},
			left: {
				keyName: 'A',
				keyCode: 65
			},
			right: {
				keyName: 'D',
				keyCode: 68
			},
			backward: {
				keyName: 'S',
				keyCode: 83
			}
		}
	};

    /**
     * Add action of model
     *
     * @param {{}} data
     * @return {IW.ModelParameters}
     */
    this.addAction = function ( data ) {
        this.actions.push( data );
        return this;
    };

    /**
     * Remove action of model
     *
     * @param {string|number} id
     * @return {IW.ModelParameters}
     */
    this.removeAction = function ( id ) {
        for ( var i = 0; i < this.actions.length; i++ ) {
            if ( this.actions[ i ][ 'id' ] === id ) {
                this.actions.splice( index, 0 );
                break;
            }
        }
        return this;
    };

    /**
     * Calculate and set damage
     *
     * @param {{ typeWeapon: string, physicalDamage: number, criticalDamage: number }} damage
     * @return {IW.ModelParameters}
     */
    this.setDamage = function ( damage ) {

        var critical = damage.physicalDamage * damage.criticalDamage / 100;

        if ((this.armor.current - damage.physicalDamage) < this.getMinArmor()) {
            this.addHull( - Math.abs( this.armor.current - damage.physicalDamage ) );
            this.armor.current = this.getMinArmor();
        } else {
            this.armor.current -= damage.physicalDamage;
        }

        this.addHull( - critical );

        return this;
    };

    this.isDestroyed = function () {
        return this.getCurrentHull() <= this.getMinHull();
    };

    /**
     * Add armor of model
     *
     * @param {number} int
     * @returns {IW.ModelParameters}
     */
    this.addArmor = function ( int ) {
        if ( this.getCurrentArmor() + int > this.getMaxArmor() ) {
            this.armor.current = this.getMaxArmor();
        } else {
            this.armor.current += int;
        }
        return this;
    };

	/**
     * Get current armor of model
     *
	 * @return {number}
	 */
	this.getCurrentArmor = function () {
        return this.armor.current;
    };

    /**
     * Set current armor of model
     *
     * @return {IW.ModelParameters}
     */
    this.setCurrentArmor = function (armor) {
        this.armor.current = armor;
        return this;
    };

	/**
     * Get max armor of model
     *
	 * @return {number}
	 */
    this.getMaxArmor = function () {
        return this.armor.max;
    };

	/**
     * Get min armor of model
     *
	 * @return {number}
	 */
	this.getMinArmor = function () {
        return this.armor.min;
    };

	/**
     * Get reduction armor of model
     *
	 * @return {number}
	 */
    this.getReductionArmor = function () {
        return this.armor.reduction;
    };

    /**
     * Add hull of model
     *
     * @param {number} int
     * @returns {IW.ModelParameters}
     */
    this.addHull = function ( int ) {
        if ( this.getCurrentHull() + int > this.getMaxHull() ) {
            this.hull.current = this.getMaxHull();
        } else if ( this.getCurrentHull() - int < this.getMinHull() ) {
            this.hull.current = this.getMinHull();
        } else {
            this.hull.current += int;
        }
        return this;
    };

    /**
     * Get current hull of model
     *
	 * @return {number}
	 */
	this.getCurrentHull = function () {
        return this.hull.current;
    };

    /**
     * Set current hull of model
     *
     * @return {IW.ModelParameters}
     */
    this.setCurrentHull = function (hull) {
        this.hull.current = hull;
        return this;
    };

	/**
     * Get max hull of model
     *
	 * @return {number}
	 */
    this.getMaxHull = function () {
        return this.hull.max;
    };

	/**
	 * Get min hull of model
	 *
	 * @return {number}
	 */
    this.getMinHull = function () {
        return this.hull.min;
    };

	/**
	 * Get reduction hull of model
	 *
	 * @return {number}
	 */
    this.getReductionHull = function () {
        return this.hull.reduction;
    };

	/**
	 * Get max speed of model
	 *
	 * @return {number}
	 */
    this.getMaxSpeed = function () {
        return this.speed.max;
    };

    /**
     * Get min speed of model
     *
     * @return {number}
     */
    this.getMinSpeed = function () {
        return this.speed.min;
    };

    /**
     * Get current speed of model
     *
     * @returns {number}
     */
    this.getCurrentSpeed = function () {
        return this.speed.current;
    };

    /**
     * Auto reduce current speed of model
     *
     * @returns {IW.ModelParameters}
     */
    this.reduceCurrentSpeedAuto = function () {
        if ( this.getCurrentSpeed() > this.speed.deceleration ) {
            this.speed.current -= this.speed.deceleration;
        } else if ( this.getCurrentSpeed() < - this.speed.deceleration ) {
            this.speed.current += this.speed.deceleration;
        } else {
            this.speed.current = 0;
        }
        return this;
    };

    /**
     * Increase current speed of model
     *
     * @returns {IW.ModelParameters}
     */
    this.increaseCurrentSpeed = function () {
        if ( this.getCurrentSpeed() < this.speed.max ) {
            this.speed.current += this.speed.acceleration;
        } else if ( this.getCurrentSpeed() < this.speed.max ) {
            this.speed.current = this.speed.max;
        }
        return this;
    };

    /**
     * Reduce current speed of model
     *
     * @returns {IW.ModelParameters}
     */
    this.reduceCurrentSpeed = function () {
        if (this.getCurrentSpeed() > this.speed.min) {
            this.speed.current -= this.getCurrentSpeed() < 0 ? this.speed.deceleration / 10 : this.speed.deceleration;
        } else if ( this.getCurrentSpeed() < this.speed.min ) {
            this.speed.current = this.speed.min;
        }
        return this;
    };

    /**
     * Gets speed radius forward
     *
     * @returns {number}
     */
    this.getSpeedRadiusForward = function () {
        return this.speed.speedRadiusForward;
    };

    /**
     * Gets speed radius backward
     *
     * @returns {number}
     */
    this.getSpeedRadiusBackward = function () {
        return this.speed.speedRadiusBackward / 3;
    };

    /**
     * Set current speed of model
     *
     * @returns {number}
     */
    this.setCurrentSpeed = function ( speed ) {
        return this.speed.current = speed;
    };

    /**
     * Get current energy of model
     *
     * @returns {number}
     */
    this.getCurrentEnergy = function () {
        return this.energy.current;
    };

    /**
     * Get max energy of model
     *
     * @returns {number}
     */
    this.getMaxEnergy = function () {
        return this.energy.max;
    };

    /**
     * Add energy of model
     *
     * @param {number} int
     * @returns {IW.ModelParameters}
     */
    this.addEnergy = function ( int ) {
        if ( this.getCurrentEnergy() + int > this.getMaxEnergy() ) {
            this.energy.current = this.getMaxEnergy();
        } else {
            this.energy.current += int;
        }
        return this;
    };

    /**
     * Get reduction energy of model
     *
     * @returns {number}
     */
    this.getReductionEnergy = function () {
        return this.energy.reduction;
    };

    /**
     * Get incline speed of model
     *
     * @returns {number}
     */
    this.getInclineSpeed = function () {
        return THREE.Math.degToRad( this.getCurrentSpeed() * this.incline.speed / 100 );
    };

    /**
     * Get incline min speed of model
     *
     * @returns {number}
     */
    this.getInclineMinSpeed = function () {
        return this.incline.minSpeed;
    };

    /**
     * Get incline angle of model
     *
     * @returns {number}
     */
    this.getInclineAngle = function () {
        return this.incline.angle;
    };

    /**
     * Get incline max angle of model
     *
     * @returns {number|*}
     */
    this.getInclineMaxAngle = function () {
        return this.incline.maxAngle;
    };

    /**
     * Reduce incline angle of model
     *
     * @returns {IW.ModelParameters}
     */
    this.reduceInclineAngle = function () {
        var speed = this.getInclineSpeed();
        this.incline.angle -= this.getInclineAngle() < 0 ? speed : speed * 2;
        return this;
    };

    /**
     * Auto-increase incline angle of model
     *
     * @returns {IW.ModelParameters}
     */
    this.increaseInclineAngle = function () {
        var speed = this.getInclineSpeed();
        this.incline.angle += this.getInclineAngle() > 0 ? speed : speed * 2;
        return this;
    };

    /**
     * Adds increase incline angle of model
     *
     * @param {number} int
     * @returns {IW.ModelParameters}
     */
    this.addInclineAngle = function ( int ) {
        this.incline.angle += int;
        return this;
    };
};

IW.ModelParameters.GUN_1 = 1;
IW.ModelParameters.ACTION_SHOT = 1;
