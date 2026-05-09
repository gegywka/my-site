(function () {
    'use strict';

    function LampaOptimizer() {
        this.init = function () {
            // Добавляем стили для ускорения
            const style = document.createElement('style');
            style.textContent = `
                /* Форсируем аппаратное ускорение */
                .card, .items__item, .full-start__bg {
                    will-change: transform !important;
                    transform: translateZ(0) !important;
                    -webkit-transform: translateZ(0) !important;
                }

                /* Заменяем тяжелый блюр на быстрый градиент */
                .full-start__bg, .card__background, .blur {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    background: rgba(0, 0, 0, 0.85) !important;
                }

                /* Убираем тени, которые тормозят скролл на Apple TV Gen 1 */
                .card, .button {
                    box-shadow: none !important;
                    -webkit-box-shadow: none !important;
                }
            `;
            document.head.appendChild(style);

            // Визуальное подтверждение загрузки для дебага
            // Если ты увидишь это сообщение при старте - значит код работает!
            setTimeout(function() {
                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('Apple TV Optimizer Active');
                } else {
                    console.log('Optimizer loaded, but Lampa UI not ready');
                }
            }, 2000);
        };
    }

    // Правильная инициализация плагина
    if (window.appready) {
        new LampaOptimizer().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new LampaOptimizer().init();
        });
    }
})();
