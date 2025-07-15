document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/processos';

    const form = document.getElementById('form-processo'); 
    
    const urlParams = new URLSearchParams(window.location.search);
    const processoId = urlParams.get('id');

    if (!form) {
        console.error('ERRO CRÍTICO: Formulário com id="form-processo" não foi encontrado no HTML.');
        return;
    }

    if (!processoId) {
        alert('ID do processo não encontrado na URL!');
        window.location.href = 'processos.html';
        return;
    }


    const popularSelect = async (elementId, url, valueField = 'codigo', textField = 'nome') => {
        const select = document.getElementById(elementId);
        if (!select) {
            console.error(`Elemento <select> com id "${elementId}" não encontrado.`);
            return;
        }
        try {
            const response = await axios.get(url);
            select.innerHTML = '<option value="">Selecione</option>';
            response.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item[valueField];
                option.textContent = item[textField] || `Item #${item[valueField]}`;
                select.appendChild(option);
            });
        } catch (error) {
            console.error(`Erro ao carregar dados para ${elementId}:`, error);
            select.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };


    const carregarDadosProcesso = async () => {
        try {
            console.log("Iniciando carregamento dos dropdowns...");

            await Promise.all([
                popularSelect('cliente_codigo', '/api/clientes'),
                popularSelect('usuario_codigo', '/api/usuarios/advogados'),
                popularSelect('categoria_codigo', '/api/catProcessos'),

                popularSelect('modelo_contrato_codigo', '/api/modelos', 'codigo', 'implementacao_modelo') 
            ]);
            console.log("Dropdowns populados com sucesso.");


            console.log(`Buscando dados para o processo ID: ${processoId}`);
            const response = await axios.get(`${apiUrl}/${processoId}`);
            const processo = response.data;
            console.log("Dados do processo recebidos:", processo);


            document.getElementById('descricao').value = processo.descricao || '';
            document.getElementById('comentarios').value = processo.comentarios || '';
            document.getElementById('cliente_codigo').value = processo.cliente_codigo;
            document.getElementById('usuario_codigo').value = processo.usuario_codigo;
            document.getElementById('categoria_codigo').value = processo.categoria_codigo;
            document.getElementById('modelo_contrato_codigo').value = processo.modelo_contrato_codigo;


            if (processo.contas_lancadas) {
                document.getElementById('cliente_codigo').disabled = true;
                const labelCliente = document.querySelector('label[for="cliente_codigo"]');
                if (labelCliente) {
                    labelCliente.title = 'Não é possível alterar o cliente de um processo com lançamentos financeiros.';
                    labelCliente.innerHTML += ' <i class="ri-lock-fill text-yellow-400"></i>';
                }
            }
            console.log("Formulário preenchido.");

        } catch (error) {
            alert('Erro ao carregar dados do processo. Verifique o console.');
            console.error("Erro detalhado em carregarDadosProcesso:", error);
        }
    };


   form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';


        const dadosAtualizados = {
            descricao: document.getElementById('descricao').value,
            comentarios: document.getElementById('comentarios').value,
            cliente_codigo: document.getElementById('cliente_codigo').value,
            usuario_codigo: document.getElementById('usuario_codigo').value,
            categoria_codigo: document.getElementById('categoria_codigo').value,
            modelo_contrato_codigo: document.getElementById('modelo_contrato_codigo').value,
            status: 'A' // Você pode querer um campo para o status também
        };

        try {

            const response = await axios.put(`${apiUrl}/${processoId}`, dadosAtualizados);
            alert(response.data.message || "Processo atualizado com sucesso!");
            window.location.href = 'processos.html'; // Redireciona para a lista
        } catch (error) {
            const msgErro = error.response?.data?.message || 'Falha ao atualizar o processo.';
            alert(msgErro);
            console.error('Erro ao atualizar processo:', error);
            

            submitButton.disabled = false;
            submitButton.textContent = 'Salvar Alterações';
        }
    });

    carregarDadosProcesso();
});
