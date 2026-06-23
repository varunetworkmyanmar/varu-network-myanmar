document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const whoItem = document.getElementById('whoDropdown');
    const priorityItem = document.getElementById('priorityDropdown');

    function closeAllMobile() {
        if (window.innerWidth <= 900) {
            if (whoItem) whoItem.classList.remove('open');
            if (priorityItem) priorityItem.classList.remove('open');
        }
    }

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            if (!navLinks.classList.contains('active')) closeAllMobile();
        });
    }

    function toggleDropdown(item) {
        const link = item.querySelector('.nav-link');
        if (!link) return;
        link.addEventListener('click', function(event) {
            if (window.innerWidth <= 900) {
                event.preventDefault();
                event.stopPropagation();
                if (priorityItem && item !== priorityItem) priorityItem.classList.remove('open');
                if (whoItem && item !== whoItem) whoItem.classList.remove('open');
                item.classList.toggle('open');
            }
        });
    }

    if (whoItem) toggleDropdown(whoItem);
    if (priorityItem) toggleDropdown(priorityItem);

    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 900 && navLinks && !navLinks.contains(event.target) && mobileToggle && !mobileToggle.contains(event.target)) {
            navLinks.classList.remove('active');
            closeAllMobile();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 900 && navLinks) {
            navLinks.classList.remove('active');
            closeAllMobile();
        }
    });
});