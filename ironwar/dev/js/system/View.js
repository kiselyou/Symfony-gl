
import Application from './Application';

class View extends Application {
    /**
     *
     * @param {string} path It is path to template
     */
    constructor(path) {
        super();

        this._viewPath = path;
    }

    /**
     * It is path to controller EJS
     *
     * @returns {string}
     * @constructor
     */
    static get ROUTE_EJS() {
        return '/ejs';
    };

    upload() {
        this.ajax.post(View.ROUTE_EJS, {name: this._viewPath, params: {}})
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

export default View;
