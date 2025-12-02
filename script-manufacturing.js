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
    
    if (manufacturingForm) {
        manufacturingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Валидация
            if (!validateForm()) {
                return;
            }
            
            // Показать загрузку
            setLoadingState(true);
            
            try {
                // ВАЖНО: Форма должна иметь action с основной почтой
                // В HTML: <form action="https://formsubmit.co/recnpp-s@yandex.ru" ...>
                
                // Создаем FormData
                const formData = new FormData(this);
                
                // ДОБАВЛЯЕМ ВТОРОЙ EMAIL ЧЕРЕЗ CC (Carbon Copy)
                // Formsubmit поддерживает поле _cc для копий
                formData.append('_cc', 'rl.recnpp-s@yandex.ru');
                
                // Другие настройки Formsubmit
                formData.append('_subject', 'Новая заявка на изготовление детали');
                formData.append('_template', 'table');
                formData.append('_captcha', 'false');
                
                // Автоответ пользователю
                formData.append('_autoresponse', 'Спасибо за заявку! Мы получили ваше сообщение и свяжемся с вами в течение 24 часов.');
                
                // Добавляем дату отправки
                formData.append('submission_date', new Date().toLocaleString('ru-RU'));
                
                // Генерируем номер заявки
                const orderNumber = 'ORD-' + new Date().getTime().toString().slice(-8);
                formData.append('order_number', orderNumber);
                
                // Отправляем форму
                // Ваш HTML должен иметь: <form action="https://formsubmit.co/recnpp-s@yandex.ru" ...>
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // УСПЕШНАЯ ОТПРАВКА
                    const result = await response.json();
                    
                    if (result.success) {
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
                        
                    } else {
                        throw new Error('Formsubmit вернул ошибку');
                    }
                    
                } else {
                    throw new Error('Ошибка HTTP: ' + response.status);
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Пробуем альтернативный метод отправки
                try {
                    await sendAlternativeEmail();
                    showFormStatus('✅ Заявка отправлена через резервный метод!', 'success');
                } catch (backupError) {
                    showFormStatus('❌ Ошибка отправки. Пожалуйста, отправьте заявку на email: recnpp-s@yandex.ru', 'error');
                }
                
            } finally {
                setLoadingState(false);
            }
        });
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
        
        // Автоматическое скрытие
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
                btnLoading.style.display = 'inline';
                submitBtn.disabled = true;
            } else {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        }
    }
    
    // Альтернативный метод отправки (если Formsubmit не работает)
    async function sendAlternativeEmail() {
        return new Promise((resolve, reject) => {
            try {
                // Собираем данные формы
                const formData = {
                    company: document.getElementById('company')?.value || '',
                    contact_person: document.getElementById('contact-person')?.value || '',
                    phone: document.getElementById('phone')?.value || '',
                    email: document.getElementById('email')?.value || '',
                    equipment_type: document.getElementById('equipment-type')?.value || '',
                    part_name: document.getElementById('part-name')?.value || '',
                    part_description: document.getElementById('part-description')?.value || '',
                    quantity: document.getElementById('quantity')?.value || '',
                    deadline: document.getElementById('deadline')?.value || '',
                    additional_info: document.getElementById('additional-info')?.value || '',
                    submission_date: new Date().toLocaleString('ru-RU')
                };
                
                // Создаем текст письма
                const emailBody = `
                    НОВАЯ ЗАЯВКА С САЙТА
                    
                    📅 Дата: ${formData.submission_date}
                    
                    👤 КОНТАКТНАЯ ИНФОРМАЦИЯ:
                    Компания: ${formData.company}
                    Контактное лицо: ${formData.contact_person}
                    Телефон: ${formData.phone}
                    Email: ${formData.email}
                    
                    🔧 ИНФОРМАЦИЯ О ДЕТАЛИ:
                    Тип оборудования: ${formData.equipment_type}
                    Наименование детали: ${formData.part_name}
                    Описание детали: ${formData.part_description}
                    Количество: ${formData.quantity} шт.
                    Желаемый срок: ${formData.deadline}
                    
                    📝 ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ:
                    ${formData.additional_info}
                    
                    📎 ФАЙЛ ЧЕРТЕЖА:
                    ${fileInfo?.textContent || 'Файл не прикреплен'}
                `;
                
                // Создаем mailto ссылку для ОБОИХ получателей
                const subject = encodeURIComponent('Новая заявка на изготовление детали');
                const body = encodeURIComponent(emailBody);
                
                // Основной получатель и CC
                const mailtoLink = `mailto:recnpp-s@yandex.ru?cc=rl.recnpp-s@yandex.ru&subject=${subject}&body=${body}`;
                
                // Открываем в новом окне
                const mailWindow = window.open(mailtoLink, '_blank');
                
                if (mailWindow) {
                    setTimeout(() => {
                        mailWindow.close();
                        resolve();
                    }, 1000);
                } else {
                    // Если всплывающее окно заблокировано
                    alert('Пожалуйста, отправьте заявку вручную на адреса:\nrecnpp-s@yandex.ru\nrl.recnpp-s@yandex.ru');
                    reject(new Error('Popup blocked'));
                }
                
            } catch (error) {
                reject(error);
            }
        });
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
    
    // Инициализация
    console.log('Formsubmit form handler initialized');
    console.log('Emails will be sent to: recnpp-s@yandex.ru and rl.recnpp-s@yandex.ru');
});
