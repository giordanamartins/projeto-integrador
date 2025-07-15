function loadSidebar(path = '/sidebar/sidebar.html') {
    fetch(path)
        .then(response => response.text())
        .then(html => {
            const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
            sidebarPlaceholder.innerHTML = html;

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

            carregaUser();

            const processoToggle = document.getElementById('processo-toggle');
            const processoSubmenu = document.getElementById('processo-submenu');
            const processoArrow = document.getElementById('processo-arrow');

            if (processoToggle) {
                processoToggle.addEventListener('click', (event) => {
                    event.preventDefault();
                    processoSubmenu.classList.toggle('hidden');
                    processoArrow.classList.toggle('rotate-180');
                });
            }

            const relatoriosToggle = document.getElementById('relatorios-toggle');
            const relatoriosSubmenu = document.getElementById('relatorios-submenu');
            const relatoriosArrow = document.getElementById('relatorios-arrow');

            if (relatoriosToggle) {
                relatoriosToggle.addEventListener('click', (event) => {
                    event.preventDefault();
                    relatoriosSubmenu.classList.toggle('hidden');
                    relatoriosArrow.classList.toggle('rotate-180');
                });
            }

            const openBtn = document.getElementById('openSidebarBtn');

            if (openBtn) {
                let sidebarVisible = false;

                openBtn.addEventListener('click', () => {
                    sidebarVisible = !sidebarVisible;
                    sidebarPlaceholder.style.display = sidebarVisible ? 'block' : 'none';
                });

                document.addEventListener('click', (e) => {
                    if (
                        sidebarVisible &&
                        !sidebarPlaceholder.contains(e.target) &&
                        !openBtn.contains(e.target)
                    ) {
                        sidebarPlaceholder.style.display = 'none';
                        sidebarVisible = false;
                    }
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar sidebar:', error);
        });
}

async function carregaUser(){
    const user = document.getElementById('user');
    const cargo = document.getElementById('cargo');

    try {
      
        const response = await axios.get('/api/auth/status')
        
        if (response.data.loggedIn && response.data.user) {
            const usuario = response.data.user;
            
            user.textContent = usuario.nome || 'Usuário';

         
            let cargoTexto = 'Cargo Desconhecido';
            if (usuario.tipo_usuario === 'A') {
                cargoTexto = 'Advogado';
            } else if (usuario.tipo_usuario === 'J') {
                cargoTexto = 'Assessor';
            }
            
            cargo.textContent = cargoTexto;

            if (usuario.tipo_usuario === 'J') { 
                const financeiroMenuItem = document.getElementById('financeiro-toggle');
                if (financeiroMenuItem) {
                    
                    financeiroMenuItem.parentElement.style.display = 'none';
                }
            }

        } else {

            nomeUsuarioEl.textContent = 'Visitante';
            cargoUsuarioEl.textContent = 'Não autenticado';
        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        nomeUsuarioEl.textContent = 'Erro';
        cargoUsuarioEl.textContent = 'Não foi possível carregar';
    }

    ;
}
