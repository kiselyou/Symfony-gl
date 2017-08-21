import {
    VIEW_PATH_LOGIN,
    VIEW_PATH_REGISTRATION,
    VIEW_PATH_INFORMER_SUCCESS,
    VIEW_PATH_INFORMER_WARNING,
    VIEW_PATH_INFORMER_DANGER,
    VIEW_PATH_INFORMER_INFO
} from '../../../js/view/view-path';

class EJSController {

    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        this._server = server;
        this.viewPaths = {};
        this.viewPaths[VIEW_PATH_LOGIN] = 'components/authorization/login.ejs';
        this.viewPaths[VIEW_PATH_REGISTRATION] = 'components/authorization/registration.ejs';
        this.viewPaths[VIEW_PATH_INFORMER_SUCCESS] = 'components/informer/success.ejs';
        this.viewPaths[VIEW_PATH_INFORMER_WARNING] = 'components/informer/warning.ejs';
        this.viewPaths[VIEW_PATH_INFORMER_DANGER] = 'components/informer/danger.ejs';
        this.viewPaths[VIEW_PATH_INFORMER_INFO] = 'components/informer/info.ejs';
    }

    /**
     * Upload template and send it to client
     *
     * @returns {void}
     */
    render(s) {
        let data = this._server.POST;
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
