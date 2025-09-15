// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Language Selector
document.addEventListener('DOMContentLoaded', function() {
    const langButton = document.getElementById('lang-button');
    const langDropdown = document.getElementById('lang-dropdown');

    if (langButton && langDropdown) {
        langButton.addEventListener('click', function(e) {
            e.preventDefault();
            langDropdown.style.opacity = langDropdown.style.opacity === '1' ? '0' : '1';
            langDropdown.style.visibility = langDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!langButton.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.style.opacity = '0';
                langDropdown.style.visibility = 'hidden';
            }
        });
    }

    // Interest tags interaction
    const interestTags = document.querySelectorAll('.interest-tag');
    interestTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.background = '#0071e3';
            this.style.color = 'white';
            this.style.transform = 'scale(1.05)';

            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // If we're not on the homepage, go to homepage first
            if (window.location.pathname !== '/' && href.startsWith('#')) {
                window.location.href = '/' + href;
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Booking form functionality
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic client-side validation
            const requiredFields = ['user_name', 'user_email', 'user_phone', 'preferred_date_time', 'number_of_people'];
            let isValid = true;

            requiredFields.forEach(fieldName => {
                const field = this.querySelector(`[name="${fieldName}"]`);
                if (!field || !field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff3b30';
                } else {
                    field.style.borderColor = '#d2d2d7';
                }
            });

            // Email validation
            const email = this.querySelector('[name="user_email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email.value)) {
                isValid = false;
                email.style.borderColor = '#ff3b30';
            }

            if (!isValid) {
                alert('Please fill in all required fields correctly.');
                return;
            }

            // Show loading state
            const submitButton = this.querySelector('.book-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Booking...';
            submitButton.disabled = true;

            const formData = new FormData(this);

            fetch('/book', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Booking successful! We will contact you soon to confirm the details.');
                    this.reset();
                } else {
                    alert(data.message || 'Booking failed. Please try again or contact us directly.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again or contact us directly.');
            })
            .finally(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        });
    }

    // Add loading animation to buttons
    document.querySelectorAll('.cta-button, .tour-button').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.href && this.href.includes('#')) {
                return; // Allow smooth scroll
            }

            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});