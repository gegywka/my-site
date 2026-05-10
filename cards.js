(function () {
    'use strict';

    // 1. КЛАСС СТРАНИЦЫ (КОМПОНЕНТ)
    function AppleTVComponent(object) {
        var network = new Lampa.Reguest();
        var html = document.createElement('div');
        var cards = [];
        var activeIndex = 0;
        
        this.create = function () {
            html.className = 'appletv-page';
            
            var style = document.createElement('style');
            style.textContent = `
                .appletv-page { width: 100%; height: 100%; position: relative; background: #000; overflow: hidden; }
                .atv-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: top; opacity: 0.6; transition: background-image 0.4s ease-in-out; }
                .atv-gradient { position: absolute; bottom: 0; left: 0; width: 100%; height: 70%; background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%); }
                .atv-content { position: absolute; bottom: 60px; left: 60px; width: calc(100% - 120px); }
                .atv-title { color: #fff; font-size: 2.5em; font-weight: bold; margin-bottom: 25px; font-family: sans-serif; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
                .atv-carousel { display: flex; gap: 20px; transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
                .atv-card { width: 220px; height: 330px; background: #333; border-radius: 12px; transition: transform 0.2s ease, box-shadow 0.2s ease; border: 4px solid transparent; flex-shrink: 0; background-size: cover; background-position: center; }
                .atv-card.focus { transform: scale(1.1) translateY(-10px); border-color: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.8); z-index: 2; }
            `;
            html.appendChild(style);

            var bg = document.createElement('div');
            bg.className = 'atv-bg';
            bg.style.backgroundImage = "url('https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtecsozsPbHOZ.jpg')"; 
            
            var gradient = document.createElement('div');
            gradient.className = 'atv-gradient';

            var content = document.createElement('div');
            content.className = 'atv-content';
            
            var carouselHTML = '';
            for (let i = 0; i < 10; i++) {
                let posterUrl = 'https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg';
                carouselHTML += `<div class="atv-card" style="background-image: url('${posterUrl}')"></div>`;
            }

            content.innerHTML = `
                <div class="atv-title">В тренде</div>
                <div class="atv-carousel">
                    ${carouselHTML}
                </div>
            `;

            html.appendChild(bg);
            html.appendChild(gradient);
            html.appendChild(content);
        };

        this.start = function () {
            cards = html.querySelectorAll('.atv-card');
            var carousel = html.querySelector('.atv-carousel');

            var updateFocus = function() {
                cards.forEach(c => c.classList.remove('focus'));
                if (cards[activeIndex]) {
                    cards[activeIndex].classList.add('focus');
                    var offset = -(activeIndex * 240); 
                    carousel.style.transform = `translateX(${offset}px)`;
                }
            };

            updateFocus();

            Lampa.Controller.add('appletv_ctrl', {
                toggle: function () {},
                right: function () {
                    if (activeIndex < cards.length - 1) {
                        activeIndex++;
                        updateFocus();
                    }
                },
                left: function () {
                    if (activeIndex > 0) {
                        activeIndex--;
                        updateFocus();
                    } else {
                        Lampa.Controller.toggle('menu');
                    }
                },
                up: function () {},
                down: function () {},
                back: function () {
                    Lampa.Activity.backward();
                }
            });
            
            Lampa.Controller.toggle('appletv_ctrl');
        };

        this.pause = function () {};
        this.stop = function () {};
        this.render = function () { return html; };
        this.destroy = function () { network.clear(); html.remove(); };
    }

    // 2. ИНИЦИАЛИЗАЦИЯ И ИНЪЕКЦИЯ ПЛАГИНА (DOM ПОЛЛИНГ)
    function initAppleTVPlugin() {
        Lampa.Component.add('appletv_page', AppleTVComponent);

        // Запускаем таймер, который будет искать меню
        var injectTimer = setInterval(function() {
            // Ищем контейнер меню (обрабатываем разные сборки Лампы)
            var menuList = $('.menu .menu__list');
            if (menuList.length === 0) menuList = $('.menu .scroll__body');
            
            // Если меню найдено в DOM и нашей кнопки там еще нет
            if (menuList.length > 0 && !$('.appletv-menu-btn').length) {
                
                var menuItem = $(`
                    <li class="menu__item selector appletv-menu-btn">
                        <div class="menu__ico">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M21 3H3C1.89 3 1 3.89 1 5v14c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 16H3V5h18v14z"/>
                            </svg>
                        </div>
                        <div class="menu__text">Apple TV+</div>
                    </li>
                `);
                
                menuItem.on('hover:enter', function () {
                    Lampa.Activity.push({
                        url: '',
                        title: 'Apple TV+',
                        component: 'appletv_page',
                        page: 1
                    });
                });

                // Внедряем кнопку
                menuList.append(menuItem);
                
                // Убиваем таймер, задача выполнена
                clearInterval(injectTimer);
                
                // Рапортуем
                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('🍏 Apple TV+ раздел загружен');
                }
            }
        }, 500); // Проверка каждые 500мс

        // Fallback: убиваем таймер через 20 секунд, чтобы не забивать память, если что-то пошло не так
        setTimeout(function() { clearInterval(injectTimer); }, 20000);
    }

    // Точка входа
    if (window.appready) initAppleTVPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') initAppleTVPlugin();
        });
    }
})();
