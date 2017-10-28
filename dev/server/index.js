// let Server = require('./core/Server');
// let s = new Server();
// s.init();

import Server from './core/Server';
import Conf from './core/Conf';

switch (process.argv[2]) {
    case 'dev':
        new Server(Conf.ENV_DEV).init();
        break;
    default:
        new Server(Conf.ENV_PROD).init();
        break;
}
