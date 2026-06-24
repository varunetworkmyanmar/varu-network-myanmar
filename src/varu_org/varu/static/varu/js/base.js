document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');
    const whoItem = document.getElementById('whoDropdown');
    const priorityItem = document.getElementById('priorityDropdown');

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

    // Handle window resize
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
});