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
                
                // Проверка размера
                if (file.size > 10 * 1024 * 1024) {
                    showFormStatus('Размер файла не должен превышать 10 МБ', 'error');
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
    
    // Замените этот URL на ваш Form Endpoint с Getform.io
    const GETFORM_ENDPOINT = 'https://getform.io/f/awnvgnob';
    
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
                console.log('Начинаем отправку через Getform.io...');
                
                // Собираем данные
                const formData = new FormData();
                
                // Добавляем все поля формы
                const formElements = this.elements;
                for (let element of formElements) {
                    if (element.name && element.type !== 'file') {
                        if (element.type === 'checkbox') {
                            formData.append(element.name, element.checked ? 'Да' : 'Нет');
                        } else if (element.value) {
                            formData.append(element.name, element.value);
                        }
                    }
                }
                
                // Добавляем файл если есть
                if (fileInput.files[0]) {
                    formData.append('file', fileInput.files[0]);
                }
                
                // Добавляем скрытые поля
                formData.append('_subject', 'Новая заявка на изготовление детали');
                formData.append('_to', 'recnpp-s@yandex.ru, rl.recnpp-s@yandex.ru');
                formData.append('_replyto', document.getElementById('email').value);
                
                // Добавляем дату
                formData.append('submission_date', new Date().toLocaleString('ru-RU'));
                
                console.log('Отправляем данные на Getform.io...');
                
                // Отправляем
                const response = await fetch(GETFORM_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                console.log('Ответ Getform:', response.status);
                
                if (response.ok) {
                    // УСПЕШНАЯ ОТПРАВКА
                    const result = await response.json();
                    console.log('Успешно:', result);
                    
                    showFormStatus('✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                    
                    // Очистка формы
                    manufacturingForm.reset();
                    
                    // Сброс информации о файле
                    if (fileInfo) {
                        fileInfo.textContent = 'Файл не выбран';
                        fileInfo.style.color = '#666';
                    }
                    
                } else {
                    throw new Error(`Ошибка отправки: ${response.status}`);
                }
                
            } catch (error) {
                console.error('Ошибка отправки:', error);
                
                // Показываем альтернативный способ
                showFormStatus(`
                    <div style="text-align: left; padding: 15px;">
                        <p style="color: #721c24; font-weight: bold; margin-bottom: 10px;">
                            ❌ Не удалось отправить форму автоматически.
                        </p>
                        <p style="margin-bottom: 10px;">Пожалуйста, отправьте заявку напрямую на email:</p>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <p><strong>Адреса получателей:</strong></p>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>recnpp-s@yandex.ru</li>
                                <li>rl.recnpp-s@yandex.ru</li>
                            </ul>
                            
                            <p><strong>Тема письма:</strong> Заявка на изготовление детали</p>
                            
                            <button id="showEmailTemplate" style="
                                background: #0066cc;
                                color: white;
                                border: none;
                                padding: 10px 15px;
                                border-radius: 4px;
                                cursor: pointer;
                                margin-top: 10px;
                            ">
                                📋 Показать шаблон письма
                            </button>
                        </div>
                    </div>
                `, 'error');
                
                // Добавляем обработчик для кнопки
                setTimeout(() => {
                    const showTemplateBtn = document.getElementById('showEmailTemplate');
                    if (showTemplateBtn) {
                        showTemplateBtn.addEventListener('click', showEmailTemplate);
                    }
                }, 100);
                
            } finally {
                setLoadingState(false);
            }
        });
    }

    // Функция показа шаблона письма
    function showEmailTemplate() {
        const formData = {
            company: document.getElementById('company').value,
            contactPerson: document.getElementById('contact-person').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            equipmentType: document.getElementById('equipment-type').value,
            partName: document.getElementById('part-name').value,
            partDescription: document.getElementById('part-description').value,
            quantity: document.getElementById('quantity').value,
            deadline: document.getElementById('deadline').value,
            additionalInfo: document.getElementById('additional-info').value,
            fileInfo: fileInfo?.textContent || 'Файл не прикреплен'
        };
        
        const emailTemplate = `
Тема: Заявка на изготовление детали

Уважаемые коллеги,

Прошу рассмотреть возможность изготовления детали.

Контактная информация:
- Организация: ${formData.company}
- Контактное лицо: ${formData.contactPerson}
- Телефон: ${formData.phone}
- Email: ${formData.email}

Информация о детали:
- Тип оборудования: ${formData.equipmentType}
- Наименование детали: ${formData.partName}
- Описание: ${formData.partDescription}
- Количество: ${formData.quantity} шт.
- Желаемый срок: ${formData.deadline}

Дополнительная информация:
${formData.additionalInfo}

Файл чертежа: ${formData.fileInfo}

---
С уважением,
${formData.contactPerson}
${formData.company}
        `.trim();
        
        showFormStatus(`
            <div style="text-align: left; padding: 15px;">
                <p style="color: #0c5460; font-weight: bold; margin-bottom: 10px;">
                    📝 Шаблон письма:
                </p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
${emailTemplate}
                    </pre>
                </div>
                <p style="margin-top: 10px; font-size: 14px;">
                    Скопируйте этот текст, создайте новое письмо и отправьте на указанные адреса.
                </p>
            </div>
        `, 'info');
    }

    // Функции ====================================================

    // Валидация формы
    function validateForm() {
        const requiredFields = manufacturingForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '#e0e0e0';
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
            showFormStatus('Введите корректный номер телефона', 'error');
            isValid = false;
        }
        
        if (!isValid) {
            showFormStatus('Заполните все обязательные поля', 'error');
        }
        
        return isValid;
    }
    
    // Валидация email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
        
        // Прокрутка к статусу
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Автоскрытие только для успеха
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 8000);
        }
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
    
    // Установка минимальной даты
    const deadlineField = document.getElementById('deadline');
    if (deadlineField) {
        const today = new Date().toISOString().split('T')[0];
        deadlineField.min = today;
    }
});
