const apiUrl = '/api/catDespesas';
const form = document.getElementById('form_categoria');

form.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const descricao = document.getElementById('descricao').value;

    const novaCatD = {
        descricao: descricao
    };

    try{
        const response = await axios.post(apiUrl, novaCatD);

        form.reset();

        setTimeout(() => {
            window.location.href = '/categoriaDespesas/categorias_desp.html';
        }, 2000);
    } catch (error){
        console.error('Erro ao criar categoria', error);
        alert('Falha ao criar categoria. Verifique o console.');
    }
});
