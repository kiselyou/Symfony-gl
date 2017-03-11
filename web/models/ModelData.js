/**
 *
 * @constructor
 */
THREE.ModelData = function () {

	// index - текущее значение
	// min - минимальное значение
	// max - максимальное значение
	// unit - еденица измерения

	this.accelerationSpeed = { index: 1, unit: 'м.с' };                   // Ускорения
	this.decelerationSpeed = { index: 1, unit: 'м.с' };                   // Торможение

	this.speedDirect = {
		index: 700,
		min: 200,
		max: 5000,
		unit: 'м/с'
	};  // Скорость перемещения по прямой

	this.speedRotate = {
		index: 600,
		min: 100,
		max: 3000,
		unit: 'м/с'
	};  // Скорость разварота

	this.radius = {
		index: 10,                              // percent from speed rotate
		incline: 0,                             // degree
		maxIncline: 55 * Math.PI / 180,         // degree
		speedIncline: ( Math.PI / 180 ) / 2,    // degree
		unit: '% от скорости разварота'
	};  // Радиус разворота

	this.armor = { index: 1000, min: 0, max: 1000, unit: 'МВт' };           // Генератор щитов
	this.carcass = { index: 500, min: 0, max: 500, unit: 'единиц' };        // Корпус
	this.hold = { index: 10, min: 0, max: 100, unit: 'единиц' };            // Размер грузового отсека
	this.energy = { index: 10000, min: 100, max: 10000, unit: 'МВт' };      // Размер грузового отсека

	/**
	 * Get speed line
	 *
	 * @param {number} [reduce] percent of reduce speed
	 * @returns {number}
	 */
	this.getSpeedDirect = function ( reduce ) {
		reduce = reduce === undefined ? 0 : reduce;
		var speed = this.speedDirect.index * ( 1 - reduce / 100 );
		return speed < this.speedDirect.min ? this.speedDirect.min : speed;
	};

	/**
	 * Get speed rotate
	 *
	 * @param {number} [reduce] percent of reduce speed
	 * @returns {number}
	 */
	this.getSpeedRotate = function ( reduce ) {
		reduce = reduce === undefined ? 0 : reduce;
		var speed = this.speedRotate.index * ( 1 - reduce / 100 );
		return speed < this.speedRotate.min ? this.speedRotate.min : speed;
	};

	/**
	 * Get turn radius
	 *
	 * @returns {number}
	 */
	this.getRadius = function () {
		return this.getSpeedRotate() / 100 * this.radius.index;
	};

	/**
	 * Get speed incline for current model
	 *
	 * @returns {number}
	 */
	this.getSpeedIncline = function () {
		return this.radius.speedIncline;
	};

	/**
	 * Get incline for current model
	 *
	 * @returns {number}
	 */
	this.getIncline = function () {
		return this.radius.incline;
	};

	/**
	 * Increase incline for current model
	 *
	 * @param {number} incline
	 * @returns {THREE.ModelData}
	 */
	this.increaseIncline = function ( incline ) {
		this.radius.incline += incline;
		return this;
	};

	/**
	 * Set incline for current model
	 *
	 * @param {number} incline
	 * @returns {THREE.ModelData}
	 */
	this.setIncline = function ( incline ) {
		this.radius.incline = incline;
		return this;
	};

	/**
	 * Get max incline model
	 *
	 * @returns {number}
	 */
	this.getMaxIncline = function () {
		return this.radius.maxIncline;
	};

	/**
	 * Set max incline model
	 *
	 * @param {number} incline
	 * @returns {THREE.ModelData}
	 */
	this.setMaxIncline = function ( incline ) {
		this.radius.maxIncline = incline;
		return this;
	};
};