var btn = document.getElementById('_send_form');
var validation = new IW.Validation('#form_reg');
validation.addEventCheckAll('click', btn);
validation.addEventCheckAll('keyup', 'input');

validation.addGroupMarker('span');

btn.addEventListener('click', function () {
    console.log(1);
});

validation.addRile('username', {
    required: true,
    max: 25,
    min: 6,
    label: 'Username'
});

validation.addRile('email', {
    required: true,
    max: 60,
    min: 5,
    label: 'Email'
});

validation.addRile('password', {
    required: true,
    max: 25,
    min: 6,
    isMatch: 'username',
    label: 'Password'
});

validation.addRile('confirm_password', {
    required: true,
    isMatch: 'username',
    isNotSame: 'password',
    label: 'Confirm Password'
});

validation.setCallbackSuccess(function (element) {
    if (element == btn) {
        //            document.getElementById('form_reg').submit();
    }
});

validation.messagesAppendTo('#reg_error');
validation.listen();
