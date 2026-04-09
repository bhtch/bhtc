// 俄语工程机械产品数据库
const products = [
    {
        id: 1,
        name: "Экскаватор Hyundai R220LC-9",
        category: "Экскаваторы",
        price: "$150,000",
        description: "Современный экскаватор для строительных работ с мощным двигателем",
        features: [
            "Двигатель: 152 л.с.",
            "Вес: 22,000 кг",
            "Объем ковша: 0.8-1.2 м³",
            "Глубина копания: 6.8 м"
        ],
        images: [
            "https://via.placeholder.com/800x600/2c3e50/ffffff?text=Экскаватор+Front",
            "https://via.placeholder.com/800x600/3498db/ffffff?text=Экскаватор+Side"
        ]
    },
    {
        id: 2,
        name: "Погрузчик Cat 950M",
        category: "Погрузчики",
        price: "$120,000",
        description: "Надежный колесный погрузчик для различных строительных задач",
        features: [
            "Двигатель: 186 л.с.",
            "Мощность: 139 кВт",
            "Грузоподъемность: 4,500 кг",
            "Объем ковша: 3.0 м³"
        ],
        images: [
            "https://via.placeholder.com/800x600/e74c3c/ffffff?text=Погрузчик+Cat",
            "https://via.placeholder.com/800x600/2c3e50/ffffff?text=Погрузчик+Working"
        ]
    },
    {
        id: 3,
        name: "Кран XCMG QY25K5",
        category: "Краны",
        price: "$200,000",
        description: "Автомобильный кран для тяжелых строительных работ",
        features: [
            "Грузоподъемность: 25 тонн",
            "Длина стрелы: 38 м",
            "Двигатель: 276 л.с.",
            "Максимальный вылет: 34 м"
        ],
        images: [
            "https://via.placeholder.com/800x600/3498db/ffffff?text=Кран+XCMG",
            "https://via.placeholder.com/800x600/2c3e50/ffffff?text=Кран+Working"
        ]
    },
    {
        id: 4,
        name: "Бульдозер Komatsu D65EX-18",
        category: "Бульдозеры",
        price: "$180,000",
        description: "Мощный бульдозер для земляных работ",
        features: [
            "Двигатель: 224 л.с.",
            "Вес: 22,000 кг",
            "Толщина отвала: 4.5 м",
            "Мощность: 167 кВт"
        ],
        images: [
            "https://via.placeholder.com/800x600/f39c12/ffffff?text=Бульдозер+Komatsu",
            "https://via.placeholder.com/800x600/2c3e50/ffffff?text=Бульдозер+Site"
        ]
    },
    {
        id: 5,
        name: "Каток Volvo SD115",
        category: "Катки",
        price: "$90,000",
        description: "Каток для уплотнения грунта и асфальта",
        features: [
            "Ширина уплотнения: 1.4 м",
            "Вес: 11,500 кг",
            "Вибрационная частота: 38/48 Гц",
            "Мощность: 115 л.с."
        ],
        images: [
            "https://via.placeholder.com/800x600/27ae60/ffffff?text=Каток+Volvo",
            "https://via.placeholder.com/800x600/2c3e50/ffffff?text=Каток+Road"
        ]
    },
    {
        id: 6,
        name: "Бетоносмеситель Liebherr HTM 905",
        category: "Бетонная техника",
        price: "$85,000",
        description: "Современная бетономешалка для строительных площадок",
        features: [
            "Объем барабана: 9 м³",
            "Мощность двигателя: 335 л.с.",
            "Максимальная скорость: 80 км/ч",
            "Расход топлива: 28 л/100км"
        ],
        images: [
            "https://via.placeholder.com/800x600/8e44ad/ffffff?text=Бетоносмеситель",
            "https://via.placeholder.com/800x600/2c3e50/ffffff?text=Бетонная+Смесь"
        ]
    },
    {
        id: 7,
        name: "Мини-экскаватор Kubota U35-4",
        category: "Экскаваторы",
        price: "$45,000",
        description: "Компактный экскаватор для городских строительных работ",
        features: [
            "Двигатель: 35 л.с.",
            "Вес: 3,500 кг",
            "Объем ковша: 0.12 м³",
            "Глубина копания: 3.6 м"
        ],
        images: [
            "https://via.placeholder.com/800x600/3498db/ffffff?text=Мини-Экскаватор",
            "https://via.placeholder.com/800x600/2c3e50/ffffff?text=Мини+В Работе"
        ]
    },
    {
        id: 8,
        name: "Телескопический погрузчик JCB 540-170",
        category: "Погрузчики",
        price: "$95,000",
        description: "Гибкий погрузчик с телескопической стрелой",
        features: [
            "Вылет стрелы: 17 м",
            "Грузоподъемность: 4,000 кг",
            "Двигатель: 130 л.с.",
            "Высота подъема: 17 м"
        ],
        images: [
            "https://via.placeholder.com/800x600/e74c3c/ffffff?text=Телескопический",
            "https://via.placeholder.com/800x600/2c3e50/ffffff?text=Погрузчик+В Работе"
        ]
    }
];

// 分类数据
const categories = [
    "Все товары",
    "Экскаваторы",
    "Погрузчики",
    "Краны",
    "Бульдозеры",
    "Катки",
    "Бетонная техника"
];

// 工具函数：获取产品详情
function getProductById(id) {
    return products.find(product => product.id == id);
}

// 工具函数：根据分类筛选产品
function getProductsByCategory(category) {
    if (category === "Все товары" || category === "Все") {
        return products;
    }
    return products.filter(product => product.category === category);
}

// 工具函数：搜索产品
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面
    const currentPage = window.location.pathname.split('/').pop();
    
    // 如果是产品详情页，获取产品ID并展示详情
    if (currentPage === 'product-detail.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId) {
            displayProductDetails(productId);
        }
    }
    
    // 如果是产品列表页，显示所有产品
    if (currentPage === 'products.html') {
        displayAllProducts();
        setupSearch();
        setupCategoryFilter();
    }
});

// 显示产品详情
function displayProductDetails(productId) {
    const product = getProductById(productId);
    const container = document.getElementById('product-details');
    
    if (!container || !product) return;
    
    container.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="product-gallery">
                    <img src="${product.images[0]}" alt="${product.name}" class="img-fluid mb-3">
                    <div class="row">
                        ${product.images.map((img, index) => `
                            <div class="col-4">
                                <img src="${img}" alt="${product.name} - вид ${index+1}" 
                                     class="img-fluid thumbnail" onclick="changeMainImage('${img}')">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <h1 class="mb-3">${product.name}</h1>
                <h3 class="text-danger mb-4">${product.price}</h3>
                
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Описание</h5>
                        <p class="card-text">${product.description}</p>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Технические характеристики</h5>
                        <ul class="list-group list-group-flush">
                            ${product.features.map(feature => `
                                <li class="list-group-item">${feature}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="d-grid gap-2 d-md-flex">
                    <button class="btn btn-primary btn-lg me-2" onclick="requestQuote(${product.id})">
                        <i class="fas fa-envelope me-2"></i>Запросить коммерческое предложение
                    </button>
                    <button class="btn btn-outline-secondary btn-lg">
                        <i class="fas fa-phone me-2"></i>Позвонить специалисту
                    </button>
                </div>
            </div>
        </div>
        
        <div class="row mt-5">
            <div class="col-12">
                <h3 class="mb-4">Похожие товары</h3>
                <div class="row" id="related-products">
                    <!-- Похожие товары будут загружены здесь -->
                </div>
            </div>
        </div>
    `;
    
    // 显示 похожие товары
    displayRelatedProducts(product.category, product.id);
}

// 显示所有产品
function displayAllProducts(filteredProducts = null) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    const productsToShow = filteredProducts || products;
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Товары не найдены. Попробуйте изменить критерии поиска.
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productsToShow.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 product-card">
                <div class="position-relative">
                    <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                    <span class="badge bg-primary position-absolute top-0 start-0 m-2">
                        ${product.category}
                    </span>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text flex-grow-1">${product.description}</p>
                    <div class="mt-auto">
                        <h4 class="text-danger">${product.price}</h4>
                        <div class="d-grid gap-2">
                            <a href="product-detail.html?id=${product.id}" class="btn btn-primary">
                                <i class="fas fa-info-circle me-2"></i>Подробнее
                            </a>
                            <button class="btn btn-outline-secondary" onclick="quickRequest(${product.id})">
                                <i class="fas fa-quote-right me-2"></i>Быстрый запрос
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 显示相关产品
function displayRelatedProducts(category, excludeId) {
    const container = document.getElementById('related-products');
    if (!container) return;
    
    const related = products.filter(p => 
        p.category === category && p.id != excludeId
    ).slice(0, 3); // Показываем максимум 3 похожих товара
    
    if (related.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Похожих товаров пока нет.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = related.map(product => `
        <div class="col-md-4">
            <div class="card h-100">
                <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h6 class="card-title">${product.name}</h6>
                    <p class="text-danger mb-2">${product.price}</p>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-sm btn-outline-primary">
                        Подробнее
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// 设置搜索功能
function setupSearch() {
    const searchInput = document.getElementById('product-search');
    const searchButton = document.getElementById('search-button');
    
    if (!searchInput || !searchButton) return;
    
    // 点击搜索按钮
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // Enter键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

// 执行搜索
function performSearch(query) {
    if (query.trim() === '') {
        displayAllProducts();
        return;
    }
    
    const results = searchProducts(query);
    displayAllProducts(results);
    
    // 更新搜索结果统计
    const stats = document.getElementById('search-stats');
    if (stats) {
        stats.innerHTML = `
            <small class="text-muted">
                Найдено ${results.length} товаров по запросу: "${query}"
            </small>
        `;
    }
}

// 设置分类筛选
function setupCategoryFilter() {
    const container = document.getElementById('category-filter');
    if (!container) return;
    
    // 生成分类按钮
    container.innerHTML = categories.map(category => `
        <button class="btn btn-outline-primary me-2 mb-2" onclick="filterByCategory('${category}')">
            ${category}
        </button>
    `).join('');
}

// 按分类筛选
function filterByCategory(category) {
    const filteredProducts = category === 'Все товары' 
        ? products 
        : getProductsByCategory(category);
    
    displayAllProducts(filteredProducts);
    
    // 更新活动按钮
    const buttons = document.querySelectorAll('#category-filter .btn');
    buttons.forEach(btn => {
        if (btn.textContent.trim() === category) {
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('btn-primary');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
        }
    });
}

// 更换主图片
function changeMainImage(src) {
    const mainImage = document.querySelector('.product-gallery img.img-fluid');
    if (mainImage) {
        mainImage.src = src;
    }
}

// 快速请求报价
function quickRequest(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    // 显示模态框或提示
    alert(`Запрос на товар: ${product.name}\nМы свяжемся с вами в ближайшее время.`);
    
    // 这里可以添加实际的表单提交逻辑
    console.log(`Quick request for product: ${product.name} (ID: ${productId})`);
}

// 请求正式报价
function requestQuote(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    // 将产品信息存储到本地存储，以便在联系表单中使用
    localStorage.setItem('requestedProduct', JSON.stringify({
        id: product.id,
        name: product.name
    }));
    
    // 跳转到联系页面
    window.location.href = 'contact.html?product=' + productId;
}

// 导出模块（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        categories,
        getProductById,
        getProductsByCategory,
        searchProducts
    };
}