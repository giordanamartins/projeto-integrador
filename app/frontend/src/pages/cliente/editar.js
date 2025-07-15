
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/clientes';
    const form = document.getElementById('form_cliente');
    
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');

    if (!form) {
        console.error('ERRO CRÍTICO: Formulário com id="form_cliente" não foi encontrado no HTML.');
        return;
    }

    if (!clienteId) {
        alert('ID do cliente não encontrado na URL!');
        window.location.href = 'clientes.html';
        return;
    }

    /**
     * Busca os dados do cliente e preenche o formulário.
     */
    const carregarDadosCliente = async () => {
        try {
            const response = await axios.get(`${apiUrl}/${clienteId}`);
            const cliente = response.data;


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
        } catch (error) {
            console.error('Erro ao buscar dados do cliente:', error);
            alert('Não foi possível carregar os dados do cliente.');
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
            cpf_cnpj: document.getElementById('cpf_cnpj').value,
            email: document.getElementById('email').value,
            data_nascimento: document.getElementById('data_nascimento').value,
            tipo_pessoa: document.getElementById('tipo_pessoa').value,
            telefone1: document.getElementById('telefone1').value,
            telefone2: document.getElementById('telefone2')?.value, // Supondo que exista um campo
            comentario: document.getElementById('comentario').value,
            endereco_cep: document.getElementById('cep').value,
            endereco_uf: document.getElementById('uf').value,
            endereco_cidade: document.getElementById('cidade').value,
            endereco_bairro: document.getElementById('bairro').value,
            endereco_logradouro: document.getElementById('logradouro').value,
            endereco_numero: document.getElementById('numero').value,
            endereco_complemento: document.getElementById('complemento').value
        };

        try {
            const response = await axios.put(`${apiUrl}/${clienteId}`, dadosAtualizados);
            alert(response.data.message);
            window.location.href = 'clientes.html';
        } catch (error) {
            const mensagemErro = error.response ? error.response.data.error : 'Falha ao atualizar cliente.';
            alert(`Erro: ${mensagemErro}`);
            console.error("Erro ao atualizar cliente:", error);
            
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar';
            setTimeout(() => {
                window.location.href = '/cliente/clientes.html';
            }, 2000);
        }
    });


    carregarDadosCliente();
});
