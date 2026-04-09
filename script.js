/**
 * Основной JavaScript файл для сайта СтройТехника
 * Содержит общие функции и обработчики событий для всех страниц
 */

// Конфигурация сайта
const siteConfig = {
    companyName: '百贺天成 BHTC',
    contactPhone: '+86 181 6785 6752',
    contactEmail: 'info@bhtch.com',
    website: 'www.xjbhtch.com',
    apiBaseUrl: '/api',
    debugMode: false
};

// Глобальные переменные
let currentPage = window.location.pathname;
let userPreferences = {
    language: 'ru',
    currency: 'USD',
    theme: 'light'
};

// Основной объект приложения
const StroyTehnika = {
    // Инициализация приложения
    init: function() {
        this.log('Инициализация сайта...');
        
        // Загрузка сохраненных предпочтений
        this.loadPreferences();
        
        // Настройка темы
        this.setTheme(userPreferences.theme);
        
        // Настройка обработчиков событий
        this.bindEvents();
        
        // Настройка форм
        this.initForms();
        
        // Настройка навигации
        this.initNavigation();
        
        // Инициализация специфичных для страницы функций
        this.initPageSpecific();
        
        this.log('Сайт инициализирован');
    },
    
    // Логирование (только в режиме отладки)
    log: function(message, data = null) {
        if (siteConfig.debugMode) {
            console.log(`[${new Date().toLocaleTimeString()}] ${message}`, data || '');
        }
    },
    
    // Загрузка сохраненных предпочтений пользователя
    loadPreferences: function() {
        try {
            const savedPrefs = localStorage.getItem('stroytehnika_preferences');
            if (savedPrefs) {
                const parsed = JSON.parse(savedPrefs);
                userPreferences = { ...userPreferences, ...parsed };
                this.log('Предпочтения загружены', userPreferences);
            }
        } catch (error) {
            this.log('Ошибка загрузки предпочтений', error);
        }
    },
    
    // Сохранение предпочтений пользователя
    savePreferences: function() {
        try {
            localStorage.setItem('stroytehnika_preferences', JSON.stringify(userPreferences));
            this.log('Предпочтения сохранены', userPreferences);
        } catch (error) {
            this.log('Ошибка сохранения предпочтений', error);
        }
    },
    
    // Установка темы
    setTheme: function(theme) {
        document.body.setAttribute('data-theme', theme);
        userPreferences.theme = theme;
        this.savePreferences();
        this.log('Тема установлена', theme);
    },
    
    // Переключение темы
    toggleTheme: function() {
        const currentTheme = userPreferences.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },
    
    // Настройка обработчиков событий
    bindEvents: function() {
        // Переключение темы
        const themeToggle = document.querySelector('[data-toggle="theme"]');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Прокрутка к верху
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Показать/скрыть кнопку при прокрутке
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });
        }
        
        // Фильтрация товаров
        const filterButtons = document.querySelectorAll('[data-category]');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterProducts(category);
                
                // Обновляем активную кнопку
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Поиск товаров

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                this.searchProducts(query);
            });
        }
        
        // Галерея изображений
        this.initGallery();
        
        // FAQ аккордеон
        this.initFAQ();
        
        // Обработка форм
        this.initFormHandlers();
    },
    
    // Настройка навигации
    initNavigation: function() {
        // Подсветка активной страницы в навигации
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || 
                (currentPath === '/' && linkPath === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Мобильное меню
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                navbarCollapse.classList.toggle('show');
            });
            
            // Закрыть меню при клике на ссылку

            const navLinksMobile = document.querySelectorAll('.navbar-nav .nav-link');
            navLinksMobile.forEach(link => {
                link.addEventListener('click', () => {
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    navbarCollapse.classList.remove('show');
                });
            });
        }
    },
    
    // Инициализация форм
    initForms: function() {
        // Валидация форм
        const forms = document.querySelectorAll('form[data-validate]');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e));
        });
    },
    
    // Валидация формы
    validateForm: function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        let isValid = true;
        const errors = [];
        
        // Проверка обязательных полей

        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
                errors.push(`Поле "${field.previousElementSibling?.textContent || field.name}" обязательно для заполнения`);
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        // Проверка email
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (field.value && !emailRegex.test(field.value)) {
                isValid = false;
                field.classList.add('is-invalid');
                errors.push('Введите корректный email адрес');
            }
        });
        
        // Проверка телефона
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
            if (field.value && !phoneRegex.test(field.value)) {
                isValid = false;
                field.classList.add('is-invalid');
                errors.push('Введите корректный номер телефона');
            }
        });
        
        if (!isValid) {
            this.showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
            errors.forEach(error => console.error(error));
            return false;
        }
        
        // Отправка формы
        this.submitForm(form, formData);
        return true;
    },
    
    // Отправка формы
    submitForm: function(form, formData) {
        const formId = form.id || 'contact-form';
        const submitBtn = form.querySelector('[type="submit"]');
        
        // Блокировка кнопки отправки

        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        }
        
        // Имитация отправки (в реальном проекте здесь будет fetch запрос)

        setTimeout(() => {
            // Восстановление кнопки
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить';
            }
            
            // Показать сообщение об успехе

            this.showNotification('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Очистка формы

            form.reset();
            
            // Логирование
            const formDataObj = Object.fromEntries(formData);
            this.log('Форма отправлена', { formId, data: formDataObj });
        }, 1500);
    },
    
    // Инициализация галереи
    initGallery: function() {
        const thumbnails = document.querySelectorAll('.thumbnails img');
        const mainImage = document.getElementById('main-image');
        
        if (thumbnails.length && mainImage) {
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', function() {
                    // Обновление основного изображения
                    mainImage.src = this.src;
                    
                    // Обновление активной миниатюры

                    thumbnails.forEach(img => img.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
    },
    
    // Инициализация FAQ
    initFAQ: function() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');
                
                // Закрываем все открытые FAQ
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Открываем текущий, если он был закрыт
                if (!isActive) {
                    faleItem.classList.add('active');
                }
            });
        });
    },
    
    // Настройка обработчиков форм
    initFormHandlers: function() {
        // Маска для телефона

        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
                }
                this.value = value.substring(0, 18);
            });
        });
    },
    
    // Инициализация функций, специфичных для страницы
    initPageSpecific: function() {
        const page = currentPage.split('/').pop() || 'index.html';
        
        switch(page) {
            case 'products.html':
                this.initProductsPage();
                break;
            case 'product-detail.html':
                this.initProductDetailPage();
                break;
            case 'contact.html':
                this.initContactPage();
                break;
            case 'services.html':
                this.initServicesPage();
                break;
            default:
                this.initHomePage();
        }
    },
    
    // Функции для главной страницы
    initHomePage: function() {
        this.log('Инициализация главной страницы');
        
        // Инициализация слайдера (если есть)

        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            this.initSlider(heroSlider);
        }
    },
    
    // Функции для страницы продуктов
    initProductsPage: function() {
        this.log('Инициализация страницы продуктов');
        
        // Загрузка продуктов (имитация)

        this.loadProducts();
    },
    
    // Функции для страницы деталей продукта
    initProductDetailPage: function() {
        this.log('Инициализация страницы деталей продукта');
        
        // Загрузка данных продукта

        const productId = this.getProductIdFromURL();
        if (productId) {
            this.loadProductDetails(productId);
        }
        
        // Инициализация галереи

        this.initImageZoom();
    },
    
    // Функции для контактной страницы
    initContactPage: function() {
        this.log('Инициализация контактной страницы');
        
        // Инициализация карты (заглушка)

        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            this.initMap(mapContainer);
        }
    },
    
    // Функции для страницы услуг
    initServicesPage: function() {
        this.log('Инициализация страницы услуг');
        
        // Инициализация табов услуг

        const serviceTabs = document.querySelector('.service-tabs');
        if (serviceTabs) {
            this.initServiceTabs(serviceTabs);
        }
    },
    
    // Загрузка продуктов (имитация)

    loadProducts: function() {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;
        
        // Здесь должна быть загрузка данных с сервера
        // В демо-версии используем статические данные
        
        const products = [
            {
                id: 1,
                name: 'Экскаватор Cat 320',
                price: 85000,
                category: 'excavators',
                image: 'https://images.unsplash.com/photo-1570126646281-5ec88111777f',
                description: 'Гусеничный экскаватор для сложных земляных работ'
            },
            {
                id: 2,
                name: 'Погрузчик Volvo L220H',
                price: 72000,
                category: 'loaders',
                image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088',
                description: 'Фронтальный погрузчик для погрузочно-разгрузочных работ'
            }
        ];
        
        this.log('Продукты загружены', products);
    },
    
    // Фильтрация продуктов по категории

    filterProducts: function(category) {
        const productItems = document.querySelectorAll('.product-item');
        
        productItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
            }
        });
        
        this.log('Фильтр применен', category);
    },
    
    // Поиск продуктов

    searchProducts: function(query) {
        const productItems = document.querySelectorAll('.product-item');
        
        productItems.forEach(item => {
            const productName = item.querySelector('.card-title').textContent.toLowerCase();
            if (query === '' || productName.includes(query.toLowerCase())) {
                item.style.display = 'block';
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
            }
        });
        
        this.log('Поиск выполнен', query);
    },
    
    // Получение ID продукта из URL
    getProductIdFromURL: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    },
    
    // Загрузка деталей продукта (имитация)
    loadProductDetails: function(productId) {
        this.log('Загрузка деталей продукта', productId);
        
        // Здесь должна быть загрузка данных с сервера
        // В демо-версии просто логируем
        console.log(`Загрузка данных для продукта ID: ${productId}`);
    },
    
    // Инициализация увеличения изображений

    initImageZoom: function() {
        const mainImage = document.getElementById('main-image');
        if (mainImage) {
            mainImage.addEventListener('click', function() {
                this.classList.toggle('zoomed');
            });
        }
    },
    
    // Инициализация слайдера

    initSlider: function(container) {
        this.log('Инициализация слайдера', container);
        // Здесь будет код для инициализации слайдера
    },
    
    // Инициализация карты

    initMap: function(container) {
        this.log('Инициализация карты', container);
        // Здесь будет код для инициализации карты
    },
    
    // Инициализация вкладок услуг

    initServiceTabs: function(container) {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Обновление активной кнопки

                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Показать активную вкладку

                tabContents.forEach(content => {
                    if (content.id === tabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    },
    
    // Показать уведомление

    showNotification: function(message, type = 'info') {
        // Создание элемента уведомления

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                  type === 'error' ? 'exclamation-circle' : 
                                  'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Добавление в DOM

        document.body.appendChild(notification);
        
        // Анимация появления

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Удаление уведомления через 5 секунд

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Обработчик закрытия

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    },
    
    // Получение ID продукта из URL (для страницы деталей)

    getProductIdFromURL: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    },
    
    // Проверка формата email

    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Проверка формата телефона

    validatePhone: function(phone) {
        const re = /^[\d\s\+\-\(\)]{10,}$/;
        return re.test(phone);
    },
    
    // Установка валюты

    setCurrency: function(currency) {
        userPreferences.currency = currency;
        this.savePreferences();
        this.updatePrices();
    },
    
    // Обновление цен на странице (имитация)

    updatePrices: function() {
        const priceElements = document.querySelectorAll('[data-price]');
        
        priceElements.forEach(element => {
            const basePrice = parseFloat(element.getAttribute('data-price'));
            const convertedPrice = this.convertCurrency(basePrice, userPreferences.currency);
            
            const formattedPrice = this.formatPrice(convertedPrice, userPreferences.currency);
            element.textContent = formattedPrice;
        });
        
        this.log('Цены обновлены', userPreferences.currency);
    },
    
    // Конвертация валюты (заглушка)

    convertCurrency: function(amount, toCurrency) {
        // В реальном проекте здесь будет API конвертации

        const rates = {
            USD: 1,
            EUR: 0.85,
            RUB: 75
        };
        
        return amount * (rates[toCurrency] || 1);
    },
    
    // Форматирование цены

    formatPrice: function(amount, currency) {
        const formatter = new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        
        return formatter.format(amount);
    },
    
    // Отправка формы заказа

    submitOrderForm: function(formData) {
        this.log('Отправка формы заказа', formData);
        
        // Имитация отправки

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    orderId: 'ORD-' + Date.now()
                });
            }, 1500);
        });
    },
    
    // Обновление корзины (если будет реализована)

    updateCart: function() {
        const cartItems = JSON.parse(localStorage.getItem('stroytehnika_cart') || '[]');
        const cartCount = document.getElementById('cart-count');
        
        if (cartCount) {
            cartCount.textContent = cartItems.length;
        }
    },
    
    // Инициализация обработчиков для корзины (если будет реализована)

    initCart: function() {
        const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                const productName = e.target.getAttribute('data-product-name');
                const productPrice = parseFloat(e.target.getAttribute('data-product-price'));
                
                this.addToCart(productId, productName, productPrice);
            });
        });
    },
    
    // Добавление товара в корзину

    addToCart: function(productId, productName, productPrice) {
        const cart = JSON.parse(localStorage.getItem('stroytehnika_cart') || '[]');
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }
        
        localStorage.setItem('stroytehnika_cart', JSON.stringify(cart));
        this.updateCart();
        
        this.showNotification(`${productName} добавлен в корзину`, 'success');
    }
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    StroyTehnika.init();
});

// Глобальные вспомогательные функции

/**
 * Форматирование даты

 */
function formatDate(date, format = 'ru-RU') {
    return new Intl.DateTimeFormat(format, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

/**
 * Форматирование числа

 */
function formatNumber(number, options = {}) {
    const defaultOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    };
    
    return new Intl.NumberFormat('ru-RU', {
        ...defaultOptions,
        ...options
    }).format(number);
}

/**
 * Проверка мобильного устройства

 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Проверка планшетного устройства

 */
function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Проверка темной темы

 */
function isDarkTheme() {
    return document.body.getAttribute('data-theme') === 'dark' ||
           window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Плавная прокрутка к элементу

 */
function smoothScrollTo(elementId, offset = 100) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Копирование в буфер обмена

 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Текст скопирован:', text);
    }).catch(err => {
        console.error('Ошибка копирования:', err);
    });
}

/**
 * Валидация номера телефона

 */
function validatePhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Валидация email

 */
function validateEmailAddress(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Форматирование номера телефона

 */
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
        return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
    }
    return phone;
}

/**
 * Получение параметра из URL

 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Установка параметра URL

 */
function setUrlParameter(name, value) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(name, value);
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
}

/**
 * Удаление параметра URL

 */
function removeUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(name);
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
}