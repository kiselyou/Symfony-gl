var username = 'username';
var password = 'password';
var btn = document.getElementById('_send_form');

var validation = new IW.Validation('#form_login');
validation.addEventCheckAll('click', btn);
validation.addEventCheckAll('keyup', 'input');
validation.findParent('.iw_group');

validation.addRile(username, {
    required: true,
    max: 25,
    min: 6,
    label: 'Username'
});

validation.addRile(password, {
    required: true,
    max: 25,
    min: 6,
    isSame: username,
    label: 'Password'
});

validation.setCallbackSuccess(function (element) {
    if (element == btn) {
        //            document.getElementById('form_login').submit();
    }
});

validation.messagesAppendTo('#login_error');
validation.listen();

var elementsAction = document.querySelectorAll('[data-iw-action]');
for (var i = 0; i < elementsAction.length; i++) {
    elementsAction[i].addEventListener('click', function () {
        switch (this.getAttribute('data-iw-action')) {
            case 'switch':
                var elementsHide = document.querySelectorAll(this.getAttribute('data-iw-hide'));
                var elementsShow = document.querySelectorAll(this.getAttribute('data-iw-show'));
                var a;
                for (a = 0; a < elementsHide.length; a++) {
                    elementsHide[a].classList.add('iw_hidden');
                }
                for (a = 0; a < elementsShow.length; a++) {
                    elementsShow[a].classList.remove('iw_hidden');
                }
                break;
        }
    });
}
