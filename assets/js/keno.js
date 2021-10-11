import axios from 'axios';
import {
    isLine,
    isMobile,
    showLogin,
    showError
} from './global';

var gameWindow;

function checkWindow() {
    if (gameWindow && !gameWindow.closed) {
        gameWindow.close();
    }
    gameWindow = window.open('', "popup", "fullscreen");
    gameWindow.moveTo(0, 0);
    gameWindow.resizeTo(screen.width, screen.height);
    gameWindow.document.write('Loading...');
    return;
}

export default async function keno(slug) {
    if (!sessionStorage.getItem('token')) {
        showLogin('กรุณาเข้าสู่ระบบ');
    } else {

        if (!isLine()) {
            checkWindow();
        }

        let jsonData = JSON.parse(sessionStorage.getItem('data_agent'));
        let kenoItem = jsonData.lists.filter(item => item.productCode == slug)[0];
        let uri =  kenoItem.getLogin;

        kenoLogin(uri, kenoItem);

        async function kenoLogin(uri, kenoItem) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');

            if (isMobile()) {
                uri = uri + 'MB'
            } else {
                uri = uri + 'PC'
            }

            let resp = await axios.get(uri);
            if (isLine()) {
                if (resp.data.code == kenoItem.success) {
                    location.href = resp.data.url
                } else {
                    if (resp.data.code == 1005) {
                        showLogin(resp.data.message);
                    } else {
                        showError(resp.data.message);
                    }
                }
            } else {
                if (resp.data.code == kenoItem.success) {
                        gameWindow.location.href = resp.data.url
                } else {
                    if (resp.data.code == 1005) {
                        gameWindow.close();
                        showLogin(resp.data.message);
                    } else {
                        gameWindow.close();
                        showError(resp.data.message);
                    }
                }
            }
        }
    }
}

