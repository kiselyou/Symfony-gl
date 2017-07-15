var btn = document.getElementById('_send_form');
var validation = new IW.Validation('#form_reg');
validation.addEventCheckAll('click', btn);
validation.addEventCheckAll('keyup', 'input');

validation.findParent('.iw_group');

btn.addEventListener('click', function () {
    // console.log(1);
});

validation.addRule('username', {
    required: true,
    max: 25,
    min: 4,
    label: 'Username'
});

validation.addRule('email', {
    required: true,
    max: 60,
    min: 5,
    label: 'Email'
});

validation.addRule('password', {
    required: true,
    max: 25,
    min: 4,
    isMatch: 'username',
    label: 'Password'
});

validation.addRule('confirm_password', {
    required: true,
    isMatch: 'username',
    isNotSame: 'password',
    label: 'Confirm Password'
});

validation.setCallbackSuccess(function (element) {
    if (element == btn) {
        var data = $('#form_reg').serializeArray();
        new IW.Ajax().post('/iw/registration', data, function (res) {
            var success = $('#reg_success');
            console.log(res);
            try {
                var data = JSON.parse(res);
                if (data.status) {
                    success.append('<li>' + data.msg + '</li>');
                } else {
                    $('#reg_error').append('<li>' + data.msg + '</li>');
                }
            } catch (e) {
                console.log(e);
                alert('We\'re sorry a server error occurred. Please Try again');
            }
        });
    }
});

validation.messagesAppendTo('#reg_error');
validation.listen();
