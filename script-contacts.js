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
        contactForm.addEventListener('submit', async function(e) {
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

            // Валидация email
            if (!isValidEmail(email)) {
                formStatus.textContent = 'Пожалуйста, введите корректный email адрес';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }

            // Показываем статус отправки
            formStatus.textContent = '⌛ Отправка сообщения...';
            formStatus.className = 'form-status info';
            formStatus.style.display = 'block';

            // Отправляем через Getform.io
            try {
                await sendViaGetform(name, phone, email, subject, message);
                
                // Успешная отправка
                formStatus.textContent = '✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.';
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';

                // Очистка формы
                contactForm.reset();

                // Скрываем статус через 5 секунд
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
                
            } catch (error) {
                console.error('Ошибка отправки через Getform:', error);
                
                // Если Getform не сработал, показываем альтернативный способ
                formStatus.innerHTML = `
                    <div style="text-align: left;">
                        <p style="color: #dc3545; font-weight: bold;">❌ Не удалось отправить автоматически</p>
                        <p>Пожалуйста, отправьте сообщение напрямую на email:</p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li><strong>recnpp-s@yandex.ru</strong></li>
                            <li><strong>rl.recnpp-s@yandex.ru</strong></li>
                        </ul>
                        <button onclick="showEmailTemplate()" style="
                            background: #0066cc;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            margin-top: 10px;
                            cursor: pointer;
                        ">
                            📋 Показать шаблон письма
                        </button>
                    </div>
                `;
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                
                // Сохраняем данные для шаблона
                window.formDataForTemplate = { name, phone, email, subject, message };
            }
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

    // Функция отправки через Getform.io
    async function sendViaGetform(name, phone, email, subject, message) {
        // ЗАМЕНИТЕ ЭТОТ URL НА ВАШ GETFORM ENDPOINT
        // Получите его после регистрации на https://getform.io
        const GETFORM_ENDPOINT = 'https://getform.io/f/awnvgnob';
        
        const formData = new FormData();
        
        // Добавляем данные формы
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('subject', subject || 'Сообщение с сайта');
        formData.append('message', message);
        
        // Добавляем информацию для отправки на обе почты
        formData.append('_to', 'recnpp-s@yandex.ru, rl.recnpp-s@yandex.ru');
        formData.append('_subject', 'Новое сообщение с сайта: ' + (subject || 'Без темы'));
        formData.append('_replyto', email);
        
        // Отправляем запрос
        const response = await fetch(GETFORM_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    // Функция для показа шаблона письма
    window.showEmailTemplate = function() {
        if (!window.formDataForTemplate) return;
        
        const { name, phone, email, subject, message } = window.formDataForTemplate;
        
        const emailTemplate = `
Уважаемые коллеги,

Поступило новое сообщение с контактной формы сайта:

📅 Дата: ${new Date().toLocaleString('ru-RU')}

👤 Контактная информация:
Имя: ${name}
Телефон: ${phone}
Email: ${email}

📋 Тема: ${subject || 'Сообщение с сайта'}

📝 Сообщение:
${message}

---
Это сообщение отправлено через контактную форму сайта.
Пожалуйста, ответьте отправителю в течение 24 часов.
        `.trim();
        
        // Копируем в буфер обмена
        navigator.clipboard.writeText(emailTemplate).then(() => {
            const formStatus = document.getElementById('form-status');
            if (formStatus) {
                formStatus.innerHTML = `
                    <div style="text-align: left;">
                        <p style="color: #28a745; font-weight: bold;">✅ Текст письма скопирован в буфер обмена!</p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <pre style="white-space: pre-wrap; font-family: Arial; font-size: 14px;">
${emailTemplate}
                            </pre>
                        </div>
                        <p>Теперь:</p>
                        <ol style="margin: 10px 0; padding-left: 20px;">
                            <li>Откройте почтовый клиент</li>
                            <li>Создайте новое письмо</li>
                            <li>Вставьте текст (Ctrl+V)</li>
                            <li>Получатель: <strong>recnpp-s@yandex.ru</strong></li>
                            <li>Копия (CC): <strong>rl.recnpp-s@yandex.ru</strong></li>
                            <li>Отправьте письмо</li>
                        </ol>
                    </div>
                `;
                formStatus.className = 'form-status info';
            }
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            alert('Не удалось скопировать текст. Скопируйте его вручную.');
        });
    }

    // Вспомогательные функции
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    console.log('Контактная форма настроена для отправки через Getform.io на две почты');
});
