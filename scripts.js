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
