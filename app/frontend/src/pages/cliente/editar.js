const apiUrl = '/api/clientes';

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
    const form = document.getElementById('form_cliente');

    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');

    if (!clienteId){
        alert('ID do cliente não encontrado na URL');
        window.location.href = 'clientes.html';
        return;
    }

    const carregarDadosCliente = async () => {
        try {
            const response = await axios.get(`${apiUrl}/${clienteId}`);
            const cliente = response.data;

            // Preenche cada campo do formulário com os dados recebidos
            document.getElementById('nome').value = cliente.nome || '';
            document.getElementById('cpf_cnpj').value = cliente.cpf_cnpj || '';
            document.getElementById('email').value = cliente.email || '';
            document.getElementById('tipo_pessoa').value = cliente.tipo_pessoa || '';
            document.getElementById('telefone1').value = cliente.telefone1 || '';
            document.getElementById('comentario').value = cliente.comentario || '';
            document.getElementById('cep').value = cliente.endereco_cep || '';
            document.getElementById('uf').value = cliente.endereco_uf || '';
            document.getElementById('cidade').value = cliente.endereco_cidade || '';
            document.getElementById('bairro').value = cliente.endereco_bairro || '';
            document.getElementById('logradouro').value = cliente.endereco_logradouro || '';
            document.getElementById('numero').value = cliente.endereco_numero || '';
            document.getElementById('complemento').value = cliente.endereco_complemento || '';

            if (cliente.data_nascimento) {
                document.getElementById('data_nascimento').value = new Date(cliente.data_nascimento).toISOString().split('T')[0];
            }
        }catch(error){
            console.error('Erro ao buscar dados do cliente:', error);
            alert('Não foi possível carregar os dados do cliente.');
        }
    };

    form.addEventListener('submit', async (event)=>{
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        const updateDados = {
            nome: document.getElementById('nome').value,
            cpf_cnpj: document.getElementById('cpf_cnpj').value,
            email: document.getElementById('email').value,
            data_nascimento: document.getElementById('data_nascimento').value,
            tipo_pessoa: document.getElementById('tipo_pessoa').value,
            telefone1: document.getElementById('telefone1').value,
            telefone2: document.getElementById('telefone2')?.value, // Supondo que exista um campo com id="telefone2"
            comentario: document.getElementById('comentario').value,
            endereco_cep: document.getElementById('cep').value,
            endereco_uf: document.getElementById('uf').value,
            endereco_cidade: document.getElementById('cidade').value,
            endereco_bairro: document.getElementById('bairro').value,
            endereco_logradouro: document.getElementById('logradouro').value,
            endereco_numero: document.getElementById('numero').value,
            endereco_complemento: document.getElementById('complemento').value

        };

        try{
            const response = await axios.put(`${apiUrl}/${clienteId}`, updateDados);


            alert(response.data.message);
            window.location.href = 'clientes.html';
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

    carregarDadosCliente();

        
});