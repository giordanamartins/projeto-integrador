document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/processos';
    const urlParams = new URLSearchParams(window.location.search);
    const processoId = urlParams.get('id');

    const tituloEl = document.getElementById('titulo-contrato');
    const textareaEl = document.getElementById('contrato-texto');
    const btnCopiar = document.getElementById('btn-copiar');

    if (!processoId) {
        alert('ID do processo não encontrado na URL.');
        window.location.href = 'processos.html';
        return;
    }

    const carregarContrato = async () => {
        try {
            const response = await axios.get(`${apiUrl}/${processoId}/contrato`);
            const textoContrato = response.data.contrato;
            console.log(textoContrato)

            tituloEl.textContent = `Contrato Gerado para o Processo #${processoId}`;
            textareaEl.value = textoContrato;

        } catch (error) {
            const msgErro = error.response?.data?.message || 'Falha ao gerar o contrato.';
            tituloEl.textContent = 'Erro';
            textareaEl.value = `Não foi possível gerar o contrato.\n\nMotivo: ${msgErro}`;
            console.error('Erro ao gerar contrato:', error);
        }
    };

    btnCopiar.addEventListener('click', () => {
        textareaEl.select();
        document.execCommand('copy');
        alert('Texto do contrato copiado para a área de transferência!');
    });

    carregarContrato();
});
