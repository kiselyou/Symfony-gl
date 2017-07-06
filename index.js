const Server = require('./server/core/Server');

try {
    let core = new Server();

    core
        .init()
        .initSocket();

} catch (e) {
    console.log(e);
}
