document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/tarefas';
    const form = document.getElementById('form_tarefa');
    
    const urlParams = new URLSearchParams(window.location.search);
    const tarefaId = urlParams.get('id');

    if (!tarefaId) {
        alert('ID da tarefa não encontrado!');
        window.location.href = 'tarefas.html';
        return;
    }

    const carregarDadosTarefa = async () => {
        try {
            const response = await axios.get(`${apiUrl}/${tarefaId}`);
            const tarefa = response.data;


            document.getElementById('codigo').value = tarefa.codigo;
            document.getElementById('descricao').value = tarefa.descricao || '';
            document.getElementById('usuario_nome').value = tarefa.usuario_nome || '';
            

            if (tarefa.data_hora) {
                const data = new Date(tarefa.data_hora);

                data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
                document.getElementById('data_hora').value = data.toISOString().slice(0, 16);
            }
        } catch (error) {
            alert('Erro ao carregar os dados da tarefa.');
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const dadosAtualizados = {
            descricao: document.getElementById('descricao').value,
            data_hora: document.getElementById('data_hora').value,
        };

        try {
            const response = await axios.put(`${apiUrl}/${tarefaId}`, dadosAtualizados);
            alert(response.data.message);
            window.location.href = 'tarefas.html';
        } catch (error) {
            alert(error.response?.data?.message || 'Falha ao atualizar a tarefa.');
        }
    });

    carregarDadosTarefa();
});
