
class EJSController {

    /**
     *
     * @param server
     */
    constructor(server) {
        this.server = server;
    }

    render(req, res, params) {
        let template = null;

        try {
            template = this.server.view.load(params['route'], req.body['path']);
        } catch (error) {
            this.err.exception(error).alert('Cannot upload template', 'EJSController', 'render');
            template = this.server.view.loadError();
        }

        res.writeHead(200, this.server.conf.contentType(2));
        res.end(template, this.server.conf.encoding, true);
    }

    ejs() {

        this.viewResponse('');
    }
}

export default EJSController;
