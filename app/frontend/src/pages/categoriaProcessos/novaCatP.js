const apiUrl = '/api/catProcessos';
const form = document.getElementById('form_processo');

form.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;

    const novaCatP = {
        nome: nome,
        descricao: descricao
    };

    try{
        const response = await axios.post(apiUrl, novaCatP);

        form.reset();

        setTimeout(() => {
            window.location.href = '/categoriaProcessos/categorias_processo.html';
        }, 2000);
    } catch (error){
        console.error('Erro ao criar categoria', error);
        alert('Falha ao criar categoria. Verifique o console.');
    }
});
