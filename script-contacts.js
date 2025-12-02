document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню (оставляем ваш код)
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });

        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = event.target.closest('.nav');
            const isClickOnToggle = event.target.closest('.menu-toggle');
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }

    // Инициализация карты (оставляем ваш код)
    if (document.getElementById('map')) {
        var map = L.map('map', {
            attributionControl: false
        }).setView([59.9311, 30.3609], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© РемЭнергоКомплект НПП',
            maxZoom: 18
        }).addTo(map);

        var officeCoords = [59.9311, 30.3609];
        var productionCoords = [59.9075, 30.3512];

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

        L.control.attribution({
            position: 'bottomright',
            prefix: '© РемЭнергоКомплект НПП'
        }).addTo(map);

        officeMarker.openPopup();
    }

    // ОБНОВЛЕННАЯ обработка формы
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

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

            // Формируем тело письма
            const emailBody = `
                НОВОЕ СООБЩЕНИЕ С САЙТА

                📅 Дата: ${new Date().toLocaleString('ru-RU')}
                
                👤 Контактная информация:
                Имя: ${name}
                Телефон: ${phone}
                Email: ${email}
                
                📋 Тема: ${subject || 'Сообщение с сайта'}
                
                📝 Сообщение:
                ${message}
                
                ---
                Это сообщение отправлено с контактной формы сайта.
                Пожалуйста, ответьте отправителю в течение 24 часов.
            `.trim();

            // Создаем mailto ссылку для ОБОИХ почт
            const mailtoLink = createMailtoLink(emailBody, subject, email);
            
            // Показываем инструкцию
            showEmailInstructions(emailBody, mailtoLink);
            
            // Очищаем форму
            contactForm.reset();
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

    // Функция создания mailto ссылки
    function createMailtoLink(body, subject, replyTo) {
        const encodedSubject = encodeURIComponent(subject || 'Сообщение с сайта');
        const encodedBody = encodeURIComponent(body);
        
        // Основной получатель: recnpp-s@yandex.ru
        // Копия: rl.recnpp-s@yandex.ru
        return `mailto:recnpp-s@yandex.ru?cc=rl.recnpp-s@yandex.ru&subject=${encodedSubject}&body=${encodedBody}`;
    }

    // Функция показа инструкций
    function showEmailInstructions(emailBody, mailtoLink) {
        const formStatus = document.getElementById('form-status');
        if (!formStatus) return;
        
        formStatus.innerHTML = `
            <div style="text-align: left; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <div style="background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                        1
                    </div>
                    <h3 style="margin: 0; color: #28a745;">Письмо готово к отправке</h3>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #0066cc;">
                    <p><strong>📧 Письмо будет отправлено на:</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>recnpp-s@yandex.ru</strong> (основной получатель)</li>
                        <li><strong>rl.recnpp-s@yandex.ru</strong> (копия)</li>
                    </ul>
                </div>
                
                <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                    <button onclick="window.open('${mailtoLink}', '_blank')" style="
                        background: #0066cc;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                        flex: 1;
                        min-width: 200px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    ">
                        📨 Открыть почтовый клиент
                    </button>
                    
                    <button onclick="copyToClipboard(\`${escapeHTML(emailBody)}\`)" style="
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                        flex: 1;
                        min-width: 200px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    ">
                        📋 Скопировать текст письма
                    </button>
                </div>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-top: 15px;">
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                        💡 <strong>Совет:</strong> Если почтовый клиент не открылся автоматически, 
                        скопируйте текст выше и отправьте вручную на указанные адреса.
                    </p>
                </div>
            </div>
        `;
        formStatus.className = 'form-status success';
        formStatus.style.display = 'block';
        
        // Прокрутка к статусу
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Вспомогательные функции
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Функция для экранирования HTML
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Глобальная функция для копирования в буфер
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Показываем уведомление
            const notification = document.createElement('div');
            notification.textContent = '✅ Текст скопирован в буфер обмена!';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 10000;
                animation: fadeInOut 3s ease;
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }).catch(err => {
            alert('Не удалось скопировать текст. Скопируйте его вручную.');
        });
    };

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

    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);

    console.log('Контактная форма настроена для отправки на recnpp-s@yandex.ru и rl.recnpp-s@yandex.ru');
});
