var play = new IW.Player('iw_play_container');

play
    .loadJson()
    .loadSkyBox()
    .loadSprites()
    .loadAllModels()
    .playsConfigOrbitControl()
    .start(function (multiLoader, ajaxData) {
        play
            .setConnect()
            .init( play.updateModel );
    });
