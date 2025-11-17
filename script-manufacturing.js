document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });

    // File upload functionality
    const fileInput = document.getElementById('drawing-file');
    const fileInfo = document.getElementById('file-info');
    
    if (fileInput && fileInfo) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const file = this.files[0];
                const fileSize = (file.size / 1024 / 1024).toFixed(2); // Size in MB
                
                if (file.size > 10 * 1024 * 1024) { // 10 MB limit
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

    // Form submission
    const manufacturingForm = document.getElementById('manufacturingForm');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    if (manufacturingForm) {
        manufacturingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }

            // Show loading state
            setLoadingState(true);

            try {
                // Prepare form data
                const formData = new FormData(this);
                
                // Add additional info
                formData.append('form-type', 'manufacturing-order');
                formData.append('submission-date', new Date().toLocaleString('ru-RU'));

                // Send email using Formspree or similar service
                const response = await sendEmail(formData);
                
                if (response.ok) {
                    showFormStatus('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                    manufacturingForm.reset();
                    fileInfo.textContent = 'Файл не выбран';
                    fileInfo.style.color = '#666';
                } else {
                    throw new Error('Ошибка отправки формы');
                }
            } catch (error) {
                console.error('Error sending form:', error);
                showFormStatus('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.', 'error');
            } finally {
                setLoadingState(false);
            }
        });
    }

    // Form validation
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

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            emailField.style.borderColor = '#dc3545';
            showFormStatus('Пожалуйста, введите корректный email адрес', 'error');
            isValid = false;
        }

        // Phone validation
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            phoneField.style.borderColor = '#dc3545';
            showFormStatus('Пожалуйста, введите корректный номер телефона', 'error');
            isValid = false;
        }

        if (!isValid) {
            showFormStatus('Пожалуйста, заполните все обязательные поля', 'error');
        }

        return isValid;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation (basic)
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Show form status message
    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';

        // Auto hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }

    // Set loading state
    function setLoadingState(isLoading) {
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

    // Email sending function (using Formspree as example)
    async function sendEmail(formData) {
        // Using Formspree service - replace with your actual Formspree endpoint
        const formspreeEndpoint = 'https://formspree.io/f/your-form-id-here';
        
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        return response;
    }

    // Alternative email sending using EmailJS (uncomment if using EmailJS)
    /*
    async function sendEmail(formData) {
        // Initialize EmailJS with your user ID
        emailjs.init('your-user-id');
        
        // Prepare template parameters
        const templateParams = {
            company: formData.get('company'),
            contact_person: formData.get('contact-person'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            equipment_type: formData.get('equipment-type'),
            part_name: formData.get('part-name'),
            part_description: formData.get('part-description'),
            quantity: formData.get('quantity'),
            deadline: formData.get('deadline'),
            additional_info: formData.get('additional-info'),
            submission_date: new Date().toLocaleString('ru-RU')
        };

        // Send email
        return await emailjs.send('your-service-id', 'your-template-id', templateParams);
    }
    */

    // Real-time validation
    const formFields = manufacturingForm.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            if (this.hasAttribute('required') && this.value.trim()) {
                this.style.borderColor = '#e0e0e0';
            }
            
            // Specific field validation
            if (this.id === 'email' && this.value) {
                if (!isValidEmail(this.value)) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#e0e0e0';
                }
            }
            
            if (this.id === 'phone' && this.value) {
                if (!isValidPhone(this.value)) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#e0e0e0';
                }
            }
        });
        
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            }
        });
    });

    // Set minimum date for deadline field to today
    const deadlineField = document.getElementById('deadline');
    if (deadlineField) {
        const today = new Date().toISOString().split('T')[0];
        deadlineField.min = today;
    }

    // Add smooth scrolling for anchor links
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