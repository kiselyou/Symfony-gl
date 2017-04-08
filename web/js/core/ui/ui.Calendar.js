
    var ui = {};

    (function(ui) {
        'use strict';

        /**
         * @memberOf ui
         * @namespace ui.Calendar
         * @constructor
         */
        ui.Calendar = function() {

            /** @const {string} */
            const FORMAT_DATE = 'dd/mm/yyyy';

            /** @const {string} */
            const FORMAT_TIME = 'hh:mm:ss';

            var param = {
                class: '.ui-calendar',
                icon: 'calendar',
                width: 200,
                data: {
                    date: true,
                    time: true,
                    event: 'click',
                    format: FORMAT_DATE + ' ' + FORMAT_TIME
                }
            };

            var scope = this;
            
            this.update = function () {
                var fields = document.body.querySelectorAll( param.class );
                if ( fields ) {
                    for (var i = 0; i < fields.length; i++) {
                        // get old field
                        var old_field = fields[i];
                        // get block new field
                        var blockField = getTempField();
                        // add to page new element
                        old_field.parentNode.insertBefore( blockField, old_field );
                        // get button of new element
                        var btn = blockField.querySelector('[data-calendar-btn]');
                        // move old element to new element
                        blockField.insertBefore( old_field, btn );
                        // hide old field
                        old_field.style.display = 'none';
                        // get new field
                        var user_field = blockField.querySelector('[data-calendar-field]');
                        // rewrite value to new field
                        user_field.value = old_field.value;

                        btn.addEventListener( 'click', onClick );
                    }
                }
            };
            
            function getTempField() {
                var element = document.createElement( 'div' );
                element.classList.add( 'input-group' );
                element.style.width = param.width + 'px';
                element.innerHTML += '<input type="text" class="form-control" data-calendar-field>';
                element.innerHTML += '<span class="btn btn-default input-group-addon" data-calendar-btn><i class="glyphicon glyphicon-' + param.icon + '"></i></span>';
                return element;
            }
            
            function onClick( e ) {
                // get parent element
                var parent = this.parentNode;
                // get old field
                var old_field = parent.querySelector( param.class );
                // get new field
                var user_field = parent.querySelector( '[data-calendar-field]' );
                // get button for open calendar
                // this
                console.log(old_field, user_field);
                console.log( splitDate( '', 'yyyy-mm-dd h:m:s' ) );
            }

            function onFocus() {

            }
            
            function convertFormat( date, format, to ) {
                var arrFormatFrom = format.split( ' ' );
                var arrFormatTo = to.split( ' ' );
            }
            
            function splitDate( date, format ) {

                var arrDate = date.replace(/[^-0-9]/g, '-').split('-');
                var fd = format.match(/^((y{4}|[dmy]{2})([^a-zA-Z0-9]+)(y{4}|[dmy]{2})([^a-zA-Z0-9]+)(y{4}|[dmy]{2})){0,1}[ ]{0,1}(([hms]{1,2})([^a-zA-Z0-9]+)([hms]{1,2})([^a-zA-Z0-9]+)([hms]{1,2})){0,1}$/);

                if( fd.length != 13 ) {
                    return false;
                }

                var res = {};

                var arrFormatDate = {};
                arrFormatDate[ fd[ 2 ].substring( 0, 1 ) ] = 1;
                arrFormatDate[ fd[ 4 ].substring( 0, 1 ) ] = 1;
                arrFormatDate[ fd[ 6 ].substring( 0, 1 ) ] = 1;

                if ( arrFormatDate.d && arrFormatDate.m && arrFormatDate.y ) {
                    res[ fd[ 2 ] ] = arrDate[ 0 ] == undefined || arrDate[ 0 ] == '' ? '00' : arrDate[ 0 ];
                    res[ fd[ 4 ] ] = arrDate[ 1 ] == undefined ? '00' : arrDate[ 1 ];
                    res[ fd[ 6 ] ] = arrDate[ 2 ] == undefined ? '00' : arrDate[ 2 ];
                }

                var arrFormatTime = {};
                arrFormatTime[ fd[ 8  ].substring( 0, 1 ) ] = 1;
                arrFormatTime[ fd[ 10 ].substring( 0, 1 ) ] = 1;
                arrFormatTime[ fd[ 12 ].substring( 0, 1 ) ] = 1;

                if ( arrFormatTime.h && arrFormatTime.m && arrFormatTime.s ) {
                    res[ fd[ 8  ] ] = arrDate[ 3 ] == undefined ? '00' : arrDate[ 3 ];
                    res[ fd[ 10 ] ] = arrDate[ 4 ] == undefined ? '00' : arrDate[ 4 ];
                    res[ fd[ 12 ] ] = arrDate[ 5 ] == undefined ? '00' : arrDate[ 5 ];
                }

                return Object.keys(res).length > 0 ? res : false;
            }

            function constructor() {
                scope.update();
            }

            constructor();
        }

    } (window.ui || {}));

    new ui.Calendar();