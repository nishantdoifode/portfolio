document.addEventListener("DOMContentLoaded", () => {


    const typingText = document.querySelector(".typing-text");
    if (typingText) {
        const textArray = ["Frontend Developer", "UI/UX Enthusiast", "Web Designer"];
        let index = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = textArray[index];

            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % textArray.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 500);
    }


    const themeToggle = document.getElementById("theme-toggle");
    const icon = themeToggle ? themeToggle.querySelector("i") : null;

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        if(icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            if (icon) {
                icon.classList.toggle("fa-moon");
                icon.classList.toggle('fa-sun');
            }
            localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    }



    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);


        gsap.utils.toArray(".reveal").forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        gsap.utils.toArray(".progress").forEach((bar) => {
            const targetWidth = getComputedStyle(bar).getPropertyValue('--target-width').trim();
            gsap.set(bar, { width: "0%" });
            gsap.to(bar, {
                width: targetWidth || "100%",
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });
        });


        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length > 0) {
            statNumbers.forEach(stat => {
                const parent = stat.closest('.stat-item');
                const target = parseInt(parent.getAttribute('data-target')) || 0;
                const counter = { val: 0 };

                gsap.to(counter, {
                    val: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { val: 1 },
                    scrollTrigger: {
                        trigger: parent,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    onUpdate: function() {
                        const newVal = Math.round(counter.val);
                        if (stat.innerText != newVal) {
                            stat.innerText = newVal;
                        }
                    }
                });
            });
        }
    }


    // Initialize skill dots
    const skillDots = document.querySelectorAll('.skill-dots[data-level]');
    skillDots.forEach(container => {
        const level = parseInt(container.dataset.level) || 0;
        for (let i = 0; i < 5; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i < level ? ' filled' : '');
            container.appendChild(dot);
        }
    });

    // Proof link click handlers - scroll to project and highlight
    const proofLinks = document.querySelectorAll('.proof-link');
    proofLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionId = link.getAttribute('href');
            const cardIndex = parseInt(link.dataset.card) || 0;

            if (!sectionId || !sectionId.startsWith('#')) return;

            const targetSection = document.querySelector(sectionId);
            if (!targetSection) return;

            const cards = targetSection.querySelectorAll('.card');
            const targetCard = cards[cardIndex];
            if (!targetCard) return;

            // Let browser handle scroll, then highlight after a short delay
            requestAnimationFrame(() => {
                setTimeout(() => {
                    targetCard.style.transition = 'box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease';
                    targetCard.style.boxShadow = '0 0 0 3px var(--accent)';
                    targetCard.style.transform = 'scale(1.02)';
                    targetCard.style.borderColor = 'var(--accent)';

                    setTimeout(() => {
                        targetCard.style.boxShadow = '';
                        targetCard.style.transform = '';
                        targetCard.style.borderColor = '';
                    }, 1500);
                }, 300);
            });
        });
    });

    const cards = document.querySelectorAll('.card');
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeModal = document.querySelector('.close-modal');

    // Image viewer for UI designs
    const imageViewer = document.querySelector('.image-viewer');
    const viewerImg = document.getElementById('viewer-img');
    const viewerCaption = document.getElementById('viewer-caption');
    const closeViewer = document.querySelector('.close-viewer');

    if (cards.length > 0 && modal) {
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger modal if clicking on a link inside the card
                if (e.target.closest('.card-links a')) return;

                const isUiCard = card.classList.contains('ui-card');

                if (isUiCard && imageViewer) {
                    // Open full-screen image viewer for UI designs
                    const imgSrc = card.dataset.img || (card.querySelector('img') ? card.querySelector('img').src : '');
                    const title = card.dataset.title || 'UI Design';
                    const desc = card.dataset.desc || '';

                    if (viewerImg) viewerImg.src = imgSrc;
                    if (viewerCaption) viewerCaption.textContent = title + (desc ? ' — ' + desc : '');

                    imageViewer.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                } else if (!isUiCard) {
                    // Open modal for coding projects
                    const imgSrc = card.dataset.img || (card.querySelector('img') ? card.querySelector('img').src : '');
                    const title = card.dataset.title || (card.querySelector('h3') ? card.querySelector('h3').textContent : 'Project');
                    const desc = card.dataset.desc || 'No description available.';
                    const impact = card.dataset.impact || '';

                    if (modalImg) modalImg.src = imgSrc;
                    if (modalTitle) modalTitle.textContent = title;
                    if (modalDesc) modalDesc.textContent = desc;
                    if (impact) {
                        let impactEl = document.getElementById('modal-impact');
                        if (!impactEl) {
                            impactEl = document.createElement('p');
                            impactEl.id = 'modal-impact';
                            impactEl.className = 'modal-impact';
                            modalDesc.parentNode.insertBefore(impactEl, modalDesc.nextSibling);
                        }
                        impactEl.innerHTML = '<strong>Impact:</strong> ' + impact;
                    }

                    modal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const hideModal = () => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        if (closeModal) closeModal.addEventListener('click', hideModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) hideModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) hideModal();
        });
    }

    // Image viewer handlers
    if (imageViewer) {
        const hideViewer = () => {
            imageViewer.classList.add('hidden');
            document.body.style.overflow = '';
        };

        if (closeViewer) closeViewer.addEventListener('click', hideViewer);
        window.addEventListener('click', (e) => {
            if (e.target === imageViewer) hideViewer();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !imageViewer.classList.contains('hidden')) hideViewer();
        });

        // Also close on clicking the image itself
        if (viewerImg) {
            viewerImg.addEventListener('click', hideViewer);
        }
    }


    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const setActiveNav = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    // Set initial active state on load
    setActiveNav();

    window.addEventListener('scroll', setActiveNav);

    // Contact form handling with toast notifications - Netlify compatible
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        const handleSubmit = async (e) => {
            // Show loading state
            submitBtn.classList.add('loading');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner"></i>';

            try {
                const formData = new FormData(contactForm);
                // Ensure form-name is included for Netlify
                formData.append('form-name', 'contact');

                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    body: new URLSearchParams(formData).toString()
                });

                if (response.ok || response.redirected) {
                    showToast('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                // Fallback: let the form submit normally (Netlify handles it)
                contactForm.removeEventListener('submit', handleSubmit);
                contactForm.submit();
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalText;
            }
        };

        contactForm.addEventListener('submit', handleSubmit);
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Force reflow then show
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
});