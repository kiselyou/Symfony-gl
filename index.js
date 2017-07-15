const Server = require('./server/core/Server');

try {
    let core = new Server();

    core.init();

} catch (e) {
    console.log(e);
}
