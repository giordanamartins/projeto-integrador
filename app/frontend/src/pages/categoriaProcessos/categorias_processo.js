let idsSelecionados = [];
const apiUrl = '/api/catProcessos';

// Função principal que é chamada quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    carregaCatProc();
    setupEventListenersGlobais(); // Configura os eventos que só precisam ser adicionados uma vez
});

/**
 * Busca as categorias da API e constrói a tabela HTML.
 * @param {string} termoBusca - O texto a ser pesquisado.
 */
const carregaCatProc = async (termoBusca = '') => {
    const containerTabela = document.getElementById('tabelaCat');
    const qtdRegElement = document.getElementById('qtdReg');

    if (!containerTabela) {
        console.error('Erro: Elemento com id "tabelaCat" não foi encontrado no HTML.');
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}?busca=${termoBusca}`);
        const categorias = response.data;

        if (qtdRegElement) {
            qtdRegElement.innerHTML = `<strong>${categorias.length}</strong> Registros`;
        }

        let resultsTableHTML = `
            <table id="resultsTable" class="table contentbox ml-10 mx-auto mt-11 text-white">
                <thead>
                    <tr class="py-5">
                        <th class="px-5">
                            <input type="checkbox" id="checkbox-all" title="Selecionar Todos">
                        </th>
                        <th class="px-50">Nome</th>
                        <th class="px-50">Descrição</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (categorias.length === 0) {
            resultsTableHTML += `<tr><td colspan="2" style="text-align: center;">Nenhuma categoria encontrada.</td></tr>`;
        } else {
            categorias.forEach(categoria => {
                resultsTableHTML += `
                    <tr class="border-b border-gray-700 odd:bg-zinc-800 even:bg-zinc-700 hover:bg-gray-600 cursor-pointer linha-clicavel" data-id="${categoria.codigo}">
                        <td class="px-5 py-4">
                            <input type="checkbox" class="checkbox-categoria" data-id="${categoria.codigo}">
                        </td>
                        <td class="px-6 py-4 font-medium whitespace-nowrap text-white">${categoria.descricao || ''}</td>
                        <td class="px-6 py-4 font-medium whitespace-nowrap text-white">${categoria.descricao || ''}</td>
                    </tr>
                `;
            });
        }

        resultsTableHTML += `</tbody></table>`;
        containerTabela.innerHTML = resultsTableHTML;

        // Reconfigura os eventos para os novos elementos da tabela
        setupEventListenersTabela();
        updateSelecionados(); // Garante que os botões comecem no estado correto

    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        containerTabela.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar os dados. Verifique o console.</p>';
    }
};

/**
 * Configura os "escutadores" de eventos que só precisam ser configurados uma vez,
 * como a barra de pesquisa e os botões de ação.
 */
function setupEventListenersGlobais() {
    // Lógica da barra de pesquisa
    const searchInput = document.getElementById('search');
    let debounceTimer;
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            clearTimeout(debounceTimer);
            const termoBusca = event.target.value;
            debounceTimer = setTimeout(() => {
                carregaCatProc(termoBusca);
            }, 300);
        });
    }

    // Lógica do botão de exclusão
    const excluirBtn = document.getElementById('bt_excluir');
    if (excluirBtn) {
        excluirBtn.addEventListener('click', async () => {
            if (idsSelecionados.length === 0) return;
            if (confirm(`Tem certeza que deseja excluir ${idsSelecionados.length} categoria(s)?`)) {
                try {
                    const response = await axios.delete(apiUrl, { data: { ids: idsSelecionados } });
                    alert(response.data.message);
                    carregaCatProc();
                } catch (error) {
                    const msgErro = error.response ? error.response.data.message : 'Falha ao excluir categorias.';
                    alert(msgErro);
                    console.error('Erro ao excluir categorias:', error);
                }
            }
        });
    }
    
    // Lógica para o botão de clonar
    const clonarBtn = document.getElementById('bt_clonar');
    if (clonarBtn) {
        clonarBtn.addEventListener('click', async () => {
            if (idsSelecionados.length !== 1) {
                alert('Por favor, selecione exatamente UMA categoria para clonar.');
                return;
            }

            const idParaClonar = idsSelecionados[0];

            if (confirm(`Tem certeza que deseja clonar esta categoria?`)) {
                try {
                    const response = await axios.post(`${apiUrl}/${idParaClonar}/clone`);
                    alert(response.data.message);
                    carregaCatProc();
                } catch (error) {
                    const msgErro = error.response ? error.response.data.message : 'Falha ao clonar a categoria.';
                    alert(msgErro);
                    console.error('Erro ao clonar categoria:', error);
                }
            }
        });
    }

    // Lógica do menu financeiro
    const financeiroToggle = document.getElementById('financeiro-toggle');
    const financeiroSubmenu = document.getElementById('financeiro-submenu');
    const financeiroArrow = document.getElementById('financeiro-arrow');
    if (financeiroToggle) {
        financeiroToggle.addEventListener('click', (event) => {
            event.preventDefault();
            financeiroSubmenu.classList.toggle('hidden');
            financeiroArrow.classList.toggle('rotate-180');
        });
    }
}

/**
 * Configura os eventos para os elementos dinâmicos da tabela (checkboxes e linhas).
 */
function setupEventListenersTabela() {
    const checkTodos = document.getElementById('checkbox-all');
    const checkUnicos = document.querySelectorAll('.checkbox-categoria');
    const linhasTabela = document.querySelectorAll('.linha-clicavel');

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

    linhasTabela.forEach(linha => {
        linha.addEventListener('click', (event) => {
            if (event.target.type === 'checkbox') return;
            const catId = linha.dataset.id;
            window.location.href = `editar.html?id=${catId}`;
        });
    });
}

/**
 * Atualiza o array 'idsSelecionados' e o estado dos botões de ação.
 */
function updateSelecionados() {
    idsSelecionados = [];
    const checkMarcados = document.querySelectorAll('.checkbox-categoria:checked');
    checkMarcados.forEach(checkbox => idsSelecionados.push(checkbox.dataset.id));

    const excluirBtn = document.getElementById('bt_excluir');
    const clonarBtn = document.getElementById('bt_clonar');

    if (excluirBtn) {
        excluirBtn.disabled = idsSelecionados.length === 0;
    }
    
    if (clonarBtn) {
        clonarBtn.disabled = idsSelecionados.length !== 1;
    }
}
