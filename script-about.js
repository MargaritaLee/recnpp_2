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
    
    // Add animation on scroll for statistics
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Animate info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Testimonial card animations
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Certificate card animations
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Add loading animation for all animated elements
    const animatedElements = document.querySelectorAll('.stat-item, .info-card, .testimonial-card, .certificate-card');
    animatedElements.forEach(element => {
        element.addEventListener('animationend', function() {
            if (element.style.opacity === '1') {
                element.style.opacity = '1';
                element.style.transform = element.classList.contains('certificate-card') || 
                                        element.classList.contains('testimonial-card') ? 
                                        'scale(1)' : 'translateY(0)';
            }
        });
    });
});

// Partners section animation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize partners animation
    initPartnersAnimation();
    
    function initPartnersAnimation() {
        const partnerCards = document.querySelectorAll('.partner-card');
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const partnerObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered animation for cards
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                    
                    partnerObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Set initial state and observe each card
        partnerCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            partnerObserver.observe(card);
        });

        // Add hover effects
        partnerCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });

        // Add click effect for mobile
        partnerCards.forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('partner-card-active');
            });
        });
    }

    // Parallax effect for partners section
    function initParallaxEffect() {
        const partnersSection = document.querySelector('.partners-section');
        
        if (partnersSection) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                partnersSection.style.backgroundPosition = `center ${rate}px`;
            });
        }
    }

    // Initialize parallax if section exists
    if (document.querySelector('.partners-section')) {
        initParallaxEffect();
    }

    // Add smooth scroll to partners section from navigation
    const navLinks = document.querySelectorAll('a[href="#partners"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const partnersSection = document.querySelector('.partners-section');
            if (partnersSection) {
                partnersSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Partners counter animation
    function initPartnersCounter() {
        const partnerCards = document.querySelectorAll('.partner-card');
        const counterElement = document.createElement('div');
        counterElement.className = 'partners-counter';
        counterElement.innerHTML = `
            <div class="counter-number">0</div>
            <div class="counter-text">надежных партнеров</div>
        `;
        
        const partnersSection = document.querySelector('.partners-section .container');
        if (partnersSection) {
            partnersSection.insertBefore(counterElement, partnersSection.querySelector('.partners-grid'));
            
            // Animate counter
            let count = 0;
            const targetCount = partnerCards.length;
            const duration = 2000; // 2 seconds
            const increment = targetCount / (duration / 16); // 60fps
            
            const counter = setInterval(() => {
                count += increment;
                if (count >= targetCount) {
                    count = targetCount;
                    clearInterval(counter);
                }
                counterElement.querySelector('.counter-number').textContent = Math.floor(count);
            }, 16);
        }
    }

    // Initialize counter when partners section is in view
    const partnersObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initPartnersCounter();
                partnersObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const partnersSection = document.querySelector('.partners-section');
    if (partnersSection) {
        partnersObserver.observe(partnersSection);
    }
});

// Additional CSS for counter (add to CSS file)
const counterCSS = `
.partners-counter {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.counter-number {
    font-size: 3rem;
    font-weight: bold;
    color: #000066;
    margin-bottom: 0.5rem;
}

.counter-text {
    font-size: 1.1rem;
    color: #666;
    font-weight: 500;
}

.partner-card-active {
    transform: scale(1.05) !important;
    box-shadow: 0 25px 50px rgba(0,0,0,0.2) !important;
    z-index: 100 !important;
}

@media (max-width: 768px) {
    .partners-counter {
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .counter-number {
        font-size: 2.5rem;
    }
    
    .counter-text {
        font-size: 1rem;
    }
}
`;

// Inject counter CSS
const style = document.createElement('style');
style.textContent = counterCSS;
document.head.appendChild(style);