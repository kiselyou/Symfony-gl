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

    this.paste = function (selector, str) {
        var to = document.querySelectorAll(selector);
        if (to) {
            var element = document.createElement('div');
            element.innerHTML = str;

            for (var a = 0; a < to.length; a++) {
                to[a].appendChild(element);
            }

            var scriptElements = element.querySelectorAll('script');
            for (var i = 0; i < scriptElements.length; i++) {
                this._evalScript(scriptElements[i]);
            }
        }
    };

    /**
     *
     * @param {Element|HTMLElement} element
     * @return {void}
     * @private
     */
    this._evalScript = function (element) {
        var data = (element.text || element.textContent || element.innerHTML || '' ),
            body = document.getElementsByTagName('body')[0] || document.documentElement,
            script = document.createElement('script');

        script.type = 'text/javascript';

        try {
            // doesn't work on ie...
            script.appendChild(document.createTextNode(data));
        } catch(e) {
            // IE has funky script nodes
            script.text = data;
        }

        body.appendChild(script);
        body.removeChild(script);
    };
};
