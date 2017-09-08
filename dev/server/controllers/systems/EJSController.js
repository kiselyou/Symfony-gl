
import {viewPath} from '../../../js/ini/ejs-ini';

class EJSController {

    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        this._server = server;
        this.viewPaths = viewPath;
    }

    /**
     * Render template. Send completed template to client
     *
     * @returns {void}
     */
    render() {
        let data = this._server.POST;
        this._server.responseView(this._getViewPath(data['name']), this._server.parseData(data['options']));
    }

    /**
     * Upload template. Send EJS template to client
     *
     * @returns {string}
     */
    template() {
        let data = this._server.POST;
        let path = this._getViewPath(data['name']);
        let tmp = this._server.fileLoader.getTemplate(path);
        this._server.responseJSON({ejs: tmp});
    }

    /**
     * Get path of template
     *
     * @param {string} name It is name of template
     * @returns {string}
     * @private
     */
    _getViewPath(name) {
        return this.viewPaths.hasOwnProperty(name) ? this.viewPaths[name] : '';
    }
}

export default EJSController;
