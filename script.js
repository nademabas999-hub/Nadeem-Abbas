
// --- Navbar Scroll Effect ---
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// --- Intersection Observer for Animations ---
const animatedElements = document.querySelectorAll('.needs-animation');
if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // observer.unobserve(entry.target); // Optional
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => { observer.observe(el); });
}

// --- Smooth Scroll for Nav Links ---
document.querySelectorAll('.nav-link[href^="#"], .btn-gradient[href^="#"], .btn-play[href^="#"], .logo a[href^="#"], .footer-brand[href^="#"], .cta-button[href^="#"], .btn-choose-gradient[href^="#"]')
    .forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    new bootstrap.Collapse(navbarCollapse).hide();
                }
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                } else {
                    const correspondingNavLink = document.querySelector(`.nav-link[href="${targetId}"]`);
                    if (correspondingNavLink) { correspondingNavLink.classList.add('active'); }
                }
            }
        });
});

// --- Active Nav Link on Scroll ---
const sections = document.querySelectorAll('section[id]');
if (sections.length > 0) {
    window.addEventListener('scroll', navHighlighter);
    function navHighlighter() {
        let scrollY = window.pageYOffset;
        const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
        let activeSectionId = null;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbarHeight - 70;
            let sectionId = current.getAttribute('id');
            if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
               activeSectionId = sectionId;
            }
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (activeSectionId && link.getAttribute('href') === '#' + activeSectionId) {
                link.classList.add('active');
            }
        });
        if (window.scrollY < sections[0].offsetTop - navbarHeight - 70) {
             document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
             const heroNavLink = document.querySelector('.nav-link[href*="' + sections[0].id + '"]');
             if (heroNavLink) heroNavLink.classList.add('active');
        }
    }
    navHighlighter(); // Call once on load
}

// --- Copyright Year ---
const copyrightYearElement = document.getElementById('copyright-year');
if (copyrightYearElement) {
    copyrightYearElement.textContent = new Date().getFullYear();
}

// --- Image Carousel (If exists in #about section) ---
// Note: Aapke HTML mein prevBtn aur nextBtn IDs nahi hain, isliye yeh part shayad kaam na kare.
const imageCards = document.querySelectorAll('#about .image-card');
const prevBtn = document.getElementById('prev-btn'); // Agar yeh element nahi hai, toh error aayega
const nextBtn = document.getElementById('next-btn'); // Agar yeh element nahi hai, toh error aayega
let currentCardIndex = 0;

function showCard(index) {
    imageCards.forEach((card, i) => {
        card.classList.remove('active-card');
        if (i === index) {
            card.classList.add('active-card');
        }
    });
}

if (imageCards.length > 0 && prevBtn && nextBtn) { // Check if buttons exist
    showCard(currentCardIndex);
    prevBtn.addEventListener('click', () => {
        currentCardIndex = (currentCardIndex - 1 + imageCards.length) % imageCards.length;
        showCard(currentCardIndex);
    });
    nextBtn.addEventListener('click', () => {
        currentCardIndex = (currentCardIndex + 1) % imageCards.length;
        showCard(currentCardIndex);
    });
}

// --- Particle Animation JavaScript ---
const particleCanvas = document.getElementById('particleCanvasPortfolio');
let ctx, particleTextElement, pageFooter, signatureText, fontSize, textX, textY, textBoundingBox; // originalTextColor removed as not used
let particleArray = [];
const particleColors = ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00', '#FF69B4', '#7FFF00', '#00BFFF', '#FFFFFF'];
let particleState = 'formed';
let scatterTriggeredByHover = false;
let fontForParticles = 'Poppins, system-ui, -apple-system, sans-serif';
let mouse = { x: null, y: null, radius: 110 };
let customCursor = { x: null, y: null, radius: 7, color: 'rgba(220, 240, 255, 0.7)' };

if (particleCanvas) {
    ctx = particleCanvas.getContext('2d');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    particleTextElement = document.getElementById('particleTextTarget');
    pageFooter = document.getElementById('main-footer');
    signatureText = particleTextElement ? particleTextElement.textContent.trim() : "SheryarDev";
    textBoundingBox = { x: 0, y: 0, width: 0, height: 0 };

    function calculateTextParameters() {
        if (!particleTextElement) return;
        const rect = particleTextElement.getBoundingClientRect();
        const parentH1 = particleTextElement.closest('h1');
        const computedStyle = window.getComputedStyle(parentH1 || particleTextElement);
        let h1FontSize = parseFloat(computedStyle.fontSize);

        // Adjust font size for particle text relative to the H1's actual rendered size
        fontSize = Math.min(h1FontSize * 0.9, particleCanvas.height / 4, 100); // 0.9 multiplier for better fit
        fontSize = Math.max(fontSize, 20);

        // Position particle text based on the span's top-left, adjusting for baseline
        textX = rect.left + window.scrollX; // Add scrollX for absolute positioning on canvas
        textY = rect.top + window.scrollY + (rect.height * 0.8); // Add scrollY and adjust Y for baseline

        // Bounding box for hover detection relative to viewport
        textBoundingBox.x = rect.left;
        textBoundingBox.y = rect.top;
        textBoundingBox.width = rect.width;
        textBoundingBox.height = rect.height;
    }

    function getTextPixelData() {
      ctx.clearRect(0,0,particleCanvas.width, particleCanvas.height);
      calculateTextParameters(); // Ensure parameters are up-to-date
      if (!particleTextElement) return null;
      const parentH1 = particleTextElement.closest('h1');
      const computedStyle = window.getComputedStyle(parentH1 || particleTextElement);
      ctx.fillStyle = "white";
      ctx.font = `${computedStyle.fontWeight || 'bold'} ${fontSize}px ${fontForParticles}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic"; // "alphabetic" is good for matching baselines

      // We are drawing on canvas which is fixed. textX and textY are already viewport-relative.
      // No need to subtract scroll here as fillText on fixed canvas uses absolute coords.
      ctx.fillText(signatureText, textX - window.scrollX, textY - window.scrollY); // Adjust for canvas drawing

      const data = ctx.getImageData(0, 0, particleCanvas.width, particleCanvas.height);
      ctx.clearRect(0,0,particleCanvas.width, particleCanvas.height);
      return data;
    }

    class Particle {
      constructor(x, y) {
        // Initial position on canvas should be relative to canvas, not viewport
        this.baseX = x + (textX - window.scrollX); // Convert sampled x to canvas x
        this.baseY = y + (textY - window.scrollY - (fontSize * 0.8)); // Convert sampled y to canvas y, adjusting for baseline

        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;

        this.size = Math.random() * 1.5 + 0.5; this.baseSize = this.size;
        this.density = Math.random() * 30 + 15;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.trail = []; this.trailLength = 4 + Math.random() * 5;
        this.speedX = (Math.random() - 0.5) * 0.3; this.speedY = (Math.random() - 0.5) * 0.3;
        this.scatterSpeedX = 0; this.scatterSpeedY = 0;
      }
      draw() {
        for (let i = 0; i < this.trail.length; i++) {
          const t = this.trail[i]; const opacity = (i / this.trail.length) * 0.3;
          ctx.beginPath(); ctx.arc(t.x, t.y, t.size * (i / this.trail.length) * 0.8, 0, Math.PI * 2);
          const rgb = hexToRgb(this.color); ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`; ctx.fill();
        }
        ctx.fillStyle = this.color; ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.closePath(); ctx.fill();
        ctx.shadowColor = this.color; ctx.shadowBlur = 5 + this.size * 2;
      }
      updateTrail() {
        this.trail.push({ x: this.x, y: this.y, size: this.size });
        if (this.trail.length > this.trailLength) this.trail.shift();
      }
      update() {
        this.updateTrail(); ctx.shadowBlur = 0;
        if (particleState === 'scattered') {
            this.x += this.scatterSpeedX; this.y += this.scatterSpeedY;
            if (this.x > particleCanvas.width + this.size * 2 || this.x < -this.size * 2) this.scatterSpeedX *= -1.02;
            if (this.y > particleCanvas.height + this.size * 2 || this.y < -this.size * 2) this.scatterSpeedY *= -1.02;
            if (Math.random() < 0.015) this.scatterSpeedX += (Math.random() - 0.5) * 0.6;
            if (Math.random() < 0.015) this.scatterSpeedY += (Math.random() - 0.5) * 0.6;
            this.scatterSpeedX = Math.max(-2.5, Math.min(2.5, this.scatterSpeedX));
            this.scatterSpeedY = Math.max(-2.5, Math.min(2.5, this.scatterSpeedY));
        } else {
            let dxMouse = mouse.x - this.x; let dyMouse = mouse.y - this.y;
            let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            if (mouse.x != null && distanceMouse < mouse.radius && particleState === 'formed') {
              let forceDirectionX = dxMouse / distanceMouse; let forceDirectionY = dyMouse / distanceMouse;
              let force = (mouse.radius - distanceMouse) / mouse.radius;
              this.x -= forceDirectionX * force * (this.density / 7);
              this.y -= forceDirectionY * force * (this.density / 7);
              this.size = this.baseSize + force * 2;
              this.speedX += (Math.random() - 0.5) * 0.08; this.speedY += (Math.random() - 0.5) * 0.08;
            } else {
              let dxBase = this.baseX - this.x; let dyBase = this.baseY - this.y;
              this.speedX += dxBase / (this.density * 5); this.speedY += dyBase / (this.density * 5);
              this.speedX *= 0.94; this.speedY *= 0.94;
              this.x += this.speedX; this.y += this.speedY;
              if (this.size > this.baseSize) this.size -= 0.08; else this.size = this.baseSize;
            }
        }
      }
    }

    function hexToRgb(hex) {
      let r = 0, g = 0, b = 0;
      if (hex.length == 4) { r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3]; }
      else if (hex.length == 7) { r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6]; }
      return { r: +r, g: +g, b: +b };
    }

    function initParticles() {
      if (!particleTextElement) { console.error("Particle text target element not found."); return; }
      particleArray = [];
      const textCoordinates = getTextPixelData(); // This uses updated calculateTextParameters
      if (!textCoordinates) { console.error("Could not get text pixel data."); return; }

      // The `x` and `y` from `textCoordinates` are relative to the getImageData area (0,0 of canvas).
      // When creating particles, their `baseX` and `baseY` should be these canvas-relative coordinates.
      const step = Math.max(2, Math.floor(70 / Math.sqrt(fontSize)));
      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          let index = (y * textCoordinates.width + x) * 4;
          if (textCoordinates.data[index + 3] > 128) {
            // Pass the canvas-relative x and y to the Particle constructor
            particleArray.push(new Particle(x, y));
          }
        }
      }
      particleTextElement.style.opacity = '0.05';
      particleTextElement.style.color = 'transparent';
      particleState = 'formed'; scatterTriggeredByHover = false;
    }

    function drawCustomCursor() {
      if (customCursor.x !== null) {
        ctx.beginPath(); ctx.arc(customCursor.x, customCursor.y, customCursor.radius, 0, Math.PI * 2);
        ctx.strokeStyle = customCursor.color; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(customCursor.x, customCursor.y, customCursor.radius / 2.5 , 0, Math.PI * 2);
        ctx.fillStyle = customCursor.color; ctx.fill();
      }
    }
    function animateParticles() {
      ctx.fillStyle = 'rgba(0, 0, 5, 0.1)';
      ctx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);
      for (let i = 0; i < particleArray.length; i++) { particleArray[i].update(); particleArray[i].draw(); }
      if (document.body.classList.contains('hide-cursor')) { drawCustomCursor(); }
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener("mousemove", function(event) {
        mouse.x = event.clientX; mouse.y = event.clientY;
        if (document.body.classList.contains('hide-cursor')) {
            customCursor.x = event.clientX; customCursor.y = event.clientY;
        }

        // Bounding box for hover is relative to viewport
        if (particleState === 'formed' && particleTextElement &&
            mouse.x > textBoundingBox.x && mouse.x < textBoundingBox.x + textBoundingBox.width &&
            mouse.y > textBoundingBox.y && mouse.y < textBoundingBox.y + textBoundingBox.height) {
            if (!scatterTriggeredByHover) {
                particleState = 'scattered'; scatterTriggeredByHover = true;
                console.log("Particles scattered!");
                particleArray.forEach(p => {
                    p.scatterSpeedX = (Math.random() - 0.5) * (Math.random() * 7 + 3);
                    p.scatterSpeedY = (Math.random() - 0.5) * (Math.random() * 7 + 3);
                });
            }
        } else {
             if (particleTextElement && (mouse.x < textBoundingBox.x || mouse.x > textBoundingBox.x + textBoundingBox.width ||
                 mouse.y < textBoundingBox.y || mouse.y > textBoundingBox.y + textBoundingBox.height)) {
                scatterTriggeredByHover = false;
             }
        }
    });

    if (pageFooter) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && particleState === 'scattered') {
                    console.log("Footer in view, re-forming particles.");
                    particleState = 'formed'; scatterTriggeredByHover = false;
                    particleArray.forEach(p => { p.scatterSpeedX = 0; p.scatterSpeedY = 0; });
                }
            });
        }, { threshold: 0.1 });
        footerObserver.observe(pageFooter);
    }

    // Debounce resize handler
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (particleCanvas) {
                particleCanvas.width = window.innerWidth;
                particleCanvas.height = window.innerHeight;
                if (particleTextElement) {
                    // Recalculate text parameters before re-initializing
                    // This is crucial because boundingClientRect depends on current layout
                    calculateTextParameters();
                    initParticles();
                }
            }
        }, 250); // Adjust debounce delay as needed
    });

    if (!document.body.classList.contains('hide-cursor')) {
        customCursor.x = null; customCursor.y = null;
    }

    // Wait for the entire page to load, including fonts and images,
    // to ensure accurate bounding box calculations.
    window.addEventListener('load', () => {
        if (particleCanvas && particleTextElement) {
            // Calculate initial parameters once everything is loaded
            calculateTextParameters();
            initParticles();
            animateParticles();
        } else {
            if (!particleCanvas) console.error("Particle canvas not found on load.");
            if (!particleTextElement) console.error("Particle text target element not found on load.");
        }
    });

} // End of particleCanvas check
