$( document ).ready(function() {

    var speedAnimation = 500;
    var navigation = $('#iw_block_navigation');
    var preview = true;

    $('#iw_show_preview').click(function () {

        if (preview) {
            preview = false;
            var btn = $(this);
            btn.hide(speedAnimation, function () {
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
            });
        }
    });

    var btnSignIn = $('#iw_show_sign_in');
    var btnRegistration = $('#iw_show_registration');
    var btnLogout = $('#iw_show_logout');
    var btnHome = $('#iw_show_home');

    new IW.Ajax().post('/iw/authenticated', {}, function (res) {

        try {
            var data = JSON.parse(res);
            buttonsControl(data.user, 0);

        } catch (e) {
            console.log(e);
            alert('We\'re sorry a server error occurred.');
        }
    });

    btnLogout.click(function () {
        new IW.Ajax().post('/iw/logout', {}, function (res) {
            try {
                var data = JSON.parse(res);
                buttonsControl(data.user, 500);

            } catch (e) {
                console.log(e);
                alert('We\'re sorry a server error occurred.');
            }
        });
    });

    btnSignIn.click(function () {
        navigation.hide(speedAnimation, function () {
            templateControls('/templates/auth/login.html');
        });
    });

    btnRegistration.click(function () {
        navigation.hide(speedAnimation, function () {
            templateControls('/templates/auth/registration.html');
        });
    });
    
    function buttonsControl(isLogged, time) {
        time = time ? time : 0;
        if (!isLogged) {
            btnSignIn.show(time);
            btnRegistration.show(time);
            btnLogout.hide(time);
            btnHome.hide(time);
        } else {
            btnSignIn.hide(time);
            btnRegistration.hide(time);
            btnLogout.show(time);
            btnHome.show(time);
        }

        navigation.show(500);
    }

    function templateControls(path) {
        var tpl = new IW.Templates();
        tpl.load(path, function (str) {
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
        });
    }
});
