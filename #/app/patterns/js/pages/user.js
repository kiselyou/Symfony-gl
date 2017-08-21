
var play = new IW.Player('iw_canvas_preview');

play
    .prod(false)
    .loadSkyBox()
    .loadModel(IW.Prepare.MODEL_EXPLORER, IW.Prepare.CATEGORY_SHIPS)
    .previewConfigOrbitControl()
    .start(function (multiLoader, ajaxData) {
        play
            .initModelPreview()
            .init();
    });
