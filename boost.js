(function () {
    'use strict';

    function LampaRealBoost() {
        this.init = function () {
            // 1. ПРИНУДИТЕЛЬНО МЕНЯЕМ НАСТРОЙКИ САМОЙ ЛАМПЫ
            // Это то же самое, что выключить всё вручную в меню, но надежнее
            Lampa.Storage.set('animation', 'false'); // Вырубаем системные анимации Lampa
            Lampa.Storage.set('background', 'false'); // Отключаем подгрузку фонов
            Lampa.Storage.set('background_type', 'solid'); // Ставим заливку цветом

            // 2. ВНЕДРЯЕМ АГРЕССИВНЫЙ CSS
            var style = document.createElement('style');
            style.textContent = `
                /* Убиваем все эффекты и плавность намертво */
                * {
                    box-shadow: none !important;
                    text-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    /* Отключение transition дает мгновенный отклик при нажатии на пульт */
                    transition: none !important; 
                    -webkit-transition: none !important;
                }

                /* Делаем фоны глухими черными, чтобы не рендерить слои */
                .full-start__bg, .blur, .app__bg {
                    background: #000 !important;
                    background-image: none !important;
                }

                /* Заставляем картинки рендериться быстрее в ущерб идеальному сглаживанию */
                img {
                    image-rendering: -webkit-optimize-contrast !important;
                }

                /* Форсируем использование аппаратного ускорения для карточек фильмов */
                .card, .items__item {
                    will-change: transform !important;
                    transform: translateZ(0) !important;
                }
            `;
            document.head.appendChild(style);

            // 3. УВЕДОМЛЕНИЕ ДЛЯ ТЕБЯ
            setTimeout(function() {
                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('⚡ Агрессивный Boost Активирован. Анимации отключены.');
                }
            }, 1500);
        };
    }

    // Правильный запуск после полной загрузки приложения
    if (window.appready) {
        new LampaRealBoost().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new LampaRealBoost().init();
        });
    }
})();
