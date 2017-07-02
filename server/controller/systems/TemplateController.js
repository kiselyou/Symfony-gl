
class TemplateController {

    constructor(config) {
        this.loader = config.view;
        this._config = config;
    }

    render(req, res, params) {

        let template = null;

        try {
            template = this.loader.prepareTemplate(params['route'], req.body['path']);
        } catch (error) {
            this.err.exception(error).alert('Cannot upload template', 'TemplateController', 'render');
            template = this.loader.prepareTemplateError();
        }

        res.writeHead(200, this._config.contentType(2));
        res.end(template, this._config.encoding, true);

    }
}

module.exports = TemplateController;
