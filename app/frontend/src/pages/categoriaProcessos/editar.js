// A lógica inteira agora espera o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/catProcessos';
    // Usando o ID correto do formulário do seu HTML
    const form = document.getElementById('form_processo');
    
    const urlParams = new URLSearchParams(window.location.search);
    const catId = urlParams.get('id');

    // Verificação para garantir que o formulário foi encontrado
    if (!form) {
        console.error('ERRO CRÍTICO: Formulário com id="form_processo" não foi encontrado no HTML.');
        return; // Este 'return' é VÁLIDO porque está dentro da função do 'DOMContentLoaded'
    }

    // Verificação do ID da categoria na URL
    if (!catId) {
        alert('ID da categoria não encontrado na URL.');
        window.location.href = 'categorias_processo.html'; // Corrigido o nome do arquivo
        return; // Este 'return' também é VÁLIDO
    }

    /**
     * Busca os dados da categoria e preenche o formulário.
     */
    const carregarDadosCat = async () => {
        try {
            const response = await axios.get(`${apiUrl}/${catId}`);
            const categoria = response.data;

            // Preenche o código e a descrição
            document.getElementById('codigo').value = categoria.codigo || '';
            document.getElementById('nome').value = categoria.nome || '';
            document.getElementById('descricao').value = categoria.descricao || '';
        } catch (error) {
            const msgErro = error.response ? error.response.data.message : 'Falha ao carregar dados.';
            alert(msgErro);
            console.error('Erro ao carregar dados da categoria:', error);
        }
    };

    /**
     * Adiciona o "escutador" para o envio do formulário.
     */
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        const dadosAtualizados = {
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
        };

        try {
            const response = await axios.put(`${apiUrl}/${catId}`, dadosAtualizados);
            alert(response.data.message);
            window.location.href = 'categorias_processo.html';
        } catch (error) {
            const mensagemErro = error.response ? error.response.data.message : 'Falha ao atualizar categoria.';
            alert(`Erro: ${mensagemErro}`);
            console.error("Erro ao atualizar categoria:", error);
            
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar';
        }
    });

    // Chama a função para carregar os dados iniciais
    carregarDadosCat();
});
