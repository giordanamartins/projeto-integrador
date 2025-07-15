document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/usuarios';
    const form = document.getElementById('form-editar-senha');
    
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('id');

    if (!usuarioId) {
        alert('ID do usuário não encontrado!');
        window.location.href = 'usuarios.html';
        return;
    }


    const carregarDadosUsuario = async () => {
        try {
            const response = await axios.get(`${apiUrl}/${usuarioId}`);
            document.getElementById('nome').value = `${response.data.nome} (${response.data.email})`;
        } catch (error) {
            document.getElementById('nome').value = 'Erro ao carregar usuário.';
        }
    };

    // Lógica para salvar a nova senha
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const novaSenha = document.getElementById('senha').value;


        try {
            const response = await axios.patch(`${apiUrl}/${usuarioId}/senha`, { senha: novaSenha });
            alert(response.data.message);
            window.location.href = 'usuarios.html';
        } catch (error) {
            alert(error.response?.data?.message || 'Falha ao atualizar a senha.');
        }
    });

    carregarDadosUsuario();
});