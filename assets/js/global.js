var gameWindow;
import axios from 'axios';
import swal from 'sweetalert';

export function checkWindow() {
    if (gameWindow && !gameWindow.closed) {
        gameWindow.close();
    }
    gameWindow = window.open('', "popup", "fullscreen");
    gameWindow.moveTo(0, 0);
    gameWindow.resizeTo(screen.width, screen.height);
    gameWindow.document.write('Loading...');
    return;
}

export function isLine() {
    return /Line/i.test(navigator.userAgent);
}

export function showLogin(message) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('redirect');
    swal({
        title: "กรุณาเข้าสู่ระบบ",
        text: message,
        icon: "error",
    }).then(function() {
        window.location.href = window.location.origin + '/login';
    });
};

export function showError(message) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('redirect');
    swal({
        title: "มีบางอย่างผิดพลาด",
        text: message,
        icon: "error",
    });
};

export function isMobile() {
    return /android|ip(hone|ad|od)/i.test(navigator.userAgent);
}


export const getJson = async function () {
    var agent = $('body').data('agent');
    var data = await axios.get(`https://cdn.ambbet.com/gamelists-${agent}.json`);

    return data;
}