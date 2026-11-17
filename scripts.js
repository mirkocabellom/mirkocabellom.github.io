// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar-main');
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
            if (navCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navCollapse).hide();
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
