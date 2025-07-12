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
});
const apiUrl = '/api/clientes';
const form = document.getElementById('form_cliente');
if (!form) {
    console.error('ERRO CRÍTICO: Formulário com id="form_cliente" não foi encontrado. Verifique seu HTML.');
}
form.addEventListener('submit', async (event) => {
    event.preventDefault();



    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Salvando...';



    const nome = document.getElementById('nome').value;
    const cpf_cnpj = document.getElementById('cpf_cnpj').value;
    const email = document.getElementById('email').value;
    const data_nascimento = document.getElementById('data_nascimento').value;
    const tipo_pessoa = document.getElementById('tipo_pessoa').value;
    const telefone1 = document.getElementById('telefone1').value;
    const comentario = document.getElementById('comentario').value;
    const endereco_cep = document.getElementById('cep').value;
    const endereco_uf = document.getElementById('uf').value;
    const endereco_cidade = document.getElementById('cidade').value;
    const endereco_bairro = document.getElementById('bairro').value;
    const endereco_logradouro = document.getElementById('logradouro').value;
    const endereco_numero = document.getElementById('numero').value;
    const endereco_complemento = document.getElementById('complemento').value;
   

    const novoCliente = {
        nome: nome,
        cpf_cnpj: cpf_cnpj,
        data_nascimento: data_nascimento,
        tipo_pessoa: tipo_pessoa,
        email: email,
        endereco_cep: endereco_cep,
        endereco_uf: endereco_uf,
        endereco_cidade: endereco_cidade,
        endereco_bairro: endereco_bairro,
        endereco_logradouro: endereco_logradouro,
        endereco_numero: endereco_numero,
        endereco_complemento: endereco_complemento,
        comentario: comentario,
        telefone1: telefone1

    };
    console.log("Enviando para a API:", novoCliente);

    try {

        const response = await axios.post(apiUrl , novoCliente);
        alert(response.data.message);
        
        
        form.reset();
        
       
        setTimeout(() => {
            window.location.href = '/cliente/clientes.html';
        }, 2000);

    } catch (error) {
       if (error.response && error.response.data && error.response.data.error) {
                alert(`Erro de Validação: ${error.response.data.error}`);
            } else {
                alert('Falha ao criar cliente. Verifique o console.');
            }
            console.error('Erro ao criar cliente:', error);

            // Reabilita o botão apenas em caso de erro
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar';
    }
});