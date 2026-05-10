(function () {
    'use strict';
    // Самый простой способ проверить - просто перекрасить весь экран в черный
    // Это сработает даже если UI Lampa еще не готов
    var style = document.createElement('style');
    style.textContent = 'body, html, .app { background: #000 !important; } .full-start__bg { display: none !important; }';
    document.head.appendChild(style);

    // Вместо сложного Noty используем стандартный лог (его видно в отладчике)
    console.log('BOOST_JS_LOADED');
    
    // Попытка вывести уведомление через 5 секунд
    setTimeout(function() {
        if (window.Lampa && Lampa.Noty) {
            Lampa.Noty.show('BOOST LOADED');
        } else {
            // Если Лампа не готова, попробуем просто вывести текст поверх всего
            var div = document.createElement('div');
            div.style = 'position:fixed;top:10px;left:10px;z-index:999;background:red;color:white;padding:20px;';
            div.innerText = 'PLUGIN WORKING';
            document.body.appendChild(div);
        }
    }, 5000);
})();
