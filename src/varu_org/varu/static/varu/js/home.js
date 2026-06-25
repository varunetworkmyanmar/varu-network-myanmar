(function() {
  const track = document.getElementById('heroTrack');
  const dotsWrap = document.getElementById('heroDots');
  const progress = document.getElementById('heroProgress');
  const carousel = document.getElementById('heroCarousel');
  const total = 3;
  let current = 0;
  let autoTimer;
  let isPaused = false;

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.className = 'hero-dot' + (i === current ? ' active' : '');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.setAttribute('aria-selected', i === current ? 'true' : 'false');
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    }
  }

  function updatePagination() {
    for (let i = 1; i <= total; i++) {
      const el = document.getElementById('pg-' + i);
      if (el) el.classList.toggle('active', i - 1 === current);
    }
    const prevEl = document.getElementById('pg-prev');
    const nextEl = document.getElementById('pg-next');
    if (prevEl) prevEl.classList.toggle('disabled', current === 0);
    if (nextEl) nextEl.classList.toggle('disabled', current === total - 1);
  }

  function startProgress() {
    progress.style.transition = 'none';
    progress.style.width = '0%';
    void progress.offsetWidth;
    requestAnimationFrame(() => {
      progress.style.transition = 'width 3s linear';
      progress.style.width = '100%';
    });
  }

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    buildDots();
    updatePagination();
    if (!isPaused) {
      startProgress();
    }
  }

  function startAutoPlay() {
    clearInterval(autoTimer);
    if (!isPaused) {
      autoTimer = setInterval(() => {
        goTo(current + 1);
      }, 3000);
    }
  }

  function pauseCarousel() {
    if (!isPaused) {
      isPaused = true;
      clearInterval(autoTimer);
      progress.style.transition = 'none';
      const indicator = document.querySelector('.hero-paused-indicator');
      if (indicator) indicator.classList.add('visible');
    }
  }

  function resumeCarousel() {
    if (isPaused) {
      isPaused = false;
      const indicator = document.querySelector('.hero-paused-indicator');
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

  // ===== PAUSE ON HOVER (Desktop) =====
  carousel.addEventListener('mouseenter', pauseCarousel);
  carousel.addEventListener('mouseleave', resumeCarousel);

  // ===== PAUSE ON TOUCH (Mobile) =====
  let touchTimer;
  carousel.addEventListener('touchstart', function() {
    pauseCarousel();
    clearTimeout(touchTimer);
  }, { passive: true });

  carousel.addEventListener('touchend', function() {
    clearTimeout(touchTimer);
    touchTimer = setTimeout(function() {
      resumeCarousel();
    }, 3000);
  }, { passive: true });

  // ===== TOUCH SWIPE =====
  let touchX = null;
  let touchStartY = null;
  
  track.addEventListener('touchstart', e => { 
    touchX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  track.addEventListener('touchmove', e => {
    if (touchX !== null) {
      const deltaX = Math.abs(e.touches[0].clientX - touchX);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    }
  }, { passive: false });
  
  track.addEventListener('touchend', e => {
    if (touchX === null) return;
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      pauseCarousel();
      goTo(diff > 0 ? current + 1 : current - 1);
      setTimeout(resumeCarousel, 3000);
    }
    touchX = null;
    touchStartY = null;
  }, { passive: true });

  // ===== BUTTON EVENTS =====
  const prevBtn = document.querySelector('.hero-btn.prev');
  const nextBtn = document.querySelector('.hero-btn.next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pauseCarousel();
      goTo(current - 1);
      setTimeout(resumeCarousel, 3000);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pauseCarousel();
      goTo(current + 1);
      setTimeout(resumeCarousel, 3000);
    });
  }

  // ===== PAGINATION EVENTS =====
  const pgPrev = document.getElementById('pg-prev');
  const pgNext = document.getElementById('pg-next');
  
  if (pgPrev) {
    pgPrev.querySelector('.page-link').addEventListener('click', () => {
      pauseCarousel();
      goTo(current - 1);
      setTimeout(resumeCarousel, 3000);
    });
  }
  
  if (pgNext) {
    pgNext.querySelector('.page-link').addEventListener('click', () => {
      pauseCarousel();
      goTo(current + 1);
      setTimeout(resumeCarousel, 3000);
    });
  }
  
  for (let i = 1; i <= total; i++) {
    const el = document.getElementById('pg-' + i);
    if (el) {
      (function(idx) {
        el.querySelector('.page-link').addEventListener('click', () => {
          pauseCarousel();
          goTo(idx - 1);
          setTimeout(resumeCarousel, 3000);
        });
      })(i);
    }
  }

  // ===== INIT =====
  buildDots();
  updatePagination();
  startProgress();
  startAutoPlay();
})();