
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import multer from 'multer';

import Conf from './Conf';


class Server {
    constructor() {
        this._app = express();

        this._cong = new Conf();

    }

    routeControls() {
        console.log(123123);
    }

    /**
     *
     * @returns {Server}
     */
    init() {


        this._app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}));
        this._app.use(bodyParser.urlencoded({extended: false}));
        this._app.use(bodyParser.json());
        this.routeControls();
        this._app.listen(this._cong.server.port, this._cong.server.host);
        return this;
    }
}

export default Server;
