import swal from 'sweetalert';
import axios from 'axios';
import {
    getJson
} from './global';

$('.btn-check').addClass('no-logged');
// var user = JSON.parse(sessionStorage.getItem('user'));
if (sessionStorage.getItem("token")) {
    $('.btn-check').removeClass('no-logged');
    $('.btn.logout').addClass('no-logged');
    $('.title-login').addClass('no-logged');
}

var loginData = {
    "substring": $('#substring').val(),
    "prefix": $('#prefix').val(),
}

$('#substring').remove();
$('#prefix').remove();

export default async function login(jsonData) {
    let uri = jsonData.login;

    $('.btn-login').on('click', function (e) {
        e.preventDefault();

        let data = {
            "username": $(this).parents('form').find('input[name="username"]').val(),
            "password": $(this).parents('form').find('input[name="password"]').val()
        }

        if (data) {
            let substring = loginData.substring;
            let prefix = loginData.prefix;
            let checkUsername = data.username.substring(0, substring);

            if (checkUsername.toLowerCase() === prefix) {
                axios.post(uri, data).then(function (res) {
                    if (res.data.code === 0) {
                        sessionStorage.setItem("token", res.data.result.access_token);
                        sessionStorage.setItem('user', res.data.result.profile.username);
                        sessionStorage.setItem('redirect', btoa(data.password));
                        swal({
                            icon: 'success',
                            title: 'เข้าสู่ระบบสำเร็จ',
                            allowOutsideClick: false,
                            button: 'OK',
                            focusConfirm: false,
                            focusCancel: false,
                            timer: 1000,
                        }).then(function () {
                            window.location.href = window.location.origin;
                        });
                    } else if (res.data.code == 1001 || res.data.code == 1003 || res.data.code == 1002) {
                        swal({
                            icon: 'error',
                            title: 'รหัสผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง.',
                            allowOutsideClick: false,
                            button: 'OK',
                            focusConfirm: false,
                            focusCancel: false
                        }).then(function () {
                            $('input[name="username"]').val("");
                            $('input[name="password"]').val("");
                        });
                    } else if (res.data.code == 1006) {
                        swal({
                            icon: 'error',
                            title: 'รหัสผู้ใช้ ถูกระงับ',
                            allowOutsideClick: false,
                            button: 'OK',
                            focusConfirm: false,
                            focusCancel: false
                        }).then(function () {
                            $('input[name="username"]').val("");
                            $('input[name="password"]').val("");
                        });
                    } else if (res.data.code == 1007) {
                        swal({
                            icon: 'error',
                            title: 'เอเยนของท่านถูกระงับ',
                            allowOutsideClick: false,
                            button: 'OK',
                            focusConfirm: false,
                            focusCancel: false
                        }).then(function () {
                            $('input[name="username"]').val("");
                            $('input[name="password"]').val("");
                        });
                    } else if (res.data.code == 1008) {
                        swal({
                            icon: 'error',
                            title: 'รหัสผ่าน ถูกระงับ',
                            allowOutsideClick: false,
                            button: 'OK',
                            focusConfirm: false,
                            focusCancel: false
                        }).then(function () {
                            $('input[name="username"]').val("");
                            $('input[name="password"]').val("");
                        });
                    }

                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                swal({
                    icon: 'error',
                    title: 'รหัสผู้ใช้ไม่ถูกต้อง',
                    allowOutsideClick: false,
                    button: 'OK',
                    focusConfirm: false,
                    focusCancel: false
                }).then(result => {
                    $('input[name="username"]').val("");
                    $('input[name="password"]').val("");
                    if (result.value) {
                        return;
                    }
                });
            }
        } else {
            swal({
                icon: 'error',
                title: 'รหัสผู้ใช้ไม่ถูกต้อง',
                allowOutsideClick: false,
                button: 'OK',
                focusConfirm: false,
                focusCancel: false
            }).then(result => {
                $('input[name="username"]').val("");
                $('input[name="password"]').val("");
                if (result.value) {
                    return;
                }
            });
        }

    });

    if (sessionStorage.getItem("token")) {
        $('.check-btn[data-action="login"]').removeClass('show');
        $('.check-btn[data-action="logout"]').addClass('show');
    } else {
        $('.check-btn[data-action="login"]').addClass('show');
        $('.check-btn[data-action="logout"]').removeClass('show');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('redirect');
    }
}