const Server = require('./server/core/Server');
let core = new Server();

core
    .init()
    .initSocket();
