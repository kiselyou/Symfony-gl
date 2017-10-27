
import {VIEW_PATH} from '../../../js/ini/ejs.ini';

class EJSController {

    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        this._server = server;
    }

    /**
     * Render template. Send completed template to client
     *
     * @param {ServerHttp} http
     * @returns {void}
     */
    render(http) {
	    http.responseView(
		    EJSController._getViewPath(http.POST['name']),
            http.parseData(http.POST['options'])
        );
    }

    /**
     * Upload template. Send EJS template to client
     *
     * @param {ServerHttp} http
     * @returns {string}
     */
    template(http) {
        let path = EJSController._getViewPath(http.POST['name']);
	    http.POST.responseJSON({
            ejs: this._server.fileLoader.getTemplate(path)
	    });
    }

    /**
     * Get path of template
     *
     * @param {string} name It is name of template
     * @returns {string}
     * @private
     */
    static _getViewPath(name) {
        return VIEW_PATH.hasOwnProperty(name) ? VIEW_PATH[name] : '';
	}
}

export default EJSController;
