/**
 * admin.js - 后台管理系统核心逻辑
 * 使用 localStorage 持久化产品数据
 * 支持图片上传(Base64)、图片预览、规格参数编辑
 */
const AdminApp = (function() {
    'use strict';

    const STORAGE_KEY = 'stroytehnika_products';
    let data = { brands: [], categories: [], products: [] };
    let deleteTargetId = null;

    // 分类名称映射（中文）
    const categoryNames = {
        excavators: '挖掘机',
        loaders: '装载机',
        graders: '平地机',
        rollers: '压路机',
        trucks: '自卸车',
        special: '特种设备'
    };

    // 临时存储当前编辑的图片Base64
    let currentImageBase64 = '';

    // 初始化
    async function init() {
        loadData();
        await loadFromJSON();
        saveData();
        renderDashboard();
        renderProductsTable();
        renderExportPage();
        bindEvents();
    }

    // 从 products.json 加载初始数据（仅首次或当 localStorage 为空时）
    async function loadFromJSON() {
        if (data.products.length > 0) return;
        try {
            const resp = await fetch('../data/products.json');
            if (resp.ok) {
                const json = await resp.json();
                data.brands = json.brands || [];
                data.categories = json.categories || [];
                data.products = json.products || [];
                saveData();
            }
        } catch(e) {
            console.log('首次加载: 使用默认数据');
        }
    }

    // localStorage 操作
    function loadData() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                data = JSON.parse(stored);
            }
        } catch(e) {
            console.error('读取本地存储失败:', e);
        }
    }

    // 按品牌顺序排序 products（柳工→国机→陕汽）
    function sortProductsByBrand() {
        const brandOrder = data.brands.reduce((map, b, i) => { map[b.id] = i; return map; }, {});
        data.products.sort((a, b) => {
            const orderA = brandOrder[a.brand] !== undefined ? brandOrder[a.brand] : 999;
            const orderB = brandOrder[b.brand] !== undefined ? brandOrder[b.brand] : 999;
            if (orderA !== orderB) return orderA - orderB;
            return a.id - b.id;
        });
    }

    function saveData() {
        try {
            sortProductsByBrand();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch(e) {
            console.error('保存到本地存储失败:', e);
        }
    }

    // 生成新ID
    function nextId() {
        if (data.products.length === 0) return 1;
        return Math.max(...data.products.map(p => p.id)) + 1;
    }

    // ====== 页面切换 ======
    function switchPage(page) {
        document.querySelectorAll('[id^="page-"]').forEach(el => el.style.display = 'none');
        const target = document.getElementById('page-' + page);
        if (target) target.style.display = 'block';

        document.getElementById('page-title').textContent = {
            dashboard: '仪表盘',
            products: '产品管理',
            export: '数据导出'
        }[page] || page;

        document.querySelectorAll('.sidebar-nav a').forEach(a => {
            a.classList.toggle('active', a.dataset.page === page);
        });

        document.getElementById('sidebar').classList.remove('show');

        if (page === 'export') renderExportPage();
    }

    // ====== 仪表盘 ======
    function renderDashboard() {
        const statsRow = document.getElementById('stats-row');
        const totalProducts = data.products.length;
        const totalBrands = data.brands.length;
        const withPrice = data.products.filter(p => p.price).length;
        const withImage = data.products.filter(p => p.image && (p.image.startsWith('data:') || p.image.trim())).length;
        const noImage = totalProducts - withImage;

        statsRow.innerHTML = `
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);"><i class="fas fa-boxes"></i></div>
                    <div><h3>${totalProducts}</h3><p>总产品数</p></div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);"><i class="fas fa-building"></i></div>
                    <div><h3>${totalBrands}</h3><p>品牌数</p></div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);"><i class="fas fa-image"></i></div>
                    <div><h3>${withImage}</h3><p>有图片产品</p></div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7);"><i class="fas fa-image"></i></div>
                    <div><h3>${noImage}</h3><p>缺图片产品</p></div>
                </div>
            </div>
        `;

        const tbody = document.getElementById('recent-tbody');
        const recent = data.products.slice(-8).reverse();
        if (recent.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">暂无产品数据</td></tr>';
            return;
        }
        tbody.innerHTML = recent.map(p => `
            <tr>
                <td class="text-muted">#${p.id}</td>
                <td>${renderThumb(p)}</td>
                <td><strong>${p.name}</strong></td>
                <td><span class="badge-brand badge-${p.brand}">${getBrandName(p.brand)}</span></td>
                <td>${categoryNames[p.category] || p.category}</td>
                <td>${p.priceDisplay || '<span class="text-muted">По запросу</span>'}</td>
            </tr>
        `).join('');
    }

    // ====== 产品表格 ======
    function renderProductsTable() {
        const tbody = document.getElementById('products-tbody');
        let filtered = [...data.products];

        const search = document.getElementById('admin-search');
        const brandFilter = document.getElementById('admin-brand-filter');
        const catFilter = document.getElementById('admin-cat-filter');

        if (search && search.value) {
            const q = search.value.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.nameRu && p.nameRu.toLowerCase().includes(q))
            );
        }
        if (brandFilter && brandFilter.value !== 'all') {
            filtered = filtered.filter(p => p.brand === brandFilter.value);
        }
        if (catFilter && catFilter.value !== 'all') {
            filtered = filtered.filter(p => p.category === catFilter.value);
        }

        const brandOrder = data.brands.reduce((map, b, i) => { map[b.id] = i; return map; }, {});
        filtered.sort((a, b) => {
            const orderA = brandOrder[a.brand] !== undefined ? brandOrder[a.brand] : 999;
            const orderB = brandOrder[b.brand] !== undefined ? brandOrder[b.brand] : 999;
            if (orderA !== orderB) return orderA - orderB;
            return a.id - b.id;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-5"><i class="fas fa-search" style="font-size:2rem;display:block;margin-bottom:10px;color:#ddd;"></i>未找到产品</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(p => `
            <tr>
                <td class="text-muted small">#${p.id}</td>
                <td>${renderThumb(p)}</td>
                <td><strong>${p.name}</strong></td>
                <td class="text-muted small">${p.nameRu || '-'}</td>
                <td><span class="badge-brand badge-${p.brand}">${getBrandName(p.brand)}</span></td>
                <td>${categoryNames[p.category] || p.category}</td>
                <td>${p.priceDisplay || '<span class="text-muted">По запросу</span>'}</td>
                <td>
                    <button class="btn-action btn-edit me-1" onclick="AdminApp.showEditModal(${p.id})" title="编辑"><i class="fas fa-pen"></i></button>
                    <button class="btn-action btn-delete" onclick="AdminApp.showDeleteModal(${p.id})" title="删除"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    // 缩略图 - 支持Base64和文件路径
    function renderThumb(product) {
        if (product.image && product.image.trim()) {
            var src;
            if (product.image.startsWith('data:')) {
                src = product.image;
            } else {
                src = '../' + product.image;
            }
            return '<img src="' + src + '" alt="' + product.name + '" class="product-thumb" onerror="this.outerHTML=\'<div class=product-thumb-placeholder><i class=fas fa-image></i></div>\'">';
        }
        return '<div class="product-thumb-placeholder"><i class="fas fa-image"></i></div>';
    }

    // 获取图片显示URL（用于模态框预览）
    function getImageSrc(product) {
        if (!product || !product.image) return '';
        if (product.image.startsWith('data:')) return product.image;
        return '../' + product.image;
    }

    // 品牌名
    function getBrandName(brandId) {
        const brand = data.brands.find(b => b.id === brandId);
        return brand ? brand.name : brandId;
    }

    // ====== 图片上传 ======
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            showToast('请选择图片文件 (JPG, PNG, WebP)', 'error');
            return;
        }

        // 验证文件大小（最大5MB）
        if (file.size > 5 * 1024 * 1024) {
            showToast('图片大小不能超过 5MB', 'error');
            return;
        }

        // 压缩图片并转为Base64
        compressAndEncode(file, function(base64) {
            currentImageBase64 = base64;
            // 隐藏文件路径输入框
            document.getElementById('form-image').value = '';
            document.getElementById('form-image').closest('.col-md-4').style.display = 'none';
            // 显示图片预览
            updateImagePreview(base64);
            showToast('图片上传成功', 'success');
        });
    }

    // 图片压缩（使用Canvas缩放）
    function compressAndEncode(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 限制最大宽度800px
                let w = img.width;
                let h = img.height;
                const maxW = 800;
                if (w > maxW) {
                    h = h * (maxW / w);
                    w = maxW;
                }
                
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);
                
                // 使用JPEG格式，质量0.8
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                callback(base64);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 更新模态框中的图片预览
    function updateImagePreview(src) {
        const preview = document.getElementById('image-preview-area');
        if (!preview) return;
        preview.innerHTML = `
            <div style="position:relative; display:inline-block;">
                <img src="${src}" class="img-preview" style="max-width:100%; max-height:250px; border-radius:8px;">
                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" 
                    onclick="AdminApp.removeImage()" title="移除图片">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    // 移除图片
    function removeImage() {
        currentImageBase64 = '';
        document.getElementById('form-image').value = '';
        document.getElementById('form-image').closest('.col-md-4').style.display = '';
        const preview = document.getElementById('image-preview-area');
        if (preview) preview.innerHTML = '<p class="text-muted small mb-0">暂无图片，请上传或输入图片路径</p>';
        // 清空文件选择
        const fileInput = document.getElementById('image-file-input');
        if (fileInput) fileInput.value = '';
        showToast('图片已移除', 'info');
    }

    // ====== 模态框操作 ======
    function populateSelects() {
        const brandSelect = document.getElementById('form-brand');
        const catSelect = document.getElementById('form-category');
        const adminBrandFilter = document.getElementById('admin-brand-filter');
        const adminCatFilter = document.getElementById('admin-cat-filter');

        brandSelect.innerHTML = '<option value="">选择品牌</option>' +
            data.brands.map(b => '<option value="' + b.id + '">' + b.name + '</option>').join('');

        catSelect.innerHTML = '<option value="">选择分类</option>' +
            data.categories.map(c => '<option value="' + c.id + '">' + c.name + ' (' + (categoryNames[c.id] || '') + ')</option>').join('');

        if (adminBrandFilter) {
            adminBrandFilter.innerHTML = '<option value="all">全部品牌</option>' +
                data.brands.map(b => '<option value="' + b.id + '">' + b.name + '</option>').join('');
        }
        if (adminCatFilter) {
            adminCatFilter.innerHTML = '<option value="all">全部分类</option>' +
                data.categories.map(c => '<option value="' + c.id + '">' + (categoryNames[c.id] || c.name) + '</option>').join('');
        }
    }

    function showAddModal() {
        document.getElementById('modalTitle').textContent = '添加产品';
        document.getElementById('productForm').reset();
        document.getElementById('form-id').value = '';
        document.getElementById('specs-container').innerHTML = '';
        document.getElementById('form-image').closest('.col-md-4').style.display = '';
        currentImageBase64 = '';
        
        // 重置图片预览
        var preview = document.getElementById('image-preview-area');
        if (preview) preview.innerHTML = '<p class="text-muted small mb-0">暂无图片，请上传或输入图片路径</p>';
        var fileInput = document.getElementById('image-file-input');
        if (fileInput) fileInput.value = '';
        
        populateSelects();
        addSpecRow();
        new bootstrap.Modal(document.getElementById('productModal')).show();
    }

    function showEditModal(id) {
        var product = data.products.find(function(p) { return p.id === id; });
        if (!product) return;

        document.getElementById('modalTitle').textContent = '编辑产品 - ' + product.name;
        document.getElementById('form-id').value = product.id;
        document.getElementById('form-brand').value = product.brand;
        document.getElementById('form-category').value = product.category;
        document.getElementById('form-name').value = product.name;
        document.getElementById('form-nameRu').value = product.nameRu || '';
        document.getElementById('form-price').value = product.price || '';
        document.getElementById('form-priceDisplay').value = product.priceDisplay || '';
        document.getElementById('form-badge').value = product.badge || '';
        document.getElementById('form-badgeText').value = product.badgeText || '';

        // 处理图片：Base64 或 文件路径
        currentImageBase64 = '';
        var imageInput = document.getElementById('form-image');
        var imageRow = imageInput.closest('.col-md-4');
        
        if (product.image && product.image.startsWith('data:')) {
            // Base64图片
            currentImageBase64 = product.image;
            imageInput.value = '';
            imageRow.style.display = 'none';
            updateImagePreview(product.image);
        } else if (product.image && product.image.trim()) {
            // 文件路径
            imageInput.value = product.image;
            imageRow.style.display = '';
            updateImagePreview(getImageSrc(product));
        } else {
            imageInput.value = '';
            imageRow.style.display = '';
            var preview = document.getElementById('image-preview-area');
            if (preview) preview.innerHTML = '<p class="text-muted small mb-0">暂无图片，请上传或输入图片路径</p>';
        }

        var fileInput = document.getElementById('image-file-input');
        if (fileInput) fileInput.value = '';

        // 规格
        var specsContainer = document.getElementById('specs-container');
        specsContainer.innerHTML = '';
        if (product.specs && product.specs.length > 0) {
            product.specs.forEach(function(spec) { addSpecRow(spec.icon, spec.text); });
        } else {
            addSpecRow();
        }

        populateSelects();
        document.getElementById('form-brand').value = product.brand;
        document.getElementById('form-category').value = product.category;
        document.getElementById('form-badge').value = product.badge || '';

        new bootstrap.Modal(document.getElementById('productModal')).show();
    }

    // 添加规格行
    function addSpecRow(icon, text) {
        var container = document.getElementById('specs-container');
        var row = document.createElement('div');
        row.className = 'row g-2 mb-2 spec-row';

        var iconOptions = [
            {v:'',l:'无图标'},{v:'fa-weight-hanging',l:'重量'},{v:'fa-cog',l:'发动机'},
            {v:'fa-horse-head',l:'功率'},{v:'fa-box',l:'容量'},{v:'fa-tint',l:'液/油'},
            {v:'fa-battery-full',l:'电池'},{v:'fa-shipping-alt',l:'交付'},{v:'fa-arrow-up',l:'卸载'},
            {v:'fa-ruler',l:'尺寸'},{v:'fa-tachometer-alt',l:'速度'},{v:'fa-leaf',l:'环保'},
            {v:'fa-sync-alt',l:'半径'},{v:'fa-wave-square',l:'频率'}
        ];

        var optionsHtml = iconOptions.map(function(o) {
            return '<option value="' + o.v + '"' + (o.v === icon ? ' selected' : '') + '>' + o.l + '</option>';
        }).join('');

        row.innerHTML = 
            '<div class="col-md-4">' +
                '<select class="form-select form-select-sm spec-icon">' + optionsHtml + '</select>' +
            '</div>' +
            '<div class="col-md-7">' +
                '<input type="text" class="form-control form-control-sm spec-text" placeholder="如: 33 т, Cummins, 3.0 м³" value="' + (text || '').replace(/"/g, '&quot;') + '">' +
            '</div>' +
            '<div class="col-md-1">' +
                '<button type="button" class="btn btn-sm btn-outline-danger" onclick="this.closest(\'.spec-row\').remove()">' +
                    '<i class="fas fa-times"></i>' +
                '</button>' +
            '</div>';
        container.appendChild(row);
    }

    // 保存产品
    function saveProduct() {
        var id = document.getElementById('form-id').value;
        var brand = document.getElementById('form-brand').value;
        var category = document.getElementById('form-category').value;
        var name = document.getElementById('form-name').value.trim();
        var nameRu = document.getElementById('form-nameRu').value.trim();
        var price = document.getElementById('form-price').value.trim();
        var priceDisplay = document.getElementById('form-priceDisplay').value.trim();
        var badge = document.getElementById('form-badge').value;
        var badgeText = document.getElementById('form-badgeText').value.trim();
        var imagePath = document.getElementById('form-image').value.trim();

        if (!brand || !category || !name) {
            showToast('请填写品牌、分类和型号', 'error');
            return;
        }

        // 图片：优先使用上传的Base64，其次使用手动输入的路径
        var image = currentImageBase64 || imagePath;

        // 收集规格
        var specs = [];
        document.querySelectorAll('.spec-row').forEach(function(row) {
            var icon = row.querySelector('.spec-icon').value;
            var text = row.querySelector('.spec-text').value.trim();
            if (text) specs.push({ icon: icon || 'fa-check', text: text });
        });

        if (id) {
            var idx = data.products.findIndex(function(p) { return p.id === parseInt(id); });
            if (idx !== -1) {
                data.products[idx] = Object.assign({}, data.products[idx], {
                    brand: brand, category: category, name: name, nameRu: nameRu,
                    price: price, priceDisplay: priceDisplay, badge: badge, badgeText: badgeText,
                    image: image, specs: specs
                });
            }
            showToast('产品已更新: ' + name, 'success');
        } else {
            data.products.push({
                id: nextId(), brand: brand, category: category, name: name, nameRu: nameRu,
                price: price, priceDisplay: priceDisplay, badge: badge, badgeText: badgeText,
                image: image, specs: specs
            });
            showToast('产品已添加: ' + name, 'success');
        }

        saveData();
        renderDashboard();
        renderProductsTable();

        currentImageBase64 = '';
        var modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        if (modal) modal.hide();
    }

    // 删除
    function showDeleteModal(id) {
        deleteTargetId = id;
        var product = data.products.find(function(p) { return p.id === id; });
        document.getElementById('delete-product-name').textContent = product ? product.name : '';
        new bootstrap.Modal(document.getElementById('deleteModal')).show();
    }

    function confirmDelete() {
        if (deleteTargetId !== null) {
            var product = data.products.find(function(p) { return p.id === deleteTargetId; });
            data.products = data.products.filter(function(p) { return p.id !== deleteTargetId; });
            saveData();
            renderDashboard();
            renderProductsTable();
            showToast('已删除: ' + (product ? product.name : ''), 'info');
            deleteTargetId = null;
        }
        var modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        if (modal) modal.hide();
    }

    // ====== 导出/导入 ======
    function exportJSON() {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('JSON 文件已下载', 'success');
    }

    function copyJSON() {
        const json = JSON.stringify(data, null, 2);
        navigator.clipboard.writeText(json).then(function() {
            showToast('JSON 已复制到剪贴板', 'success');
        }).catch(function() {
            const textarea = document.createElement('textarea');
            textarea.value = json;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('JSON 已复制到剪贴板', 'success');
        });
    }

    function importJSON() {
        new bootstrap.Modal(document.getElementById('importModal')).show();
    }

    function doImport() {
        var fileInput = document.getElementById('import-file');
        if (!fileInput.files || fileInput.files.length === 0) {
            showToast('请选择文件', 'error');
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var json = JSON.parse(e.target.result);
                if (json.products && Array.isArray(json.products)) {
                    data.brands = json.brands || data.brands;
                    data.categories = json.categories || data.categories;
                    data.products = json.products;
                    saveData();
                    renderDashboard();
                    renderProductsTable();
                    renderExportPage();
                    showToast('导入成功! 共 ' + data.products.length + ' 个产品', 'success');
                    var modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
                    if (modal) modal.hide();
                } else {
                    showToast('JSON 格式不正确，缺少 products 数组', 'error');
                }
            } catch(err) {
                showToast('JSON 解析失败: ' + err.message, 'error');
            }
        };
        reader.readAsText(fileInput.files[0]);
    }

    // ====== 导出页面 ======
    function renderExportPage() {
        const preview = document.getElementById('json-preview');
        if (preview) {
            // 显示精简预览（不显示完整Base64）
            var displayData = JSON.parse(JSON.stringify(data));
            displayData.products.forEach(function(p) {
                if (p.image && p.image.startsWith('data:') && p.image.length > 100) {
                    p.image = p.image.substring(0, 80) + '... [Base64图片, ' + (p.image.length / 1024).toFixed(0) + 'KB]';
                }
            });
            preview.textContent = JSON.stringify(displayData, null, 2);
        }
    }

    // ====== Toast 通知 ======
    function showToast(message, type) {
        type = type || 'info';
        var container = document.getElementById('toast-container');
        var icons = { success: 'fa-check-circle text-success', error: 'fa-exclamation-circle text-danger', info: 'fa-info-circle text-primary' };
        var toast = document.createElement('div');
        toast.className = 'custom-toast ' + type;
        toast.innerHTML = '<i class="fas ' + icons[type] + '" style="font-size:1.2rem;"></i><span>' + message + '</span>';
        container.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }

    // ====== 事件绑定 ======
    function bindEvents() {
        // 侧边栏导航
        document.querySelectorAll('.sidebar-nav a[data-page]').forEach(function(a) {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                switchPage(this.dataset.page);
            });
        });

        // 搜索和筛选
        var searchInput = document.getElementById('admin-search');
        var brandFilter = document.getElementById('admin-brand-filter');
        var catFilter = document.getElementById('admin-cat-filter');

        if (searchInput) searchInput.addEventListener('input', function() { renderProductsTable(); });
        if (brandFilter) brandFilter.addEventListener('change', function() { renderProductsTable(); });
        if (catFilter) catFilter.addEventListener('change', function() { renderProductsTable(); });

        // 图片上传事件
        var imageFileInput = document.getElementById('image-file-input');
        if (imageFileInput) {
            imageFileInput.addEventListener('change', handleImageUpload);
        }

        // 图片路径输入时，如果输入了路径则清除Base64
        var imageInput = document.getElementById('form-image');
        if (imageInput) {
            imageInput.addEventListener('input', function() {
                if (this.value.trim()) {
                    currentImageBase64 = '';
                    // 显示路径图片预览
                    updateImagePreview('../' + this.value.trim());
                }
            });
        }
    }

    // 页面加载时初始化
    document.addEventListener('DOMContentLoaded', init);

    // 公开API
    return {
        switchPage: switchPage,
        showAddModal: showAddModal,
        showEditModal: showEditModal,
        addSpecRow: addSpecRow,
        saveProduct: saveProduct,
        showDeleteModal: showDeleteModal,
        confirmDelete: confirmDelete,
        exportJSON: exportJSON,
        copyJSON: copyJSON,
        importJSON: importJSON,
        doImport: doImport,
        handleImageUpload: handleImageUpload,
        removeImage: removeImage,
        showToast: showToast
    };
})();
