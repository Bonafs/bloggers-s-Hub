// Theme toggle
document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
        });
    }

    // Burger menu
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // Modal close (if modal is used elsewhere)
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('modal');
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            // Optionally validate email/message here
            // Redirect to success.html with name as query param
            window.location.href = `success.html?name=${encodeURIComponent(name)}`;
        });
    }
});

// Optional: Close modal when clicking outside modal-content
window.addEventListener('click', function (event) {
    const modal = document.getElementById('modal');
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
});