(function() {
    // ===== CAROUSEL FUNCTIONALITY =====
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const progress = document.getElementById('carouselProgress');
    const container = document.getElementById('educationCarousel');
    const slides = track.querySelectorAll('.carousel-slide');
    const total = slides.length;
    let current = 0;
    let autoTimer;
    let isPaused = false;

    // Build dots
    function buildDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === current ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Start progress bar
    function startProgress() {
        progress.style.transition = 'none';
        progress.style.width = '0%';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                progress.style.transition = 'width 3s linear';
                progress.style.width = '100%';
            });
        });
    }

    // Go to slide
    function goTo(index) {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        buildDots();
        if (!isPaused) {
            startProgress();
        }
    }

    // Start auto-play
    function startAutoPlay() {
        clearInterval(autoTimer);
        if (!isPaused) {
            autoTimer = setInterval(() => {
                goTo((current + 1) % total);
            }, 3000);
        }
    }

    // Pause carousel
    function pauseCarousel() {
        if (!isPaused) {
            isPaused = true;
            clearInterval(autoTimer);
            progress.style.transition = 'none';
            const indicator = document.querySelector('.carousel-paused');
            if (indicator) indicator.classList.add('visible');
        }
    }

    // Resume carousel
    function resumeCarousel() {
        if (isPaused) {
            isPaused = false;
            const indicator = document.querySelector('.carousel-paused');
            if (indicator) indicator.classList.remove('visible');
            startAutoPlay();
            const currentWidth = progress.style.width || '0%';
            progress.style.transition = 'none';
            progress.style.width = currentWidth;
            void progress.offsetWidth;
            const remaining = 100 - parseFloat(currentWidth);
            const remainingTime = (remaining / 100) * 3000;
            if (remaining > 0) {
                progress.style.transition = `width ${remainingTime}ms linear`;
                progress.style.width = '100%';
            } else {
                startProgress();
            }
        }
    }

    // ===== EVENTS =====

    // Pause on hover (desktop)
    container.addEventListener('mouseenter', pauseCarousel);
    container.addEventListener('mouseleave', resumeCarousel);

    // Pause on touch (mobile)
    let touchTimer;
    container.addEventListener('touchstart', function() {
        pauseCarousel();
        clearTimeout(touchTimer);
    }, { passive: true });

    container.addEventListener('touchend', function() {
        clearTimeout(touchTimer);
        touchTimer = setTimeout(function() {
            resumeCarousel();
        }, 3000);
    }, { passive: true });

    // Previous button
    document.querySelector('.carousel-btn.prev-btn').addEventListener('click', () => {
        pauseCarousel();
        goTo((current - 1 + total) % total);
        setTimeout(resumeCarousel, 3000);
    });

    // Next button
    document.querySelector('.carousel-btn.next-btn').addEventListener('click', () => {
        pauseCarousel();
        goTo((current + 1) % total);
        setTimeout(resumeCarousel, 3000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            pauseCarousel();
            goTo((current - 1 + total) % total);
            setTimeout(resumeCarousel, 3000);
        }
        if (e.key === 'ArrowRight') {
            pauseCarousel();
            goTo((current + 1) % total);
            setTimeout(resumeCarousel, 3000);
        }
    });

    // Touch swipe
    let touchX = null;
    track.addEventListener('touchstart', (e) => {
        touchX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (touchX !== null) {
            const deltaX = Math.abs(e.touches[0].clientX - touchX);
            if (deltaX > 10) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    track.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            pauseCarousel();
            diff > 0 ? goTo((current + 1) % total) : goTo((current - 1 + total) % total);
            setTimeout(resumeCarousel, 3000);
        }
        touchX = null;
    });

    // ===== INIT =====
    buildDots();
    startProgress();
    startAutoPlay();
})();