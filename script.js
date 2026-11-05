// Switch Navigation Tabs
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    const targetTab = document.getElementById('tab-' + tabId);
    if(targetTab) targetTab.classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('text-logistics-600', 'bg-logistics-50', 'dark:bg-slate-800', 'dark:text-logistics-400');
        el.classList.add('text-slate-600', 'dark:text-slate-300');
    });

    const activeBtn = document.getElementById('nav-' + tabId);
    if(activeBtn) {
        activeBtn.classList.add('text-logistics-600', 'bg-logistics-50', 'dark:bg-slate-800', 'dark:text-logistics-400');
        activeBtn.classList.remove('text-slate-600', 'dark:text-slate-300');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if(menu) menu.classList.toggle('hidden');
}

// Dark / Light Mode Toggle
function toggleDarkMode() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const icon = document.getElementById('theme-icon');
    const iconMobile = document.getElementById('theme-icon-mobile');
    if(isDark) {
        if(icon) icon.className = 'fa-solid fa-sun text-base';
        if(iconMobile) iconMobile.className = 'fa-solid fa-sun text-base';
    } else {
        if(icon) icon.className = 'fa-solid fa-moon text-base';
        if(iconMobile) iconMobile.className = 'fa-solid fa-moon text-base';
    }
}

// Initialize Theme
if(localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

// Scroll Reveal Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    calculateQuickEstimate();
    updateBookingTotal();

    const icon = document.getElementById('theme-icon');
    const iconMobile = document.getElementById('theme-icon-mobile');
    if(document.documentElement.classList.contains('dark')) {
        if(icon) icon.className = 'fa-solid fa-sun text-base';
        if(iconMobile) iconMobile.className = 'fa-solid fa-sun text-base';
    }
});

// Quick Simulator Calculator
function calculateQuickEstimate() {
    const sizeEl = document.getElementById('hero-size');
    const durationEl = document.getElementById('hero-duration');
    const qtyEl = document.getElementById('hero-qty');

    if(!sizeEl || !durationEl || !qtyEl) return;

    const size = sizeEl.value;
    const duration = parseInt(durationEl.value) || 1;
    const qty = parseInt(qtyEl.value) || 1;

    let basePrice = 2500000;
    if(size === '40ft') basePrice = 4200000;
    if(size === 'reefer') basePrice = 7500000;

    let discountRate = 0;
    if(duration === 3) discountRate = 0.05;
    if(duration === 6) discountRate = 0.10;
    if(duration === 12) discountRate = 0.15;

    const monthlyTotal = basePrice * qty;
    const gross = monthlyTotal * duration;
    const discountVal = gross * discountRate;
    const finalTotal = gross - discountVal;

    document.getElementById('hero-base-price').innerText = 'Rp ' + basePrice.toLocaleString('id-ID') + ' / bln';
    document.getElementById('hero-discount-val').innerText = '- Rp ' + discountVal.toLocaleString('id-ID');
    document.getElementById('hero-total-price').innerText = 'Rp ' + finalTotal.toLocaleString('id-ID');
}

// Booking Transfer & Calculation
let currentUnitPrice = 2500000;
function selectContainerForBooking(name, price) {
    document.getElementById('selected-unit-name').value = name;
    currentUnitPrice = price;
    updateBookingTotal();
    showToast('Unit ' + name + ' dipilih!');
}

function updateBookingTotal() {
    const durEl = document.getElementById('booking-duration');
    const qtyEl = document.getElementById('booking-qty');
    if(!durEl || !qtyEl) return;

    const duration = parseInt(durEl.value) || 1;
    const qty = parseInt(qtyEl.value) || 1;
    
    const subtotal = currentUnitPrice * duration * qty;
    const mobilization = 1500000 * qty;
    const grandTotal = subtotal + mobilization;

    document.getElementById('summary-unit-price').innerText = 'Rp ' + currentUnitPrice.toLocaleString('id-ID');
    document.getElementById('summary-grand-total').innerText = 'Rp ' + grandTotal.toLocaleString('id-ID');
}

// Catalog Filter
function filterCatalog() {
    const query = document.getElementById('catalog-search').value.toLowerCase();
    const category = document.getElementById('catalog-filter').value;
    const cards = document.querySelectorAll('.inventory-card');

    cards.forEach(card => {
        const name = card.getAttribute('data-name');
        const cat = card.getAttribute('data-category');
        const matchesQuery = name.includes(query);
        const matchesCat = (category === 'all' || cat === category);

        if(matchesQuery && matchesCat) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// FAQ Accordion Toggle
function toggleFaq(el) {
    const p = el.querySelector('p');
    const icon = el.querySelector('i');
    p.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

// Toast Notification
function showToast(msg) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Form Handlers
function submitBooking(e) {
    e.preventDefault();
    showToast('Pemesanan berhasil diterbitkan! Kontrak dikirim ke email.');
    switchTab('tracking');
}

function submitRFQ(e) {
    e.preventDefault();
    showToast('Permintaan Penawaran (RFQ) berhasil dikirim!');
    e.target.reset();
}

function simulateTracking() {
    const resi = document.getElementById('tracking-input').value;
    showToast('Memuat radar GPS real-time untuk resi: ' + resi);
}

// Modal Details
function openDetailModal(type) {
    const modal = document.getElementById('detail-modal');
    const body = document.getElementById('modal-body');
    
    let html = '';
    if(type === '20ft') {
        html = `
            <div class="relative h-48 rounded-2xl overflow-hidden mb-4">
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" alt="20ft Dry Container" class="w-full h-full object-cover">
            </div>
            <h3 class="text-2xl font-bold text-navy-900 dark:text-white mb-2">20ft Standard Dry Container</h3>
            <p class="text-xs text-slate-500 mb-4">Spesifikasi teknis & kelayakan ISO.</p>
            <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-6">
                <li><strong>Dimensi PxLxT:</strong> 6.06m x 2.44m x 2.59m</li>
                <li><strong>Kapasitas Volume:</strong> 33.2 m³</li>
                <li><strong>Muatan Maksimal:</strong> 28.200 Kg</li>
                <li><strong>Sertifikasi:</strong> Cargo Worthy Grade A</li>
            </ul>
            <button onclick="closeDetailModal(); selectContainerForBooking('20ft Standard Dry', 2500000); switchTab('sewa');" class="w-full bg-logistics-600 hover:bg-logistics-700 text-white font-bold py-3 rounded-xl text-sm transition">Pilih Unit Ini & Sewa</button>
        `;
    } else if(type === '40ft') {
        html = `
            <div class="relative h-48 rounded-2xl overflow-hidden mb-4">
                <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800" alt="40ft High Cube Container" class="w-full h-full object-cover">
            </div>
            <h3 class="text-2xl font-bold text-navy-900 dark:text-white mb-2">40ft High Cube (HC) Container</h3>
            <p class="text-xs text-slate-500 mb-4">Ekstra kapasitas volume untuk kargo manufaktur.</p>
            <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-6">
                <li><strong>Dimensi PxLxT:</strong> 12.19m x 2.44m x 2.89m</li>
                <li><strong>Kapasitas Volume:</strong> 76.4 m³</li>
                <li><strong>Muatan Maksimal:</strong> 28.600 Kg</li>
                <li><strong>Tinggi Ekstra:</strong> 2.89 Meter</li>
            </ul>
            <button onclick="closeDetailModal(); selectContainerForBooking('40ft High Cube', 4200000); switchTab('sewa');" class="w-full bg-logistics-600 hover:bg-logistics-700 text-white font-bold py-3 rounded-xl text-sm transition">Pilih Unit Ini & Sewa</button>
        `;
    } else {
        html = `
            <div class="relative h-48 rounded-2xl overflow-hidden mb-4">
                <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800" alt="40ft Reefer Container" class="w-full h-full object-cover">
            </div>
            <h3 class="text-2xl font-bold text-navy-900 dark:text-white mb-2">40ft Reefer (Refrigerated)</h3>
            <p class="text-xs text-slate-500 mb-4">Kontrol suhu presisi untuk cold chain.</p>
            <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-6">
                <li><strong>Rentang Suhu:</strong> -30°C hingga +30°C</li>
                <li><strong>Muatan Maksimal:</strong> 29.400 Kg</li>
                <li><strong>Genset / Daya:</strong> 380V/460V 3-Phase</li>
                <li><strong>Mesin:</strong> Daikin / Carrier Transicold</li>
            </ul>
            <button onclick="closeDetailModal(); selectContainerForBooking('40ft Reefer', 7500000); switchTab('sewa');" class="w-full bg-logistics-600 hover:bg-logistics-700 text-white font-bold py-3 rounded-xl text-sm transition">Pilih Unit Ini & Sewa</button>
        `;
    }
    
    body.innerHTML = html;
    modal.classList.remove('hidden');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.add('hidden');
}