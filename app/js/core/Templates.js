var IW = IW || {};

/**
 * This object work with templates in path (/progress/..html)
 *
 * @constructor
 */
IW.Templates = function () {

    /**
     * It is path directory of templates
     *
     * @type {string}
     */
    var PATH_TO_LOAD = '/template';

    /**
     *
     * @type {IW.Templates}
     */
    var scope = this;

    /**
     * Load template
     *
     * @param {string} path it is path of template
     * @param {function} event
     * @returns {IW.Templates}
     */
    this.load = function (path, event) {
        var tpl = IW.Templates.cacheTemplates.find(function (item) {
            return item['path'] === path;
        });

        if (tpl) {

            event.call( this, tpl.tpl );

        } else {

            new IW.Ajax().post(
                PATH_TO_LOAD,
                { path: path },
                function ( template ) {
                    IW.Templates.cacheTemplates.push({ path: path, tpl: template });
                    event.call( this, template );

                },
                function () {

                    console.warn('Error');
                }
            );
        }
        return this;
    };

    /**
     *
     * @param {(string|jQuery|HTMLElement)} anchor
     * @param {(string|jQuery|HTMLElement)} content
     * @param {number} [position] possible values 0 - append, 1 - before, 2 - after
     * @returns {void}
     */
    this.paste = function (anchor, content, position) {
        // console.log($(html).html());
        switch (position) {
            case 1:
                $(anchor).before(content);
                break;
            case 2:
                $(anchor).after(content);
                break;
            default:
                $(anchor).append(content);
                break;
        }

        // var to = document.querySelectorAll(selector);
        // if (to) {
        //     var el = document.createElement('div');
        //     el.innerHTML = str;
        //
        //     for (var b = 0; b < to.length; b++) {
        //
        //         for (var e = 0; e < el.childNodes.length; e++) {
        //             if (!before) {
        //                 to[b].appendChild(el.childNodes[e]);
        //             } else {
        //                 to[b].insertBefore(el.childNodes[e], to[b].childNodes[0]);
        //             }
        //         }
        //     }
        //
        //     var script = el.querySelectorAll('script');
        //     for (var i = 0; i < script.length; i++) {
        //         this._evalScript(script[i]);
        //         script[i].remove();
        //     }
        // }
    };

    // /**
    //  *
    //  * @param {Element|HTMLElement} el
    //  * @return {void}
    //  * @private
    //  */
    // this._evalScript = function (el) {
    //     var data = (el.text || el.textContent || el.innerHTML || '' ),
    //         body = document.getElementsByTagName('body')[0] || document.documentElement,
    //         script = document.createElement('script');
    //
    //     script.type = 'text/javascript';
    //
    //     try {
    //         // doesn't work on ie...
    //         script.appendChild(document.createTextNode(data));
    //     } catch(e) {
    //         // IE has funky script nodes
    //         script.text = data;
    //     }
    //
    //     body.appendChild(script);
    //     body.removeChild(script);
    // };
};

/**
 * Cache. The templates which was uploaded earlier
 *
 * @type {Array}
 */
IW.Templates.cacheTemplates = [];
