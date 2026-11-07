// Mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  const setMenu = open => {
    navMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };
  navToggle.addEventListener('click', () => setMenu(!navMenu.classList.contains('open')));
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(() => e.target.classList.add('in'), i*80); });
  }, { threshold: 0.1 });
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Form → WhatsApp
const repairForm = document.getElementById('repairForm');

if (repairForm) {
  const repairStatus = document.getElementById('repairStatus');
  const repairFallback = document.getElementById('repairFallback');

  repairForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.c-btn');
    if (btn.disabled) return;

    const name = form.cname.value || 'N/A';
    const phone = form.cphone.value || 'N/A';
    const device = form.cdevice.value || 'N/A';
    const issue = form.cissue.value || 'N/A';
    const problem = form.cdesc.value || 'N/A';
    const message =
      `🛠️ *New Repair Booking Request*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📱 *Device:* ${device}\n` +
      `🔧 *Issue Type:* ${issue}\n` +
      `📝 *Description:* ${problem}\n\n` +
      `_Sent from APPLE CARE website_`;

    const encoded = encodeURIComponent(message);
    const waURL = `https://wa.me/8801811531938?text=${encoded}`;

    btn.disabled = true;
    btn.textContent = '✓ Opening WhatsApp...';
    btn.style.background = '#22c55e';
    if (repairStatus) repairStatus.hidden = true;

    const win = window.open(waURL, '_blank');
    if (!win) {
      if (repairFallback) repairFallback.href = waURL;
      if (repairStatus) repairStatus.hidden = false;
    }

    setTimeout(() => {
      btn.textContent = 'Request Repair Booking →';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// Training application → WhatsApp / Email
const trainingForm = document.getElementById('trainingForm');

if (trainingForm) {
  const startInput = trainingForm.querySelector('#tstart');
  if (startInput) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    startInput.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  const sendButtons = trainingForm.querySelectorAll('[data-send]');
  const trainingStatus = document.getElementById('trainingStatus');
  const trainingFallback = document.getElementById('trainingFallback');
  let trainingBusy = false;
  let resetTimer;

  const buildApplication = form => {
    const name = form.tname.value.trim() || 'N/A';
    const phone = form.tphone.value.trim() || 'N/A';
    const email = form.temail.value.trim() || 'N/A';
    const course = form.tcourse.value || 'N/A';
    const start = form.tstart.value || 'N/A';
    const experience = form.texperience.value || 'N/A';
    const message = form.tmessage.value.trim() || 'N/A';

    return (
      `🎓 *New Training Application*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `✉️ *Email:* ${email}\n` +
      `📚 *Course:* ${course}\n` +
      `📅 *Preferred Start:* ${start}\n` +
      `📊 *Experience:* ${experience}\n` +
      `📝 *Message:* ${message}\n\n` +
      `_Sent from APPLE CARE website_`
    );
  };

  const showWaFallback = url => {
    if (trainingFallback) trainingFallback.href = url;
    if (trainingStatus) trainingStatus.hidden = false;
  };

  const flashButton = (btn, text) => {
    const original = btn.dataset.original || btn.textContent;
    btn.dataset.original = original;
    sendButtons.forEach(b => { b.disabled = true; });
    btn.textContent = text;
    setTimeout(() => {
      btn.textContent = original;
      sendButtons.forEach(b => { b.disabled = false; });
      trainingBusy = false;
    }, 3000);
  };

  sendButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (trainingBusy) return;
      if (!trainingForm.reportValidity()) return;

      trainingBusy = true;
      if (trainingStatus) trainingStatus.hidden = true;

      const message = buildApplication(trainingForm);
      const method = btn.dataset.send;

      if (method === 'email') {
        const name = trainingForm.tname.value.trim() || 'New Applicant';
        const subject = `Training Application — ${name}`;
        const body = message.replace(/\*/g, '');
        flashButton(btn, '✓ Opening Email...');
        window.location.href = `mailto:rubeltm4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } else {
        flashButton(btn, '✓ Opening WhatsApp...');
        const waURL = `https://wa.me/8801811531938?text=${encodeURIComponent(message)}`;
        const win = window.open(waURL, '_blank');
        if (!win) showWaFallback(waURL);
      }

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => trainingForm.reset(), 3200);
    });
  });

  trainingForm.addEventListener('submit', e => {
    e.preventDefault();
    const waBtn = trainingForm.querySelector('[data-send="whatsapp"]');
    if (waBtn) waBtn.click();
  });
}
