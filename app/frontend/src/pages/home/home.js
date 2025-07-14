const dataLoad = async () => {
    const totRec = document.getElementById('totRec');
    const qtdRec = document.getElementById('qtdRec');
    const totPag = document.getElementById('totPag');
    const qtdPag = document.getElementById('qtdPag');
    
    try {
        const [responseReceber, responsePagar] = await Promise.all([
            axios.get('/api/contasReceber/hoje'),
            axios.get('/api/contasPagar/hoje')
        ]);

        const contasReceber = responseReceber.data;
        const totalReceber = contasReceber.reduce((soma, conta) => soma + (parseFloat(conta.valor) || 0), 0);

        if (qtdRec) qtdRec.innerText = contasReceber.length;
        if(totRec) totRec.innerText = new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 2}).format(totalReceber);

        const contasPagar = responsePagar.data;
        const totalPagar = contasPagar.reduce((soma, conta) => soma + (parseFloat(conta.valor) || 0), 0);
        
        if (qtdPag) qtdPag.innerText = contasPagar.length;
        if (totPag) totPag.innerText = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(totalPagar);

        if (contasPagar.length == 0) {
        qtdPag.innerHTML = `0`;
        totPag.innerHTML = `00,00`;
        }
        if (contasReceber.length == 0) {
        qtdRec.innerHTML = `0`;
        totRec.innerHTML = `00,00`;
        }
     } catch (error) {
        console.error('Erro ao carregar resumo financeiro:', error);

        if (totRec) totRec.innerText = 'Erro';
        if (totPag) totPag.innerText = 'Erro'; 
    }
    
};
dataLoad();


