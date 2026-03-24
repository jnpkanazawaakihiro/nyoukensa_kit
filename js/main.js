/* ============================================================
   MEDI ALPHA PLUS - 尿検査キット LP
   メインJavaScript
   ============================================================ */

'use strict';

/* ===== DOM ready ===== */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMenu();
  initScrollAnimations();
  initStickyCta();
  initBackToTop();
  initBarAnimations();
});

/* ===== ヘッダー スクロール ===== */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== モバイルメニュー ===== */
function initMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('headerNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // メニュー内リンククリックで閉じる
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  // 外側クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
    }
  });
}

/* ===== スクロールアニメーション ===== */
function initScrollAnimations() {
  // fade-in クラスを付与する要素を選定
  const targets = document.querySelectorAll(
    '.challenge-card, .strength-item, .case-card, .faq-item, ' +
    '.pricing-row, .corp-point, .why-item, .trust-num-item, ' +
    '.section-title, .section-label, .section-desc, ' +
    '.product-layout, .cost-comparison, .why-cheap, ' +
    '.challenge-solution-banner, ' +
    '.trust-numbers'
  );

  targets.forEach((el, i) => {
    el.classList.add('fade-in');
    // 子要素の遅延を設定
    const delay = (i % 4) * 0.1;
    el.style.transitionDelay = `${delay}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* ===== 固定CTA ===== */
function initStickyCta() {
  const sticky = document.getElementById('stickyCta');
  const hero = document.getElementById('hero');
  if (!sticky || !hero) return;

  const onScroll = () => {
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.scrollY > heroBottom - 200) {
      sticky.classList.add('visible');
    } else {
      sticky.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== トップへ戻るボタン ===== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== コスト比較バーアニメーション ===== */
function initBarAnimations() {
  const fills = document.querySelectorAll('.compare-fill');
  if (!fills.length) return;

  // 初期状態は幅0
  fills.forEach(el => {
    el._targetWidth = el.style.width;
    el.style.width = '0%';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fills.forEach(el => {
          el.style.width = el._targetWidth;
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const comp = document.querySelector('.cost-comparison');
  if (comp) observer.observe(comp);
}

/* ===== FAQ アコーディオン ===== */
function toggleFaq(btn) {
  const faqItem = btn.closest('.faq-item');
  const answer = faqItem.querySelector('.faq-a');
  const isOpen = answer.classList.contains('open');

  // すべて閉じる
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('active'));

  // クリックしたものが閉じていた場合は開く
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('active');
  }
}

/* ===== 価格タブ ===== */
function switchTab(type, el) {
  // ボタン
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  // コンテンツ
  document.getElementById('pricing-label').classList.add('hidden');
  document.getElementById('pricing-nolabel').classList.add('hidden');
  document.getElementById('pricing-' + type).classList.remove('hidden');
}

/* ===== 商品バリアント切替 ===== */
function switchVariant(type, el) {
  document.querySelectorAll('.variant-card').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');

  const labelItem = document.getElementById('label-item');
  const mainImg = document.querySelector('.product-img-main img');

  if (type === 'label') {
    if (mainImg) mainImg.src = 'https://cdn.shopify.com/s/files/1/0744/6328/1389/files/S__6012976_0.jpg?v=1773903327';
    if (labelItem) labelItem.style.display = 'flex';
  } else {
    if (mainImg) mainImg.src = 'https://cdn.shopify.com/s/files/1/0744/6328/1389/files/S__6012977_0.jpg?v=1773903326';
    if (labelItem) labelItem.style.display = 'none';
  }
}

/* ===== トーストメッセージ ===== */
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${type === 'success' ? '#00AA66' : '#CC0000'};
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: 'Noto Sans JP', sans-serif;
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    opacity: 0;
    transition: all 0.3s ease;
    white-space: nowrap;
    max-width: calc(100vw - 48px);
    text-align: center;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ===== スムーズスクロール補完 ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== カウントアップアニメーション ===== */
function countUp(el, target, duration = 1200, suffix = '') {
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isFloat ? (target * eased).toFixed(1) : Math.floor(target * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/* 数字要素を監視してカウントアップ発火 */
document.addEventListener('DOMContentLoaded', () => {
  const nums = document.querySelectorAll('.trust-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target._counted) {
        entry.target._counted = true;
        const el = entry.target;
        const text = el.childNodes[0].textContent.trim();
        const span = el.querySelector('span');

        if (text === '4.8') countUp(el.childNodes[0], 4.8, 1000);
        else if (text === '98') countUp(el.childNodes[0], 98, 1000);
        else if (text === '365') countUp(el.childNodes[0], 365, 1200);
        // "最短" は数値でないのでそのまま
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(el => observer.observe(el));
});
