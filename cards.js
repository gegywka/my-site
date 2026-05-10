(function () {
    'use strict';

    // 1. КЛАСС СТРАНИЦЫ (КОМПОНЕНТ)
    function AppleTVComponent(object) {
        var network = new Lampa.Reguest();
        var html = document.createElement('div');
        var cards = [];
        var activeIndex = 0;

        // Наш тестовый каталог для проверки динамики
        var movies = [
            { title: "Бэтмен: Тёмный рыцарь", poster: "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg", bg: "https://image.tmdb.org/t/p/w1280/8rpDcsfLJypbO6vtecsozsPbHOZ.jpg" },
            { title: "Дюна: Часть вторая", poster: "https://image.tmdb.org/t/p/w300/1pdfLvkbY9ohJlCjQH2JGjjcRsV.jpg", bg: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg" },
            { title: "Оппенгеймер", poster: "https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", bg: "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg" },
            { title: "Интерстеллар", poster: "https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", bg: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjEVAZS4xPBwEXpjcG.jpg" },
            { title: "Безумный Макс", poster: "https://image.tmdb.org/t/p/w300/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg", bg: "https://image.tmdb.org/t/p/w1280/nlCHUWjY9XWcpK2K6T1RinOItuT.jpg" }
        ];

        this.create = function () {
            html.className = 'appletv-page';

            var style = document.createElement('style');
            style.textContent = `
                .appletv-page { width: 100%; height: 100%; position: relative; background: #000; overflow: hidden; }
                
                /* Анимируем прозрачность фона для плавного перехода */
                .atv-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center 20%; opacity: 0; transition: opacity 0.6s ease; }
                .atv-bg.show { opacity: 0.6; }
                
                .atv-gradient { position: absolute; bottom: 0; left: 0; width: 100%; height: 80%; background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 100%); }
                .atv-content { position: absolute; bottom: 60px; left: 60px; width: calc(100% - 120px); z-index: 10; }
                
                /* Стили для главного заголовка с анимацией */
                .atv-title-main { color: #fff; font-size: 3.5em; font-weight: 800; margin-bottom: 10px; font-family: sans-serif; text-shadow: 0 4px 20px rgba(0,0,0,0.8); opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; transform: translateY(10px); }
                .atv-title-main.show { opacity: 1; transform: translateY(0); }
                
                .atv-subtitle { color: #aaa; font-size: 1.2em; margin-bottom: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
                
                .atv-carousel { display: flex; gap: 20px; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
                .atv-card { width: 220px; height: 330px; background: #222; border-radius: 12px; transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; border: 4px solid transparent; flex-shrink: 0; background-size: cover; background-position: center; }
                .atv-card.focus { transform: scale(1.1) translateY(-15px); border-color: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.8); z-index: 2; }
            `;
            html.appendChild(style);

            var bg = document.createElement('div');
            bg.className = 'atv-bg show';

            var gradient = document.createElement('div');
            gradient.className = 'atv-gradient';

            var content = document.createElement('div');
            content.className = 'atv-content';

            // Генерируем карточки из нашего массива
            var carouselHTML = '';
            movies.forEach(function(movie) {
                carouselHTML += `<div class="atv-card" style="background-image: url('${movie.poster}')"></div>`;
            });

            content.innerHTML = `
                <div class="atv-subtitle">Популярное сейчас</div>
                <div class="atv-title-main show">${movies[0].title}</div>
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
            var bg = html.querySelector('.atv-bg');
            var mainTitle = html.querySelector('.atv-title-main');
            var bgTimeout;

            var updateFocus = function() {
                cards.forEach(c => c.classList.remove('focus'));
                if (cards[activeIndex]) {
                    cards[activeIndex].classList.add('focus');

                    // Смещаем карусель
                    var offset = -(activeIndex * 240);
                    carousel.style.transform = `translateX(${offset}px)`;

                    // Сбрасываем видимость текста и фона
                    mainTitle.classList.remove('show');
                    bg.classList.remove('show');
                    clearTimeout(bgTimeout);

                    // Плавно показываем новый заголовок
                    setTimeout(function() {
                        mainTitle.innerText = movies[activeIndex].title;
                        mainTitle.classList.add('show');
                    }, 200);

                    // Меняем фон с задержкой (защита от лагов при быстром скролле)
                    bgTimeout = setTimeout(function() {
                        bg.style.backgroundImage = "url('" + movies[activeIndex].bg + "')";
                        bg.classList.add('show');
                    }, 400); 
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

    // 2. ИНИЦИАЛИЗАЦИЯ И ИНЪЕКЦИЯ ПЛАГИНА
    function initAppleTVPlugin() {
        Lampa.Component.add('appletv_page', AppleTVComponent);

        var injectTimer = setInterval(function() {
            var menuList = $('.menu .menu__list');
            if (menuList.length === 0) menuList = $('.menu .scroll__body');

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

                menuList.append(menuItem);
                clearInterval(injectTimer);

                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('🍏 Apple TV+ раздел загружен');
                }
            }
        }, 500);

        setTimeout(function() { clearInterval(injectTimer); }, 20000);
    }

    if (window.appready) initAppleTVPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') initAppleTVPlugin();
        });
    }
})();
