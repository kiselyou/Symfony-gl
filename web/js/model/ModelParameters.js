var IW = IW || {};

/**
 *
 * @constructor
 */
IW.ModelParameters = function () {

    /**
     *
     * @type {string|number}
     */
    this.name = IW.ModelParameters.MODEL_DEFAULT;

    /**
     *
     * @type {number}
     */
    this.angle = 0;

    /**
     * It is direct speed of object
     *
     * @type {{current: number, max: number, min: number}}
     */
    this.speed = {
        acceleration: 5,    // m.s
        deceleration: 8,   // m.s
        current: 0,         // m.s Can not be less than zero. Default 0
        max:  450,         // m.s It is maximum speed the model
        min: -50,	        // m.s If less than zero. The model is moving back
        speedRadiusForward: 0.02,
        speedRadiusBackward: 0.05
    };

    /**
     * It is parameter for incline object
     *
     * @type {{angle: number, speed: number, max: number, inclineMinSpeed: number}}
     */
    this.incline = {
        angle: 0,                       // It is angle of plane
        speed: 0.5,                    // Скорость наклона - процент от скорости объекта (radian)
        maxAngle: 35 / 180 * Math.PI,        // Максимальный угол наклона ( radian )
        minSpeed: 10                         // Мин. Скорость при которой карабль начинает наклоны
    };

    /**
     * Показатели энергии
     *
     * @type {{current: number, max: number, min: number}}
     */
    this.energy = {
        current: 9000,  // Текущее значение
        max: 9000,      // Максимальное значение
        min: 10,        // Минимальное значение
        reduction: 5    // Скорость восстановления
    };

    /**
     * Показатели брони
     *
     * @type {{current: number, max: number, min: number}}
     */
    this.armor = {
        current: 9000,  // Текущее значение
        max: 9000,      // Максимальное значение
        min: 10,        // Минимальное значение
        reduction: 5    // Скорость восстановления
    };

    /**
     * Показатели корпуса
     *
     * @type {{current: number, max: number, min: number}}
     */
    this.hull = {
        current: 9000,  // Текущее значение
        max: 9000,      // Максимальное значение
        min: 10,        // Минимальное значение
        reduction: 5    // Скорость восстановления
    };

    /**
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
            action: IW.ModelParameters.ACTION_SHOT  // It is name action - for system (Тип действия)
        }
    ];

    /**
     * Add action
     *
     * @param {Object.<action>} data
     * @return {IW.ModelParameters}
     */
    this.addAction = function ( data ) {
        this.actions.push( data );
        return this;
    };

    /**
     * Remove action
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

    this.destroy = false;

    this.getParamToClient = function () {

        var hull = this.getCurrentHull();
        var armor = this.getCurrentArmor();

        this.destroy = hull === this.getMinHull() && armor === this.getMinArmor();

        return {
            hull: hull,
            armor: armor,
            destroy: this.destroy
        };
    };

    this.setParamFromClient = function ( param ) {
        for ( var property in param ) {
            if ( param.hasOwnProperty( property ) ) {
                this[ property ][ 'current' ] = param[ property ];
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
            console.log( critical, Math.abs( this.armor.current - damage.physicalDamage ) );
            this.hull.current -= Math.abs( this.armor.current - damage.physicalDamage );
            this.armor.current = this.getMinArmor();
        } else {
            this.armor.current -= damage.physicalDamage;
        }

        if (this.hull.current < this.getMinHull()) {
            this.hull.current = this.getMinHull();
        } else {
            this.hull.current -= critical;
        }

        return this;
    };

    this.getCurrentArmor = function () {
        return this.armor.current;
    };

    this.getMaxArmor = function () {
        return this.armor.max;
    };

    this.getMinArmor = function () {
        return this.armor.min;
    };

    this.getReductionArmor = function () {
        return this.armor.reduction;
    };

    this.getCurrentHull = function () {
        return this.hull.current;
    };

    this.getMaxHull = function () {
        return this.hull.max;
    };

    this.getMinHull = function () {
        return this.hull.min;
    };

    this.getReductionHull = function () {
        return this.hull.reduction;
    };

    /**
     *
     * @returns {number}
     */
    this.getMaxSpeed = function () {
        return this.speed.max;
    };

    /**
     *
     * @returns {number}
     */
    this.getCurrentSpeed = function () {
        return this.speed.current;
    };

    /**
     *
     * @returns {IW.ModelParameters}
     */
    this.autoReduceCurrentSpeed = function () {
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
     *
     * @returns {number}
     */
    this.getSpeedRadiusForward = function () {
        return this.speed.speedRadiusForward;
    };

    /**
     *
     * @returns {number}
     */
    this.getSpeedRadiusBackward = function () {
        return this.speed.speedRadiusBackward / 3;
    };

    /**
     *
     * @returns {number}
     */
    this.getCurrentEnergy = function () {
        return this.energy.current;
    };

    /**
     *
     * @returns {number}
     */
    this.getMaxEnergy = function () {
        return this.energy.max;
    };

    /**
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
     *
     * @returns {number}
     */
    this.getReductionEnergy = function () {
        return this.energy.reduction;
    };

    /**
     *
     * @returns {number}
     */
    this.getInclineSpeed = function () {
        return THREE.Math.degToRad( this.getCurrentSpeed() * this.incline.speed / 100 );
    };

    /**
     *
     * @returns {number}
     */
    this.getInclineMinSpeed = function () {
        return this.incline.minSpeed;
    };

    /**
     *
     * @returns {number}
     */
    this.getInclineAngle = function () {
        return this.incline.angle;
    };

    /**
     *
     * @returns {number|*}
     */
    this.getInclineMaxAngle = function () {
        return this.incline.maxAngle;
    };

    /**
     *
     * @returns {IW.ModelParameters}
     */
    this.reduceInclineAngle = function () {
        var speed = this.getInclineSpeed();
        this.incline.angle -= this.getInclineAngle() < 0 ? speed : speed * 1.2;
        return this;
    };

    /**
     *
     * @returns {IW.ModelParameters}
     */
    this.increaseInclineAngle = function () {
        var speed = this.getInclineSpeed();
        this.incline.angle += this.getInclineAngle() > 0 ? speed : speed * 1.2;
        return this;
    };

    /**
     *
     * @returns {IW.ModelParameters}
     */
    this.addInclineAngle = function ( step ) {
        this.incline.angle += step;
        return this;
    };
};

IW.ModelParameters.GUN_1 = 1;
IW.ModelParameters.ACTION_SHOT = 1;

IW.ModelParameters.MODEL_S1_A = 'S1_A';
IW.ModelParameters.MODEL_S1_B = 'S1_B';
IW.ModelParameters.MODEL_S1_C = 'S1_C';
IW.ModelParameters.MODEL_S1_D = 'S1_D';

IW.ModelParameters.MODEL_DEFAULT = IW.ModelParameters.MODEL_S1_A;
