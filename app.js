const gallery = ['gallery-01-hero.jpg', 'gallery-02-open.jpg', 'gallery-03-topdown.jpg', 'gallery-04-thickness.jpg', 'gallery-05-colours.jpg', 'gallery-06-inbox.jpg', 'gallery-07-hand.jpg'];
const state = { colour: 'Graphite', kit: 'Solo', qty: 1, cart: 0, currency: 'USD' };
const prices = { Solo: 89, Traveller: 109, Pro: 129 };
const comparePrices = { Solo: 129, Traveller: 149, Pro: 179 };
const currencyRates = { USD: 1, CAD: 1.36, GBP: .79, EUR: .92, AUD: 1.51 };
const currencySymbols = { USD: '$', CAD: '$', GBP: '£', EUR: '€', AUD: '$' };
const money = n => `${currencySymbols[state.currency]}${(n * currencyRates[state.currency]).toFixed(2)}`;

const mainImage = document.querySelector('#mainImage'), thumbs = document.querySelector('#thumbs'), dots = document.querySelector('#galleryDots'), galleryCounter = document.querySelector('#galleryCounter');
function setGallery(i) {
  mainImage.style.opacity = '.25';
  setTimeout(() => { mainImage.src = 'assets/' + gallery[i]; mainImage.onload = () => mainImage.style.opacity = '1' }, 90);
  [...thumbs.children].forEach((b, n) => { b.classList.toggle('active', n === i); b.setAttribute('aria-current', n === i ? 'true' : 'false') });
  [...dots.children].forEach((b, n) => { b.classList.toggle('active', n === i); b.setAttribute('aria-current', n === i ? 'true' : 'false') });
  if (galleryCounter) galleryCounter.textContent = `${i + 1} / ${gallery.length}`;
}
gallery.forEach((src, i) => {
  const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `Show gallery image ${i + 1} of ${gallery.length}`); b.innerHTML = `<img src="assets/${src}" alt="Gallery image ${i + 1}">`; b.onclick = () => setGallery(i); thumbs.append(b);
  const d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', `Show gallery image ${i + 1}`); d.onclick = () => setGallery(i); dots.append(d);
});
setGallery(0);

function updatePrice() {
  const unit = prices[state.kit], compare = comparePrices[state.kit], total = unit * state.qty, totalCompare = compare * state.qty;
  document.querySelectorAll('#price,#ctaPrice,#finalPrice,#stickyPrice').forEach(el => el.textContent = money(total));
  document.querySelector('#comparePrice').textContent = money(totalCompare);
  document.querySelector('#splitPay').textContent = money(total / 4);
  document.querySelector('#savePill').textContent = `Save ${money((compare - unit) * state.qty)}`;
  document.querySelector('#stickyVariant').textContent = `${state.colour} / ${state.kit} · Qty ${state.qty}`;
  document.querySelectorAll('.kit').forEach(b => {
    const k = b.dataset.kit; b.classList.toggle('selected', k === state.kit);
    const span = b.querySelector('span'); if (span) span.textContent = money(prices[k]);
  });
  document.querySelectorAll('.bundle-card').forEach((card, i) => {
    const kit = ['Solo', 'Traveller', 'Pro'][i];
    card.querySelector('h3').textContent = money(prices[kit]);
    card.querySelector('s').textContent = money(comparePrices[kit]);
    card.querySelector('div>span').textContent = `Save ${money(comparePrices[kit] - prices[kit])}`;
  });
}

// Currency dropdown
const currencyBtn = document.querySelector('#currencyBtn'), currencyMenu = document.querySelector('#currencyMenu'), currencyControl = document.querySelector('#currencyControl');
currencyBtn.onclick = e => { e.stopPropagation(); const open = currencyMenu.classList.toggle('open'); currencyBtn.setAttribute('aria-expanded', open ? 'true' : 'false') };
currencyMenu.querySelectorAll('button').forEach(btn => btn.onclick = () => {
  state.currency = btn.dataset.currency;
  document.querySelector('#currencyCode').textContent = state.currency;
  document.querySelector('#currencySymbol').textContent = btn.dataset.symbol;
  currencyMenu.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === btn));
  currencyMenu.classList.remove('open'); currencyBtn.setAttribute('aria-expanded', 'false'); updatePrice();
});
document.addEventListener('click', e => { if (!currencyControl.contains(e.target)) { currencyMenu.classList.remove('open'); currencyBtn.setAttribute('aria-expanded', 'false') } });

// Product options
document.querySelectorAll('.swatch').forEach(b => b.onclick = () => { state.colour = b.dataset.colour; document.querySelector('#colourName').textContent = state.colour; document.querySelectorAll('.swatch').forEach(x => x.classList.toggle('selected', x === b)); updatePrice(); });
document.querySelectorAll('.kit').forEach(b => b.onclick = () => { state.kit = b.dataset.kit; updatePrice() });

// Quantity updates every displayed product price
const qi = document.querySelector('#qtyInput');
function setQty(q) { state.qty = Math.max(1, Math.min(10, Number(q) || 1)); qi.value = state.qty; updatePrice(); }
document.querySelector('#qtyMinus').onclick = () => setQty(state.qty - 1);
document.querySelector('#qtyPlus').onclick = () => setQty(state.qty + 1);
qi.onchange = () => setQty(qi.value);

// Drawers
function closeAllDrawers() { document.querySelectorAll('.drawer').forEach(x => { x.classList.remove('open'); x.setAttribute('aria-hidden', 'true') }); document.querySelector('#backdrop').classList.remove('show'); document.body.style.overflow = ''; }
function toggleDrawer(id, open = true) { const drawer = document.querySelector('#' + id); drawer.classList.toggle('open', open); drawer.setAttribute('aria-hidden', open ? 'false' : 'true'); document.querySelector('#backdrop').classList.toggle('show', open); document.body.style.overflow = open ? 'hidden' : ''; }
document.querySelector('#menuBtn').onclick = () => toggleDrawer('menuDrawer');
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => toggleDrawer(b.dataset.close, false));
document.querySelector('#backdrop').onclick = closeAllDrawers;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllDrawers() });

function addCart() {
  state.cart += state.qty; document.querySelector('#cartCount').textContent = state.cart;
  document.querySelector('#cartItems').innerHTML = `<div class="cart-line"><img src="assets/gallery-01-hero.jpg" alt="VOLT ARC"><div><b>VOLT ARC</b><p>${state.colour} · ${state.kit} · Qty ${state.qty}</p><strong>${money(prices[state.kit] * state.qty)}</strong></div></div>`;
  toggleDrawer('cartDrawer');
}
document.querySelector('#addToCart').onclick = addCart; document.querySelector('#stickyAdd').onclick = addCart; document.querySelector('#finalAdd').onclick = addCart;
document.querySelector('#buyNow').onclick = () => { addCart(); setTimeout(() => alert('Prototype checkout flow: connect this button to your Shopify checkout.'), 300) };
document.querySelector('#cartButton').onclick = () => toggleDrawer('cartDrawer');

// Accordions with correct plus/minus icon state
document.querySelectorAll('.accordion-group').forEach(group => {
  group.querySelectorAll('.accordion-trigger').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.onclick = () => {
      const panel = btn.nextElementSibling, was = panel.classList.contains('open');
      group.querySelectorAll('.accordion-panel').forEach(p => p.classList.remove('open'));
      group.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'false');
        const icon = trigger.querySelector('.accordion-icon i'); if (icon) icon.className = 'ph ph-plus';
      });
      if (!was) { panel.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); const icon = btn.querySelector('.accordion-icon i'); if (icon) icon.className = 'ph ph-minus'; }
    };
  });
});

const compatibility = { 'iPhone 12 or newer': 'Compatible — magnetic charging guidance applies to compatible iPhone models.', 'iPhone 11 or older': 'Wireless charging may work, but magnetic alignment requires a compatible magnetic case or ring.', 'Samsung Galaxy S24 / S23': 'Use a compatible magnetic case or included magnetic-ring solution where supported.', 'Other Android phone': 'Wireless charging compatibility varies. A magnetic-ring solution may be required for alignment.' };
const compatibilityModal = document.querySelector('#compatModal');
const compatibilitySelect = document.querySelector('#compatibilitySelect');
const compatibilityResult = document.querySelector('#compatibilityResult');
const closeCompatibility = () => {
  compatibilityModal.classList.remove('open');
  compatibilityModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};
document.querySelector('#compatibilityOpen').onclick = () => {
  compatibilityModal.classList.add('open');
  compatibilityModal.setAttribute('aria-hidden', 'false');
  compatibilitySelect.focus();
};
document.querySelectorAll('[data-close-compatibility]').forEach(button => button.onclick = closeCompatibility);
compatibilitySelect.onchange = e => compatibilityResult.textContent = compatibility[e.target.value] || 'Choose a device to see the compatibility guidance.';
document.addEventListener('keydown', e => { if (e.key === 'Escape' && compatibilityModal.classList.contains('open')) closeCompatibility() });

// Independent bundle cards: intentionally not connected to the purchase form
const reviews = [
  ['Maya R.', 'Canada', 5, 'I packed one charger instead of my usual cable pouch. That alone made the trip easier.'],
  ['Daniel K.', 'United States', 5, 'The fold-flat format is the reason I bought it. It takes almost no room.'],
  ['Sophie L.', 'UK', 5, 'The hotel bedside setup is exactly where this made sense for me.'],
  ['Arjun P.', 'Australia', 5, 'Clean design, easy to pack, and the bundle accessories are genuinely useful.'],
  ['Nora B.', 'Germany', 4, 'Good concept for keeping my small travel tech together.'],
  ['Chris T.', 'United States', 5, 'The magnetic layout is much tidier than carrying separate charging pads.']
];
const stars = n => Array.from({ length: 5 }, (_, i) => `<i class="ph-fill ${i < n ? 'ph-star' : 'ph-star'}"></i>`).join('');
const reviewMarkup = r => `<article class="review-card"><header><b>${r[0]} · ${r[1]}</b><span class="stars" aria-label="${r[2]} out of 5 stars">${stars(r[2])}</span></header><small>Verified buyer · Recent purchase</small><p>${r[3]}</p></article>`;
document.querySelector('#reviewTrack').innerHTML = [...reviews, ...reviews].map(reviewMarkup).join('');

const regions = { US: ['Dispatch', 'Same business day before cutoff', 'Delivery', '2-5 business days', 'Carrier', 'Tracked regional carrier', 'Duties', 'Shown at checkout'], CA: ['Dispatch', '1 business day', 'Delivery', '4-8 business days', 'Carrier', 'Tracked regional carrier', 'Duties', 'Shown at checkout'], UK: ['Dispatch', '1 business day', 'Delivery', '5-10 business days', 'Carrier', 'Tracked regional carrier', 'VAT', 'Included in prototype pricing'], EU: ['Dispatch', '1 business day', 'Delivery', '6-12 business days', 'Carrier', 'Tracked regional carrier', 'VAT / duties', 'No surprise-fee messaging'], AU: ['Dispatch', '1 business day', 'Delivery', '7-14 business days', 'Carrier', 'Tracked regional carrier', 'Duties', 'Shown at checkout'] };
function renderRegion(r) { const a = regions[r], target = document.querySelector('#regionContent'); target.innerHTML = ''; for (let i = 0; i < a.length; i += 2)target.insertAdjacentHTML('beforeend', `<div><b>${a[i]}</b><small>${a[i + 1]}</small></div>`) }
renderRegion('US'); document.querySelectorAll('.region-tabs button').forEach(b => b.onclick = () => { document.querySelectorAll('.region-tabs button').forEach(x => x.classList.toggle('active', x === b)); renderRegion(b.dataset.region) });

// Announcement rotation pauses on hover
const msgs = ['Free express shipping over $60 — US · CA · UK · EU · AU', '30-day risk-free trial', '2-year warranty included']; let mi = 0, announcementPaused = false; const announcement = document.querySelector('#announcement'); announcement.addEventListener('mouseenter', () => announcementPaused = true); announcement.addEventListener('mouseleave', () => announcementPaused = false); if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setInterval(() => { if (announcementPaused) return; mi = (mi + 1) % msgs.length; document.querySelector('#announcementText').textContent = msgs[mi] }, 4000) }
let seconds = 4 * 3600 + 12 * 60 + 36; setInterval(() => { seconds = Math.max(0, seconds - 1); const h = String(Math.floor(seconds / 3600)).padStart(2, '0'), m = String(Math.floor(seconds % 3600 / 60)).padStart(2, '0'), s = String(seconds % 60).padStart(2, '0'); document.querySelector('#countdown').textContent = `${h}:${m}:${s}` }, 1000);
const header = document.querySelector('#siteHeader'); window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), { passive: true });
const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }), { threshold: .15 }); document.querySelectorAll('.reveal').forEach(e => observer.observe(e));

// Sticky purchase bar, hidden again when footer enters view
const sticky = document.querySelector('#stickyAtc'), atc = document.querySelector('#addToCart'), footer = document.querySelector('footer'); let atcOut = false, footerVisible = false; const syncSticky = () => sticky.classList.toggle('show', atcOut && !footerVisible); new IntersectionObserver(([e]) => { atcOut = !e.isIntersecting; syncSticky() }, { threshold: .1 }).observe(atc); if (footer) new IntersectionObserver(([e]) => { footerVisible = e.isIntersecting; syncSticky() }, { threshold: .05 }).observe(footer);
document.querySelectorAll('[data-scroll-cart]').forEach(b => b.onclick = () => document.querySelector('.purchase-grid').scrollIntoView({ behavior: 'smooth' }));

// Newsletter prototype interaction
document.querySelector('.newsletter-form').addEventListener('submit', e => { e.preventDefault(); const input = e.currentTarget.querySelector('input'); if (input.value.trim()) input.value = 'Thanks — you’re on the list.'; });
updatePrice();
