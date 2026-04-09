// 响应式图片画廊功能

class ImageGallery {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }
        
        // 默认配置
        this.config = {
            images: [],
            thumbnailSize: 'col-4',
            showNavigation: true,
            showIndicators: true,
            autoPlay: false,
            autoPlayInterval: 3000,
            zoomEnabled: true,
            fullscreenEnabled: true,
            downloadEnabled: true,
            ...options
        };
        
        this.currentIndex = 0;
        this.autoPlayTimer = null;
        this.zoomLevel = 1;
        
        this.init();
    }
    
    init() {
        if (this.config.images.length === 0) {
            this.container.innerHTML = '<div class="alert alert-info">Изображения не загружены</div>';
            return;
        }
        
        this.render();
        this.bindEvents();
        
        if (this.config.autoPlay) {
            this.startAutoPlay();
        }
    }
    
    render() {
        this.container.innerHTML = `
            <div class="row">
                <!-- 主图片区域 -->
                <div class="col-lg-9">
                    <div class="gallery-main position-relative">
                        <div id="main-image-container" class="position-relative overflow-hidden" style="height: 500px; background-color: #f8f9fa;">
                            <img id="main-image" 
                                 src="${this.config.images[0]}" 
                                 alt="Основное изображение" 
                                 class="img-fluid h-100 w-100 object-fit-contain"
                                 style="transition: transform 0.3s ease;">
                        </div>
                        
                        ${this.config.showNavigation ? `
                        <button class="gallery-nav prev btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3" 
                                style="z-index: 10;">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="gallery-nav next btn btn-light position-absolute top-50 end-0 translate-middle-y me-3" 
                                style="z-index: 10;">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        ` : ''}
                        
                        ${this.config.showIndicators ? `
                        <div class="gallery-indicators position-absolute bottom-0 start-50 translate-middle-x mb-3">
                            ${this.config.images.map((_, index) => `
                                <button class="indicator-btn ${index === 0 ? 'active' : ''}" 
                                        data-index="${index}"
                                        style="width: 10px; height: 10px; border-radius: 50%; border: none; margin: 0 3px; 
                                               background-color: ${index === 0 ? '#007bff' : '#6c757d'}; 
                                               cursor: pointer; transition: background-color 0.3s;">
                                </button>
                            `).join('')}
                        </div>
                        ` : ''}
                        
                        <!-- 工具栏 -->
                        <div class="gallery-tools position-absolute top-0 end-0 m-2" style="z-index: 10;">
                            <div class="btn-group" role="group">
                                ${this.config.zoomEnabled ? `
                                <button class="zoom-in btn btn-light btn-sm" title="Увеличить">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                                <button class="zoom-out btn btn-light btn-sm" title="Уменьшить">
                                    <i class="fas fa-search-minus"></i>
                                </button>
                                <button class="zoom-reset btn btn-light btn-sm" title="Сбросить масштаб">
                                    <i class="fas fa-undo"></i>
                                </button>
                                ` : ''}
                                
                                ${this.config.fullscreenEnabled ? `
                                <button class="fullscreen-toggle btn btn-light btn-sm" title="Полный экран">
                                    <i class="fas fa-expand"></i>
                                </button>
                                ` : ''}
                                
                                ${this.config.downloadEnabled ? `
                                <button class="download-btn btn btn-light btn-sm" title="Скачать изображение">
                                    <i class="fas fa-download"></i>
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 缩略图区域 -->
                <div class="col-lg-3 mt-3 mt-lg-0">
                    <div class="thumbnail-container">
                        <div class="row g-2" id="thumbnails">
                            ${this.config.images.map((img, index) => `
                                <div class="${this.config.thumbnailSize}">
                                    <div class="thumbnail-item ${index === 0 ? 'active' : ''} position-relative" 
                                         data-index="${index}"
                                         style="cursor: pointer; border: 2px solid ${index === 0 ? '#007bff' : 'transparent'}; border-radius: 4px; overflow: hidden; transition: border-color 0.3s;">
                                        <img src="${img}" 
                                             alt="Миниатюра ${index + 1}" 
                                             class="img-fluid"
                                             style="height: 100px; object-fit: cover; width: 100%;">
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- 图片信息 -->
                    <div class="image-info mt-3">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <i class="fas fa-image me-2"></i>Информация об изображении
                                </h6>
                                <p class="card-text small">
                                    <span id="image-index">1</span> из ${this.config.images.length}
                                    <br>
                                    <span id="image-zoom">Масштаб: 100%</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // 缩略图点击
        const thumbnails = this.container.querySelectorAll('.thumbnail-item');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.getAttribute('data-index'));
                this.showImage(index);
            });
        });
        
        // 导航按钮
        const prevBtn = this.container.querySelector('.gallery-nav.prev');
        const nextBtn = this.container.querySelector('.gallery-nav.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevImage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }
        
        // 指示器点击
        const indicators = this.container.querySelectorAll('.indicator-btn');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const index = parseInt(indicator.getAttribute('data-index'));
                this.showImage(index);
            });
        });
        
        // 缩放功能
        if (this.config.zoomEnabled) {
            const zoomInBtn = this.container.querySelector('.zoom-in');
            const zoomOutBtn = this.container.querySelector('.zoom-out');
            const zoomResetBtn = this.container.querySelector('.zoom-reset');
            const mainImage = this.container.querySelector('#main-image');
            const mainImageContainer = this.container.querySelector('#main-image-container');
            
            if (zoomInBtn && mainImage) {
                zoomInBtn.addEventListener('click', () => this.zoomImage(0.2));
            }
            
            if (zoomOutBtn && mainImage) {
                zoomOutBtn.addEventListener('click', () => this.zoomImage(-0.2));
            }
            
            if (zoomResetBtn && mainImage) {
                zoomResetBtn.addEventListener('click', () => this.resetZoom());
            }
            
            // 鼠标滚轮缩放
            if (mainImageContainer && mainImage) {
                mainImageContainer.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -0.1 : 0.1;
                    this.zoomImage(delta);
                });
            }
        }
        
        // 全屏功能
        const fullscreenBtn = this.container.querySelector('.fullscreen-toggle');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        
        // 下载功能
        const downloadBtn = this.container.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadCurrentImage());
        }
        
        // 键盘导航
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    showImage(index) {
        if (index < 0 || index >= this.config.images.length) return;
        
        this.currentIndex = index;
        const mainImage = this.container.querySelector('#main-image');
        
        if (mainImage) {
            // 添加淡出效果
            mainImage.style.opacity = '0.5';
            
            setTimeout(() => {
                mainImage.src = this.config.images[index];
                mainImage.style.opacity = '1';
                
                // 更新活动状态
                this.updateActiveStates();
                this.resetZoom();
            }, 150);
        }
    }
    
    prevImage() {
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) {
            newIndex = this.config.images.length - 1;
        }
        this.showImage(newIndex);
    }
    
    nextImage() {
        let newIndex = this.currentIndex + 1;
        if (newIndex >= this.config.images.length) {
            newIndex = 0;
        }
        this.showImage(newIndex);
    }
    
    updateActiveStates() {
        // 更新缩略图
        const thumbnails = this.container.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumb, index) => {
            if (index === this.currentIndex) {
                thumb.classList.add('active');
                thumb.style.borderColor = '#007bff';
            } else {
                thumb.classList.remove('active');
                thumb.style.borderColor = 'transparent';
            }
        });
        
        // 更新指示器
        const indicators = this.container.querySelectorAll('.indicator-btn');
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
                indicator.style.backgroundColor = '#007bff';
            } else {
                indicator.classList.remove('active');
                indicator.style.backgroundColor = '#6c757d';
            }
        });
        
        // 更新图片信息
        const imageIndex = this.container.querySelector('#image-index');
        if (imageIndex) {
            imageIndex.textContent = `${this.currentIndex + 1} из ${this.config.images.length}`;
        }
    }
    
    zoomImage(delta) {
        const mainImage = this.container.querySelector('#main-image');
        if (!mainImage) return;
        
        this.zoomLevel = Math.max(0.1, Math.min(5, this.zoomLevel + delta));
        
        mainImage.style.transform = `scale(${this.zoomLevel})`;
        
        // 更新缩放信息
        const zoomInfo = this.container.querySelector('#image-zoom');
        if (zoomInfo) {
            zoomInfo.textContent = `Масштаб: ${Math.round(this.zoomLevel * 100)}%`;
        }
    }
    
    resetZoom() {
        this.zoomLevel = 1;
        const mainImage = this.container.querySelector('#main-image');
        if (mainImage) {
            mainImage.style.transform = 'scale(1)';
            
            const zoomInfo = this.container.querySelector('#image-zoom');
            if (zoomInfo) {
                zoomInfo.textContent = 'Масштаб: 100%';
            }
        }
    }
    
    toggleFullscreen() {
        const galleryMain = this.container.querySelector('.gallery-main');
        if (!galleryMain) return;
        
        if (!document.fullscreenElement) {
            if (galleryMain.requestFullscreen) {
                galleryMain.requestFullscreen();
            } else if (galleryMain.webkitRequestFullscreen) {
                galleryMain.webkitRequestFullscreen();
            } else if (galleryMain.msRequestFullscreen) {
                galleryMain.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    downloadCurrentImage() {
        const imageUrl = this.config.images[this.currentIndex];
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `image_${this.currentIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    startAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
        
        this.autoPlayTimer = setInterval(() => {
            this.nextImage();
        }, this.config.autoPlayInterval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    handleKeydown(event) {
        if (!this.container.contains(event.target)) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.prevImage();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextImage();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    this.toggleFullscreen();
                }
                break;
            case '+':
            case '=':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.zoomImage(0.2);
                }
                break;
            case '-':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.zoomImage(-0.2);
                }
                break;
            case '0':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.resetZoom();
                }
                break;
        }
    }
    
    // 公共方法
    addImage(url) {
        this.config.images.push(url);
        this.render();
        this.bindEvents();
    }
    
    removeImage(index) {
        if (index >= 0 && index < this.config.images.length) {
            this.config.images.splice(index, 1);
            if (this.currentIndex >= this.config.images.length) {
                this.currentIndex = Math.max(0, this.config.images.length - 1);
            }
            this.render();
            this.bindEvents();
        }
    }
    
    setImages(images) {
        this.config.images = images;
        this.currentIndex = 0;
        this.render();
        this.bindEvents();
    }
    
    destroy() {
        this.stopAutoPlay();
        document.removeEventListener('keydown', this.handleKeydown);
        this.container.innerHTML = '';
    }
}

// 初始化函数
function initializeGalleries() {
    // 自动查找所有需要初始化的图库
    const galleryElements = document.querySelectorAll('[data-gallery]');
    
    galleryElements.forEach(element => {
        const galleryId = element.id;
        const images = element.getAttribute('data-images');
        
        if (images) {
            try {
                const imageList = JSON.parse(images);
                new ImageGallery(galleryId, {
                    images: imageList,
                    thumbnailSize: element.getAttribute('data-thumbnail-size') || 'col-4',
                    showNavigation: element.getAttribute('data-navigation') !== 'false',
                    showIndicators: element.getAttribute('data-indicators') !== 'false',
                    autoPlay: element.getAttribute('data-autoplay') === 'true',
                    autoPlayInterval: parseInt(element.getAttribute('data-interval') || '3000'),
                    zoomEnabled: element.getAttribute('data-zoom') !== 'false',
                    fullscreenEnabled: element.getAttribute('data-fullscreen') !== 'false',
                    downloadEnabled: element.getAttribute('data-download') !== 'false'
                });
            } catch (error) {
                console.error(`Failed to initialize gallery ${galleryId}:`, error);
            }
        }
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeGalleries();
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageGallery;
}