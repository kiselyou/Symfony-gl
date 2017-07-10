
$( document ).ready(function() {
    var home = $('#iw_home');
    var canvas = $('iw_canvas_play');
    var player = new IW.Player('iw_canvas_play');

    $('#iw_to_space').click(function () {
        home.fadeOut(500, function () {

            player
                .loadJson()
                .loadSkyBox()
                .loadSprites()
                .loadAllModels()
                .playsConfigOrbitControl()
                .startAjax('/socket/info/socket_play', function (multiLoader, ajaxData) {

                    player.socketConnect = ajaxData.config.socket;

                    player
                        .setConnect()
                        .init(player.updateModel);
                });

        });
    });
});
