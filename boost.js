(function () {
    'use strict';

    function LampaUltraBoost() {
        this.init = function () {
            this.injectStyles();
            this.showStatus();
            console.log('Boost: Инициализировано');
        };

        this.injectStyles = function () {
            const styleId = 'lampa-boost-styles';
            if (document.getElementById(styleId)) return;

            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* 1. ГАСИМ БЛЮР ВЕЗДЕ - это 80% нагрузки на Apple TV Gen 1 */
                .full-start__bg, .card__background, .blur, .base-button.white, .glass {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    background: rgba(10, 10, 10, 0.9) !important;
                    filter: none !important;
                }

                /* 2. УБИРАЕМ ТЕНИ - разгружаем отрисовку слоев */
                .card, .button, .img-fluid, .full-start__poster {
                    box-shadow: none !important;
                    -webkit-box-shadow: none !important;
                }

                /* 3. УСКОРЯЕМ АНИМАЦИИ (делаем их нативными для глаза) */
                * {
                    -webkit-transition-duration: 100ms !important;
                    transition-duration: 100ms !important;
                }

                /* ТЕСТОВЫЙ ПУНКТ: если ты видишь это, значит CSS применился */
                /* Можно удалить после проверки */
                /* .full-start { border: 5px solid red !important; } */
            `;
            document.head.appendChild(style);
        };

        this.showStatus = function () {
            // Ждем готовности UI, чтобы показать уведомление
            var checkReady = setInterval(function() {
                if (window.Lampa && Lampa.Noty) {
                    clearInterval(checkReady);
                    Lampa.Noty.show('🚀 Boost Active: Blur Disabled');
                }
            }, 500);
        };
    }

    // Запуск с проверкой готовности среды
    if (window.appready) {
        new LampaUltraBoost().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new LampaUltraBoost().init();
        });
    }
})();
