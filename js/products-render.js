/**
 * products-render.js
 * 从 data/products.json 加载产品数据并动态渲染产品卡片
 */
(function() {
    'use strict';

    // 状态
    let allProducts = [];
    let brands = [];
    let categories = [];
    let activeCategory = 'all';
    let activeBrand = 'all';
    let searchQuery = '';

    // 占位图背景映射
    const placeholderBgs = {
        excavators: 'placeholder-bg-excavator',
        loaders: 'placeholder-bg-loaders',
        graders: 'placeholder-bg-graders',
        rollers: 'placeholder-bg-rollers',
        trucks: 'placeholder-bg-trucks',
        special: 'placeholder-bg-special'
    };

    // 占位图图标映射
    const placeholderIcons = {
        excavators: 'fa-digging',
        loaders: 'fa-truck-loading',
        graders: 'fa-road',
        rollers: 'fa-circle',
        trucks: 'fa-truck',
        special: 'fa-cogs'
    };

    // 初始化
    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('无法加载产品数据');
            const data = await response.json();

            brands = data.brands || [];
            categories = data.categories || [];
            allProducts = data.products || [];

            renderCategoryButtons();
            renderBrandButtons();
            renderProducts();

            // 绑定搜索
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    searchQuery = this.value.toLowerCase().trim();
                    renderProducts();
                });
            }
        } catch (err) {
            console.error('加载产品数据失败:', err);
            const container = document.getElementById('products-container');
            if (container) {
                container.innerHTML = '<div class="container"><div class="no-products"><i class="fas fa-exclamation-triangle text-danger"></i><p>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</p></div></div>';
            }
        }
    }

    // 渲染分类按钮
    function renderCategoryButtons() {
        const container = document.getElementById('category-buttons');
        if (!container) return;

        let html = '<button class="btn btn-outline-secondary btn-sm category-btn active" data-category="all">' + (typeof BHTC !== 'undefined' ? BHTC.t('cat.all') : 'Все') + '</button>';
        categories.forEach(cat => {
            html += '<button class="btn btn-outline-secondary btn-sm category-btn" data-category="' + cat.id + '"><i class="fas ' + cat.icon + ' me-1"></i>' + cat.name + '</button>';
        });
        container.innerHTML = html;

        // 绑定点击
        container.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeCategory = this.dataset.category;
                renderProducts();
            });
        });
    }

    // 渲染品牌按钮
    function renderBrandButtons() {
        const container = document.getElementById('brand-buttons');
        if (!container) return;

        let html = '<button class="brand-btn active" data-brand="all">' + (typeof BHTC !== 'undefined' ? BHTC.t('cat.all') : 'Все') + '</button>';
        brands.forEach(brand => {
            html += '<button class="brand-btn" data-brand="' + brand.id + '">' + brand.name + '</button>';
        });
        container.innerHTML = html;

        // 绑定点击
        container.querySelectorAll('.brand-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                container.querySelectorAll('.brand-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeBrand = this.dataset.brand;
                renderProducts();
            });
        });
    }

    // 过滤产品
    function getFilteredProducts() {
        return allProducts.filter(p => {
            const matchCategory = activeCategory === 'all' || p.category === activeCategory;
            const matchBrand = activeBrand === 'all' || p.brand === activeBrand;
            const matchSearch = !searchQuery ||
                p.name.toLowerCase().includes(searchQuery) ||
                (p.nameRu && p.nameRu.toLowerCase().includes(searchQuery)) ||
                p.brand.toLowerCase().includes(searchQuery);
            return matchCategory && matchBrand && matchSearch;
        });
    }

    // 获取品牌信息
    function getBrand(brandId) {
        return brands.find(b => b.id === brandId) || { name: brandId, country: 'Китай' };
    }

    // 渲染产品列表
    function renderProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        const filtered = getFilteredProducts();

        if (filtered.length === 0) {
            container.innerHTML = '<div class="container"><div class="no-products"><i class="fas fa-search"></i><p>Техника не найдена. Попробуйте изменить фильтры.</p></div></div>';
            return;
        }

        // 按品牌分组
        const grouped = {};
        filtered.forEach(p => {
            if (!grouped[p.brand]) grouped[p.brand] = [];
            grouped[p.brand].push(p);
        });

        let html = '';

        // 按品牌顺序渲染
        brands.forEach(brand => {
            if (!grouped[brand.id]) return;
            const brandProducts = grouped[brand.id];

            html += '<div class="container"><div class="brand-section">';
            html += '<div class="brand-header">';
            html += '<h2>' + brand.name + '</h2>';
            html += '<span class="brand-badge">' + brand.country + ' &bull; ' + brandProducts.length + ' моделей</span>';
            html += '</div>';
            html += '<div class="row g-4">';

            brandProducts.forEach(product => {
                html += renderProductCard(product);
            });

            html += '</div></div></div>';
        });

        // 处理没有在brands数组中定义的品牌
        Object.keys(grouped).forEach(brandId => {
            if (brands.find(b => b.id === brandId)) return;
            const brandProducts = grouped[brandId];
            html += '<div class="container"><div class="brand-section">';
            html += '<div class="brand-header"><h2>' + brandId + '</h2>';
            html += '<span class="brand-badge">' + brandProducts.length + ' моделей</span>';
            html += '</div><div class="row g-4">';
            brandProducts.forEach(p => { html += renderProductCard(p); });
            html += '</div></div></div>';
        });

        container.innerHTML = html;
    }

    // 渲染单个产品卡片
    function renderProductCard(product) {
        const brand = getBrand(product.brand);
        const categoryBg = placeholderBgs[product.category] || 'placeholder-bg-special';
        const categoryIcon = placeholderIcons[product.category] || 'fa-cogs';
        const hasImage = product.image && product.image.trim() !== '';

        let imageHtml;
        if (hasImage) {
            imageHtml = '<img src="' + product.image + '" alt="' + product.name + '" onerror="this.parentElement.classList.add(\'' + categoryBg + '\');this.style.display=\'none\';this.nextElementSibling.style.display=\'block\';">' +
                        '<div class="placeholder-icon" style="display:none;"><i class="fas ' + categoryIcon + '"></i></div>';
        } else {
            imageHtml = '<div class="placeholder-icon"><i class="fas ' + categoryIcon + '"></i></div>';
        }

        // 图片容器背景
        const containerClass = hasImage ? 'product-img-container' : 'product-img-container ' + categoryBg;

        // 徽章
        let badgeHtml = '';
        if (product.badge && product.badgeText) {
            badgeHtml = '<span class="badge ' + product.badge + ' position-absolute" style="top:10px;left:10px;font-size:0.75rem;">' + product.badgeText + '</span>';
        }

        // 参数列表
        let specsHtml = '';
        if (product.specs && product.specs.length > 0) {
            specsHtml = '<ul class="specs-list mt-3">';
            product.specs.forEach(spec => {
                specsHtml += '<li><i class="fas ' + (spec.icon || 'fa-check') + '"></i>' + spec.text + '</li>';
            });
            specsHtml += '</ul>';
        }

        // 价格
        let priceClass = product.price ? 'price-tag' : 'price-tag ask';
        let priceText = product.priceDisplay || (typeof BHTC !== 'undefined' ? BHTC.t('products.ask') : 'По запросу');

        // 卡片HTML
        return '<div class="col-lg-3 col-md-4 col-sm-6">' +
            '<div class="card product-card h-100">' +
            '<div class="' + containerClass + '">' +
            badgeHtml +
            imageHtml +
            '</div>' +
            '<div class="card-body">' +
            '<h6 class="card-title fw-bold">' + product.name + '</h6>' +
            '<p class="text-muted small mb-2">' + (product.nameRu || '') + '</p>' +
            specsHtml +
            '</div>' +
            '<div class="card-footer bg-white border-top-0 pb-3">' +
            '<div class="d-flex justify-content-between align-items-center">' +
            '<span class="' + priceClass + '">' + priceText + '</span>' +
            '<a href="https://wa.me/8618167856752?text=' + encodeURIComponent('Здравствуйте! Интересуюсь: ' + product.name) + '" class="btn btn-sm whatsapp-btn" target="_blank"><i class="fab fa-whatsapp"></i></a>' +
            '</div></div></div></div>';
    }
})();
