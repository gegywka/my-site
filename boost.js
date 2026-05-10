(function () {
    'use strict';

    function LampaScrollOptimizer() {
        this.init = function () {
            // Возвращаем нативные настройки для стабильности
            Lampa.Storage.set('animation', 'true');
            Lampa.Storage.set('background', 'true');

            var style = document.createElement('style');
            style.textContent = `
                /* 1. ИСПРАВЛЕНИЕ СКРОЛЛА И ФОНА */
                .blur, .full-start__bg {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    background: linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(0,0,0,0.95) 100%) !important;
                }

                /* 2. ОПТИМИЗАЦИЯ КОНТЕЙНЕРА ПРОКРУТКИ */
                /* Заставляем сам список фильмов летать на GPU */
                .scroll, .scroll__body, .items {
                    will-change: transform !important;
                    -webkit-transform: translate3d(0, 0, 0) !important;
                    transform: translate3d(0, 0, 0) !important;
                }

                /* 3. ОПТИМИЗАЦИЯ КАРТОЧЕК (БЕЗ БЛОКИРОВКИ МАКЕТА) */
                .card, .items__item {
                    /* Оставляем только paint-изоляцию, она не ломает скролл */
                    contain: paint !important;
                    
                    will-change: transform, opacity !important;
                    -webkit-transform: translate3d(0, 0, 0) !important;
                    transform: translate3d(0, 0, 0) !important;
                    
                    -webkit-backface-visibility: hidden !important;
                    backface-visibility: hidden !important;
                }

                /* 4. ВОЗВРАЩАЕМ ПЛАВНОСТЬ АНИМАЦИИ */
                .card {
                    transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease !important;
                }

                /* Убираем лишние тени для облегчения отрисовки */
                .card:not(.focus) {
                    box-shadow: none !important;
                }
                
                /* Ускоряем работу с изображениями */
                img {
                    image-rendering: -webkit-optimize-contrast !important;
                }
            `;
            document.head.appendChild(style);

            setTimeout(function() {
                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('✅ Scroll Fixed & GPU Boosted');
                }
            }, 1500);
        };
    }

    if (window.appready) {
        new LampaScrollOptimizer().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new LampaScrollOptimizer().init();
        });
    }
})();
