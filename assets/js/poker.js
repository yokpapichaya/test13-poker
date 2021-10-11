import axios from 'axios';
import {
    isLine,
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

export function changeImg() {
    $(this).attr('src', gameData.themePath + '/images/not-found.png');
}

var pokerItem = [];
var allGameList = [];
pokerItem.push($('.slot-item').data('slug'));

const gameList = async function () {
    allGameList = [];
    let jsonData = JSON.parse(sessionStorage.getItem('data_agent'));
    let ambData = jsonData.lists.filter(item => item.type == 'poker')[0];
    let respAMB = await axios.get(ambData.getGame);

    $.each(pokerItem, function (index, value) {
        if (ambData.productCode == value) {
            allGameList.push({
                'active': ambData.active,
                'status': ambData.success,
                'method': ambData.method,
                'name': ambData.productName,
                'slug': ambData.productCode,
                'getLogin': ambData.getLogin,
                'lists': respAMB.data.data != undefined ? respAMB.data.data : ''
            });
        }
    });

    return allGameList;
}


export default async function poker(slug) {
    if (allGameList.length == 0) {
        await gameList();
    }

    $('.game-list').empty();

    getAllGame(slug);

    async function getAllGame(data) {

        var allGameSort = data == 'all' ? allGameList : allGameList.filter(item => item.slug == data);

        if (allGameSort.length > 0) {
        
            $.each(allGameSort, function (index, value) {
                var productName = value.name,
                    id = productName.toLowerCase().replace(' ', '-');

                if(data == 'all') {
                    var list = $(window).width() <= 576 ?  value.lists.slice(0, 4) : value.lists.slice(0, 3);
                }else {
                    var list = value.lists
                }

                if(data == 'all') {a
                    $.each(list, function (index, element) {
                        let img = element.imageUrl ? element.imageUrl : 'https://cdn.ambbet.com/' + element.imgUrl;
                            let name = element.gameName.en ? element.gameName.en : element.gameName;
                            let gameCode = element.gameCode ? element.gameCode : '';
                            let gameId = element.gameId ? element.gameId : '';
                            let vendor = element.productCode ? element.productCode : 'amb-poker';
                        $('#' + id).append(`<div class="col-6 col-md-4 game-item" data-code="${ gameCode }" data-id="${gameId}" data-vendor="${ vendor }">
                            <div class="box-card-promotion">
                                <div class="box-card-promotion__img"><img data-src="${img}" alt="${name}" src="${img}" class="lazyload"></div>
                                <div class="box-card-promotion__caption">
                                    ${name}
                                </div>
                            </div>
                        </div>`)
                    });
                }else {
                    $('.game-list').append(`<div class="row" id="${ id }"></div>`);
                    if (list.length > 0 && value.active) {
                        $.each(list, function (index, element) {
                            let img = element.imageUrl ? element.imageUrl : 'https://cdn.ambbet.com/' + element.imgUrl;
                            let name = element.gameName.en ? element.gameName.en : element.gameName;
                            let gameCode = element.gameCode ? element.gameCode : '';
                            let gameId = element.gameId ? element.gameId : '';
                            let vendor = element.productCode ? element.productCode : 'amb-poker';
                            $('#' + id).append(`<div class="col-6 col-md-3 col-lg-2 game-item" data-code="${ gameCode }" data-id="${gameId}" data-vendor="${ vendor }">
                                <div class="box-card-promotion">
                                    <div class="box-card-promotion__img"><img data-src="${img}" alt="${name}" src="${img}"  class="lazyload"></div>
                                    <div class="box-card-promotion__caption">
                                        ${name}
                                    </div>
                                </div>
                            </div>`)
                        });
                    }else {
                        swal({
                            title: "มีบางอย่างผิดพลาด",
                            text: "เกมปิดปรับปรุงชั่วคราว ขออภัยในความไม่สะดวก",
                            icon: "error",
                            timer: 1500,
                        }).then(function() {
                            location.href = window.location.origin;
                        });
                    }
                }
            });

            $('img').on('error', function () {
                $(this).attr('src', window.location.origin + '/wp-content/themes/landing/images/not-found.png');
            });

            $('.game-item').on('click', function () {
                checkGameLogin($(this).data('id'), $(this).data('code'), $(this).data('vendor'));
            });
        }
    }

    async function checkGameLogin(id, code, vendor) {

        let game;

        $.each(allGameList, function (index, value) {
            if (value.slug == vendor) {
                game = value
            }
        });


        if (!sessionStorage.getItem('token')) {
            showLogin('Please Login.');
        } else {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');

            if (!isLine()) {
                checkWindow();
            }

            var slug = game.slug,
                uri = game.getLogin,
                data, resp, respDataUrl;

            
            if(slug == 'amb-poker') {
                data = uri + `gameId=${id}`
            }else {
                slug == 'evoplay01' ? data = `${uri + id}&gameId=${code}&productCode=${slug}` : data = `${uri + id}&gameCode=${code}&productCode=${slug}`
            }
            resp = await axios.get(data);
            respDataUrl = resp.data.url ? resp.data.url : resp.data.Url

            if (isLine()) {
                if (resp.data.code == 0) {
                    location.href = respDataUrl;
                } else {
                    if (resp.data.code == 1005) {
                        showLogin(resp.data.message);
                    } else {
                        showError(resp.data.message);
                    }
                }
            } else {

                if (resp.data.code == 0) {
                    gameWindow.location.href = respDataUrl;
                } else {
                    gameWindow.close();
                    if (resp.data.code == 1005) {
                        showLogin(resp.data.message);
                    } else {
                        showError(resp.data.message);
                    }
                }
            }
        }
    }
}