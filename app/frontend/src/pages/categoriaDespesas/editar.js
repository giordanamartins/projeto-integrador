const apiUrl = '/api/catDespesas';

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
    const form = document.getElementById('form_categoria');

    const urlParams = new URLSearchParams(window.location.search);
    const catId = urlParams.get('id');

    if (!catId){
        alert('ID da categoria não encontrado na URL');
        window.location.href = 'cateorias_desp.html';
        return;
    }

    const carregarDadosCat = async () => {
        try {
            const response = await axios.get(`${apiUrl}/${catId}`);
            const categoria = response.data;

            // Preenche cada campo do formulário com os dados recebidos
            document.getElementById('descricao').value = categoria.descricao || ''
        }catch(error){
            console.error("--- ERRO DETALHADO AO CARREGAR DADOS ---");
            console.error("Objeto de erro completo:", error);
            if (error.response) {
                // O servidor respondeu com um status de erro (404, 500, etc.)
                const mensagemServidor = error.response.data.message || 'Erro desconhecido do servidor.';
                alert(`Não foi possível carregar os dados da categoria: ${mensagemServidor}`);
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                alert('Não foi possível se comunicar com o servidor. Verifique sua conexão e se o backend está rodando.');
            } else {
                // Algo deu errado ao configurar a requisição
                alert('Ocorreu um erro inesperado ao preparar a requisição.');
            }
        }
    };

    form.addEventListener('submit', async (event)=>{
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        const updateDados = {
            descricao: document.getElementById('descricao').value,

        };

        try{
            const response = await axios.put(`${apiUrl}/${catId}`, updateDados);


            alert(response.data.message);
            window.location.href = 'categorias_desp.html';
        }catch(error){
            console.error("--- ERRO DETALHADO AO ATUALIZAR ---");
            console.error("Objeto de erro completo:", error);

            if (error.response) {
                // O servidor respondeu com um status de erro
                const mensagemErro = error.response.data.error || error.response.data.message || 'Ocorreu um erro no servidor.';
                alert(`Erro: ${mensagemErro}`);
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                alert('Não foi possível se comunicar com o servidor. Verifique sua conexão.');
            } else {
                // Algo deu errado ao configurar a requisição
                alert('Ocorreu um erro inesperado ao preparar a requisição.');
            }
            
            // Reabilita o botão apenas se deu erro, para o usuário tentar novamente
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar';
        }


    });

    carregarDadosCat();

        
});