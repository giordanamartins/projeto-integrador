document.addEventListener('DOMContentLoaded', () => {

    const campoUsuarioNome = document.getElementById('user_codigo');

    const carregarUsuarioLogado = async () => {
        try {

            const response = await axios.get('/api/auth/status');
            
            if (response.data.loggedIn && response.data.user) {

                campoUsuarioNome.value = response.data.user.nome;
            } else {

                campoUsuarioNome.value = 'Usuário não encontrado';
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário logado:', error);
            campoUsuarioNome.value = 'Erro ao carregar usuário';
        }
    };


    const apiUrl = '/api/tarefas';
    const form = document.getElementById('form_tarefa');
    carregarUsuarioLogado();

    form.addEventListener('submit', async (event) =>{
        event.preventDefault();
        const dadosTarefa = {
            descricao: document.getElementById('descricao').value,
            data_hora: document.getElementById('data_hora').value,
        }; 
        console.log(dadosTarefa);

        try {
            const response = await axios.post(apiUrl, dadosTarefa);
            form.reset();

            carregarUsuarioLogado();

            setTimeout(() => {
                window.location.href = '/agenda/tarefas.html';
            }, 2000);
        } catch (error) {
            console.error('Erro ao criar tarefa', error);
            alert('Falha ao criar tarefa. Verifique o console.')
        }

        carregarUsuarioLogado();
    });

});