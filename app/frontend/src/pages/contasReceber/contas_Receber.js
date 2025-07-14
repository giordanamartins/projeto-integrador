let idsSelecionados = [];
const apiUrl = '/api/contasReceber';

// Função principal que é chamada quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    carregaContasReceber();
    setupEventListenersGlobais();
});

/**
 * Busca as contas da API e constrói a tabela HTML.
 */
const carregaContasReceber = async (termoBusca = '') => {
    const containerTabela = document.getElementById('tabelaContasReceber');
    const qtdRegElement = document.getElementById('qtdReg');
    if (!containerTabela) return;

    try {
        const response = await axios.get(`${apiUrl}?busca=${termoBusca}`);
        const contas = response.data;

        if (qtdRegElement) qtdRegElement.innerHTML = `<strong>${contas.length}</strong> Registros`;

        let tableHTML = `
            <table id="resultsTable" class="table contentbox ml-10 mx-auto mt-11 text-white">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="p-4 w-12"><input type="checkbox" id="checkbox-all"></th>
                        <th class="p-4">Cliente</th>
                        <th class="p-4">Descrição</th>
                        <th class="p-4 text-center">Vencimento</th>
                        <th class="p-4 text-center">Valor</th>
                        <th class="p-4 text-center">Situação</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (contas.length === 0) {
            tableHTML += `<tr><td colspan="6" class="text-center p-4">Nenhuma conta a receber encontrada.</td></tr>`;
        } else {
            contas.forEach(conta => {
                console.log('Conta:', conta);
                const dataFormatada = new Date(conta.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.valor);
                
                let statusTexto = 'Desconhecido';
                let statusSpanClasses = 'inline-block px-3 py-1 text-xs font-semibold rounded-full';
                if (conta.status === 'A') {
                    statusTexto = 'Em Aberto';
                    statusSpanClasses += ' bg-yellow-400 text-yellow-900';
                } else if (conta.status === 'R') { // 'R' de Recebido
                    statusTexto = 'Recebido';
                    statusSpanClasses += ' bg-green-600 text-white';
                } else if (conta.status === 'X') {
                    statusTexto = 'Cancelado';
                    statusSpanClasses += ' bg-red-600 text-white';
                    
                }

                tableHTML += `
                    <tr class="border-b odd:bg-zinc-800 even:bg-zinc-700 border-gray-700 hover:bg-gray-700">
                        <td class="p-4 text-center"><input type="checkbox" class="checkbox-conta" data-id="${conta.codigo}" data-status="${conta.status}"></td>
                        <td class="px-10 font-medium">${conta.cliente_nome || ''}</td>
                        <td class="px-20 text-gray-300">${conta.descricao || ''}</td>
                        <td class="px-4 text-center">${dataFormatada}</td>
                        <td class="px-18 text-center">${valorFormatado}</td>
                        <td class="p-4 text-center">
                            <span class="${statusSpanClasses}">${statusTexto}</span>
                        </td>
                    </tr>
                `;
            });
        }
        tableHTML += `</tbody></table>`;
        containerTabela.innerHTML = tableHTML;
        
        setupEventListenersTabela();
        updateSelecionados();

    } catch (error) {
        console.error('Erro ao buscar contas a receber:', error);
        containerTabela.innerHTML = '<p class="text-red-500 text-center">Erro ao carregar os dados.</p>';
    }
};

/**
 * Configura os "escutadores" de eventos que só precisam ser configurados uma vez.
 */
function setupEventListenersGlobais() {
    const receberBtn = document.getElementById('bt_receber');
    if (receberBtn) {
        receberBtn.addEventListener('click', () => {
            if (idsSelecionados.length > 0) atualizarStatusContas(idsSelecionados, 'R', 'recebidas');
        });
    }

    const reabrirBtn = document.getElementById('bt_reabrir');
    if (reabrirBtn) {
        reabrirBtn.addEventListener('click', () => {
            if (idsSelecionados.length > 0) atualizarStatusContas(idsSelecionados, 'A', 'reabertas');
        });
    }

    const cancelarBtn = document.getElementById('bt_cancelar');
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', () => {
            if (idsSelecionados.length > 0) {
                atualizarStatusContas(idsSelecionados, 'X', 'canceladas');
            }
        });
    }
}

/**
 * Função centralizada para enviar a atualização de status para a API.
 */
async function atualizarStatusContas(ids, novoStatus, acaoTexto) {
    if (confirm(`Tem certeza que deseja marcar ${ids.length} conta(s) como ${acaoTexto}?`)) {
        try {
            // Usa o método PATCH para a rota de atualização de status
            const response = await axios.patch(`${apiUrl}/status`, { ids, status: novoStatus });
            alert(response.data.message);
            carregaContasReceber(); // Recarrega a tabela para mostrar as mudanças
        } catch (error) {
            alert(error.response?.data?.message || `Falha ao marcar contas como ${acaoTexto}.`);
        }
    }
}

/**
 * Configura os eventos para os elementos dinâmicos da tabela (checkboxes).
 */
function setupEventListenersTabela() {
    const checkTodos = document.getElementById('checkbox-all');
    const checkUnicos = document.querySelectorAll('.checkbox-conta');

    if (checkTodos) {
        checkTodos.addEventListener('change', () => {
            checkUnicos.forEach(checkbox => checkbox.checked = checkTodos.checked);
            updateSelecionados();
        });
    }
    checkUnicos.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (!checkTodos.checked) checkTodos.checked = false;
            updateSelecionados();
        });
    });
}

/**
 * Atualiza o array 'idsSelecionados' e o estado visual e funcional dos botões.
 */
function updateSelecionados() {
    idsSelecionados = Array.from(document.querySelectorAll('.checkbox-conta:checked')).map(cb => cb.dataset.id);
    const statusSelecionados = Array.from(document.querySelectorAll('.checkbox-conta:checked')).map(cb => cb.dataset.status);

    const receberBtn = document.getElementById('bt_receber');
    const reabrirBtn = document.getElementById('bt_reabrir');
    const cancelarBtn = document.getElementById('bt_cancelar');

    let receberAtivo = false;
    let reabrirAtivo = false;
    let cancelarAtivo = false;

    if (statusSelecionados.length > 0) {
        const todosEmAberto = statusSelecionados.every(status => status === 'A');
        const todosRecebidos = statusSelecionados.every(status => status === 'R');

        if (todosEmAberto) {
            receberAtivo = true;
            cancelarAtivo = true;
        } else if (todosRecebidos) {
            reabrirAtivo = true;
        }
    }

    // Aplica o estado visual e funcional aos 3 botões
    if (receberBtn) {
        receberBtn.disabled = !receberAtivo;
        receberBtn.classList.toggle('opacity-50', !receberAtivo);
        receberBtn.classList.toggle('cursor-not-allowed', !receberAtivo);
    }
    if (reabrirBtn) {
        reabrirBtn.disabled = !reabrirAtivo;
        reabrirBtn.classList.toggle('opacity-50', !reabrirAtivo);
        reabrirBtn.classList.toggle('cursor-not-allowed', !reabrirAtivo);
    }
    if (cancelarBtn) {
        cancelarBtn.disabled = !cancelarAtivo;
        cancelarBtn.classList.toggle('opacity-50', !cancelarAtivo);
        cancelarBtn.classList.toggle('cursor-not-allowed', !cancelarAtivo);
    }
}
