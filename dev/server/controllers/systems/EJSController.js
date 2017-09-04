import {
    VIEW_PATH_LOGIN,
    VIEW_PATH_REGISTRATION,
    VIEW_PATH_INFORMER_SUCCESS,
    VIEW_PATH_INFORMER_WARNING,
    VIEW_PATH_INFORMER_DANGER,
    VIEW_PATH_INFORMER_INFO,
    VIEW_PATH_MENU_GENERAL
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
        this.viewPaths[VIEW_PATH_MENU_GENERAL] = 'components/menu/general.ejs';
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
