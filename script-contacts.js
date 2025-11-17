document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Меняем иконку бургера на крестик
            if (navMenu.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });

        // Закрываем меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });

        // Закрываем меню при клике вне его области
        document.addEventListener('click', function(event) {
            const isClickInsideNav = event.target.closest('.nav');
            const isClickOnToggle = event.target.closest('.menu-toggle');
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }

    // Инициализация карты
    if (document.getElementById('map')) {
        var map = L.map('map', {
            attributionControl: false
        }).setView([59.9311, 30.3609], 12);

        // Добавляем слой карты
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© РемЭнергоКомплект НПП',
            maxZoom: 18
        }).addTo(map);

        // Координаты офисов (точные координаты для Санкт-Петербурга)
        var officeCoords = [59.9311, 30.3609]; // Кондратьевский пр.
        var productionCoords = [59.9075, 30.3512]; // наб. реки Волковки

        // Создаем кастомные иконки для маркеров
        var officeIcon = L.divIcon({
            className: 'office-marker',
            html: '<div style="background: #000066; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        var productionIcon = L.divIcon({
            className: 'production-marker',
            html: '<div style="background: #0066cc; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        // Маркеры
        var officeMarker = L.marker(officeCoords, {
            icon: officeIcon
        }).addTo(map)
        .bindPopup(`
            <div class="custom-popup">
                <h3>Основной офис</h3>
                <p>пр-кт Кондратьевский, д.3, к.4</p>
                <p>Лит.Д, помещ.2Н-2</p>
            </div>
        `);

        var productionMarker = L.marker(productionCoords, {
            icon: productionIcon
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

        // Автоматически открываем попап основного офиса
        officeMarker.openPopup();
    }

    // Обработка формы
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Простая валидация
            if (!name || !phone || !email || !message) {
                formStatus.textContent = 'Пожалуйста, заполните все обязательные поля';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }

            // В реальном приложении здесь был бы AJAX запрос к серверу
            // Для демонстрации просто показываем успешное сообщение
            
            formStatus.textContent = 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.';
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';

            // Очистка формы
            contactForm.reset();

            // Скрываем статус через 5 секунд
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        });

        // Очистка статуса при изменении полей формы
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (formStatus.style.display !== 'none') {
                    formStatus.style.display = 'none';
                }
            });
        });
    }

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
