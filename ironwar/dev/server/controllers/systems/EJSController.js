import ViewPathControls from '../../../js/view/ViewPathControls';

class EJSController {

    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        this._server = server;

        this.viewPaths = {};
        this.viewPaths[ViewPathControls.PATH_LOGIN] = 'components/authorization/login.ejs';
        this.viewPaths[ViewPathControls.PATH_REGISTRATION] = 'components/authorization/registration.ejs';
    }

    /**
     * Upload template and send it to client
     *
     * @param req
     * @param res
     * @param params
     */
    render(req, res, params) {
        let data = this._server.getPostData(true);
        this._server.responseView(this._getViewPath(data['name']), this._server.parseData(data['params']));
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
