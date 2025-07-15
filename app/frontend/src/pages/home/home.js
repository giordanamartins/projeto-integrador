const dataLoad = async () => {
    const totRec = document.getElementById('totRec');
    const qtdRec = document.getElementById('qtdRec');
    const totPag = document.getElementById('totPag');
    const qtdPag = document.getElementById('qtdPag');
    const tarefas = document.getElementById('tarefas');

    const qtdAberto = document.getElementById('qtdAberto');
    const qtdAndamento = document.getElementById('qtdAndamento');
    const qtdConcluido = document.getElementById('qtdConcluido');
    const qtdCancelado = document.getElementById('qtdCancelado');

    const qtdTarefa = document.getElementById('qtdTarefa');
    
    try {
        const [responseReceber, responsePagar, responseProcesso, responseTarefa] = await Promise.all([
            axios.get('/api/contasReceber/hoje'),
            axios.get('/api/contasPagar/hoje'),
            axios.get('/api/processos/status-count'),
            axios.get('/api/tarefas')
        ]);


        const contasReceber = responseReceber.data;
        const totalReceber = contasReceber.reduce((soma, conta) => soma + (parseFloat(conta.valor) || 0), 0);

        if (qtdRec) qtdRec.innerText = contasReceber.length;
        if(totRec) totRec.innerText = new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 2}).format(totalReceber);

        const contasPagar = responsePagar.data;
        const totalPagar = contasPagar.reduce((soma, conta) => soma + (parseFloat(conta.valor) || 0), 0);
        
        if (qtdPag) qtdPag.innerText = contasPagar.length;
        if (totPag) totPag.innerText = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(totalPagar);

        const processoCounts = responseProcesso.data;
        console.log("Contagem de status dos processos:", processoCounts);

        if(qtdAberto) qtdAberto.innerText = processoCounts.A || 0;
        if(qtdAndamento) qtdAndamento.innerText = processoCounts.D || 0;
        if(qtdConcluido) qtdConcluido.innerText = processoCounts.C || 0;
        if(qtdCancelado) qtdCancelado.innerText = processoCounts.X || 0;


        const tarefaCount = responseTarefa.data;

        const tarefa = responseTarefa.data;

        if(qtdTarefa) qtdTarefa.innerText = tarefaCount.length;
        if (tarefaCount.length == 0) qtdTarefa.innerText = 0;

        let resultsTarefa = '';

        if (tarefa.length === 0) {
            resultsTarefa += `Não há tarefas hoje`;
        } else {
            tarefa.forEach(task => {
                const dataFormatada = new Date(task.data_hora).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: false
                });
                resultsTarefa += `
                    <div class="py-2 inline-flex items-center gap-3">
                        <ion-icon class="text-red-500" name="chevron-forward-outline"></ion-icon>
                        <span class="font-bold">${dataFormatada}</span>
                        <span class="">${task.descricao}</span>
                    </div>
                `;
            });
        }

        
        tarefas.innerHTML = resultsTarefa;

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


