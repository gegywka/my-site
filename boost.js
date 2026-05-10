(function () {
    'use strict';

    function LampaSafeOptimizer() {
        this.init = function () {
            // Очищаем потенциально конфликтные системные ключи
            Lampa.Storage.set('animation', 'true');
            Lampa.Storage.set('background', 'true');

            var style = document.createElement('style');
            style.textContent = `
                /* 1. ОТКЛЮЧАЕМ УБИЙЦУ GPU (Блюр) - БЕЗОПАСНО */
                .blur, .full-start__bg {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    background: rgba(15, 15, 15, 0.95) !important;
                }

                /* 2. ОТКЛЮЧАЕМ ТЕНИ У НЕАКТИВНЫХ ЭЛЕМЕНТОВ */
                .card:not(.focus), .button:not(.focus), .img-fluid {
                    box-shadow: none !important;
                    -webkit-box-shadow: none !important;
                }

                /* 3. ОПТИМИЗИРУЕМ РАСТР (Экономим ОЗУ) */
                img {
                    image-rendering: -webkit-optimize-contrast !important;
                }

                /* 4. УСКОРЯЕМ АНИМАЦИЮ (Без 3D-вмешательств в оси координат) */
                /* Используем базовый 2D-трансформ, который Lampa понимает */
                .card {
                    transition: transform 0.2s ease-out, opacity 0.2s ease-out !important;
                }
            `;
            document.head.appendChild(style);

            setTimeout(function() {
                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('🛡 Safe Mode: Blur removed, Scroll native');
                }
            }, 1500);
        };
    }

    if (window.appready) {
        new LampaSafeOptimizer().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new LampaSafeOptimizer().init();
        });
    }
})();
