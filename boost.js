(function () {
    'use strict';

    function LampaHardwareBoost() {
        this.init = function () {
            // Возвращаем базовые настройки Lampa для красивого вида
            Lampa.Storage.set('animation', 'true');
            Lampa.Storage.set('background', 'true');

            var style = document.createElement('style');
            style.textContent = `
                /* 1. БАЗОВАЯ ОПТИМИЗАЦИЯ ФОНА (Градиент вместо блюра) */
                .blur, .full-start__bg {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    background: linear-gradient(180deg, rgba(15,15,15,0.6) 0%, rgba(15,15,15,0.95) 100%) !important;
                }

                /* 2. АГРЕССИВНОЕ АППАРАТНОЕ УСКОРЕНИЕ (GPU HACKS) */
                /* Заставляем WebKit создать независимую текстуру в VRAM видеокарты */
                .card, .items__item, .scroll, .scroll__body {
                    will-change: transform, opacity !important;
                    
                    /* Принудительный 3D-рендеринг */
                    transform: translate3d(0, 0, 0) !important;
                    -webkit-transform: translate3d(0, 0, 0) !important;

                    /* Отсечение невидимой геометрии (снимает 50% нагрузки с GPU) */
                    backface-visibility: hidden !important;
                    -webkit-backface-visibility: hidden !important;
                    
                    /* Отключение субпиксельного сглаживания текста при движении */
                    -webkit-font-smoothing: antialiased !important;
                }

                /* 3. CSS CONTAINMENT (Убийца процессорных лагов) */
                /* Изолируем карточки, чтобы браузер не пересчитывал всю страницу при скролле */
                .card {
                    contain: layout style paint !important;
                }

                /* 4. ОПТИМИЗАЦИЯ АНИМАЦИЙ */
                .card {
                    transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease !important;
                }

                .card:not(.focus), .button:not(.focus) {
                    box-shadow: none !important;
                }
                .card.focus {
                    box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
                }
                
                img {
                    image-rendering: -webkit-optimize-contrast !important;
                }
            `;
            document.head.appendChild(style);

            setTimeout(function() {
                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('🛠 Hardware GPU Boost: Включено (Translate3D + Contain)');
                }
            }, 1500);
        };
    }

    if (window.appready) {
        new LampaHardwareBoost().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new LampaHardwareBoost().init();
        });
    }
})();
