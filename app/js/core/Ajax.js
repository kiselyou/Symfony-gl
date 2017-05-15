var IW = IW || {};

/**
 *
 * @constructor
 */
IW.Ajax = function () {

    var xhr = new XMLHttpRequest();

    /**
     *
     * @param {string} url
     * @param {?({}|[])} param
     * @param {function} success
     * @param {function} [error]
     * @returns {IW.Ajax}
     */
    this.post = function ( url, param, success, error ) {
        xhr.open(IW.Ajax.POST, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(this._prepareParams(param, IW.Ajax.POST));
        this._execute(success, error);
        return this;
    };

    /**
     *
     * @param {string} url
     * @param {?({}|[])} param
     * @param {function} success
     * @param {function} [error]
     * @returns {IW.Ajax}
     */
    this.get = function ( url, param, success, error ) {
        var getUrl = this._concatUrl(url, this._prepareParams(param, IW.Ajax.GET));
        xhr.open(IW.Ajax.GET, getUrl);
        xhr.send();
        this._execute(success, error);
        return this;
    };

    /**
     *
     * @param {function} success
     * @param {function} [error]
     * @returns {IW.Ajax}
     */
    this._execute = function ( success, error ) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                return;
            }

            if (xhr.status != 200) {
                if (error) {
                    error.call(this, xhr.status, xhr.statusText);
                }
            } else {
                success.call(this, xhr.responseText);
            }
        };
        return this;
    };

    /**
     *
     * @param {{}} param
     * @param {string} method
     * @returns {string}
     * @private
     */
    this._prepareParams = function ( param, method ) {
        var res = '';
        if (param) {
            switch (method) {
                case IW.Ajax.GET:
                    var arr = [];
                    for (var key in param) {
                        if (param.hasOwnProperty(key)) {
                            arr.push(key + '=' + param[key]);
                        }
                    }
                    res = arr.join('&');
                    break;
                case IW.Ajax.POST:
                    res = JSON.stringify(param);
                    break;
            }
        }
        return res;
    };

    /**
     * Concatenate url and string of parameters
     *
     * @param {string} url
     * @param {string} param
     * @returns {string}
     * @private
     */
    this._concatUrl = function ( url, param ) {
        if (param === '' || !param) {
            return url;
        }

        if ( url.indexOf( '?' ) > -1 ) {
            return url + param;
        } else {
            return url + '?' + param;
        }
    };
};

IW.Ajax.POST = 'POST';
IW.Ajax.GET = 'GET';
