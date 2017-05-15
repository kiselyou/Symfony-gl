var IW = IW || {};

/**
 *
 * @augments IW.Ajax
 * @constructor
 */
IW.Templates = function () {

    // Parent constructor
    IW.Ajax.call( this );

    var PATH_TO_LOAD = '/template';

    this._loaded = [];

    /**
     *
     * @type {IW.Templates}
     */
    var scope = this;

    /**
     * Load template
     *
     * @param {string} name it is path of template
     * @param {function} event
     * @returns {IW.Templates}
     */
    this.load = function (name, event) {
        var tpl = this._loaded.find(function (item) {
            return item['name'] === name;
        });
        if (tpl) {
            event.call( this, tpl.tpl );
        } else {
            this.post(
                PATH_TO_LOAD,
                { template: name },
                function ( template ) {
                    scope._loaded.push({ name: name, tpl: template });
                    event.call( this, template );
                },
                function () {

                    console.warn('Error');
                }
            );
        }
        return this;
    };
};
