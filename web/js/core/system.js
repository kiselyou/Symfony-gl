$( document ).ready(function() {

    $('.element-tooltip').tooltip();
    $('.element-popover').popover();

    $('tr[data-go-to]').each(function () {
        $( this ).dblclick(function() {
            window.location.href = $( this ).attr('data-go-to');
        })
    });

    setTimeout(function () {
        $('.load-container').css('opacity', 1);
    }, 100);
});