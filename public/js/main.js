// Main JavaScript for LEVERAGEAI Website

document.addEventListener('DOMContentLoaded', function() {
    // Airtable Form Submission
    const airtableForm = document.getElementById('airtable-form');
    const formStatus = document.getElementById('form-status');

    if (airtableForm) {
        airtableForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value,
                date: new Date().toISOString()
            };

            // In a real implementation, you would use the Airtable API
            // This is a placeholder for the actual API call
            submitToAirtable(formData);
        });
    }

    // Function to submit data to Airtable
    function submitToAirtable(data) {
        // This is where you would make the actual API call to Airtable
        // For demonstration purposes, we'll simulate a successful submission

        // In a real implementation, you would use fetch or axios:
        /*
        const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY';
        const AIRTABLE_BASE_ID = 'YOUR_AIRTABLE_BASE_ID';
        const AIRTABLE_TABLE_NAME = 'Contact Submissions';

        fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: data
            })
        })
        .then(response => response.json())
        .then(result => {
            showFormSuccess();
            airtableForm.reset();
        })
        .catch(error => {
            showFormError();
            console.error('Error submitting to Airtable:', error);
        });
        */

        // Simulate successful submission after 1 second
        setTimeout(() => {
            showFormSuccess();
            airtableForm.reset();
        }, 1000);
    }

    // Show success message
    function showFormSuccess() {
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.className = 'success';

        // Hide the message after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }

    // Show error message
    function showFormError() {
        formStatus.textContent = 'Oops! Something went wrong. Please try again later.';
        formStatus.className = 'error';
    }
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Animate Stats Counter
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                stat.textContent = Math.floor(current);

                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                }
            }, 16);
        });
    }

    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Trigger animation when stats section is in viewport
    let statsAnimated = false;
    window.addEventListener('scroll', () => {
        if (!statsAnimated && statNumbers.length > 0) {
            const statsSection = document.querySelector('.stats');
            if (isInViewport(statsSection)) {
                animateStats();
                statsAnimated = true;
            }
        }
    });

    // Testimonial Slider (if multiple testimonials)
    const testimonials = document.querySelectorAll('.testimonial-container');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }

    if (testimonials.length > 1) {
        // Show first testimonial initially
        showTestimonial(0);

        // Create navigation dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'testimonial-dots';

        testimonials.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = i === 0 ? 'dot active' : 'dot';
            dot.addEventListener('click', () => {
                currentTestimonial = i;
                showTestimonial(i);
                updateDots();
            });
            dotsContainer.appendChild(dot);
        });

        document.querySelector('.testimonials').appendChild(dotsContainer);

        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.className = i === currentTestimonial ? 'dot active' : 'dot';
            });
        }

        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
            updateDots();
        }, 5000);
    }
});
