document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-novo-usuario');
    const tipoUsuarioSelect = document.getElementById('tipo_usuario');
    const campoOAB = document.getElementById('campo-oab');

    tipoUsuarioSelect.addEventListener('change', () => {
        if (tipoUsuarioSelect.value === 'A') {
            campoOAB.style.display = 'block'; // Mostra o campo
        } else {
            campoOAB.style.display = 'none'; // Esconde o campo
        }
    });


    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const tipo_usuario = document.getElementById('tipo_usuario').value;
        const numero_oab = document.getElementById('numero_oab').value;

        const novoUsuario = {
            nome,
            email,
            senha,
            tipo_usuario,

            numero_oab: tipo_usuario === 'A' ? numero_oab : null
        };

        try {
            const response = await axios.post('/api/usuarios', novoUsuario);
            alert(response.data.message + "\n\nVocê será redirecionado para a tela de login.");

            form.reset();
            window.location.href = '/login/index.html';
            campoOAB.style.display = 'none'; // Esconde o campo OAB após o reset
        } catch (error) {

            const mensagemErro = error.response ? error.response.data.message : 'Falha ao criar usuário.';
            alert(mensagemErro);
            console.error('Erro ao criar usuário:', error);
        }
    });
});
