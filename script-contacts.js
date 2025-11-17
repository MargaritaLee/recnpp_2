document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карты
    var map = L.map('map', {
        attributionControl: false
    }).setView([59.9311, 30.3609], 12);

    // Добавляем слой карты
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© РемЭнергоКомплект НПП'
    }).addTo(map);

    // Координаты офисов
    var officeCoords = [59.9311, 30.3609]; // Кондратьевский пр.
    var productionCoords = [59.9075, 30.3512]; // наб. реки Волковки

    // Маркеры
    var officeMarker = L.marker(officeCoords, {
        className: 'office-marker'
    }).addTo(map)
    .bindPopup(`
        <div class="custom-popup">
            <h3>Основной офис</h3>
            <p>пр-кт Кондратьевский, д.3, к.4</p>
            <p>Лит.Д, помещ.2Н-2</p>
        </div>
    `);

    var productionMarker = L.marker(productionCoords, {
        className: 'production-marker'
    }).addTo(map)
    .bindPopup(`
        <div class="custom-popup">
            <h3>Производственный комплекс</h3>
            <p>набережная реки Волковки, 17</p>
        </div>
    `);

    // Добавляем кастомное attribution
    L.control.attribution({
        position: 'bottomright',
        prefix: '© РемЭнергоКомплект НПП'
    }).addTo(map);

    // Обработка формы
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ваш код обработки формы...
        });
    }
});