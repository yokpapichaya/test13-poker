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

export default async function casino(slug) {
    if (!sessionStorage.getItem('token')) {
        showLogin('กรุณาเข้าสู่ระบบ');
    } else {

        if (!isLine()) {
            checkWindow();
        }

        let jsonData = JSON.parse(sessionStorage.getItem('data_agent'));
        let casinoItem = jsonData.lists.filter(item => item.productCode == slug)[0];
        let uri =  casinoItem.getLogin;

        casinoLogin(uri, casinoItem);

        async function casinoLogin(uri, casinoItem) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');

            if (isMobile()) {
                uri = uri + 'MB'
            } else {
                uri = uri + 'PC'
            }

            let resp = await axios.get(uri);

            if (isLine()) {
                if (resp.data.code == casinoItem.success) {
                    location.href = resp.data.url
                } else {
                    if (resp.data.code == 1005) {
                        showLogin(resp.data.message);
                    } else {
                        showError(resp.data.message);
                    }
                }
            } else {
                if (resp.data.code == casinoItem.success) {
                    if(casinoItem.productCode == 'betgames') {
                        gameWindow.location.href = `https://webiframe.betgames.tv/#/auth?apiUrl=${resp.data.server}&partnerCode=${resp.data.partnerCode}&partnerToken=${resp.data.token}&language=th&timezone=7`
                    }else {
                        gameWindow.location.href = resp.data.url
                    }
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