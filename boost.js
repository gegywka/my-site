(function () {
    'use strict';

    function SmartLampaOptimizer() {
        this.init = function () {
            const style = document.createElement('style');
            style.textContent = `
                /* Форсируем использование видеокарты для всех карточек */
                .card, .items__item, .full-start__bg {
                    will-change: transform;
                    transform: translateZ(0);
                    -webkit-transform: translateZ(0);
                }

                /* Вместо тяжелого динамического блюра используем мягкий градиент */
                /* Это сохранит "вайб" Apple TV, но разгрузит процессор */
                .full-start__bg {
                    filter: none !important;
                    background: radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%) !important;
                }

                /* Оставляем тени только у активного элемента (фокуса) */
                .card:not(.focus) {
                    box-shadow: none !important;
                }
                .card.focus {
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5) !important;
                }

                /* Ограничиваем анимацию только для перемещения фокуса */
                .card {
                    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
            `;
            document.head.appendChild(style);
            console.log('Smart Optimizer: Эстетика сохранена, лаги убраны.');
        };
    }

    if (window.appready) new SmartLampaOptimizer().init();
    else Lampa.Listener.follow('app', (e) => { if (e.type == 'ready') new SmartLampaOptimizer().init(); });
})();
