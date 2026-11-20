/* ═══════════════════════════════════════════════════════
   TETRA STUDIO — Script
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── CONFIGURACIÓN CENTRALIZADA ───
    const WHATSAPP_NUMBER = '5493815456354'; // Reemplazá por tu número real con código de país (ej. 549381XXXXXXX)
    const CONTACT_EMAIL = 'tetra.studio@gmail.com'; // Correo corporativo oficial de Tetra Studio

    function buildWhatsAppUrl(message) {
        const cleanNumber = String(WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
        const text = message || 'Hola Tetra, quiero consultar para digitalizar mi negocio.';
        return 'https://wa.me/' + cleanNumber + '?text=' + encodeURIComponent(text);
    }

    // --- HEADER SCROLL ---
    const header = document.getElementById('header');
    const heroSection = document.getElementById('hero');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        const threshold = heroSection
            ? Math.max(40, heroSection.offsetHeight - (header ? header.offsetHeight : 76) - 24)
            : 80;
        if (header) {
            if (scrollY > threshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    window.addEventListener('load', handleHeaderScroll);
    window.addEventListener('resize', handleHeaderScroll);
    handleHeaderScroll();

    // --- BURGER MENU ---
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta, .mobile-menu__symbol a') : [];

    function closeMobileMenu() {
        if (burgerBtn) burgerBtn.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // --- SCROLL REVEAL ---
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');

        revealElements.forEach(function (el) {
            const rect = el.getBoundingClientRect();
            const delay = parseInt(el.dataset.delay) || 0;

            if (rect.top < windowHeight * 0.88) {
                setTimeout(function () {
                    el.classList.add('revealed');
                }, delay);
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('load', revealOnScroll);
    window.addEventListener('hashchange', revealOnScroll);
    document.addEventListener('DOMContentLoaded', revealOnScroll);
    revealOnScroll();

    // --- PARALLAX ---
    function handleParallax() {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(function (el) {
            const speed = parseFloat(el.dataset.parallax);
            if (!el.parentElement) return;
            const rect = el.parentElement.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const offset = (centerY - window.innerHeight / 2) * speed;

            el.style.transform = el.classList.contains('tetra-symbol--massive')
                ? 'translate(-50%, calc(-50% + ' + offset + 'px))'
                : 'translateY(' + offset + 'px)';
        });
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    // --- SLOW ROTATION FOR HERO SYMBOL ---
    const heroSymbol = document.querySelector('.hero__symbol-bg .tetra-symbol');
    let rotation = 0;

    function rotateHeroSymbol() {
        rotation += 0.02;
        if (heroSymbol) {
            heroSymbol.style.transform = 'translate(-50%, -50%) rotate(' + rotation + 'deg)';
        }
        requestAnimationFrame(rotateHeroSymbol);
    }

    rotateHeroSymbol();

    // --- CREATORS FILTER ---
    const categoryFilters = document.querySelectorAll('#categoryFilters .filter-btn');
    const locationFilters = document.querySelectorAll('#locationFilters .filter-btn');
    let activeCategory = 'all';
    let activeLocation = 'all';

    function filterCreators() {
        const cards = document.querySelectorAll('.creators__catalog .creator-card');
        cards.forEach(function (card) {
            const rawCat = card.dataset.category || '';
            const categories = rawCat.split(',').map(function (s) { return s.trim().toLowerCase(); });
            const location = (card.dataset.location || '').trim().toLowerCase();

            const targetCat = activeCategory.toLowerCase();
            const targetLoc = activeLocation.toLowerCase();

            const matchCategory = targetCat === 'all' || targetCat === 'todos' ||
                categories.indexOf('all') !== -1 || categories.indexOf('todos') !== -1 ||
                categories.indexOf(targetCat) !== -1;

            const matchLocation = targetLoc === 'all' || targetLoc === 'todas' || targetLoc === 'todos' ||
                location === 'all' || location === 'todas' || location === 'todos' || location === targetLoc;

            if (matchCategory && matchLocation) {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(function () {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.classList.add('hidden');
            }
        });
    }

    window.TetraFilterCreators = filterCreators;

    categoryFilters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            categoryFilters.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            activeCategory = this.dataset.filter || 'all';
            filterCreators();
        });
    });

    locationFilters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            locationFilters.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            activeLocation = this.dataset.filter || 'all';
            filterCreators();
        });
    });

    // --- CREATOR MODAL (REQUEST FORM) ---
    const creatorModal = document.getElementById('creatorModal');
    const openCreatorForm = document.getElementById('openCreatorForm');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const creatorForm = document.getElementById('creatorForm');

    function openModal() {
        if (!creatorModal) return;
        creatorModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!creatorModal) return;
        creatorModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openCreatorForm) {
        openCreatorForm.addEventListener('click', openModal);
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    function postCreatorRequest(url, payload) {
        return fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function (response) {
            return response.json().catch(function () { return {}; }).then(function (data) {
                if (!response.ok) {
                    const error = new Error(data.error || 'No pudimos enviar la solicitud');
                    error.status = response.status;
                    error.fallbackEmail = data.fallbackEmail || '';
                    throw error;
                }
                return data;
            });
        });
    }

    function sendCreatorRequest(payload) {
        return postCreatorRequest('api.php?action=contact', payload).catch(function (primaryError) {
            if (primaryError.status !== 404) throw primaryError;
            return postCreatorRequest('/api/contact', payload);
        });
    }

    function showCreatorFormStatus(message, type, fallbackEmail) {
        const status = document.getElementById('creatorFormStatus');
        if (!status) return;
        status.className = 'form-status' + (type ? ' form-status--' + type : '');
        status.textContent = message || '';
        if (fallbackEmail) {
            status.appendChild(document.createTextNode(' '));
            const link = document.createElement('a');
            link.href = 'mailto:' + fallbackEmail;
            link.textContent = fallbackEmail;
            status.appendChild(link);
        }
    }

    if (creatorForm) {
        creatorForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const submitButton = document.getElementById('creatorSubmitBtn');
            const form = this;
            const payload = {
                brand: String(formData.get('brand') || '').trim(),
                email: String(formData.get('email') || '').trim(),
                contentType: formData.get('contentType') || '',
                category: formData.get('category') || '',
                creatorCount: formData.get('creatorCount') || '1',
                budget: formData.get('budget') || '',
                date: formData.get('date') || '',
                description: formData.get('description') || '',
                website: formData.get('website') || ''
            };

            submitButton.disabled = true;
            submitButton.textContent = 'ENVIANDO...';
            showCreatorFormStatus('Estamos enviando tu solicitud...', 'pending');

            sendCreatorRequest(payload).then(function () {
                form.reset();
                showCreatorFormStatus('¡Solicitud enviada! Te responderemos a la brevedad.', 'success');
            }).catch(function (error) {
                const fallback = error.fallbackEmail || form.dataset.recipient || CONTACT_EMAIL;
                showCreatorFormStatus(error.message + '. También podés escribirnos a', 'error', fallback);
            }).then(function () {
                submitButton.disabled = false;
                submitButton.innerHTML = 'ENVIAR SOLICITUD <span>&rarr;</span>';
            });
        });
    }

    // --- SMOOTH SCROLL FOR ALL ANCHOR LINKS (DELEGATED) ---
    function scrollToTarget(target) {
        if (!target) return;
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
    }

    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href) return;

        // Skip admin hash triggers (managed by admin.js)
        if (href === '#admin') return;

        // Scroll to top
        if (href === '#' || href === '#hero' || href === '#top') {
            e.preventDefault();
            closeMobileMenu();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        try {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                closeMobileMenu();
                scrollToTarget(target);
            }
        } catch (err) {
            // Ignore invalid CSS selector syntax
        }
    });

    // --- HOVER TILT ON CREATOR CARDS (DELEGATED) ---
    document.addEventListener('mousemove', function (e) {
        const card = e.target.closest('.creator-card');
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transition = 'transform 0.1s ease';
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });

    document.addEventListener('mouseout', function (e) {
        const card = e.target.closest('.creator-card');
        if (!card) return;
        if (!card.contains(e.relatedTarget)) {
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
        }
    });

    // --- SERVICES HOVER IMAGE POSITIONING (DELEGATED) ---
    document.addEventListener('mousemove', function (e) {
        const item = e.target.closest('.services__item');
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const img = item.querySelector('.services__hover-img');
        if (img) {
            img.style.left = (x - 100) + 'px';
        }
    });

    // --- CREATOR CARD CLICK TO EXPAND PROFILE MODAL ---
    document.addEventListener('click', function (e) {
        const card = e.target.closest('.creator-card');
        if (!card) return;
        // Don't open if clicking inside admin panel or login
        if (e.target.closest('.admin-panel') || e.target.closest('.admin-login')) return;
        // Don't open profile modal if clicking directly on the Instagram button
        if (e.target.closest('.creator-card__instagram')) return;

        const nameEl = card.querySelector('.creator-card__name');
        const roleEl = card.querySelector('.creator-card__role');
        const catsEl = card.querySelector('.creator-card__cats');
        const locEl = card.querySelector('.creator-card__loc');
        const imgEl = card.querySelector('.creator-card__img img');

        if (!nameEl) return;

        const name = nameEl.textContent.trim();
        const role = roleEl ? roleEl.textContent.trim() : 'CONTENT CREATOR';
        const cats = catsEl ? catsEl.textContent.trim() : '';
        const loc = locEl ? locEl.textContent.trim() : '';
        const img = imgEl ? imgEl.src : '';
        const instagramMap = {
            'sol': 'supercuutee',
            'lour': 'lourmorales',
            'maia': '_maiatorress'
        };
        const rawInsta = card.dataset.instagram || instagramMap[name.toLowerCase()] || name.toLowerCase().replace(/\s+/g, '');
        const instaHandle = rawInsta.replace(/^@/, '');
        const instaUrl = 'https://www.instagram.com/' + instaHandle + '/';

        // Remove any existing profile modal first
        const existing = document.querySelector('.creator-profile-modal');
        if (existing) existing.remove();

        const profileModal = document.createElement('div');
        profileModal.className = 'modal active creator-profile-modal';
        profileModal.innerHTML = '<div class="modal__overlay"></div>' +
            '<div class="modal__content creator-profile-modal__content">' +
            '<button class="creator-profile-modal__close" aria-label="Cerrar">&times;</button>' +
            '<div class="creator-profile-modal__grid">' +
            '<div class="creator-profile-modal__image-col">' +
            '<img src="' + img + '" alt="' + name + '" class="creator-profile-modal__img">' +
            '<div class="creator-profile-modal__watermark">' +
            '<img src="logos/tetralogSFblanco.png" alt="" class="tetra-symbol"></div>' +
            '</div>' +
            '<div class="creator-profile-modal__body">' +
            '<h2 class="creator-profile-modal__name">' + name + '</h2>' +
            '<p class="creator-profile-modal__role">' + role + '</p>' +
            '<div class="creator-profile-modal__meta">' +
            (cats ? '<span class="creator-profile-modal__cat">' + cats + '</span>' : '') +
            (loc ? '<span class="creator-profile-modal__loc">' + loc + '</span>' : '') +
            '</div>' +
            '<div class="creator-profile-modal__socials">' +
            '<div class="creator-profile-modal__social-item">' +
            '<span class="creator-profile-modal__social-label">INSTAGRAM</span>' +
            '<a href="' + instaUrl + '" target="_blank" rel="noopener" class="creator-profile-modal__social-link">@' + instaHandle + ' <span class="creator-profile-modal__arrow">&nearr;</span></a>' +
            '</div>' +
            '</div>' +
            '<div class="creator-profile-modal__tags-wrap">' +
            '<span class="creator-profile-modal__tags-label">TIPOS DE CONTENIDO</span>' +
            '<div class="creator-profile-modal__tags">' +
            '<span class="creator-tag">UGC</span>' +
            '<span class="creator-tag">REELS</span>' +
            '<span class="creator-tag">STORIES</span>' +
            '<span class="creator-tag">PHOTO</span>' +
            '</div>' +
            '</div>' +
            '<a href="#contacto" class="btn btn--primary creator-work-btn">' +
            'TRABAJAR CON ' + name + ' <span>&rarr;</span></a>' +
            '</div></div></div>';

        document.body.appendChild(profileModal);
        document.body.style.overflow = 'hidden';

        function closeProfile() {
            profileModal.classList.remove('active');
            setTimeout(function () {
                profileModal.remove();
                document.body.style.overflow = '';
            }, 300);
        }

        const closeBtn = profileModal.querySelector('.creator-profile-modal__close');
        const overlay = profileModal.querySelector('.modal__overlay');
        const workBtn = profileModal.querySelector('.creator-work-btn');

        if (closeBtn) closeBtn.addEventListener('click', closeProfile);
        if (overlay) overlay.addEventListener('click', closeProfile);

        if (workBtn) {
            workBtn.addEventListener('click', function (ev) {
                ev.preventDefault();
                closeProfile();
                const contactSection = document.getElementById('contacto');
                if (contactSection) {
                    setTimeout(function () {
                        scrollToTarget(contactSection);
                    }, 100);
                }
            });
        }
    });

    // --- CASOS DE ÉXITO (DATA & INTERACCIÓN) ---
    const CASE_STUDIES = {
        'cafs': {
            name: 'CAFS',
            type: 'PÁGINA WEB & CATÁLOGO',
            year: '2026',
            img: 'uploads/project-cafs.jpg',
            desafio: 'CAFS necesitaba profesionalizar su presencia digital y presentar su catálogo deportivo de forma ágil, eliminando la fricción de carga lenta y mejorando la tasa de consultas comerciales.',
            solucion: 'Desarrollamos una web de alto rendimiento, 100% responsiva y optimizada para mobile, con arquitectura ligera, catálogo visual interactivo y conversión directa a canales de venta.',
            resultado: 'Incremento del 45% en consultas directas de clientes potenciales y una presencia de marca sólida, moderna y alineada a los estándares de la industria.'
        },
        'cukies': {
            name: 'CUKIES',
            type: 'BRANDING & IDENTIDAD',
            year: '2026',
            img: 'uploads/project-cukies.jpg',
            desafio: 'Posicionar una marca gastronómica joven en un segmento altamente competitivo, requiriendo una identidad visual única que destacara en redes sociales y en el empaque físico.',
            solucion: 'Creamos un universo de marca completo: logotipo, paleta tipográfica y cromática, diseño de packaging sostenible y lineamientos de dirección artística para redes sociales.',
            resultado: 'Lanzamiento con récord de ventas en su primer mes, alto engagement orgánico en Instagram y reconocimiento instantáneo de la identidad visual por parte de los clientes.'
        },
        'confimed': {
            name: 'CONFIMED',
            type: 'SISTEMA DE GESTIÓN MÉDICA',
            year: '2026',
            img: 'uploads/project-confimed.jpg',
            desafio: 'Procesos manuales y descentralizados en la asignación de turnos y seguimiento de pacientes, lo que generaba demoras operativas, llamadas perdidas y sobrecarga del personal.',
            solucion: 'Diseñamos e implementamos un sistema web centralizado con agenda médica interactiva, gestión de turnos en tiempo real, historial de atenciones y perfiles protegidos.',
            resultado: 'Reducción de más del 60% en tiempos de gestión administrativa, optimización de la agenda de los profesionales y una experiencia mucho más cómoda para los pacientes.'
        },
        'laboratorio suizo': {
            name: 'LABORATORIO SUIZO',
            type: 'SISTEMA & AUTOMATIZACIÓN',
            year: '2026',
            img: 'uploads/project-laboratorio-suizo.jpg',
            desafio: 'Digitalizar de forma segura la entrega de resultados de laboratorio clínico, cumpliendo normativas de confidencialidad de datos y eliminando la necesidad de retiro físico.',
            solucion: 'Desarrollamos una plataforma robusta y segura con cifrado de información, portal de autogestión para pacientes y panel de auditoría y carga para bioquímicos.',
            resultado: '100% de los análisis disponibles online en segundos, reduciendo drásticamente las consultas en mostrador y mejorando la satisfacción del paciente.'
        }
    };

    const caseStudyModal = document.getElementById('caseStudyModal');
    const caseStudyOverlay = document.getElementById('caseStudyOverlay');
    const caseStudyClose = document.getElementById('caseStudyClose');

    function openCaseStudy(projectId) {
        if (!caseStudyModal) return;
        const key = String(projectId || '').toLowerCase().trim();
        const data = CASE_STUDIES[key] || CASE_STUDIES['cafs'];

        const nameEl = document.getElementById('caseStudyName');
        const typeEl = document.getElementById('caseStudyType');
        const yearEl = document.getElementById('caseStudyYear');
        const imgEl = document.getElementById('caseStudyImg');
        const desafioEl = document.getElementById('caseStudyDesafio');
        const solucionEl = document.getElementById('caseStudySolucion');
        const resultadoEl = document.getElementById('caseStudyResultado');
        const ctaEl = document.getElementById('caseStudyCta');

        if (nameEl) nameEl.textContent = data.name;
        if (typeEl) typeEl.textContent = data.type;
        if (yearEl) yearEl.textContent = data.year;
        if (imgEl) {
            imgEl.src = data.img;
            imgEl.alt = data.name;
        }
        if (desafioEl) desafioEl.textContent = data.desafio;
        if (solucionEl) solucionEl.textContent = data.solucion;
        if (resultadoEl) resultadoEl.textContent = data.resultado;
        if (ctaEl) {
            ctaEl.href = buildWhatsAppUrl('Hola Tetra, vi el caso de éxito de ' + data.name + ' y quiero consultar por un proyecto similar.');
        }

        caseStudyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCaseStudy() {
        if (!caseStudyModal) return;
        caseStudyModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (caseStudyClose) caseStudyClose.addEventListener('click', closeCaseStudy);
    if (caseStudyOverlay) caseStudyOverlay.addEventListener('click', closeCaseStudy);

    document.addEventListener('click', function (e) {
        const item = e.target.closest('.project-item');
        if (!item) return;
        const projectId = item.dataset.project || (item.querySelector('.project-item__name') ? item.querySelector('.project-item__name').textContent : '');
        openCaseStudy(projectId);
    });

    document.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('project-item')) {
            e.preventDefault();
            const projectId = e.target.dataset.project || '';
            openCaseStudy(projectId);
        }
    });

    // Close modals on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeModal();
            closeCaseStudy();
            const profileModal = document.querySelector('.creator-profile-modal');
            if (profileModal) {
                profileModal.classList.remove('active');
                setTimeout(function () {
                    profileModal.remove();
                    document.body.style.overflow = '';
                }, 300);
            }
        }
    });

    // ─── INICIALIZACIÓN DE ENLACES DE CONVERSIÓN (WHATSAPP + EMAIL) ───
    function updatePlanLinks(mode) {
        const isAnnual = mode === 'annual';
        const planBtns = document.querySelectorAll('.plan-card__btn');
        planBtns.forEach(function (btn) {
            const plan = btn.dataset.plan || '01';
            const planName = btn.dataset.planName || ('Plan ' + plan);
            const priceText = isAnnual
                ? (btn.dataset.annualPrice || '')
                : (btn.dataset.monthlyPrice || '');
            const msg = priceText
                ? 'Hola Tetra, quiero elegir el ' + planName + ' (' + priceText + ').'
                : 'Hola Tetra, quiero info sobre el Plan ' + plan;
            btn.href = buildWhatsAppUrl(msg);
        });
    }

    function initBillingToggle() {
        const toggleBtns = document.querySelectorAll('.billing-btn');
        if (!toggleBtns.length) return;

        function setBillingMode(mode) {
            const isAnnual = mode === 'annual';
            toggleBtns.forEach(function (b) {
                const active = b.dataset.billing === mode;
                b.classList.toggle('active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });

            document.querySelectorAll('.plan-card__pricing').forEach(function (box) {
                const amountEl = box.querySelector('.plan-card__amount');
                const periodEl = box.querySelector('.plan-card__period');
                const noteEl = box.querySelector('.plan-card__annual-note');
                if (amountEl) {
                    amountEl.textContent = isAnnual ? (box.dataset.annualPrice || '') : (box.dataset.monthlyPrice || '');
                }
                if (periodEl) {
                    periodEl.textContent = isAnnual ? 'ARS / año (pago único)' : 'ARS / mes';
                }
                if (noteEl) {
                    noteEl.textContent = isAnnual ? (box.dataset.annualNote || '') : (box.dataset.monthlyNote || '');
                }
            });

            updatePlanLinks(mode);
        }

        toggleBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                setBillingMode(this.dataset.billing || 'monthly');
            });
        });

        setBillingMode('monthly');
    }

    function initConversionLinks() {
        // WhatsApp General
        const generalWaUrl = buildWhatsAppUrl('Hola Tetra, quiero consultar para digitalizar mi negocio.');
        const headerCta = document.querySelector('.header__cta');
        if (headerCta) headerCta.href = generalWaUrl;

        const mobileCta = document.querySelector('.mobile-menu__cta');
        if (mobileCta) mobileCta.href = generalWaUrl;

        const contactWaBtn = document.querySelector('.contact__btn-whatsapp');
        if (contactWaBtn) contactWaBtn.href = buildWhatsAppUrl('Hola Tetra, quiero coordinar una reunión para digitalizar mi negocio.');

        const footerWaLink = document.querySelector('.footer__link-whatsapp');
        if (footerWaLink) footerWaLink.href = generalWaUrl;

        const floatWa = document.getElementById('whatsappFloat');
        if (floatWa) floatWa.href = generalWaUrl;

        // Plan Personalizado
        const customPlanBtn = document.getElementById('customPlanBtn');
        if (customPlanBtn) {
            customPlanBtn.href = buildWhatsAppUrl('Hola Tetra, quiero cotizar un plan a medida para mi negocio');
        }

        // Planes WhatsApp + Toggle Mensual / Anual
        updatePlanLinks('monthly');
        initBillingToggle();

        // Email corporativo
        document.querySelectorAll('.contact-email-link, .contact__email, .footer__link-email').forEach(function (el) {
            el.href = 'mailto:' + CONTACT_EMAIL;
            if (el.classList.contains('contact-email-link') || el.classList.contains('contact__email')) {
                el.textContent = CONTACT_EMAIL;
            }
        });

        const creatorFormEl = document.getElementById('creatorForm');
        if (creatorFormEl) creatorFormEl.dataset.recipient = CONTACT_EMAIL;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initConversionLinks);
    } else {
        initConversionLinks();
    }

    // --- CONSOLA TETRA: PANTALLA CON TIPEO + TECLAS MECÁNICAS ---
    (function initConsole() {
        const consoleEl = document.getElementById('tetraConsole');
        if (!consoleEl) return;
        const typedEl = document.getElementById('consoleTyped');
        const labelEl = document.getElementById('consoleLabel');
        const descEl = document.getElementById('consoleDesc');
        const statusEl = document.getElementById('consoleStatus');
        const keys = Array.prototype.slice.call(consoleEl.querySelectorAll('.key'));
        const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const WELCOME = { title: 'TETRA STUDIO', desc: 'Tecnología, facturación y contenido en un solo lugar.' };
        const TYPE_MS = 110;
        let typeTimer = null;
        let restoreTimer = null;
        let currentTitle = '';
        let focusedKey = null;
        let hovering = false;

        function setStatus(text) { if (statusEl) statusEl.textContent = text; }

        function typeTitle(title, desc) {
            if (title === currentTitle) return; // ignorar pedidos redundantes
            clearTimeout(typeTimer);
            clearTimeout(restoreTimer);
            currentTitle = title;
            if (labelEl) labelEl.textContent = title;
            if (descEl) descEl.textContent = desc;
            if (reduced) {
                typedEl.textContent = title;
                setStatus('LISTO');
                return;
            }
            typedEl.textContent = '';
            setStatus('ESCRIBIENDO');
            let i = 0;
            (function step() {
                i += 1;
                typedEl.textContent = title.slice(0, i);
                if (i < title.length) {
                    typeTimer = setTimeout(step, TYPE_MS);
                } else {
                    setStatus('LISTO');
                }
            })();
        }

        function scheduleRestore() {
            clearTimeout(restoreTimer);
            restoreTimer = setTimeout(function () {
                if (focusedKey || hovering) return;
                typeTitle(WELCOME.title, WELCOME.desc);
            }, 350);
        }

        keys.forEach(function (key) {
            const show = function () { typeTitle(key.dataset.title, key.dataset.desc); };
            key.addEventListener('mouseenter', function () { hovering = true; show(); });
            key.addEventListener('mouseleave', function () { hovering = false; scheduleRestore(); });
            key.addEventListener('focus', function () { focusedKey = key; show(); });
            key.addEventListener('blur', function () { focusedKey = null; scheduleRestore(); });
        });

        // Escritura inicial: pausa de 350 ms y luego tipeo carácter por carácter
        typedEl.textContent = '';
        if (descEl) descEl.textContent = WELCOME.desc;
        setTimeout(function () {
            currentTitle = '';
            typeTitle(WELCOME.title, WELCOME.desc);
        }, 350);

        // Ola de teclas en reposo: escalonada 85 ms, cada 7 s
        if (!reduced) {
            function wave() {
                if (document.hidden || hovering || focusedKey) return;
                if (document.querySelector('.modal.active')) return;
                keys.forEach(function (key, idx) {
                    setTimeout(function () {
                        key.classList.remove('is-pop');
                        void key.offsetWidth;
                        key.classList.add('is-pop');
                    }, idx * 85);
                });
            }
            keys.forEach(function (key) {
                key.addEventListener('animationend', function (e) {
                    if (e.target.classList.contains('key__face')) key.classList.remove('is-pop');
                });
            });
            setTimeout(wave, 2200);
            setInterval(wave, 7000);
        }
    })();

    // --- CLIENT LOGOS ANIMATION ---
    function revealClientLogos() {
        const clientLogos = document.querySelectorAll('.client-logo');
        clientLogos.forEach(function (logo, index) {
            if (!logo.dataset.animated) {
                logo.dataset.animated = '1';
                logo.style.opacity = '0';
                logo.style.transform = 'translateY(20px)';
                logo.style.transition = 'opacity 0.6s ease ' + (index * 80) + 'ms, transform 0.6s ease ' + (index * 80) + 'ms';
            }
            const rect = logo.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', revealClientLogos, { passive: true });
    window.addEventListener('load', revealClientLogos);

    // --- EXPOSE RE-INIT FOR ADMIN / CMS ---
    window.TetraInit = function () {
        revealOnScroll();
        revealClientLogos();
        filterCreators();
    };

})();
