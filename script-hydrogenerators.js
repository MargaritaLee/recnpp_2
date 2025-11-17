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

    // Данные альбомов для гидрогенераторов
    const albumsData = {
        'in-stock': {
            title: 'В наличии - Гидрогенераторы',
            photos: Array.from({length: 24}, (_, i) => ({
                src: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e8f4f8'/%3E%3Ctext x='200' y='140' font-family='Arial' font-size='18' text-anchor='middle' fill='%23006666'%3EГидрогенератор%3C/text%3E%3Ctext x='200' y='170' font-family='Arial' font-size='16' text-anchor='middle' fill='%23006666'%3EДеталь ${i + 1}%3C/text%3E%3Ctext x='200' y='200' font-family='Arial' font-size='14' text-anchor='middle' fill='%23006666'%3E(В наличии)%3C/text%3E%3C/svg%3E`,
                caption: `Гидрогенераторная деталь ${i + 1} - в наличии`
            }))
        },
        'exclusive': {
            title: 'Эксклюзив - Гидрогенераторы',
            photos: Array.from({length: 22}, (_, i) => ({
                src: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8e8e8'/%3E%3Ctext x='200' y='140' font-family='Arial' font-size='18' text-anchor='middle' fill='%23993333'%3EЭксклюзив%3C/text%3E%3Ctext x='200' y='170' font-family='Arial' font-size='16' text-anchor='middle' fill='%23993333'%3EГидродеталь ${i + 1}%3C/text%3E%3Ctext x='200' y='200' font-family='Arial' font-size='14' text-anchor='middle' fill='%23993333'%3E(Уникальная)%3C/text%3E%3C/svg%3E`,
                caption: `Эксклюзивная гидродеталь ${i + 1} - специальное исполнение`
            }))
        },
        'bolts': {
            title: 'Болты - Гидрогенераторы',
            photos: Array.from({length: 20}, (_, i) => ({
                src: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e8f8e8'/%3E%3Ctext x='200' y='140' font-family='Arial' font-size='18' text-anchor='middle' fill='%23006633'%3EБолт%3C/text%3E%3Ctext x='200' y='170' font-family='Arial' font-size='16' text-anchor='middle' fill='%23006633'%3EГидро ${i + 1}%3C/text%3E%3Ctext x='200' y='200' font-family='Arial' font-size='14' text-anchor='middle' fill='%23006633'%3E(Водостойкий)%3C/text%3E%3C/svg%3E`,
                caption: `Болт для гидрогенератора ${i + 1} - водостойкое покрытие`
            }))
        },
        'contact-ring': {
            title: 'Контактное кольцо - Гидрогенераторы',
            photos: Array.from({length: 19}, (_, i) => ({
                src: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23fff8e8'/%3E%3Ctext x='200' y='140' font-family='Arial' font-size='16' text-anchor='middle' fill='%23663300'%3EКонтактное%3C/text%3E%3Ctext x='200' y='165' font-family='Arial' font-size='16' text-anchor='middle' fill='%23663300'%3EКольцо ${i + 1}%3C/text%3E%3Ctext x='200' y='190' font-family='Arial' font-size='14' text-anchor='middle' fill='%23663300'%3E(Гидро)%3C/text%3E%3C/svg%3E`,
                caption: `Контактное кольцо гидрогенератора ${i + 1} - антикоррозийное`
            }))
        },
        'oil-catcher': {
            title: 'Маслоуловитель - Гидрогенераторы',
            photos: Array.from({length: 21}, (_, i) => ({
                src: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e8e8f8'/%3E%3Ctext x='200' y='140' font-family='Arial' font-size='16' text-anchor='middle' fill='%23330066'%3EМаслоуловитель%3C/text%3E%3Ctext x='200' y='165' font-family='Arial' font-size='16' text-anchor='middle' fill='%23330066'%3EГидро ${i + 1}%3C/text%3E%3Ctext x='200' y='190' font-family='Arial' font-size='14' text-anchor='middle' fill='%23330066'%3E(Эффективный)%3C/text%3E%3C/svg%3E`,
                caption: `Маслоуловитель гидросистемы ${i + 1} - высокая эффективность`
            }))
        },
        'underband-segments': {
            title: 'Сегменты подбандажные - Гидрогенераторы',
            photos: Array.from({length: 25}, (_, i) => ({
                src: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8e8f4'/%3E%3Ctext x='200' y='130' font-family='Arial' font-size='14' text-anchor='middle' fill='%23660033'%3EПодбандажный%3C/text%3E%3Ctext x='200' y='150' font-family='Arial' font-size='14' text-anchor='middle' fill='%23660033'%3EСегмент ${i + 1}%3C/text%3E%3Ctext x='200' y='170' font-family='Arial' font-size='12' text-anchor='middle' fill='%23660033'%3EГидрогенератор%3C/text%3E%3Ctext x='200' y='190' font-family='Arial' font-size='12' text-anchor='middle' fill='%23660033'%3E(Водостойкий)%3C/text%3E%3C/svg%3E`,
                caption: `Подбандажный сегмент гидрогенератора ${i + 1} - водостойкое исполнение`
            }))
        },
        'agp-40': {
            title: 'АГП-40 - Гидрогенераторы',
            photos: Array.from({length: 20}, (_, i) => ({
                src: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f4e8f8'/%3E%3Ctext x='200' y='140' font-family='Arial' font-size='18' text-anchor='middle' fill='%23440066'%3EАГП-40%3C/text%3E%3Ctext x='200' y='170' font-family='Arial' font-size='16' text-anchor='middle' fill='%23440066'%3EГидро ${i + 1}%3C/text%3E%3Ctext x='200' y='200' font-family='Arial' font-size='14' text-anchor='middle' fill='%23440066'%3E(Спецверсия)%3C/text%3E%3C/svg%3E`,
                caption: `АГП-40 гидрокомпонент ${i + 1} - специальная версия`
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
                <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
                <div class="photo-caption">${photo.caption}</div>
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
            photoItem.innerHTML = `
                <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
                <div class="photo-caption">${photo.caption}</div>
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