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

    const carregarUsuarioLogado = async () => {
        try {
            // A rota '/api/auth/status' já nos dá os dados do usuário logado
            const response = await axios.get('/api/auth/status');
            
            if (response.data.loggedIn && response.data.user) {
                // Preenche o campo de usuário com o nome e o deixa readonly
                campoUsuarioNome.value = response.data.user.nome;
            } else {
                // Se por algum motivo não encontrar o usuário, exibe um erro
                campoUsuarioNome.value = 'Usuário não encontrado';
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário logado:', error);
            campoUsuarioNome.value = 'Erro ao carregar usuário';
        }
    };


    const apiUrl = '/api/tarefas';
    const form = document.getElementById('form_tarefa');

    form.addEventListener('submit', async (event) =>{
        event.preventDefault();
        const dadosTarefa = {
            descricao: document.getElementById('descricao').value,
            data_hora: document.getElementById('data_hora').value,
        }; 

        try {
            const response = await axios.post(apiUrl, dadosTarefa);
            form.reset();

            carregarUsuarioLogado();

            setTimeout(() => {
                window.location.href = '/agenda/tarefas.html';
            }, 2000);
        } catch (error) {
            console.error('Erro ao criar categoria', error);
            alert('Falha ao criar categoria. Verifique o console.')
        }

        carregarUsuarioLogado();
    });

});