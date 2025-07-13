// Array para guardar os IDs das contas selecionadas
let idsSelecionados = [];
const apiUrl = '/api/contasPagar';

// Função principal que é chamada quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    carregaCPagar();
    setupEventListenersGlobais(); // Configura os eventos que só precisam ser adicionados uma vez
});

/**
 * Busca as contas da API e constrói a tabela HTML.
 * @param {string} termoBusca
 */
const carregaCPagar = async (termoBusca = '') => {
    const containerTabela = document.getElementById('tabelaCPagar');
    const qtdRegElement = document.getElementById('qtdReg');

    if (!containerTabela) {
        console.error('Erro: Elemento com id "tabelaCPagar" não foi encontrado no HTML.');
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}?busca=${termoBusca}`);
        const contasp = response.data;

        if (qtdRegElement) {
            qtdRegElement.innerHTML = `<strong>${contasp.length}</strong> Registros`;
        }

        let resultsTableHTML = `
            <table id="resultsTable" class="table contentbox ml-10 mx-auto mt-11 text-white">
                <thead>
                    <tr class="py-5">
                        <th class="px-5"><input type="checkbox" id="checkbox-all"></th>
                        <th>Descrição</th>
                        <th class="text-center">Categoria</th>
                        <th class="text-center">Data de Vencimento</th>
                        <th class="text-center">Valor</th>
                        <th class="text-center">Situação</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (contasp.length === 0) {
            resultsTableHTML += `<tr><td colspan="6" style="text-align: center;">Nenhuma conta a pagar encontrada.</td></tr>`;
        } else {
            contasp.forEach(conta => {
                const dataFormatada = new Date(conta.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.valor);
                
                let statusTexto = 'Desconhecido';
                let statusSpanClasses = 'inline-block px-3 py-1 text-xs font-semibold rounded-full';

                if (conta.status === 'A') {
                    statusTexto = 'Em aberto';
                    statusSpanClasses += ' bg-yellow-400 text-yellow-900';
                } else if (conta.status === 'B') {
                    statusTexto = 'Pago';
                    statusSpanClasses += ' bg-green-600 text-white';
                }

                resultsTableHTML += `
                    <tr class="border-b border-gray-700 odd:bg-zinc-800 even:bg-zinc-700">
                        <td class="text-center px-5 py-4">
                            <input type="checkbox" class="checkbox-conta" data-id="${conta.codigo}" data-status="${conta.status}">
                        </td>
                        <td class="px-6 py-4 font-medium whitespace-nowrap text-white" title="${conta.descricao || ''}">${(conta.descricao || '').substring(0, 40)}${(conta.descricao || '').length > 40 ? '...' : ''}</td>
                        <td class="px-8 text-center py-4">${conta.categoria_descricao || ''}</td>
                        <td class="px-8 text-center py-4">${dataFormatada}</td>
                        <td class="px-8 text-center py-4">${valorFormatado}</td>
                        <td class="text-center px-3 py-3">
                            <span class="${statusSpanClasses}">${statusTexto}</span>
                        </td>
                    </tr>
                `;
            });
        }

        resultsTableHTML += `</tbody></table>`;
        containerTabela.innerHTML = resultsTableHTML;
        
        setupEventListenersTabela();
        updateSelecionados();

    } catch (error) {
        console.error('Erro ao buscar contas a pagar:', error);
        containerTabela.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar os dados. Verifique o console.</p>';
    }
};


function setupEventListenersGlobais() {

    const baixarBtn = document.getElementById('bt_ok');
    if (baixarBtn) {
        baixarBtn.addEventListener('click', () => {
            if (idsSelecionados.length > 0) {
                atualizarStatusContas(idsSelecionados, 'B', 'baixadas'); 
            }
        });
    }


    const reabrirBtn = document.getElementById('bt_reopen');
    if (reabrirBtn) {
        reabrirBtn.addEventListener('click', () => {
            if (idsSelecionados.length > 0) {
                atualizarStatusContas(idsSelecionados, 'A', 'reabertas');
            }
        });
    }
    
    const excluirBtn = document.getElementById('bt_del'); // Garanta que seu botão tenha id="bt_del"
    if (excluirBtn) {
        excluirBtn.addEventListener('click', async () => {
            if (idsSelecionados.length === 0) return;
            if (confirm(`Tem certeza que deseja excluir ${idsSelecionados.length} conta(s)? Apenas contas "Em Aberto" serão removidas.`)) {
                try {
                    const response = await axios.delete(apiUrl, { data: { ids: idsSelecionados } });
                    alert(response.data.message);
                    carregaCPagar();
                } catch (error) {
                    const msgErro = error.response ? error.response.data.message : 'Falha ao excluir contas.';
                    alert(msgErro);
                    console.error('Erro ao excluir contas:', error);
                }
            }
        });
    }
}


async function atualizarStatusContas(ids, novoStatus, acaoTexto) {
    if (confirm(`Tem certeza que deseja marcar ${ids.length} conta(s) como ${acaoTexto}?`)) {
        try {
            const response = await axios.patch(`${apiUrl}/status`, {
                ids: ids,
                status: novoStatus
            });
            alert(response.data.message);
            carregaCPagar(); 
        } catch (error) {
            const msgErro = error.response ? error.response.data.message : `Falha ao atualizar contas.`;
            alert(msgErro);
            console.error(`Erro ao marcar contas como ${acaoTexto}:`, error);
        }
    }
}


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
            if (!checkbox.checked && checkTodos) checkTodos.checked = false;
            updateSelecionados();
        });
    });
}


function updateSelecionados() {
    const checkMarcados = document.querySelectorAll('.checkbox-conta:checked');
    
    idsSelecionados = Array.from(checkMarcados).map(cb => cb.dataset.id);
    const statusSelecionados = Array.from(checkMarcados).map(cb => cb.dataset.status);

    const baixarBtn = document.getElementById('bt_ok');
    const reabrirBtn = document.getElementById('bt_reopen');
    const excluirBtn = document.getElementById('bt_del');

    let baixarAtivo = false;
    let reabrirAtivo = false;

    if (statusSelecionados.length > 0) {
        const todosEmAberto = statusSelecionados.every(status => status === 'A');
        const todosPagos = statusSelecionados.every(status => status === 'B');

        if (todosEmAberto) {
            baixarAtivo = true;
        } else if (todosPagos) {
            reabrirAtivo = true;
        }
    }

    if (baixarBtn) {
        baixarBtn.disabled = !baixarAtivo;
        baixarBtn.classList.toggle('opacity-50', !baixarAtivo);
        baixarBtn.classList.toggle('cursor-not-allowed', !baixarAtivo);
    }

    if (reabrirBtn) {
        reabrirBtn.disabled = !reabrirAtivo;
        reabrirBtn.classList.toggle('opacity-50', !reabrirAtivo);
        reabrirBtn.classList.toggle('cursor-not-allowed', !reabrirAtivo);
    }
}
