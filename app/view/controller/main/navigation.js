var speedAnimation = 500;
var navigation = $('#iw_block_navigation');
var preview = true;

$('#iw_show_preview').click( function () {

    if (preview) {
        preview = false;
        var btn = $(this);
        btn.hide( speedAnimation, function () {
            btn.remove();

            var play = new IW.Player('iw_canvas_preview');
            play
                .prod(false)
                .loadSkyBox()
                .loadSprites()
                .loadModel(IW.Prepare.MODEL_EXPLORER, IW.Prepare.CATEGORY_SHIPS)
                .previewConfigOrbitControl()
                .start(function (multiLoader, ajaxData) {
                    play
                        .initModelPreview()
                        .init();
                });
        } );
    }
});

$('#iw_show_sign_in').click( function () {
    navigation.hide( speedAnimation, function () {
        templateControls('/templates/auth/login.html');
    } );
});

$('#iw_show_registration').click( function () {
    navigation.hide( speedAnimation, function () {
        templateControls('/templates/auth/registration.html');
    } );
});

function templateControls(path) {
    var tpl = new IW.Templates();
    tpl.load(path, function ( str ) {
        var template = $(str);
        tpl.paste(navigation, template, 2);
        template.hide().show(speedAnimation);

        template.on('click', '[data-iw-action="iw-modal-close"]', function () {
            $(this).closest('.iw_modal').hide(speedAnimation, function () {
                navigation.show(speedAnimation);
                $(template).remove();
            });
        });

        template.on('click', '[data-iw-action="iw-show-login"]', function () {
            $(this).closest('.iw_modal').hide(speedAnimation, function () {
                $(template).remove();
                templateControls('/templates/auth/login.html');
            });
        });

        template.on('click', '[data-iw-action="iw-show-registration"]', function () {
            $(this).closest('.iw_modal').hide(speedAnimation, function () {
                $(template).remove();
                templateControls('/templates/auth/registration.html');
            });
        });
    } );
}
