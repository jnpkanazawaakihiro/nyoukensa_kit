/**
 * MEDI ALPHA PLUS — 法人向け尿検査キット LP
 * main.js
 */

'use strict';

/* ==============================
   DOM Ready
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initRevealOnScroll();
  initFAQ();
  initPricingTabs();
  initProductThumbs();
  initCounters();
  initForm();
  initSPStickyCTA();
  initModalClose();
  initCompareBarAnimation();
});

/* ==============================
   Header: Scroll & Active Nav
   ============================== */
function initHeader() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.header-nav a:not(.nav-company)');
  const sections = Array.from(navLinks).map(link => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#') ? document.querySelector(href) : null;
  });

  const onScroll = () => {
    // Scrolled shadow
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active nav highlight
    const scrollY = window.scrollY + 120;
    sections.forEach((section, i) => {
      if (!section) return;
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        navLinks[i].classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==============================
   Mobile Menu
   ============================== */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('headerNav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    nav.classList.toggle('mobile-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('mobile-open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      toggle.classList.remove('open');
      nav.classList.remove('mobile-open');
    }
  });
}

/* ==============================
   Reveal on Scroll
   ============================== */
function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const siblingReveal = siblings.filter(s => s.classList.contains('reveal'));
        const delay = siblingReveal.indexOf(entry.target) * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==============================
   FAQ Accordion
   ============================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(fi => fi.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==============================
   Pricing Tabs
   ============================== */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.ptab');
  const panes = document.querySelectorAll('.pricing-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('ptab-active'));
      tab.classList.add('ptab-active');

      panes.forEach(pane => {
        if (pane.id === `tab-${target}`) {
          pane.classList.remove('hidden');
        } else {
          pane.classList.add('hidden');
        }
      });
    });
  });
}

/* ==============================
   Product Thumbs
   ============================== */
function initProductThumbs() {
  const thumbs = document.querySelectorAll('.product-thumb');
  const mainImg = document.getElementById('productMainImg');
  const labelRow = document.getElementById('labelRow');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.dataset.img;
      const isLabel = thumb.dataset.label === 'label';

      if (mainImg && newSrc) {
        mainImg.style.opacity = '0';
        mainImg.style.transition = 'opacity 0.25s';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 150);
      }

      if (labelRow) {
        labelRow.style.opacity = isLabel ? '1' : '0.35';
      }
    });
  });
}

/* ==============================
   Counter Animation
   ============================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  if (!('IntersectionObserver' in window)) {
    counters.forEach(el => {
      el.textContent = el.dataset.target;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimal = parseInt(el.dataset.decimal || '0');
  const duration = 1800;
  const start = performance.now();

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = eased * target;

    el.textContent = decimal > 0
      ? value.toFixed(decimal)
      : Math.floor(value).toString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = decimal > 0 ? target.toFixed(decimal) : target.toString();
    }
  };

  requestAnimationFrame(step);
}

/* ==============================
   Compare Bar Animation
   ============================== */
function initCompareBarAnimation() {
  const bars = document.querySelectorAll('.compare-bar');

  bars.forEach(bar => {
    const targetWidth = bar.style.width || '100%';
    bar.style.width = '0%';
    bar.style.transition = 'none';

    if (!('IntersectionObserver' in window)) {
      bar.style.width = targetWidth;
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            bar.style.transition = 'width 1.2s ease';
            bar.style.width = targetWidth;
          }, 200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(bar);
  });
}

/* ==============================
   Form Handling
   ============================== */
function initForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';

    // Simulate API call (replace with actual endpoint)
    await new Promise(resolve => setTimeout(resolve, 1500));

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 見積依頼を送信する <span class="btn-note">最短当日中にご連絡 ／ 強引な営業は一切行いません</span>';

    // Google広告 コンバージョン計測（申し込み）
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-16540234234/MhdjCJmNsZUcEPrj_849'
      });
    }

    // Show success modal
    showModal();
    form.reset();
  });

  // Real-time validation
  form.querySelectorAll('input[required], select[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });
}

function validateForm(form) {
  let isValid = true;

  // Required fields
  form.querySelectorAll('input[required], select[required]').forEach(field => {
    if (!validateField(field)) isValid = false;
  });

  // Privacy checkbox
  const privacy = document.getElementById('privacy');
  if (privacy && !privacy.checked) {
    showFieldError(privacy, 'プライバシーポリシーへの同意が必要です');
    isValid = false;
  }

  return isValid;
}

function validateField(field) {
  clearFieldError(field);

  if (!field.value.trim()) {
    showFieldError(field, 'この項目は必須です');
    return false;
  }

  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    showFieldError(field, '正しいメールアドレスを入力してください');
    return false;
  }

  return true;
}

function showFieldError(field, msg) {
  field.classList.add('error');
  const existingMsg = field.parentElement.querySelector('.error-msg');
  if (!existingMsg) {
    const msgEl = document.createElement('span');
    msgEl.className = 'error-msg';
    msgEl.style.cssText = 'font-size:11px;color:#DC2626;margin-top:2px;';
    msgEl.textContent = msg;
    field.parentElement.appendChild(msgEl);
  }
}

function clearFieldError(field) {
  field.classList.remove('error');
  const msg = field.parentElement.querySelector('.error-msg');
  if (msg) msg.remove();
}

/* ==============================
   Modal
   ============================== */
function showModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function initModalClose() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  if (!overlay) return;

  const close = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ==============================
   SP Sticky CTA
   ============================== */
function initSPStickyCTA() {
  const hero = document.getElementById('top');
  const stickyCta = document.getElementById('spStickyCta');

  if (!stickyCta || !hero) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        stickyCta.style.display = 'flex';
      } else {
        stickyCta.style.display = 'none';
      }
    });
  }, { threshold: 0 });

  observer.observe(hero);
}

/* ==============================
   Smooth Scroll (enhanced)
   ============================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = document.getElementById('header')?.offsetHeight || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});
