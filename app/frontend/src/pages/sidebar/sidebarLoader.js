function loadSidebar(path = '/app/frontend/src/pages/sidebar/sidebar.html') {
    fetch(path)
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-placeholder').innerHTML = html;

            const financeiroToggle = document.getElementById('financeiro-toggle');
            const financeiroSubmenu = document.getElementById('financeiro-submenu');
            const financeiroArrow = document.getElementById('financeiro-arrow');

            if (financeiroToggle) {
                financeiroToggle.addEventListener('click', (event) => {
                    event.preventDefault();
                    financeiroSubmenu.classList.toggle('hidden');
                    financeiroArrow.classList.toggle('rotate-180');
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar sidebar:', error);
        });
}
