document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form_processo');

    const popularCategorias = async () => {
        try {
            const response = await axios.get('/api/catProcessos'); // API que você já tem
            const categorias = response.data;

            selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>'; // Limpa e adiciona a opção padrão

            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.codigo; // O valor será o ID da categoria
                option.textContent = cat.nome; // O texto será a descrição
                selectCategoria.appendChild(option);
            });

        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            selectCategoria.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    }; 

    const popularAdvogado = async () => {
        const selectAdvogado = document.getElementById('advogado');

        try {
            const response = await axios.get('api/usuarios/advogados');
            const advogados = response.data;
            selectAdvogado.innerHTML = '<option value="">Selecione um advogado</option>';

            advogados.forEach(advogado => {
            const option = document.createElement('option');
            option.value = advogado.codigo;
            option.textContent = advogado.nome;
            selectAdvogado.appendChild(option);
        });
        } catch (error) {
            console.error('Erro ao carregar advogados:', error);
            selectAdvogado.innerHTML = '<option value="">Erro ao carregar advogados</option>';
        }
    }

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

    popularCategorias();
    popularAdvogado();



});

const apiUrl = "/api/processos";