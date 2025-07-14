document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-lancar-contas');
    const urlParams = new URLSearchParams(window.location.search);
    const processoId = urlParams.get('processoId');
    
    let descricaoBase = ''; // Guardará a descrição base do processo

    // Elementos do formulário
    const valorTotalInput = document.getElementById('valor_total');
    const dataInicialInput = document.getElementById('data_primeiro_vencimento');
    const periodicidadeSelect = document.getElementById('periodicidade');
    const parcelasInput = document.getElementById('numero_parcelas');
    const previaContainer = document.getElementById('previa-parcelas');

    if (!processoId) {
        alert('ID do processo não fornecido na URL!');
        window.location.href = '/processos/processos.html';
        return;
    }

    /**
     * Carrega os dados do processo para preencher o campo informativo.
     */
    const carregarDadosDoProcesso = async () => {
        try {
            // Chama a rota que busca os dados específicos para o lançamento
            const response = await axios.get(`/api/processos/${processoId}/dados-lancamento`);
            const processo = response.data;
            document.getElementById('processo_info').value = `Processo #${processo.codigo} - Cliente: ${processo.cliente_nome}`;
            descricaoBase = processo.descricao || `Honorários do Processo #${processo.codigo}`;
            atualizarPrevia(); // Atualiza a prévia com os dados iniciais
        } catch (error) {
            console.error("Erro ao carregar dados do processo", error);
            alert("Não foi possível carregar os dados do processo. Verifique o console.");
        }
    };

    /**
     * Calcula e exibe a prévia das parcelas em tempo real.
     */
    const atualizarPrevia = () => {
        const valorTotal = parseFloat(valorTotalInput.value) || 0;
        const numParcelas = parseInt(parcelasInput.value) || 1;
        const dataInicial = dataInicialInput.value ? new Date(dataInicialInput.value + 'T00:00:00') : new Date();
        const periodicidade = periodicidadeSelect.value;
        
        if (valorTotal <= 0 || numParcelas <= 0 || !dataInicialInput.value) {
            previaContainer.innerHTML = '<p class="text-gray-400">Preencha os valores para ver a prévia.</p>';
            return;
        }

        const valorParcela = valorTotal / numParcelas;
        let previaHTML = '';

        for (let i = 0; i < numParcelas; i++) {
            let dataVencimento = new Date(dataInicial);
            if (periodicidade === 'mensal') {
                dataVencimento.setMonth(dataVencimento.getMonth() + i);
            }
            const dataFormatada = dataVencimento.toLocaleDateString('pt-BR');
            const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorParcela);
            
            previaHTML += `<p>${i + 1}ª Parcela: ${valorFormatado} - Vencimento: ${dataFormatada}</p>`;
        }
        previaContainer.innerHTML = previaHTML;
    };

    // Adiciona "escutadores" para atualizar a prévia em tempo real
    [valorTotalInput, dataInicialInput, periodicidadeSelect, parcelasInput].forEach(el => {
        el.addEventListener('input', atualizarPrevia);
    });

    // Lógica de envio do formulário
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const dadosLancamento = {
            processo_codigo: processoId,
            valor_total: valorTotalInput.value,
            data_primeiro_vencimento: dataInicialInput.value,
            periodicidade: periodicidadeSelect.value,
            numero_parcelas: parcelasInput.value,
            descricao_base: descricaoBase
        };

        try {
            const response = await axios.post('/api/contasReceber/lancar-parcelas', dadosLancamento);
            alert(response.data.message);
            window.location.href = '/processos/processos.html'; // Volta para a lista de processos
        } catch (error) {
            alert(error.response?.data?.message || 'Falha ao lançar contas.');
        }
    });

    // Carrega os dados iniciais do processo
    carregarDadosDoProcesso();
});
