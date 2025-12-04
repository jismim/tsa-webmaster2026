// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 70;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Animated Counter for Impact Numbers
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            animateCounter(entry.target);
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.impact-number').forEach(counter => {
    observer.observe(counter);
});

// Success Stories Carousel
const storyCards = document.querySelectorAll('.story-card');
const prevStoryBtn = document.querySelector('.prev-story');
const nextStoryBtn = document.querySelector('.next-story');
const storyDotsContainer = document.querySelector('.story-dots');
let currentStoryIndex = 0;
let storyAutoplayInterval;

// Create story dots
storyCards.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('story-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToStory(index));
    storyDotsContainer.appendChild(dot);
});

const storyDots = document.querySelectorAll('.story-dot');

function updateStoryCarousel() {
    storyCards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentStoryIndex) {
            card.classList.add('active');
        }
    });
    
    storyDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentStoryIndex) {
            dot.classList.add('active');
        }
    });
}

function goToStory(index) {
    currentStoryIndex = index;
    updateStoryCarousel();
    resetStoryAutoplay();
}

function nextStory() {
    currentStoryIndex = (currentStoryIndex + 1) % storyCards.length;
    updateStoryCarousel();
}

function prevStory() {
    currentStoryIndex = (currentStoryIndex - 1 + storyCards.length) % storyCards.length;
    updateStoryCarousel();
}

function resetStoryAutoplay() {
    clearInterval(storyAutoplayInterval);
    storyAutoplayInterval = setInterval(nextStory, 6000);
}

if (prevStoryBtn && nextStoryBtn) {
    prevStoryBtn.addEventListener('click', () => {
        prevStory();
        resetStoryAutoplay();
    });
    nextStoryBtn.addEventListener('click', () => {
        nextStory();
        resetStoryAutoplay();
    });
}

// Auto-play stories carousel
storyAutoplayInterval = setInterval(nextStory, 6000);

// Resources Carousel functionality
const cards = document.querySelectorAll('.resource-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.carousel-dots');
let currentIndex = 0;
let resourceAutoplayInterval;

// Create dots
cards.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateCarousel() {
    cards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentIndex) {
            card.classList.add('active');
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentIndex) {
            dot.classList.add('active');
        }
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetResourceAutoplay();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
}

function resetResourceAutoplay() {
    clearInterval(resourceAutoplayInterval);
    resourceAutoplayInterval = setInterval(nextSlide, 5000);
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetResourceAutoplay();
    });
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetResourceAutoplay();
    });
}

// Auto-play carousel
resourceAutoplayInterval = setInterval(nextSlide, 5000);

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// CTA Button Click Handlers
const primaryCTA = document.querySelector('.cta-button.primary');
const secondaryCTA = document.querySelector('.cta-button.secondary');

if (primaryCTA) {
    primaryCTA.addEventListener('click', () => {
        const resourcesSection = document.querySelector('.resources-highlight');
        if (resourcesSection) {
            resourcesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

if (secondaryCTA) {
    secondaryCTA.addEventListener('click', () => {
        const submitSection = document.querySelector('.submit-cta');
        if (submitSection) {
            submitSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Submit Button Handler
const submitButton = document.querySelector('.submit-button');
if (submitButton) {
    submitButton.addEventListener('click', () => {
        alert('This will take you to the resource submission form.\n\nIn production, this would link to: submit-resource.html');
        // In production, replace with: window.location.href = 'submit-resource.html';
    });
}

// View All Resources Button
const viewAllBtn = document.querySelector('.view-all-btn');
if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
        alert('This will take you to the full resources directory page.\n\nIn production, this would link to: resources.html');
        // In production, replace with: window.location.href = 'resources.html';
    });
}

// Add animation on scroll for cards
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Apply scroll animations to various elements
document.querySelectorAll('.impact-card, .action-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    animateOnScroll.observe(card);
});

// Animate hero content on load
window.addEventListener('load', () => {
    setTimeout(() => {
        const heroTitle = document.querySelector('.animate-title');
        const heroSubtitle = document.querySelector('.animate-subtitle');
        
        if (heroTitle) heroTitle.classList.add('show');
        if (heroSubtitle) {
            setTimeout(() => {
                heroSubtitle.classList.add('show');
            }, 300);
        }
    }, 1600);
});