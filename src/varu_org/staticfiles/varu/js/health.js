// ===== LIGHTBOX FUNCTIONALITY =====
let currentImage = 0;
const totalImages = 8;

// Image data - Replace with your actual image paths
const images = [
    { src: '', alt: 'Image 1' },
    { src: '', alt: 'Image 2' },
    { src: '', alt: 'Image 3' },
    { src: '', alt: 'Image 4' },
    { src: '', alt: 'Image 5' },
    { src: '', alt: 'Image 6' },
    { src: '', alt: 'Image 7' },
    { src: '', alt: 'Image 8' }
];

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const imageContainer = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');
    
    currentImage = index;
    
    // Update image display
    updateLightboxImage();
    
    // Update counter
    counter.textContent = `${currentImage + 1} / ${totalImages}`;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const imageContainer = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');
    
    // If there's an actual image, display it
    if (images[currentImage].src) {
        imageContainer.innerHTML = `<img src="${images[currentImage].src}" alt="${images[currentImage].alt}">`;
    } else {
        // Show placeholder
        imageContainer.innerHTML = `
            <i class="fas fa-image"></i>
            <span>${images[currentImage].alt}</span>
        `;
    }
    
    counter.textContent = `${currentImage + 1} / ${totalImages}`;
}

function nextImage() {
    currentImage = (currentImage + 1) % totalImages;
    updateLightboxImage();
}

function prevImage() {
    currentImage = (currentImage - 1 + totalImages) % totalImages;
    updateLightboxImage();
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextImage();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevImage();
    }
});

// ===== CLOSE ON OVERLAY CLICK =====
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// ===== TOUCH SWIPE FOR LIGHTBOX =====
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.getElementById('lightbox').addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.getElementById('lightbox').addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Only trigger if horizontal swipe is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            nextImage();
        } else {
            prevImage();
        }
    }
}, { passive: true });

// ===== DOUBLE TAP TO CLOSE =====
let lastTap = 0;
document.getElementById('lightbox').addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 300 && tapLength > 0) {
        // Double tap detected - close if tapping on background
        const target = e.target;
        if (target === this || target.closest('.lightbox-content') === null) {
            closeLightbox();
        }
    }
    lastTap = currentTime;
}, { passive: true });

// ===== PREVENT SCROLLING ON LIGHTBOX =====
document.addEventListener('touchmove', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });