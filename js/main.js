// 骨骼肌：结构与功能 - 主脚本文件

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 返回顶部按钮功能
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // 监听滚动事件，控制按钮显示/隐藏
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        // 点击返回顶部
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 导航栏当前页面高亮
    highlightCurrentPage();
    
    // 图片懒加载
    lazyLoadImages();
    
    // 初始化交互元素
    initInteractiveElements();
});

// 高亮当前页面在导航栏中的链接
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (currentPage === linkPage) {
            link.classList.add('active');
        } else if (currentPage === '' && linkPage === 'index.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        images.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // 回退方案：立即加载所有图片
        images.forEach(image => {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        });
    }
}

// 初始化交互元素
function initInteractiveElements() {
    // 这个函数将在interactive.js中实现
    if (typeof initInteractive === 'function') {
        initInteractive();
    }
}

// 显示提示信息
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 显示提示
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// 添加CSS样式
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
        z-index: 1000;
    }
    
    .toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .toast-info {
        background-color: #3498db;
    }
    
    .toast-success {
        background-color: #2ecc71;
    }
    
    .toast-warning {
        background-color: #f39c12;
    }
    
    .toast-error {
        background-color: #e74c3c;
    }
`;

document.head.appendChild(toastStyles);
