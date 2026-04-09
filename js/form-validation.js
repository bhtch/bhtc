// 表单验证和提交功能

// 表单验证规则
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Zа-яА-ЯёЁ\s-]+$/,
        message: "Введите корректное имя (только буквы и дефисы)"
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Введите корректный email адрес"
    },
    phone: {
        required: true,
        pattern: /^[\d\s\(\)\+\-]+$/,
        minLength: 7,
        maxLength: 20,
        message: "Введите корректный номер телефона"
    },
    company: {
        required: false,
        maxLength: 100,
        message: "Название компании слишком длинное"
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 1000,
        message: "Сообщение должно содержать от 10 до 1000 символов"
    }
};

// 初始化表单验证
function initializeFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // 添加输入事件监听器
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // 表单提交事件
    contactForm.addEventListener('submit', handleFormSubmit);
}

// 验证单个字段
function validateField(event) {
    const field = event.target;
    const fieldName = field.name;
    const rules = validationRules[fieldName];
    
    if (!rules) return true;
    
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // 检查必填字段
    if (rules.required && value === '') {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }
    
    // 检查最小长度
    if (isValid && rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = `Минимальная длина: ${rules.minLength} символов`;
    }
    
    // 检查最大长度
    if (isValid && rules.maxLength && value.length > rules.maxLength) {
        isValid = false;
        errorMessage = `Максимальная длина: ${rules.maxLength} символов`;
    }
    
    // 检查正则表达式
    if (isValid && rules.pattern && !rules.pattern.test(value)) {
        isValid = false;
        errorMessage = rules.message;
    }
    
    // 显示或清除错误
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError({ target: field });
    }
    
    return isValid;
}

// 显示字段错误
function showFieldError(field, message) {
    clearFieldError({ target: field });
    
    // 添加错误类
    field.classList.add('is-invalid');
    
    // 创建错误消息元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    errorDiv.id = `${field.name}-error`;
    
    // 插入错误消息
    field.parentNode.appendChild(errorDiv);
}

// 清除字段错误
function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector(`#${field.name}-error`);
    if (errorDiv) {
        errorDiv.remove();
    }
}

// 验证整个表单
function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        const event = { target: field };
        if (!validateField(event)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// 处理表单提交
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // 验证表单
    if (!validateForm(form)) {
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }
    
    // 禁用提交按钮
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Отправка...';
    
    try {
        // 获取表单数据
        const formData = getFormData(form);
        
        // 这里可以添加实际的API调用
        // const response = await submitFormToAPI(formData);
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 显示成功消息
        showNotification('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
        
        // 重置表单
        form.reset();
        
        // 保存到本地存储（模拟数据库）
        saveFormDataLocally(formData);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.', 'error');
    } finally {
        // 恢复提交按钮
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

// 获取表单数据
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    // 添加额外信息
    data.timestamp = new Date().toISOString();
    data.userAgent = navigator.userAgent;
    data.referrer = document.referrer;
    data.productId = getRequestedProductId();
    
    return data;
}

// 获取请求的产品ID
function getRequestedProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('product') || null;
}

// 保存到本地存储
function saveFormDataLocally(data) {
    try {
        // 获取现有数据
        let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        
        // 添加新数据
        submissions.push({
            ...data,
            id: Date.now()
        });
        
        // 保存（限制最多保存50条记录）
        if (submissions.length > 50) {
            submissions = submissions.slice(-50);
        }
        
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        
        console.log('Form data saved locally:', data);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知容器（如果不存在）
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // 添加通知
    container.appendChild(notification);
    
    // 自动移除通知
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// 快速联系表单
function initializeQuickContact() {
    const quickContactBtns = document.querySelectorAll('.quick-contact-btn');
    
    quickContactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = this.getAttribute('data-price');
            
            // 预填表单
            const modal = document.getElementById('quickContactModal');
            if (modal) {
                const messageField = modal.querySelector('#quick-message');
                if (messageField) {
                    messageField.value = `Здравствуйте! Меня интересует товар: ${productName} (${productPrice}). Пожалуйста, отправьте мне подробную информацию и коммерческое предложение.`;
                }
                
                // 显示模态框
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
            }
        });
    });
}

// 电话号码格式化
function formatPhoneNumber(phone) {
    // 移除所有非数字字符
    const cleaned = phone.replace(/\D/g, '');
    
    // 俄罗斯电话号码格式化
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
        return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    } else if (cleaned.length === 10) {
        return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
    }
    
    return phone;
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化表单验证
    initializeFormValidation();
    
    // 初始化快速联系
    initializeQuickContact();
    
    // 为电话号码输入框添加格式化
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                this.value = formatPhoneNumber(this.value);
            }
        });
    });
    
    // 添加产品选择功能（如果是从产品页面跳转过来的）
    const productId = getRequestedProductId();
    if (productId && window.products) {
        const product = window.products.find(p => p.id == productId);
        if (product) {
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `Здравствуйте! Меня интересует товар: ${product.name} (${product.price}). Пожалуйста, отправьте мне подробную информацию и коммерческое предложение.`;
            }
        }
    }
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validationRules,
        validateField,
        validateForm,
        formatPhoneNumber
    };
}