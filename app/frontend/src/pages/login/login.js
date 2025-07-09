const formLogin = document.getElementById('login');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try{
        const response = await axios.post('/api/auth/login', {email, senha});

        if (response.data.success){
            window.location.href = '/home/index.html';
        }
    }catch (error) {
        console.log('Deu ruim', error);
        alert('E-mail ou senha inválidos. Tente novamente.');
    }
});