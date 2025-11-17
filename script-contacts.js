/* Добавьте эти стили в ваш style-contacts.css */

.menu-toggle {
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
    background: none;
    border: none;
    color: #333;
    padding: 5px;
    transition: color 0.3s ease;
}

.menu-toggle:hover {
    color: #000066;
}

/* Убедитесь, что эти стили для мобильного меню присутствуют */
@media (max-width: 768px) {
    .menu-toggle {
        display: block;
    }
    
    .nav-menu {
        position: fixed;
        top: 80px;
        left: -100%;
        width: 100%;
        height: calc(100vh - 80px);
        background: white;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 2rem;
        transition: left 0.3s ease;
        gap: 0;
        z-index: 999;
    }
    
    .nav-menu.active {
        left: 0;
    }
    
    .nav-menu li {
        width: 100%;
        text-align: center;
    }
    
    .nav-menu a {
        display: block;
        padding: 1rem;
        border-bottom: 1px solid #eee;
        font-size: 1.1rem;
    }
    
    .nav-menu a:hover {
        background: #f8f9fa;
    }
}
