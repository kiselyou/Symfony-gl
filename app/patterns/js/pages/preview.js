var preview = false;
document.getElementById('iw_show_preview').addEventListener('click', function () {
    if (!preview) {
        preview = true;
        this.classList.add('iw_hidden');
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
    }
});
