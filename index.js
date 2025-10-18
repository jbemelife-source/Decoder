
// Robust JS for sidebar  //

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebarToggle') || document.querySelector('.sidebar-toggle');
    const tabLinks = Array.from(document.querySelectorAll('.tab-link'));
    const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

    // create overlay (if not present)
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        // minimal inline styles so overlay works even if CSS wasn't pasted
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0,0,0,0)';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.zIndex = '950';
        overlay.style.transition = 'background 0.28s ease, opacity 0.28s ease, visibility 0.28s';
        document.body.appendChild(overlay);
    }

    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add('show');
            sidebar.setAttribute('aria-hidden', 'false');
        }
        overlay.style.background = 'rgba(0,0,0,0.45)';
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
        document.documentElement.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove('show');
            sidebar.setAttribute('aria-hidden', 'true');
        }
        overlay.style.background = 'rgba(0,0,0,0)';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        document.documentElement.style.overflow = '';
    }

    // toggle button
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar && sidebar.classList.contains('show')) closeSidebar();
            else openSidebar();
        });
    }

    // click overlay closes
    overlay.addEventListener('click', closeSidebar);

    // click outside sidebar closes
    document.addEventListener('click', (e) => {
        if (!sidebar) return;
        const target = e.target;
        if (!sidebar.contains(target) && toggleBtn && !toggleBtn.contains(target)) {
            closeSidebar();
        }
    });

    // escape key closes
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });

    // Tabs logic
    function showTab(id) {
        tabPanels.forEach(p => p.classList.toggle('active', p.id === id));
        tabLinks.forEach(l => {
            const tid = l.dataset.tab || (l.getAttribute('href') || '').replace('#', '');
            l.classList.toggle('active', tid === id);
        });
    }

    // Initialize: show tab with .active link or first panel
    const initialLink = tabLinks.find(l => l.classList.contains('active'));
    const initialId = initialLink ? (initialLink.dataset.tab || initialLink.getAttribute('href').replace('#', '')) : (tabPanels[0] && tabPanels[0].id);
    if (initialId) showTab(initialId);

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.tab || (link.getAttribute('href') || '').replace('#', '');
            if (!targetId) return;
            showTab(targetId);
            // close sidebar on mobile after picking a tab
            closeSidebar();
        });
    });
});

