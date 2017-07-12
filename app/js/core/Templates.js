var IW = IW || {};

/**
 * This object work with templates in path (/progress/..html)
 *
 * @constructor
 */
IW.Templates = function () {

    /**
     * It is path to controller of templates
     *
     * @type {string}
     */
    var CONTROLLER_PATH = '/template';

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
                CONTROLLER_PATH,
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
     * @param {number} [position] possible values 0 - append, 1 - before, 2 - after, 3 - paste like html instead
     * @returns {void}
     */
    this.paste = function (anchor, content, position) {
        switch (position) {
            case 1:
                $(anchor).before(content);
                break;
            case 2:
                $(anchor).after(content);
                break;
            case 3:
                $(anchor).html(content);
                break;
            default:
                $(anchor).append(content);
                break;
        }
    };
};

/**
 * Cache. The templates which was uploaded earlier
 *
 * @type {Array}
 */
IW.Templates.cacheTemplates = [];
