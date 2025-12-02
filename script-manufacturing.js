document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Закрытие мобильного меню
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Загрузка файлов
    const fileInput = document.getElementById('drawing-file');
    const fileInfo = document.getElementById('file-info');
    
    if (fileInput && fileInfo) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const file = this.files[0];
                const fileSize = (file.size / 1024 / 1024).toFixed(2);
                
                // Проверка размера (20 МБ максимум для Formsubmit)
                if (file.size > 20 * 1024 * 1024) {
                    showFormStatus('Размер файла не должен превышать 20 МБ', 'error');
                    this.value = '';
                    fileInfo.textContent = 'Файл не выбран';
                    return;
                }
                
                fileInfo.textContent = `${file.name} (${fileSize} МБ)`;
                fileInfo.style.color = '#0066cc';
            } else {
                fileInfo.textContent = 'Файл не выбран';
                fileInfo.style.color = '#666';
            }
        });
    }

    // Форма отправки
    const manufacturingForm = document.getElementById('manufacturingForm');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    
    // Флаг для отслеживания отправки
    let isFormSubmitting = false;
    
    if (manufacturingForm) {
        manufacturingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (isFormSubmitting) {
                return;
            }
            
            // Валидация
            if (!validateForm()) {
                return;
            }
            
            isFormSubmitting = true;
            setLoadingState(true);
            
            try {
                console.log('Начало отправки формы через Formsubmit...');
                
                // Создаем FormData
                const formData = new FormData(this);
                
                // Добавляем скрытые поля для Formsubmit
                formData.append('_cc', 'rl.recnpp-s@yandex.ru');
                formData.append('_subject', 'Новая заявка на изготовление детали с сайта');
                formData.append('_template', 'table');
                formData.append('_captcha', 'false');
                formData.append('_autoresponse', 'Спасибо за заявку! Мы получили ваше сообщение и свяжемся с вами в течение 24 часов.');
                
                // Добавляем информацию о времени
                formData.append('submission_date', new Date().toLocaleString('ru-RU'));
                
                // Генерируем номер заявки
                const orderNumber = 'ORD-' + Date.now().toString().slice(-8);
                formData.append('order_number', orderNumber);
                
                // URL Formsubmit
                const formsubmitUrl = 'https://formsubmit.co/recnpp-s@yandex.ru';
                
                console.log('Отправка запроса на Formsubmit...');
                
                // Отправляем с таймаутом 30 секунд
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);
                
                const response = await fetch(formsubmitUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                console.log('Ответ Formsubmit:', response.status);
                
                if (response.ok) {
                    try {
                        const result = await response.json();
                        console.log('Ответ Formsubmit JSON:', result);
                        
                        if (result.success) {
                            // УСПЕШНАЯ ОТПРАВКА ЧЕРЕЗ FORMSUBMIT
                            showFormStatus('✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                            
                            // Показываем номер заявки
                            setTimeout(() => {
                                showFormStatus(`📋 Номер вашей заявки: <strong>${orderNumber}</strong>. Сохраните его для отслеживания.`, 'info');
                            }, 2000);
                            
                            // Очистка формы
                            manufacturingForm.reset();
                            
                            // Сброс информации о файле
                            if (fileInfo) {
                                fileInfo.textContent = 'Файл не выбран';
                                fileInfo.style.color = '#666';
                            }
                            
                            // Логирование успешной отправки
                            console.log('Form submitted successfully to Formsubmit');
                            
                            // Сохраняем номер в localStorage
                            localStorage.setItem('lastOrderNumber', orderNumber);
                            
                        } else {
                            throw new Error('Formsubmit вернул ошибку');
                        }
                    } catch (jsonError) {
                        console.log('Formsubmit вернул не JSON ответ, возможно успешно');
                        showFormStatus('✅ Заявка отправлена! Ожидайте подтверждения на email.', 'success');
                        manufacturingForm.reset();
                    }
                    
                } else {
                    console.error('Formsubmit HTTP ошибка:', response.status);
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Форма не отправилась через Formsubmit, показываем инструкцию
                showFormStatus(`
                    <div style="text-align: left;">
                        <p style="color: #dc3545; font-weight: bold;">❌ Форма не отправилась автоматически.</p>
                        <p>Пожалуйста, отправьте заявку вручную:</p>
                        <ol style="margin-left: 20px;">
                            <li>Скопируйте данные из формы</li>
                            <li>Отправьте их на email: <strong>recnpp-s@yandex.ru</strong></li>
                            <li>В копию укажите: <strong>rl.recnpp-s@yandex.ru</strong></li>
                            <li>Тема письма: <strong>Заявка на изготовление детали</strong></li>
                        </ol>
                        <p style="margin-top: 10px;">
                            <button id="copyFormData" style="background: #0066cc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                                📋 Скопировать данные формы
                            </button>
                        </p>
                    </div>
                `, 'error');
                
                // Добавляем кнопку для копирования данных формы
                setTimeout(() => {
                    const copyBtn = document.getElementById('copyFormData');
                    if (copyBtn) {
                        copyBtn.addEventListener('click', copyFormDataToClipboard);
                    }
                }, 100);
                
            } finally {
                setLoadingState(false);
                setTimeout(() => {
                    isFormSubmitting = false;
                }, 5000);
            }
        });
    }

    // Функция копирования данных формы в буфер обмена
    function copyFormDataToClipboard() {
        try {
            const formData = {
                company: document.getElementById('company')?.value || '',
                contactPerson: document.getElementById('contact-person')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                email: document.getElementById('email')?.value || '',
                equipmentType: document.getElementById('equipment-type')?.value || '',
                partName: document.getElementById('part-name')?.value || '',
                partDescription: document.getElementById('part-description')?.value || '',
                quantity: document.getElementById('quantity')?.value || '',
                deadline: document.getElementById('deadline')?.value || '',
                additionalInfo: document.getElementById('additional-info')?.value || '',
                fileInfo: fileInfo?.textContent || 'Файл не прикреплен',
                submissionDate: new Date().toLocaleString('ru-RU')
            };
            
            const text = `
ЗАЯВКА НА ИЗГОТОВЛЕНИЕ ДЕТАЛИ

📅 Дата заявки: ${formData.submissionDate}

👤 КОНТАКТНАЯ ИНФОРМАЦИЯ:
Компания: ${formData.company}
Контактное лицо: ${formData.contactPerson}
Телефон: ${formData.phone}
Email: ${formData.email}

🔧 ИНФОРМАЦИЯ О ДЕТАЛИ:
Тип оборудования: ${formData.equipmentType}
Наименование детали: ${formData.partName}
Описание детали: ${formData.partDescription}
Количество: ${formData.quantity} шт.
Желаемый срок: ${formData.deadline}

📝 ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ:
${formData.additionalInfo}

📎 ФАЙЛ ЧЕРТЕЖА:
${formData.fileInfo}

---
Это заявка отправлена с сайта РемЭнергоКомплект НПП
            `.trim();
            
            navigator.clipboard.writeText(text).then(() => {
                const copyBtn = document.getElementById('copyFormData');
                if (copyBtn) {
                    copyBtn.textContent = '✅ Данные скопированы!';
                    copyBtn.style.background = '#28a745';
                    setTimeout(() => {
                        copyBtn.textContent = '📋 Скопировать данные формы';
                        copyBtn.style.background = '#0066cc';
                    }, 3000);
                }
                
                // Показываем инструкцию по отправке
                showFormStatus(`
                    <div style="text-align: left;">
                        <p style="color: #28a745; font-weight: bold;">✅ Данные скопированы в буфер обмена!</p>
                        <p>Теперь:</p>
                        <ol style="margin-left: 20px;">
                            <li>Откройте ваш почтовый клиент</li>
                            <li>Создайте новое письмо</li>
                            <li>Вставьте скопированные данные (Ctrl+V)</li>
                            <li>Адрес получателя: <strong>recnpp-s@yandex.ru</strong></li>
                            <li>Копия (CC): <strong>rl.recnpp-s@yandex.ru</strong></li>
                            <li>Тема: <strong>Заявка на изготовление детали</strong></li>
                            <li>Если есть файл чертежа, прикрепите его к письму</li>
                            <li>Отправьте письмо</li>
                        </ol>
                    </div>
                `, 'info');
                
            }).catch(err => {
                console.error('Ошибка копирования:', err);
                showFormStatus('❌ Не удалось скопировать данные. Скопируйте их вручную.', 'error');
            });
            
        } catch (error) {
            console.error('Ошибка при подготовке данных:', error);
            showFormStatus('❌ Ошибка при подготовке данных. Заполните форму заново.', 'error');
        }
    }

    // Функции ====================================================

    // Валидация формы
    function validateForm() {
        const requiredFields = manufacturingForm.querySelectorAll('[required]');
        let isValid = true;
        
        // Сброс стилей ошибок
        requiredFields.forEach(field => {
            field.style.borderColor = '#e0e0e0';
        });
        
        // Проверка обязательных полей
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            }
        });
        
        // Валидация email
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            emailField.style.borderColor = '#dc3545';
            showFormStatus('Введите корректный email адрес', 'error');
            isValid = false;
        }
        
        // Валидация телефона
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            phoneField.style.borderColor = '#dc3545';
            showFormStatus('Введите корректный номер телефона (минимум 10 цифр)', 'error');
            isValid = false;
        }
        
        // Проверка согласия на обработку данных
        const agreementField = document.getElementById('agreement');
        if (agreementField && !agreementField.checked) {
            showFormStatus('Необходимо согласие на обработку персональных данных', 'error');
            isValid = false;
        }
        
        if (!isValid) {
            showFormStatus('Пожалуйста, заполните все обязательные поля правильно', 'error');
        }
        
        return isValid;
    }
    
    // Валидация email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Валидация телефона
    function isValidPhone(phone) {
        const digitsOnly = phone.replace(/\D/g, '');
        return digitsOnly.length >= 10;
    }
    
    // Показать статус формы
    function showFormStatus(message, type) {
        if (!formStatus) return;
        
        formStatus.innerHTML = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // Автоматическое скрытие только для успешных сообщений
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 10000);
        }
        
        // Прокрутка к статусу
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Состояние загрузки
    function setLoadingState(isLoading) {
        if (!submitBtn) return;
        
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (btnText && btnLoading) {
            if (isLoading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'flex';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            } else {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        }
    }
    
    // Реальная валидация при вводе
    const formFields = manufacturingForm?.querySelectorAll('input, textarea, select') || [];
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            if (this.hasAttribute('required') && this.value.trim()) {
                this.style.borderColor = '#e0e0e0';
            }
            
            if (this.id === 'email' && this.value) {
                this.style.borderColor = isValidEmail(this.value) ? '#28a745' : '#dc3545';
            }
            
            if (this.id === 'phone' && this.value) {
                this.style.borderColor = isValidPhone(this.value) ? '#28a745' : '#dc3545';
            }
        });
        
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            }
        });
    });
    
    // Установка минимальной даты
    const deadlineField = document.getElementById('deadline');
    if (deadlineField) {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const tomorrow = today.toISOString().split('T')[0];
        deadlineField.min = tomorrow;
        
        // Преобразование в нормальный формат даты
        deadlineField.addEventListener('focus', function() {
            this.type = 'date';
        });
    }
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Проверяем, была ли отправлена форма
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
        const orderNumber = localStorage.getItem('lastOrderNumber') || 'ORD-' + Date.now().toString().slice(-6);
        showFormStatus(`
            <div style="text-align: center;">
                <p style="color: #28a745; font-size: 24px; margin-bottom: 10px;">✅</p>
                <h3 style="color: #28a745; margin-bottom: 10px;">Заявка успешно отправлена!</h3>
                <p>Мы получили вашу заявку и свяжемся с вами в течение 24 часов.</p>
                <p style="margin-top: 10px; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                    <strong>Номер вашей заявки:</strong><br>
                    <span style="font-size: 18px; color: #0066cc;">${orderNumber}</span>
                </p>
                <p style="margin-top: 10px; font-size: 14px; color: #666;">
                    Сохраните этот номер для отслеживания статуса заявки.
                </p>
            </div>
        `, 'success');
        
        // Убираем параметр из URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Инициализация
    console.log('Form handler initialized');
    console.log('Form will be sent to: recnpp-s@yandex.ru (with CC to rl.recnpp-s@yandex.ru)');
});
