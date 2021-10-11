import $ from 'jquery';
import Swiper from 'swiper/js/swiper';
import axios from 'axios';
import 'bootstrap/js/dist/tab';
import swal from 'sweetalert';
import casino from './casino';
import keno from './keno';
import trading from './trading';
import slot from './slot';
import login from './login';
import Odometer from 'odometer';
import {
    getJson
} from './global';

$('.btn-check').addClass('no-logged');
// var user = JSON.parse(sessionStorage.getItem('user'));
if (sessionStorage.getItem("token")) {
    $('.btn-check').removeClass('no-logged');
    $('.logout').addClass('no-logged');
    $('.p-wallet').addClass('no-logged');
}

(function ($) {
    // Use this variable to set up the common and page specific functions. If you
    // rename this variable, you will also need to rename the namespace below.
    var Sage = {
        // All pages
        'common': {
            init: function () {

            },
            finalize: async function () {
                AOS.init();

                if (sessionStorage.getItem('data_agent')) {
                    listData = JSON.parse(sessionStorage.getItem('data_agent'));
                } else {
                    var listData = await getJson();
                    var item = listData.data;
                    listData = item;
                    sessionStorage.setItem('data_agent', JSON.stringify(item));
                }

                login(listData);

                var isMobile = false;
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
                    isMobile = true;
                }

                if(listData.lists.length > 0) {
                    let casinoData =  listData.lists.filter(item => item.type == 'casino');
                    let casinoHot = casinoData.filter(item => item.recommended == true);
                    let slotData =  listData.lists.filter(item => item.type == 'slot' || item.type == 'poker');
                    let slotHot = slotData.filter(item => item.recommended == true);
                    if(casinoHot.length > 0) {
                        $.each(casinoHot, function(idnex, el) {
                            $(`.box-games[data-slug=${el.productCode}]`).find('.box-gamesmain').append(`<div class="hot box-gamesmain__hot"><span>HOT</span></div>`);
                        });
                    }

                    if(slotHot.length > 0) {
                        $.each(slotHot, function(idnex, el) {
                            $(`.box-games[data-slug=${el.productCode}]`).find('.box-gamesmain').append(`<div class="hot box-gamesmain__hot"><span>HIT</span></div>`);
                        });
                    }

                    let logo = [];
                    
                    if($('body').data('casino') == 1) {
                        $.each(listData.lists, function(index, el) {
                            if(el.type == 'casino') {
                                logo.push(el)
                            }
                        })
                    }

                    if($('body').data('amb-poker') == 1) {
                        $.each(listData.lists, function(index, el) {
                            if(el.type == 'poker') {
                                logo.push(el)
                            }
                        })
                    }

                    if($('body').data('slot') == 1) {
                        $.each(listData.lists, function(index, el) {
                            if(el.type == 'slot') {
                                logo.push(el)
                            }
                        })
                    }
                    
                    if(logo.length > 0) {
                        $.each(logo, function(index, el) {
                            if(el.productCode == 'askmebet') {
                                $('.vendor').prepend(`<img src="${el.logo}" alt="${el.productName} logo">`)
                            }else {
                                $('.vendor').append(`<img src="${el.logo}" alt="${el.productName} logo">`)
                            }
                        });
                    }

                    $('.sport-item').on("click", async function (e) {
                        e.preventDefault();
                        console.log(listData.m_redirect)
                        var state = $(this).data('state');
                        var hash = $('body').data('hash');
                        if (!sessionStorage.getItem('token')) {
                            swal({
                                title: "กรุณาเข้าสู่ระบบ",
                                text: "Please Login.",
                                icon: "error",
                                timer: 1000
                            }).then(function () {
                                location.href = window.location.origin + '/login';
                            });
                        } else {
                            if (isMobile) {
                                window.location.href = `${listData.m_redirect}?username=${sessionStorage.getItem('user')}&password=${atob(sessionStorage.getItem('redirect'))}&hash=${hash}&url=${window.location.origin}&state=${state}`
                            } else {
                                window.location.href = `${listData.d_redirect}?username=${sessionStorage.getItem('user')}&password=${atob(sessionStorage.getItem('redirect'))}&hash=${hash}&url=${window.location.origin}&state=${state}`
                            }
                            sessionStorage.clear();
                        }
                    });
                }

                $('.casino-item').on('click', function () {
                    if (!sessionStorage.getItem('token')) {
                        swal({
                            title: "กรุณาเข้าสู่ระบบ",
                            text: "Please Login.",
                            icon: "error",
                        }).then(function () {
                            window.location.href = window.location.origin + '/login';
                        });
                        return;
                    } else {
                        casino($(this).data('slug'));
                    }
                });

                // sticky menu
                window.onscroll = function () {
                    myFunction()
                };
                var header = document.getElementById("myHeader");
                var sticky = header.offsetTop;

                function myFunction() {
                    if (window.pageYOffset > sticky) {
                        header.classList.add("sticky");
                    } else {
                        header.classList.remove("sticky");
                    }
                }

                //banner swiper
                var mySwiper = new Swiper('#h-banner', {
                    slidesPerView: 1,
                    autoplay: {
                        delay: 5000,
                    },
                    navigation: {
                        nextEl: '.banner-next',
                        prevEl: '.banner-prev',
                    },
                });


                 //sec-brand swiper
                 var mySwiper = new Swiper('#h-brand', {
                    slidesPerView: 6,
                    spaceBetween: 30,
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        draggable: true,
                      },
                    breakpoints: {
                        // when window width is >= 320px
                        320: {
                          slidesPerView: 3,
                        //   spaceBetween: 20
                        },
                        // when window width is >= 480px
                        480: {
                          slidesPerView: 3,
                          spaceBetween: 30
                        },
                        // when window width is >= 640px
                        640: {
                          slidesPerView: 4,
                          spaceBetween: 40
                        },
                        1024: {
                            slidesPerView: 6,
                            spaceBetween: 40
                          }
                      }
                });

                //open submenu desktop
                $('.menu-list__item').mouseover(function () {
                    $(this).find('.sub-menu').addClass('show');
                }).mouseleave(function () {
                    $(this).find('.sub-menu').removeClass('show');
                });

                // menu hamburger
                $('.menu-hamburger').on('click', function () {
                    $('.menu-hamburger__line').toggleClass('active');
                    $('.mobile-menu').toggleClass('open');
                    $('.mobile-menu .nav').toggleClass('open');
                });

                //menu mobile lock a link when it has child
                $('.has-child').on('click', function () {
                    $('.sub-menu').toggleClass('open');
                });


                $('.list-menu a').each(function (index) {
                    var thismenuItem = $(this);

                    thismenuItem.click(function () {
                        $('.menuitem-wrapper').eq(index).addClass('spin');
                        var timer = setTimeout(function () {
                            $('.menuitem-wrapper').eq(index).removeClass('spin');
                            $('.list-menu').removeClass('open');
                            $('.menu-btn').removeClass('click');
                        }, 800);
                    });
                });

                var wallet = new Swiper('#wallet-update', {
                    slidesPerView: 5,
                    direction: 'vertical',
                    centeredSlides: true,
                    loop: true,
                    // loopedSlides: 4,
                    loopAdditionalSlides: 0,
                    speed: 1000,
                    autoplay: {
                        delay: 2000,
                        disableOnInteraction: false,
                    },
                });
            }
        },
        'home': {
            init: function () {
                var num = parseFloat($('#number').val());
                var el = document.querySelector('.odometer');

                var od = new Odometer({
                    el: el,
                    value: num,
                    format: '(,ddd).dd',
                    theme: 'default',
                    durations: 8000
                });

                var count = 1.42;
                el.innerHTML = num + count

                setInterval(() => {
                    count = count + 1.42;
                    el.innerHTML = num + count
                }, 2000);
            },
            finalize: function () {
                //logo slide swiper
                var mySwiper = new Swiper('#sport-banner', {
                    slidesPerView: 1,
                    autoplay: {
                        delay: 5000,
                    },
                    navigation: {
                        nextEl: '.sport-next',
                        prevEl: '.sport-prev',
                    },
                });

                $('.casino-game').on('click', function () {
                    if (!sessionStorage.getItem('token')) {
                        swal({
                            title: "กรุณาเข้าสู่ระบบ",
                            text: "Please Login.",
                            icon: "error",
                        }).then(function () {
                            window.location.href = window.location.origin + '/login';
                        });
                        return;
                    } else {
                        casino($(this).data('slug'));
                    }
                });

                $('.keno').on('click', function () {
                    if (!sessionStorage.getItem('token')) {
                        swal({
                            title: "กรุณาเข้าสู่ระบบ",
                            text: "Please Login.",
                            icon: "error",
                        }).then(function () {
                            window.location.href = window.location.origin + '/login';
                        });
                        return;
                    } else {
                        keno($(this).data('slug'));
                    }
                });

                $('.trading').on('click', function () {
                    if (!sessionStorage.getItem('token')) {
                        swal({
                            title: "กรุณาเข้าสู่ระบบ",
                            text: "Please Login.",
                            icon: "error",
                        }).then(function () {
                            window.location.href = window.location.origin + '/login';
                        });
                        return;
                    } else {
                        trading($(this).data('slug'));
                    }
                });
                
            }
        },
        'slot': {
            init: function () {

            },
            finalize: function () {
                slot($('.slot-item').data('slug'));
            }
        },
        'page_template_page_wallet': {
            init: function () {},
            finalize: async function () {
                let listData = JSON.parse(sessionStorage.getItem('data_agent'));

                if (!sessionStorage.getItem('token')) {
                    swal({
                        title: "กรุณาเข้าสู่ระบบ",
                        text: "Please Login.",
                        icon: "error",
                    }).then(function () {
                        location.href = window.location.origin + '/login';
                    });
                    return;
                } else {
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
                    let uri = listData.wallet;
                    axios.get(uri).then(function (res) {
                        if (res.data.code == 0) {
                            $('.h_iframe').attr('src', res.data.result);
                        } else {
                            swal({
                                title: "กรุณาเข้าสู่ระบบ",
                                text: "Please Login.",
                                icon: "error",
                                timer: 1000
                            }).then(function () {
                                sessionStorage.clear();
                                location.href = window.location.origin + '/login';
                            });
                            return;
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
        },
        'page_template_page_login': {
            init: function () {},
            finalize: function () {
                if (sessionStorage.getItem('token')) {
                    window.location.href = window.location.origin;
                }
            }
        },
        'page_template_page_register': {
            init: function () {

            },
            finalize: function () {
                if (sessionStorage.getItem('token')) {
                    window.location.href = window.location.origin;
                }
            }
        }
    };

    // The routing fires all common scripts, followed by the page specific scripts.
    // Add additional events for more control over timing e.g. a finalize event
    var UTIL = {
        fire: function (func, funcname, args) {
            var fire;
            var namespace = Sage;
            funcname = (funcname === undefined) ? 'init' : funcname;
            fire = func !== '';
            fire = fire && namespace[func];
            fire = fire && typeof namespace[func][funcname] === 'function';

            if (fire) {
                namespace[func][funcname](args);
            }
        },
        loadEvents: function () {
            // Fire common init JS
            UTIL.fire('common');
            // Fire page-specific init JS, and then finalize JS
            $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function (i, classnm) {
                UTIL.fire(classnm);
                UTIL.fire(classnm, 'finalize');
            });

            // Fire common finalize JS
            UTIL.fire('common', 'finalize');
            //$(#sh);  
        }
    };

    // Load Events
    $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.