/**
 * Royal Silver Jubilee Utilities & Interactions
 * Santosh & Govind • 2001 - 2026 • 28 November 2026
 */

// Toast notification helper
window.showAnniversaryToast = function (message) {
  let toast = document.getElementById('royal-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'royal-toast';
    toast.className = 'royal-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
};

// Copy hashtag to clipboard
function copyHashtag() {
  const tagEl = document.getElementById('anniversary-hashtag');
  const tag = tagEl ? tagEl.innerText : '#SantoshGovind2026';
  navigator.clipboard.writeText(tag).then(() => {
    window.showAnniversaryToast(`📋 Copied "${tag}" to clipboard!`);
  });
}

// Toggle between 2001 Wedding Day and 2026 Silver Jubilee photo filters
let isShowingVintage = false;
function toggleCouplePhoto() {
  const portraitImg = document.getElementById('couple-portrait-img');
  if (!portraitImg) return;
  isShowingVintage = !isShowingVintage;

  if (isShowingVintage) {
    portraitImg.style.filter = 'sepia(0.7) contrast(1.1) brightness(0.95)';
    window.showAnniversaryToast('📷 2001: Vintage Wedding Day Memory Filter');
  } else {
    portraitImg.style.filter = 'none';
    window.showAnniversaryToast('✨ 2026: Silver Jubilee Celebration View');
  }
}

// Device View Mode toggle (Full Desktop vs iPhone Reel Frame)
function setViewMode(mode) {
  const body = document.body;
  const btnFull = document.getElementById('btn-view-fullscreen');
  const btnPhone = document.getElementById('btn-view-phone');

  if (mode === 'phone') {
    body.classList.add('phone-view-active');
    if (btnPhone) btnPhone.classList.add('active');
    if (btnFull) btnFull.classList.remove('active');
    if (window.skyLanterns) window.skyLanterns.resize();
  } else {
    body.classList.remove('phone-view-active');
    if (btnFull) btnFull.classList.add('active');
    if (btnPhone) btnPhone.classList.remove('active');
    if (window.skyLanterns) window.skyLanterns.resize();
  }
}

function scrollToCard() {
  const card = document.getElementById('invite-card-section');
  if (card) {
    card.scrollIntoView({ behavior: 'smooth' });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copy-hashtag-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyHashtag);
  }
});
