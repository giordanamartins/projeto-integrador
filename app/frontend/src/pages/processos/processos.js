document.addEventListener('DOMContentLoaded', () => {
    const financeiroToggle = document.getElementById('financeiro-toggle');
    const financeiroSubmenu = document.getElementById('financeiro-submenu');
    const financeiroArrow = document.getElementById('financeiro-arrow');
    if (financeiroToggle) {
        financeiroToggle.addEventListener('click', (event) => {
            // Impede o comportamento padrão do link (que seria navegar para '#')
            event.preventDefault();

            // Alterna a classe 'hidden' no submenu, fazendo-o aparecer ou desaparecer
            financeiroSubmenu.classList.toggle('hidden');

            // Alterna a classe 'rotate-180' no ícone da seta para girá-lo
            financeiroArrow.classList.toggle('rotate-180');
        });
    }
});