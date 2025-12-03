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

    // Данные альбомов для турбогенераторов
    const albumsData = {
        'bolts': {
            title: 'Болты и винты',
            photos: Array.from({length: 20}, (_, i) => ({
                src: `/gallery/turbo/bolts_${i + 1}.jpg`,
                caption: ''
            }))
        },
        'exclusive': {
            title: 'Эксклюзив',
            photos: Array.from({length: 20}, (_, i) => ({
                src: `/gallery/turbo/exclusive_${i + 1}.jpg`,
                caption: ''
            }))
        },
        'oil-catcher': {
            title: 'Маслоуловитель',
            photos: Array.from({length: 20}, (_, i) => ({
                src: `/gallery/turbo/oil-catcher_${i + 1}.jpg`,
                caption: ''
            }))
        },
        'contact-ring': {
            title: 'Контактное кольцо',
            photos: Array.from({length: 20}, (_, i) => ({
                src: `/gallery/turbo/contact-ring_${i + 1}.jpg`,
                caption: ''
            }))
        },
        'underband-segments': {
            title: 'Подбандажные сегменты',
            photos: Array.from({length: 20}, (_, i) => ({
                src: `/gallery/turbo/underband-segments_${i + 1}.jpg`,
                caption: ''
            }))
        },
        'agp-40': {
            title: 'АГП-40',
            photos: Array.from({length: 20}, (_, i) => ({
                src: `/gallery/turbo/agp-40_${i + 1}.jpg`,
                caption: ''
            }))
        }
    };

    // Modal elements
    const modal = document.getElementById('albumModal');
    const modalTitle = document.getElementById('modalTitle');
    const albumPhotos = document.getElementById('albumPhotos');
    const closeBtn = document.querySelector('.close');

    // Album button click handlers
    const albumButtons = document.querySelectorAll('.album-btn');
    albumButtons.forEach(button => {
        // Обновляем текст кнопок в соответствии с названиями альбомов
        const albumId = button.getAttribute('data-album');
        if (albumsData[albumId]) {
            button.textContent = albumsData[albumId].title;
        }
        
        button.addEventListener('click', function() {
            const albumId = this.getAttribute('data-album');
            openAlbum(albumId);
        });
    });

    // Open album function
    function openAlbum(albumId) {
        const album = albumsData[albumId];
        if (!album) return;

        // Set modal title
        modalTitle.textContent = album.title;

        // Clear previous photos
        albumPhotos.innerHTML = '';

        // Add photos to modal
        album.photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `
                <img src="${photo.src}" alt="Фото ${index + 1}" loading="lazy">
                ${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
            `;
            albumPhotos.appendChild(photoItem);
        });

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modal events
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
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

    // Animation on scroll for album cards
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate album cards
    const albumCards = document.querySelectorAll('.album-card');
    albumCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Pagination for large albums
    let currentPage = 1;
    const photosPerPage = 12;

    function showPage(albumId, page) {
        const album = albumsData[albumId];
        if (!album) return;

        const startIndex = (page - 1) * photosPerPage;
        const endIndex = startIndex + photosPerPage;
        const pagePhotos = album.photos.slice(startIndex, endIndex);

        albumPhotos.innerHTML = '';

        pagePhotos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            const photoIndex = startIndex + index + 1;
            photoItem.innerHTML = `
                <img src="${photo.src}" alt="Фото ${photoIndex}" loading="lazy">
                ${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
            `;
            albumPhotos.appendChild(photoItem);
        });

        // Add pagination if needed
        if (album.photos.length > photosPerPage) {
            addPagination(albumId, page, Math.ceil(album.photos.length / photosPerPage));
        }

        currentPage = page;
    }

    function addPagination(albumId, currentPage, totalPages) {
        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                showPage(albumId, i);
            });
            pagination.appendChild(pageBtn);
        }

        albumPhotos.appendChild(pagination);
    }

});
