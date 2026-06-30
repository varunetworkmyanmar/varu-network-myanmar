document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');
    const whoItem = document.getElementById('whoDropdown');
    const priorityItem = document.getElementById('priorityDropdown');
    const navbar = document.querySelector('.navbar');

    // ========================================
    // SHRINK NAVBAR ON SCROLL (DESKTOP ONLY)
    // ========================================
    let isShrunk = false;
    let isTransitioning = false;
    let lastScrollY = window.scrollY;
    const SHRINK_THRESHOLD = 80; // pixels to scroll before shrinking
    const DESKTOP_BREAKPOINT = 901; // only apply on desktop
    const TRANSITION_DURATION = 350; // match CSS transition duration

    function shouldShrinkNavbar() {
        return window.innerWidth >= DESKTOP_BREAKPOINT;
    }

    function applyShrinkState(shrink) {
        if (isTransitioning) return;
        
        if (shrink && !isShrunk) {
            isTransitioning = true;
            navbar.classList.add('navbar-shrunk');
            isShrunk = true;
            setTimeout(() => {
                isTransitioning = false;
            }, TRANSITION_DURATION);
        } else if (!shrink && isShrunk) {
            isTransitioning = true;
            navbar.classList.remove('navbar-shrunk');
            isShrunk = false;
            setTimeout(() => {
                isTransitioning = false;
            }, TRANSITION_DURATION);
        }
    }

    function handleNavbarScroll() {
        if (!shouldShrinkNavbar()) {
            // Reset to normal if on mobile/tablet
            applyShrinkState(false);
            return;
        }

        const scrollY = window.scrollY;
        
        // Only update if scroll position has changed significantly
        if (Math.abs(scrollY - lastScrollY) < 2) return;
        lastScrollY = scrollY;
        
        // Check if we should shrink or expand
        if (scrollY > SHRINK_THRESHOLD) {
            applyShrinkState(true);
        } else {
            applyShrinkState(false);
        }
    }

    // ========================================
    // SCROLL HANDLING WITH RAF THROTTLING
    // ========================================
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ========================================
    // HANDLE WINDOW RESIZE
    // ========================================
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (!shouldShrinkNavbar() && isShrunk) {
                applyShrinkState(false);
            }
            // Update scroll position after resize
            lastScrollY = window.scrollY;
        }, 200);
    });

    // ========================================
    // PREVENT NAVBAR INTERFERENCE WITH SCROLL
    // ========================================
    let mouseInNavbar = false;
    let mouseTimeout;

    navbar.addEventListener('mouseenter', function() {
        mouseInNavbar = true;
        // Clear any pending scroll updates
        if (mouseTimeout) {
            clearTimeout(mouseTimeout);
        }
    });

    navbar.addEventListener('mouseleave', function() {
        mouseInNavbar = false;
        // Re-enable scroll handling after a short delay
        mouseTimeout = setTimeout(() => {
            if (!mouseInNavbar) {
                handleNavbarScroll();
            }
        }, 100);
    });

    // ========================================
    // EXISTING MOBILE MENU CODE
    // ========================================

    function isMobile() {
        return window.innerWidth <= 900;
    }

    function closeAllMobile() {
        if (isMobile()) {
            if (whoItem) whoItem.classList.remove('open');
            if (priorityItem) priorityItem.classList.remove('open');
        }
    }

    function closeMobileMenu() {
        if (navLinks) {
            navLinks.classList.remove('active');
            if (navBackdrop) navBackdrop.classList.remove('active');
            closeAllMobile();
        }
    }

    // Toggle mobile menu
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            if (navBackdrop) {
                navBackdrop.classList.toggle('active');
            }
            if (!navLinks.classList.contains('active')) {
                closeAllMobile();
            }
        });
    }

    // Handle dropdown toggles on mobile
    function setupDropdownToggle(item) {
        if (!item) return;
        const link = item.querySelector('.nav-link');
        if (!link) return;

        link.addEventListener('click', function(event) {
            if (isMobile()) {
                event.preventDefault();
                event.stopPropagation();
                
                // Close other dropdowns
                if (whoItem && item !== whoItem) whoItem.classList.remove('open');
                if (priorityItem && item !== priorityItem) priorityItem.classList.remove('open');
                
                // Toggle this dropdown
                item.classList.toggle('open');
            }
        });
    }

    setupDropdownToggle(whoItem);
    setupDropdownToggle(priorityItem);

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (isMobile() && navLinks) {
            // If click is outside nav and not on toggle button
            if (!navLinks.contains(event.target) && 
                mobileToggle && 
                !mobileToggle.contains(event.target)) {
                closeMobileMenu();
            }
        }
    });

    // Close menu when clicking backdrop
    if (navBackdrop) {
        navBackdrop.addEventListener('click', function() {
            closeMobileMenu();
        });
    }

    // Handle window resize for mobile menu
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (!isMobile() && navLinks) {
                navLinks.classList.remove('active');
                if (navBackdrop) navBackdrop.classList.remove('active');
                closeAllMobile();
            }
        }, 200);
    });

    // Handle dropdown menu items clicks
    document.querySelectorAll('.dropdown-menu a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (isMobile()) {
                const parentItem = this.closest('.nav-item');
                if (parentItem) {
                    parentItem.classList.remove('open');
                }
                setTimeout(function() {
                    closeMobileMenu();
                }, 100);
            }
        });
    });

    // Initial check in case page loads already scrolled
    setTimeout(handleNavbarScroll, 150);
});