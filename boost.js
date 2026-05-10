(function () {
    'use strict';

    function LampaFluentBoost() {
        this.init = function () {
            // 1. Возвращаем родные анимации и фоны Lampa
            Lampa.Storage.set('animation', 'true');
            Lampa.Storage.set('background', 'true');

            // 2. Внедряем умный CSS, который любит GPU
            var style = document.createElement('style');
            style.textContent = `
                /* Заменяем тормозящий блюр на красивый Fluent-градиент */
                .blur, .full-start__bg {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    /* Создаем эффект тонированного стекла */
                    background: linear-gradient(180deg, rgba(15,15,15,0.6) 0%, rgba(15,15,15,0.95) 100%) !important;
                }

                /* ФОРСИРУЕМ GPU: Анимируем только то, что не вызывает перерисовку макета */
                .card {
                    will-change: transform, opacity;
                    /* Идеальная кривая Безье для плавного, но быстрого отклика */
                    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease !important;
                }

                /* Убираем тени у всех неактивных элементов, оставляем только там, где курсор */
                .card:not(.focus), .button:not(.focus) {
                    box-shadow: none !important;
                }

                /* Легкая тень для активного элемента создает глубину без лишней нагрузки */
                .card.focus {
                    box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
                }
                
                /* Заставляем браузер использовать быстрый алгоритм масштабирования картинок */
                img {
                    image-rendering: -webkit-optimize-contrast !important;
                }
            `;
            document.head.appendChild(style);

            // 3. Подтверждение
            setTimeout(function() {
                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('✨ Fluent Boost: Анимации оптимизированы');
                }
            }, 1500);
        };
    }

    if (window.appready) {
        new LampaFluentBoost().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new LampaFluentBoost().init();
        });
    }
})();
