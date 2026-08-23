
    const defaultConfig = {
      about_title: "SUMMARY",
      about_text: "Thanks for stopping by! Whether you're here to analyze, explore, or get inspired, I hope my work sparks your curiosity.",
      resume_banner_title: "RESUME",
      footer_text: "© 2026 My Portfolio. All rights reserved.",
      primary_color: "#667eea",
      surface_color: "#ffffff",
      text_color: "#2d3748",
      secondary_text_color: "#4a5568",
      accent_color: "#764ba2",
      font_family: "Montserrat",
      font_size: 16
    };

let currentPage;

const fileName = window.location.pathname.split('/').pop();

if (fileName === 'resume.html') {
    currentPage = 'resume';
} else if (fileName === 'projects.html') {
    currentPage = 'projects';
} else if (fileName === 'about.html') {
    currentPage = 'about';
} else if (fileName === 'contact.html') {
    currentPage = 'contact';
} else if (fileName.startsWith('project')) {
    currentPage = null;
} else {
    currentPage = 'home';
}

    async function onConfigChange(config) {
      const fontFamily = config.font_family || defaultConfig.font_family;
      const fontSize = config.font_size || defaultConfig.font_size;
      const baseFontStack = 'sans-serif';
      
      document.body.style.fontFamily = `${fontFamily}, ${baseFontStack}`;
      document.body.style.fontSize = `${fontSize}px`;
      
      // Update text content
      document.getElementById('about-title').textContent = config.about_title || defaultConfig.about_title;
      document.getElementById('about-text').textContent = config.about_text || defaultConfig.about_text;
      document.getElementById('resume-banner-title').textContent = config.resume_banner_title || defaultConfig.resume_banner_title;
      document.getElementById('footer-text').textContent = config.footer_text || defaultConfig.footer_text;
      document.getElementById('footer-text-resume').textContent = config.footer_text || defaultConfig.footer_text;
      document.getElementById('footer-text-projects').textContent = config.footer_text || defaultConfig.footer_text;
      document.getElementById('footer-text-about').textContent = config.footer_text || defaultConfig.footer_text;
      document.getElementById('footer-text-contact').textContent = config.footer_text || defaultConfig.footer_text;
      
      // Update colors
      const surfaceColor = config.surface_color || defaultConfig.surface_color;
      const textColor = config.text_color || defaultConfig.text_color;
      const secondaryTextColor = config.secondary_text_color || defaultConfig.secondary_text_color;
      
      document.getElementById('app').style.backgroundColor = surfaceColor;
      
      document.getElementById('about-title').style.color = '#000000';
      document.getElementById('about-text').style.color = secondaryTextColor;
      
      // Update font sizes proportionally - both titles now at 1.5x
      document.getElementById('about-title').style.fontSize = `${fontSize * 1.5}px`;
      document.getElementById('about-text').style.fontSize = `${fontSize * 0.75}px`;
      document.getElementById('resume-banner-title').style.fontSize = `${fontSize * 2.5}px`;
    }

    function mapToCapabilities(config) {
      return {
        recolorables: [
          {
            get: () => config.primary_color || defaultConfig.primary_color,
            set: (value) => {
              config.primary_color = value;
              if (window.elementSdk) window.elementSdk.setConfig({ primary_color: value });
            }
          },
          {
            get: () => config.surface_color || defaultConfig.surface_color,
            set: (value) => {
              config.surface_color = value;
              if (window.elementSdk) window.elementSdk.setConfig({ surface_color: value });
            }
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              config.text_color = value;
              if (window.elementSdk) window.elementSdk.setConfig({ text_color: value });
            }
          },
          {
            get: () => config.secondary_text_color || defaultConfig.secondary_text_color,
            set: (value) => {
              config.secondary_text_color = value;
              if (window.elementSdk) window.elementSdk.setConfig({ secondary_text_color: value });
            }
          },
          {
            get: () => config.accent_color || defaultConfig.accent_color,
            set: (value) => {
              config.accent_color = value;
              if (window.elementSdk) window.elementSdk.setConfig({ accent_color: value });
            }
          }
        ],
        borderables: [],
        fontEditable: {
          get: () => config.font_family || defaultConfig.font_family,
          set: (value) => {
            config.font_family = value;
            if (window.elementSdk) window.elementSdk.setConfig({ font_family: value });
          }
        },
        fontSizeable: {
          get: () => config.font_size || defaultConfig.font_size,
          set: (value) => {
            config.font_size = value;
            if (window.elementSdk) window.elementSdk.setConfig({ font_size: value });
          }
        }
      };
    }

    function mapToEditPanelValues(config) {
      return new Map([
        ["about_title", config.about_title || defaultConfig.about_title],
        ["about_text", config.about_text || defaultConfig.about_text],
        ["resume_banner_title", config.resume_banner_title || defaultConfig.resume_banner_title],
        ["footer_text", config.footer_text || defaultConfig.footer_text]
      ]);
    }

    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
      });
    }

    // Page navigation
    function showPage(pageName) {
      currentPage = pageName;
      
      // Hide all pages
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });
      
      // Show selected page
      const targetPage = document.getElementById(`${pageName}-page`);
      if (targetPage) {
        targetPage.classList.add('active');
      }
      
      // Reset filter to 'all' when entering projects page
      if (pageName === 'projects') {
        filterProjects('all', false);
      }
      
      // Update active nav link
      updateActiveNav();
      
      // Scroll to top
      document.getElementById('app').scrollTop = 0;
    }

function updateActiveNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    const isActive = link.dataset.page === currentPage;

    // remove any old inline color you may have set before
    link.style.color = '';

    // toggle active class for underline
    link.classList.toggle('active', isActive);
  });
}


    // Add click handlers to all nav links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        showPage(page);
      });
    });

    // Filter functionality
let currentFilter = 'all';
let projectGridHeight = 0;
let filterAnimating = false;

function filterProjects(filter, animate = true) {

  const projectGrid = document.getElementById('project-grid');
  const projectCards = [...projectGrid.querySelectorAll('.project-card')];
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!projectGrid) return;

  if (animate && filter === currentFilter) return;

  currentFilter = filter;

  // Filter button appearance
  filterButtons.forEach(btn => {
    btn.style.opacity =
      btn.dataset.filter === filter ? '1' : '0.5';
  });


  // =====================================================
  // ENTERING PROJECT PAGE
  // No animation
  // =====================================================

  if (!animate) {

    projectCards.forEach(card => {

      const shouldShow =
        filter === 'all' ||
        card.dataset.category === filter;

      card.style.display = shouldShow ? '' : 'none';
      card.style.opacity = shouldShow ? '1' : '0';

      card.style.transform = '';
      card.style.transition = 'none';

      card.style.position = '';
      card.style.left = '';
      card.style.top = '';
      card.style.width = '';
      card.style.height = '';

      card.style.pointerEvents =
        shouldShow ? 'auto' : 'none';
    });

    requestAnimationFrame(() => {

      if (filter === 'all') {
        projectGridHeight = projectGrid.offsetHeight;

        projectGrid.style.minHeight =
          projectGridHeight + 'px';
      }

    });

    return;
  }


  if (filterAnimating) return;

  filterAnimating = true;

  projectGrid.style.position = 'relative';


  // =====================================================
  // RECORD OLD GRID POSITIONS
  // =====================================================

  const oldPositions = new Map();

  projectCards.forEach(card => {

    if (card.style.display !== 'none') {

      oldPositions.set(card, {
        left: card.offsetLeft,
        top: card.offsetTop,
        width: card.offsetWidth,
        height: card.offsetHeight
      });

    }

  });


  const disappearing = [];
  const appearing = [];
  const staying = [];


  projectCards.forEach(card => {

    const shouldShow =
      filter === 'all' ||
      card.dataset.category === filter;

    const visible =
      card.style.display !== 'none';


    if (visible && !shouldShow) {
      disappearing.push(card);
    }

    else if (!visible && shouldShow) {
      appearing.push(card);
    }

    else if (visible && shouldShow) {
      staying.push(card);
    }

  });


  // =====================================================
  // PIN DISAPPEARING CARDS
  // =====================================================

  disappearing.forEach(card => {

    const old = oldPositions.get(card);

    card.style.position = 'absolute';

    card.style.left = old.left + 'px';
    card.style.top = old.top + 'px';

    card.style.width = old.width + 'px';
    card.style.height = old.height + 'px';

    card.style.margin = '0';
    card.style.zIndex = '5';

    card.style.pointerEvents = 'none';

  });


  // =====================================================
  // PUT APPEARING CARDS INTO GRID
  // =====================================================

  appearing.forEach(card => {

    card.style.display = '';

    card.style.position = '';
    card.style.left = '';
    card.style.top = '';
    card.style.width = '';
    card.style.height = '';
    card.style.margin = '';

    card.style.opacity = '0';
    card.style.transform = 'scale(0.65)';
    card.style.transition = 'none';

    card.style.pointerEvents = 'auto';

  });


  // Force browser to calculate new grid positions
  projectGrid.offsetHeight;


  // =====================================================
  // POSITION STAYING CARDS OVER THEIR OLD LOCATIONS
  // =====================================================

  staying.forEach(card => {

    const old = oldPositions.get(card);

    const newLeft = card.offsetLeft;
    const newTop = card.offsetTop;

    const deltaX = old.left - newLeft;
    const deltaY = old.top - newTop;

    card.style.transition = 'none';

    card.style.transform =
      `translate(${deltaX}px, ${deltaY}px)`;

  });


  // Force starting positions to render
  projectGrid.offsetHeight;


  // =====================================================
  // EVERYTHING ANIMATES SIMULTANEOUSLY
  // =====================================================

  requestAnimationFrame(() => {

    disappearing.forEach(card => {

      card.style.transition =
        'transform 0.25s ease-out, opacity 0.25s ease-out';

      card.style.transform = 'scale(0.65)';
      card.style.opacity = '0';

    });


    appearing.forEach(card => {

      card.style.transition =
        'transform 0.25s ease-out, opacity 0.25s ease-out';

      card.style.transform = 'scale(1)';
      card.style.opacity = '1';

    });


    staying.forEach(card => {

      card.style.transition =
        'transform 0.25s ease-out';

      card.style.transform =
        'translate(0px, 0px)';

    });

  });


  // =====================================================
  // CLEANUP
  // =====================================================

  setTimeout(() => {

    disappearing.forEach(card => {

      card.style.display = 'none';

      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = '0';

      card.style.position = '';
      card.style.left = '';
      card.style.top = '';
      card.style.width = '';
      card.style.height = '';
      card.style.margin = '';
      card.style.zIndex = '';

    });


    appearing.forEach(card => {

      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = '1';

    });


    staying.forEach(card => {

      card.style.transition = 'none';
      card.style.transform = '';

    });


    filterAnimating = false;

  }, 250);

}
    
    // Add click handlers to filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterProjects(btn.dataset.filter);
      });
    });

    // Add click handler to view resume button
    const viewResumeBtn = document.querySelector('.view-resume-btn');
    if (viewResumeBtn) {
      viewResumeBtn.addEventListener('click', () => {
        showPage('resume');
      });
    }

    // Add click handlers to home buttons
    document.querySelectorAll('.home-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showPage('home');
      });
    });

    // Add click handlers to project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const projectPage = card.dataset.project;
        if (projectPage) {
          showPage(projectPage);
        }
      });
    });

    // Add click handlers to back to projects buttons
    document.querySelectorAll('.back-to-projects-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showPage('projects');
      });
    });

    // Parallax effect for banner images
    function handleParallax() {
      const banners = document.querySelectorAll('.banner-parallax');
      const appContainer = document.getElementById('app');
      const scrollPosition = appContainer.scrollTop;
      
      banners.forEach(banner => {
        const bannerSection = banner.closest('.other-projects-banner');
        if (!bannerSection) return;
        
        // Get the position of the banner section relative to the viewport
        const rect = bannerSection.getBoundingClientRect();
        const bannerTop = rect.top;
        const bannerHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // Calculate when banner enters viewport (starts visible at bottom of screen)
        // and when it exits (top of banner reaches top of viewport)
        if (bannerTop < windowHeight && bannerTop + bannerHeight > 0) {
          // Banner is visible in viewport
          // Calculate progress from center of screen, creating smoother movement
          const viewportCenter = windowHeight / 2;
          const bannerCenter = bannerTop + bannerHeight / 2;
          const distanceFromCenter = viewportCenter - bannerCenter;
          
          // Apply prominent parallax with smoother calculation
          // Movement is based on distance from viewport center
const imageHeight = banner.offsetHeight;
const containerHeight = bannerSection.offsetHeight;

/* Maximum distance available before reaching source-image edge */
const maxTravel = Math.max(
  0,
  (imageHeight - containerHeight) / 2
);

/* Parallax speed */
const desiredOffset = distanceFromCenter * 0.62;

/* Stop ONLY when actual image edge is reached */
const offset = Math.max(
  -maxTravel,
  Math.min(maxTravel, desiredOffset)
);

banner.style.transform =
  `translateY(calc(-50% + ${offset}px))`;
        }
      });
    }
    
    // Add scroll listener to app container
    document.getElementById('app').addEventListener('scroll', handleParallax);
    
    // Initial parallax position
    handleParallax();

    // Add click handlers to all logo images
    document.querySelectorAll('.logo-container').forEach(logo => {
      logo.addEventListener('click', () => {
        showPage('home');
      });
    });

    // Add hover effect to coming soon card
    const comingSoonCard = document.querySelector('.coming-soon-card');
    if (comingSoonCard) {
      const overlay = comingSoonCard.querySelector('.coming-soon-overlay');
      comingSoonCard.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
      });
      comingSoonCard.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
      });
    }

    // Add click handlers to timeline read more links
    document.querySelectorAll('.timeline-read-more').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectPage = link.dataset.project;
        if (projectPage) {
          showPage(projectPage);
        }
      });
    });

    // Initialize
    updateActiveNav();
