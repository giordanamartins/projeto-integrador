document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form_contas_pagar');
    const selectCategoria = document.getElementById('categoria_codigo');

    /**
     * Busca as categorias de despesa da API e preenche o dropdown.
     */
    const popularCategorias = async () => {
        try {
            const response = await axios.get('/api/catDespesas'); // API que você já tem
            const categorias = response.data;

            selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>'; // Limpa e adiciona a opção padrão

            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.codigo; // O valor será o ID da categoria
                option.textContent = cat.descricao; // O texto será a descrição
                selectCategoria.appendChild(option);
            });

        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            selectCategoria.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    /**
     * Lógica para enviar o formulário de nova conta a pagar.
     */
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const dadosConta = {
                valor: document.getElementById('valor').value,
                data_vencimento: document.getElementById('data_vencimento').value,
                categoria_codigo: document.getElementById('categoria_codigo').value,
                descricao: document.getElementById('descricao').value
            };

            try {
                const response = await axios.post('/api/contasPagar', dadosConta);
                alert(response.data.message);
                form.reset();
                
                setTimeout(() => {
                    window.location.href = '/contasPagar/contas_pagar.html';
                }, 2000);
            } catch (error) {
                const msgErro = error.response ? error.response.data.message : 'Falha ao criar conta.';
                alert(msgErro);
                console.error('Erro ao criar conta a pagar:', error);
            }
        });
    }

    // Chama a função para popular as categorias assim que a página carrega
    popularCategorias();
});