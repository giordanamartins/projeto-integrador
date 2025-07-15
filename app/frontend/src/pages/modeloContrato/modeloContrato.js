let idsSelecionados = [];
const apiUrl = '/api/modelos';


document.addEventListener('DOMContentLoaded', () => {
    carregaModelos();
    setupEventListenersGlobais();
});

/**
 * Busca os modelos da API e constrói a tabela HTML.
 */
const carregaModelos = async (termoBusca = '') => {
    const containerTabela = document.getElementById('tabelaModelos');
    const qtdRegElement = document.getElementById('qtdReg');

    if (!containerTabela) {
        console.error('Erro: Elemento com id "tabelaModelos" não foi encontrado.');
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}?busca=${termoBusca}`);
        const modelos = response.data;

        if (qtdRegElement) {
            qtdRegElement.innerHTML = `<strong>${modelos.length}</strong> Registros`;
        }

        let tableHTML = `
            <table class="table contentbox ml-10 mx-auto mt-11 text-left text-white">
                <thead>
                    <tr class="py-5">
                        <th class="p-4 w-12"><input type="checkbox" id="checkbox-all"></th>
                        <th class="p-4 w-24">Código</th>
                        <th class="p-4">Prévia do Texto</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (modelos.length === 0) {
            tableHTML += `<tr><td colspan="3" class="text-center p-4">Nenhum modelo de contrato encontrado.</td></tr>`;
        } else {
            modelos.forEach(modelo => {
                const textoCompleto = modelo.implementacao_modelo || '';
                const limite = 150; // Limite de caracteres para a prévia
                const previa = textoCompleto.length > limite 
                    ? textoCompleto.substring(0, limite) + '...' 
                    : textoCompleto;

                tableHTML += `
                    <tr class="border-b border-gray-700 hover:bg-gray-700 odd:bg-zinc-800 even:bg-zinc-700 cursor-pointer linha-clicavel" data-id="${modelo.codigo}">
                        <td class="p-4"><input type="checkbox" class="checkbox-modelo" data-id="${modelo.codigo}"></td>
                        <td class="px-8">${modelo.codigo}</td>
                        <td class="px-18 w-[900px] text-gray-300" title="${textoCompleto}">${previa}</td>
                    </tr>
                `;
            });
        }

        tableHTML += `</tbody></table>`;
        containerTabela.innerHTML = tableHTML;

        setupEventListenersTabela();
        updateSelecionados();

    } catch (error) {
        console.error('Erro ao buscar modelos de contrato:', error);
        containerTabela.innerHTML = '<p class="text-red-500 text-center">Erro ao carregar os dados.</p>';
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
                carregaModelos(event.target.value);
            }, 300);
        });
    }

    const excluirBtn = document.getElementById('bt_excluir');
    if (excluirBtn) {
        excluirBtn.addEventListener('click', async () => {
            if (idsSelecionados.length === 0) return;
            if (confirm(`Tem certeza que deseja excluir ${idsSelecionados.length} modelo(s)?`)) {
                try {
                    const response = await axios.delete(apiUrl, { data: { ids: idsSelecionados } });
                    alert(response.data.message);
                    carregaModelos();
                } catch (error) {
                    alert(error.response?.data?.message || 'Falha ao excluir modelos.');
                }
            }
        });
    }
    
    const clonarBtn = document.getElementById('bt_clonar');
    if (clonarBtn) {
        clonarBtn.addEventListener('click', async () => {
            if (idsSelecionados.length !== 1) {
                alert('Por favor, selecione exatamente UM modelo para clonar.');
                return;
            }
            if (confirm('Tem certeza que deseja clonar este modelo?')) {
                try {
                    const response = await axios.post(`${apiUrl}/${idsSelecionados[0]}/clone`);
                    alert(response.data.message);
                    carregaModelos();
                } catch (error) {
                    alert(error.response?.data?.message || 'Falha ao clonar modelo.');
                }
            }
        });
    }
}

/**
 * Configura os eventos dos elementos da tabela (checkboxes, linhas).
 */
function setupEventListenersTabela() {
    const checkTodos = document.getElementById('checkbox-all');
    const checkUnicos = document.querySelectorAll('.checkbox-modelo');
    const linhasTabela = document.querySelectorAll('.linha-clicavel');

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

    linhasTabela.forEach(linha => {
        linha.addEventListener('click', (event) => {
            if (event.target.type === 'checkbox') return;
            const modeloId = linha.dataset.id;

        });
    });
}

/**
 * Atualiza o estado dos botões de ação com base na seleção.
 */
function updateSelecionados() {
    idsSelecionados = Array.from(document.querySelectorAll('.checkbox-modelo:checked')).map(cb => cb.dataset.id);

    const excluirBtn = document.getElementById('bt_excluir');
    const clonarBtn = document.getElementById('bt_clonar');

    if (excluirBtn) {
        excluirBtn.disabled = idsSelecionados.length === 0;
        excluirBtn.classList.toggle('opacity-50', excluirBtn.disabled);
        excluirBtn.classList.toggle('cursor-not-allowed', excluirBtn.disabled);
    }
    
    if (clonarBtn) {
        clonarBtn.disabled = idsSelecionados.length !== 1;
        clonarBtn.classList.toggle('opacity-50', clonarBtn.disabled);
        clonarBtn.classList.toggle('cursor-not-allowed', clonarBtn.disabled);
    }
}
