document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById("dropdown-variaveis");
    const textarea = document.getElementById("texto-template");
    const form = document.getElementById('form-modelo-contrato');

    if (dropdown && textarea) {
        dropdown.addEventListener("change", () => {
            const variavel = dropdown.value;

            if (variavel) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const textoAtual = textarea.value;

                textarea.value = textoAtual.slice(0, start) + variavel + textoAtual.slice(end);
                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = start + variavel.length;
            }

            dropdown.selectedIndex = 0;
        });
    }

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const texto = textarea.value.trim();

            if (!texto) {
                alert('O texto do modelo é obrigatório.');
                return;
            }

            try {
                const response = await axios.post('/api/modelos', {
                    implementacao_modelo: texto
                });

                if (response.status === 201) {
                    alert('Modelo de contrato salvo com sucesso!');
                    textarea.value = '';
                    setTimeout(() => {
                        window.location.href = '/modeloContrato/modeloContrato.hj.html';
                    }, 2000);
                } else {
                    alert(response.data?.error || 'Erro ao salvar modelo.');
                }
            } catch (error) {
                console.error('Erro ao enviar o modelo:', error);
                alert('Erro ao salvar modelo de contrato. Verifique o console.');
            }
        });
    }
});
