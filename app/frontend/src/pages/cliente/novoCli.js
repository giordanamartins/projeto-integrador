
const apiUrl = '/api/clientes';
const form = document.getElementById('form_cliente');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpfCnpj').value;
    const telefone = document.getElementById('telefone').value;

    const novoCliente = {
        nome: nome,
        email: email,
        cpf: cpf,
        telefone: telefone
    };

    try {

        const response = await axios.post(apiUrl , novoCliente);
        
        
        form.reset();
        
       
        setTimeout(() => {
            window.location.href = '/cliente/clientes.html';
        }, 2000);

    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        alert('Falha ao criar cliente. Verifique o console.');
    }
});