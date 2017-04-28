var IW = IW || {};

/**
 *
 * @param {IW.Model} model
 * @param {Camera} camera
 * @param {Element} [container]
 * @constructor
 */
IW.LabelControls = function ( model, camera, container ) {

    IW.Labels.call( this, camera, container );

    /**
     *
     * @type {IW.Model}
     */
    this.model = model;

    /**
     * This method append labels to scene
     *
     * @returns {IW.LabelControls}
     */
    this.init = function () {

        this.append( IW.Labels.TPL_AIM, '' );
        this.append( IW.Labels.TPL_SPEED, this.model.getCurrentSpeed(), this.model.getPosition(), IW.Labels.POSITION_RT );
        return this;
    };

    /**
     * Update labels
     *
     * @returns {void}
     */
    this.update = function () {

        this.updateLabel( IW.Labels.TPL_SPEED, 'Speed: ' + this.model.getCurrentSpeed() );
        this.updatePosition( IW.Labels.TPL_SPEED, this.model.getPosition(), IW.Labels.POSITION_RT );
        this.updatePosition( IW.Labels.TPL_AIM, this.model.getPositionTo(), IW.Labels.POSITION_C );
    }
};