
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/catDespesas';
    const form = document.getElementById('form_categoria');
    const urlParams = new URLSearchParams(window.location.search);
    const catId = urlParams.get('id');


    if (!form) {
        console.error('ERRO CRÍTICO: Formulário com id="form_categoria" não foi encontrado no HTML.');
        return;
    }

    if (!catId) {
        alert('ID da categoria não encontrado na URL.');
        window.location.href = 'categorias_desp.html';
        return;
    }

    /**
     * Busca os dados da categoria e preenche o formulário.
     */
    const carregarDadosCat = async () => {
        try {
            const response = await axios.get(`${apiUrl}/${catId}`);
            const categoria = response.data;


            document.getElementById('descricao').value = categoria.descricao || '';
        } catch (error) {
            console.error("Erro ao carregar dados da categoria:", error);
            const msgErro = error.response ? error.response.data.message : 'Falha ao carregar dados.';
            alert(msgErro);
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
            descricao: document.getElementById('descricao').value,
        };

        try {
            const response = await axios.put(`${apiUrl}/${catId}`, dadosAtualizados);
            alert(response.data.message);
            window.location.href = 'categorias_desp.html';
        } catch (error) {
            const mensagemErro = error.response ? error.response.data.message : 'Falha ao atualizar categoria.';
            alert(`Erro: ${mensagemErro}`);
            console.error("Erro ao atualizar categoria:", error);
            
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar';
        }
    });


    carregarDadosCat();
});
