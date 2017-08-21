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
     * @returns {void}
     */
    this.post = function ( url, param, success, error ) {
        xhr.open(IW.Ajax.POST, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(this._prepareParams(param, IW.Ajax.POST));
        this._execute( xhr, success, error );
    };

    /**
     *
     * @param {string} url
     * @param {?({}|[])} param
     * @param {function} success
     * @param {function} [error]
     * @returns {void}
     */
    this.get = function ( url, param, success, error ) {
        var getUrl = this._concatUrl(url, this._prepareParams(param, IW.Ajax.GET));
        xhr.open(IW.Ajax.GET, getUrl);
        xhr.send();
        this._execute( xhr, success, error );
    };

    /**
     *
     * @param {XMLHttpRequest} http
     * @param {function} success
     * @param {function} [error]
     * @returns {IW.Ajax}
     */
    this._execute = function ( http, success, error ) {
        http.onreadystatechange = function() {
            if (http.readyState != 4) {
                return;
            }

            if (http.status != 200) {
                if (error) {
                    error.call(this, http.status, http.statusText);
                }
            } else {
                success.call(this, http.responseText);
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
