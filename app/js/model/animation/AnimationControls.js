var IW = IW || {};

/**
 *
 * @param {IW.Model} model
 * @constructor
 */
IW.AnimationControls = function ( model ) {

    /**
     *
     * @type {IW.Model}
     */
    this.model = model;

    /**
     *
     * @type {(?|IW.Explorer)}
     */
    this.animation = null;

    /**
     *
     * @param {string} modelName
     * @returns {IW.AnimationControls}
     */
    this.startAnimation = function ( modelName ) {
        switch ( modelName ) {
            case IW.Prepare.MODEL_EXPLORER:
                this.animation = new IW.Explorer( this.model );
                this.animation.initParticles();
                break;
        }
        return this;
    };

    /**
     * Remove Effect
     *
     * @returns {IW.AnimationControls}
     */
    this.remove = function () {
        this.animation.remove();
        this.animation = null;
        return this;
    };

    /**
     * Update animation
     *
     * @returns {void}
     */
    this.update = function () {
        if ( this.animation ) {
            this.animation.update();
        }
    }
};