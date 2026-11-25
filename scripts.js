// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar-main');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            var offset = 70;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
            // Close mobile menu
            var navCollapse = document.querySelector('.navbar-collapse');
            if (navCollapse && navCollapse.classList.contains('show') && window.bootstrap) {
                var collapse = bootstrap.Collapse.getInstance(navCollapse);
                if (collapse) collapse.hide();
            }
        }
    });
});

// Scroll reveal animation
function revealOnScroll() {
    var reveals = document.querySelectorAll('.reveal');
    reveals.forEach(function(el) {
        var windowHeight = window.innerHeight;
        var elementTop = el.getBoundingClientRect().top;
        var revealPoint = 120;
        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Counter animation
function animateCounters() {
    var counters = document.querySelectorAll('.counter');
    counters.forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-target'));
        var current = 0;
        var increment = target / 60;
        var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                counter.textContent = '+' + target;
                clearInterval(timer);
            } else {
                counter.textContent = '+' + Math.floor(current);
            }
        }, 30);
    });
}

// Trigger counters when trust section is in view
var trustObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            animateCounters();
            trustObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

var trustSection = document.querySelector('.trust-band');
if (trustSection) trustObserver.observe(trustSection);

// Mobile catalogue filters (also used by the legacy tienda.html prototype).
function openFiltros() {
    var sidebar = document.getElementById('filtrosSidebar');
    if (sidebar) sidebar.classList.add('show');
    var overlay = document.getElementById('filtrosOverlay');
    if (overlay) overlay.classList.add('show');
    document.body.classList.add('filtros-open');
}

function closeFiltros() {
    var sidebar = document.getElementById('filtrosSidebar');
    if (sidebar) sidebar.classList.remove('show');
    var overlay = document.getElementById('filtrosOverlay');
    if (overlay) overlay.classList.remove('show');
    document.body.classList.remove('filtros-open');
}

function clearFilters() {
    var sidebar = document.getElementById('filtrosSidebar');
    if (!sidebar) return;
    document.querySelectorAll('.category-tile.active').forEach(function (tile) { tile.classList.remove('active'); });
    sidebar.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(function (input) {
        input.checked = false;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    sidebar.querySelectorAll('input[type="search"], input[type="text"]').forEach(function (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    sidebar.querySelectorAll('select').forEach(function (select) {
        select.selectedIndex = 0;
        select.dispatchEvent(new Event('change', { bubbles: true }));
    });
}

// Active nav link on scroll
var sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', function() {
    var scrollY = window.pageYOffset;
    sections.forEach(function(section) {
        var sectionHeight = section.offsetHeight;
        var sectionTop = section.offsetTop - 100;
        var sectionId = section.getAttribute('id');
        var navLink = document.querySelector('.navbar-main .nav-link[href="#' + sectionId + '"]');
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
});

// Catálogo: búsqueda global, filtros de categoría y acceso desde tarjetas visuales.
document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('productGrid');
    if (!grid) return;
    var categoryMap = {
        'pozo profundo': 'cat-pozo', 'superficie': 'cat-superficie', 'achique': 'cat-achique',
        'tableros y control': 'cat-tableros', 'estanques y presurización': 'cat-estanques',
        'accesorios e insumos': 'cat-accesorios'
    };
    var cards = Array.from(grid.querySelectorAll('.tienda-product-card'));
    var search = document.getElementById('catalogSearch');
    var tiles = document.querySelectorAll('[data-filter-category]');
    cards.forEach(function (card) {
        var col = card.closest('.col-sm-6, .col-md-6, .col-xl-4') || card.parentElement;
        var category = (card.querySelector('.card-category')?.textContent || '').trim().toLowerCase();
        if (col) col.dataset.category = category;
    });
    function applyFilters() {
        var active = Array.from(document.querySelectorAll('.filtros-sidebar input[type="checkbox"][id^="cat-"]:checked'))
            .map(function (input) { return input.id; }).filter(function (id) { return id !== 'cat-bombas'; });
        var term = (search?.value || '').trim().toLowerCase();
        cards.forEach(function (card) {
            var col = card.closest('[data-category]') || card.parentElement;
            var category = col.dataset.category || '';
            var categoryMatch = !active.length || active.some(function (id) { return categoryMap[category] === id; });
            var textMatch = !term || card.textContent.toLowerCase().includes(term);
            col.hidden = !(categoryMatch && textMatch);
        });
        var count = cards.filter(function (card) { return !(card.closest('[data-category]') || card.parentElement).hidden; }).length;
        var result = document.querySelector('.result-count');
        if (result) result.innerHTML = 'Mostrando <strong>' + count + '</strong> productos de esta página';
    }
    document.querySelectorAll('.filtros-sidebar input[type="checkbox"][id^="cat-"]').forEach(function (input) {
        input.addEventListener('change', function () {
            if (input.id === 'cat-bombas' && input.checked) {
                document.querySelectorAll('.filtros-sidebar input[id^="cat-"]:not(#cat-bombas)').forEach(function (item) { item.checked = false; });
            } else if (input.id !== 'cat-bombas' && input.checked) {
                var all = document.getElementById('cat-bombas'); if (all) all.checked = false;
            }
            applyFilters();
        });
    });
    search?.addEventListener('input', applyFilters);
    tiles.forEach(function (tile) {
        tile.addEventListener('click', function () {
            var id = ({ pozo: 'cat-pozo', superficie: 'cat-superficie', achique: 'cat-achique', tableros: 'cat-tableros', estanques: 'cat-estanques', accesorios: 'cat-accesorios' })[tile.dataset.filterCategory];
            document.querySelectorAll('.filtros-sidebar input[id^="cat-"]').forEach(function (input) { input.checked = input.id === id; });
            tiles.forEach(function (item) { item.classList.toggle('active', item === tile); });
            applyFilters();
            document.querySelector('.tienda-page')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.innerWidth < 992) closeFiltros();
        });
    });
    // Búsqueda procedente de la barra global (?q=...)
    var query = new URLSearchParams(window.location.search);
    if (search && query.has('q')) { search.value = query.get('q'); }
    var initialCategory = query.get('categoria');
    var categoryCheckboxId = ({
        pozo: 'cat-pozo', superficie: 'cat-superficie', achique: 'cat-achique',
        tableros: 'cat-tableros', estanques: 'cat-estanques', accesorios: 'cat-accesorios'
    })[initialCategory];
    if (categoryCheckboxId) {
        var categoryCheckbox = document.getElementById(categoryCheckboxId);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            categoryCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        } else applyFilters();
    } else applyFilters();


});

// Sincroniza el contador del carrito en todas las páginas y conserva el carrito local.
document.addEventListener('DOMContentLoaded', function () {
    var cartKey = 'fluidpump-cart';
    function readCart() {
        try { return JSON.parse(localStorage.getItem(cartKey) || '[]'); } catch (error) { return []; }
    }
    function updateBadges() {
        var count = readCart().reduce(function (total, item) { return total + Math.max(1, Number(item.quantity) || 1); }, 0);
        document.querySelectorAll('.cart-count').forEach(function (badge) {
            badge.textContent = count;
            badge.closest('.nav-cart')?.setAttribute('aria-label', 'Carrito de compras, ' + count + (count === 1 ? ' producto' : ' productos'));
        });
    }
    function storeItem(item, quantity) {
        var cart = readCart();
        var found = cart.find(function (entry) { return entry.sku && entry.sku === item.sku; });
        if (found) found.quantity = (Number(found.quantity) || 1) + quantity;
        else { item.quantity = quantity; cart.push(item); }
        try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch (error) { /* El usuario podrá seguir al checkout aunque el almacenamiento esté deshabilitado. */ }
        updateBadges();
    }
    updateBadges();

    document.querySelectorAll('.btn-add-card').forEach(function (button) {
        button.addEventListener('click', function () {
            var card = button.closest('.tienda-product-card');
            if (!card) return;
            storeItem({
                name: card.querySelector('h6')?.textContent.trim() || 'Producto FluidPump',
                sku: card.querySelector('.card-sku')?.textContent.replace('SKU:', '').trim() || '',
                price: card.querySelector('.card-price')?.textContent.trim() || ''
            }, 1);
            window.location.href = 'checkout.html';
        });
    });

    var detailAdd = document.querySelector('.producto-info-card .btn-add-cart');
    if (detailAdd) {
        detailAdd.addEventListener('click', function (event) {
            event.preventDefault();
            var quantity = Math.max(1, parseInt(document.getElementById('qtyInput')?.value, 10) || 1);
            var skuText = document.querySelector('.producto-info-card')?.innerText.match(/SKU\s*:?\s*([A-Z0-9-]+)/i);
            storeItem({
                name: document.querySelector('.producto-info-card h1, .producto-info-card h2')?.textContent.trim() || document.title,
                sku: skuText ? skuText[1] : 'FP-PED-150M',
                price: document.querySelector('.producto-info-card .producto-price')?.textContent.trim() || ''
            }, quantity);
            window.location.href = 'checkout.html';
        });
    }
});

// Contenido por industria para la página editorial de soluciones.
document.addEventListener('DOMContentLoaded', function () {
    var page = document.getElementById('industrySolution');
    if (!page) return;
    var industries = {
        edificios: {
            title: 'Edificios y Condominios', intro: 'Sistemas confiables de presurización y mantención para la continuidad del suministro de agua.',
            challengeTitle: 'Continuidad, presión y eficiencia en cada edificio', challenge: 'Las variaciones de demanda, las fallas inesperadas y la falta de mantención pueden interrumpir el suministro y afectar a toda una comunidad.',
            points: ['Presión estable en todos los pisos y horarios.', 'Menos detenciones imprevistas y costos de emergencia.', 'Equipos dimensionados para la demanda real del edificio.'],
            responseTitle: 'Diseño, instalación y respaldo técnico', response: 'Evaluamos la operación, seleccionamos equipos adecuados y acompañamos el sistema durante su ciclo de vida.',
            services: [['fa-gauge-high','Evaluación y dimensionamiento'],['fa-screwdriver-wrench','Instalación y puesta en marcha'],['fa-calendar-check','Mantención preventiva']],
            category: 'estanques', productsIntro: 'Presurización, reserva y control para salas de bombas y redes comunitarias.',
            products: [['fa-water','Estanques y presurización','Sistemas hidroneumáticos, estanques y accesorios de presión.','estanques'],['fa-sliders','Tableros y control','Protección y automatización para equipos de presión.','tableros'],['fa-gears','Bombas de superficie','Alternativas para redes de abastecimiento y refuerzo.','superficie']], image: 'img/pexels-1.jpg'
        },
        agricultura: {
            title: 'Agricultura y Parcelas', intro: 'Bombeo confiable para pozos, riego y abastecimiento rural, con alternativas eficientes según la fuente de agua.',
            challengeTitle: 'Disponibilidad de agua en condiciones exigentes', challenge: 'La profundidad del pozo, la distancia de impulsión y las variaciones estacionales exigen seleccionar correctamente cada componente.',
            points: ['Captación adecuada a profundidad y caudal requerido.', 'Soluciones para riego y abastecimiento de parcelas.', 'Opciones de bombeo eficiente y preparación para sistemas solares.'],
            responseTitle: 'Una solución ajustada al terreno', response: 'Revisamos fuente, caudal, altura y uso para proponer equipos y controles que respondan a las condiciones de la instalación.',
            services: [['fa-ruler-combined','Evaluación de caudal y altura'],['fa-water','Selección de bombas para pozo'],['fa-solar-panel','Asesoría en bombeo solar y riego']],
            category: 'pozo', productsIntro: 'Equipos para captación de agua, impulsión y riego en terrenos rurales.',
            products: [['fa-arrow-down','Bombas de pozo profundo','Equipos sumergibles para pozos y captaciones.','pozo'],['fa-faucet-drip','Bombas de superficie','Impulsión para riego, estanques y abastecimiento.','superficie'],['fa-microchip','Tableros y control','Protección y control para motores de bombeo.','tableros']], image: 'img/pexels-2.jpg'
        },
        industrias: {
            title: 'Industrias y Plantas', intro: 'Sistemas hidráulicos, control y soporte técnico para proteger la continuidad de los procesos productivos.',
            challengeTitle: 'Confiabilidad para procesos que no pueden detenerse', challenge: 'Una falla de bombeo puede afectar producción, seguridad y continuidad. La selección de equipos y su control deben responder a cada proceso.',
            points: ['Selección técnica para condiciones de operación específicas.', 'Protecciones eléctricas y control de equipos.', 'Planificación de mantención y respuesta técnica especializada.'],
            responseTitle: 'Ingeniería práctica y servicio en terreno', response: 'Apoyamos desde la evaluación de la aplicación hasta la puesta en marcha y mantención de los equipos instalados.',
            services: [['fa-industry','Evaluación de aplicaciones hidráulicas'],['fa-bolt','Tableros eléctricos y control'],['fa-headset','Servicio técnico y mantención 24/7']],
            category: 'tableros', productsIntro: 'Control eléctrico y equipos de bombeo para aplicaciones industriales.',
            products: [['fa-microchip','Tableros y control','Protección, automatización y operación de equipos.','tableros'],['fa-gears','Bombas de superficie','Equipos para procesos y sistemas de circulación.','superficie'],['fa-droplet','Bombas de achique','Drenaje y manejo de aguas para instalaciones y faenas.','achique']], image: 'img/pexels-3.jpg'
        }
    };
    var params = new URLSearchParams(window.location.search);
    var key = params.get('industria');
    if (!industries[key]) key = 'edificios';
    var item = industries[key];
    page.dataset.industry = key;
    document.title = item.title + ' | Soluciones FluidPump';
    document.getElementById('solutionHero').style.setProperty('--solution-image', "url('" + item.image + "')");
    ['solutionTitle', 'solutionBreadcrumb'].forEach(function (id) { document.getElementById(id).textContent = item.title; });
    document.getElementById('solutionIntro').textContent = item.intro;
    document.getElementById('challengeTitle').textContent = item.challengeTitle;
    document.getElementById('challengeCopy').textContent = item.challenge;
    document.getElementById('responseTitle').textContent = item.responseTitle;
    document.getElementById('responseCopy').textContent = item.response;
    document.getElementById('productsIntro').textContent = item.productsIntro;
    var primaryUrl = 'tienda.html?categoria=' + encodeURIComponent(item.category);
    document.getElementById('solutionPrimaryCta').href = primaryUrl;
    document.getElementById('solutionCatalogCta').href = primaryUrl;
    document.getElementById('challengeList').innerHTML = item.points.map(function (text) { return '<li><i class="fas fa-check"></i><span>' + text + '</span></li>'; }).join('');
    document.getElementById('serviceList').innerHTML = item.services.map(function (service) { return '<div><i class="fas ' + service[0] + '"></i><span>' + service[1] + '</span></div>'; }).join('');
    document.getElementById('solutionProducts').innerHTML = item.products.map(function (product) {
        return '<a class="solution-product-card" href="tienda.html?categoria=' + encodeURIComponent(product[3]) + '"><span class="solution-product-icon"><i class="fas ' + product[0] + '"></i></span><strong>' + product[1] + '</strong><span>' + product[2] + '</span><em>Ver categoría <i class="fas fa-arrow-right"></i></em></a>';
    }).join('');
    document.querySelectorAll('[data-industry-tab]').forEach(function (tab) {
        if (tab.dataset.industryTab === key) { tab.classList.add('active'); tab.setAttribute('aria-current', 'page'); }
    });
});
