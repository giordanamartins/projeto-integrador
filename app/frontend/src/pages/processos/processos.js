let idsSelecionados = [];
const apiUrl = '/api/processos';

document.addEventListener('DOMContentLoaded', () => {
    carregaProcessos();
    setupEventListenersGlobais();
});

/**
 * Busca os processos da API e constrói a tabela HTML.
 */
const carregaProcessos = async (termoBusca = '') => {
    const containerTabela = document.getElementById('tabelaProcessos');
    const qtdRegElement = document.getElementById('qtdReg');

    if (!containerTabela) {
        console.error('Erro: Elemento com id "tabelaProcessos" não foi encontrado.');
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}?busca=${termoBusca}`);
        const processos = response.data;

        if (qtdRegElement) {
            qtdRegElement.innerHTML = `<strong>${processos.length}</strong> Registros`;
        }

        let tableHTML = `
            <table class="w-full text-left text-white">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="p-4 w-12"><input type="checkbox" id="checkbox-all"></th>
                        <th class="p-4">Cliente</th>
                        <th class="p-4">Descrição</th>
                        <th class="p-4 text-center">Categoria</th>
                        <th class="p-4 text-center">Situação</th>
                        <th class="p-4 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (processos.length === 0) {
            tableHTML += `<tr><td colspan="6" class="text-center p-4">Nenhum processo encontrado.</td></tr>`;
        } else {
            processos.forEach(processo => {
                const statusTexto = processo.status === 'A' ? 'Em Aberto' : 'Finalizado';
                
                // Lógica condicional para o botão "Lançar Contas"
                const contasJaLancadas = parseInt(processo.contas_lancadas_count, 10) > 0;
                const lancarBtnHTML = contasJaLancadas
                    ? `<button class="bg-gray-500 text-gray-300 px-3 py-1 rounded-md text-sm cursor-not-allowed" disabled>Lançado</button>`
                    : `<button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm btn-lancar" data-id="${processo.codigo}">Lançar Contas</button>`;

                tableHTML += `
                    <tr class="border-b border-gray-700 hover:bg-gray-700 cursor-pointer linha-clicavel" data-id="${processo.codigo}">
                        <td class="p-4"><input type="checkbox" class="checkbox-processo" data-id="${processo.codigo}" data-status="${processo.status}"></td>
                        <td class="p-4 font-medium">${processo.cliente_nome || ''}</td>
                        <td class="p-4 text-gray-300">${(processo.descricao || '').substring(0, 40)}...</td>
                        <td class="p-4 text-center">${processo.categoria_nome || ''}</td>
                        <td class="p-4 text-center">${statusTexto}</td>
                        <td class="p-4 text-center space-x-2">
                            ${lancarBtnHTML}
                            <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm btn-ver-contrato" data-id="${processo.codigo}">Ver Contrato</button>
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
        console.error('Erro ao buscar processos:', error);
        containerTabela.innerHTML = '<p class="text-red-500 text-center">Erro ao carregar processos.</p>';
    }
};

/**
 * Configura os eventos globais da página (pesquisa, botões de ação).
 */
function setupEventListenersGlobais() {
    const searchInput = document.getElementById('search');
    let debounceTimer;
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                carregaProcessos(event.target.value);
            }, 300);
        });
    }

    const excluirBtn = document.getElementById('bt_excluir');
    if (excluirBtn) {
        excluirBtn.addEventListener('click', async () => {
            // Adicione aqui a lógica de exclusão de processos
        });
    }
}

/**
 * Configura os eventos dos elementos da tabela (checkboxes, linhas e botões de ação).
 */
function setupEventListenersTabela() {
    // Lógica para os checkboxes
    const checkTodos = document.getElementById('checkbox-all');
    const checkUnicos = document.querySelectorAll('.checkbox-processo');
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

    // Lógica para o clique nas linhas (para edição)
    document.querySelectorAll('.linha-clicavel').forEach(linha => {
        linha.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON' || event.target.tagName === 'INPUT') return;
            const processoId = linha.dataset.id;
            // window.location.href = `editar.html?id=${processoId}`; // Descomente quando criar a tela de edição
        });
    });

    // Lógica para os botões "Lançar Contas"
    document.querySelectorAll('.btn-lancar').forEach(button => {
        button.addEventListener('click', (event) => {
            const processoId = event.target.dataset.id;
            window.location.href = `/contasReceber/index.html?processoId=${processoId}`;
        });
    });

    // Lógica para os botões "Ver Contrato"
    document.querySelectorAll('.btn-ver-contrato').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Impede que o clique na linha seja acionado também
            
            const processoId = event.target.dataset.id;
            // Redireciona para a nova página de visualização, passando o ID
            window.location.href = `gerarContrato.html?id=${processoId}`;
        });
    });
}

/**
 * Atualiza o estado dos botões de ação com base na seleção.
 */
function updateSelecionados() {
    idsSelecionados = Array.from(document.querySelectorAll('.checkbox-processo:checked')).map(cb => cb.dataset.id);
    const excluirBtn = document.getElementById('bt_excluir');
    if (excluirBtn) {
        excluirBtn.disabled = idsSelecionados.length === 0;
        excluirBtn.classList.toggle('opacity-50', excluirBtn.disabled);
        excluirBtn.classList.toggle('cursor-not-allowed', excluirBtn.disabled);
    }
}
