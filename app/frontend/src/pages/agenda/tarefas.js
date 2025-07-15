let idsSelecionados = [];
const apiUrl = '/api/tarefas';

// Função principal que é chamada quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    carregaTarefas();
    setupEventListenersGlobais();
});

const carregaTarefas = async () => {
    const containerTabela = document.getElementById("tabelaTarefas");
    const qtdRegElement = document.getElementById('qtdReg');
    if (!containerTabela) return;

    try {
        const response = await axios.get(apiUrl);
        const tarefas = response.data;

        if (qtdRegElement) {
            qtdRegElement.innerHTML = `<strong>${tarefas.length}</strong> Registros`;
        }

        let resultsTableHTML = `
            <table id="resultsTable" class="table contentbox ml-10 mx-auto mt-11 text-white">
                <thead>
                    <tr class="py-5">
                        <th class="px-5"><input type="checkbox" id="checkbox-all" title="Selecionar Todos"></th>
                        <th>Descrição</th>
                        <th class="text-center">Data/Hora</th>
                        <th class="text-center">Usuário</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (tarefas.length === 0) {
            resultsTableHTML += `<tr><td colspan="4" class="text-center p-4">Nenhuma tarefa encontrada.</td></tr>`;
        } else {
            tarefas.forEach(tarefa => {
                const dataFormatada = new Date(tarefa.data_hora).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: false
                });

                resultsTableHTML += `
                    <tr class="border-b border-gray-700 odd:bg-zinc-800 even:bg-zinc-700 hover:bg-gray-700 cursor-pointer linha-clicavel" data-id="${tarefa.codigo}">
                        <td class="p-4 px-15 text-center"><input type="checkbox" class="checkbox-tarefa" data-id="${tarefa.codigo}"></td>
                        <td class="p-4 px-15 font-medium">${tarefa.descricao || ''}</td>
                        <td class="p-4 px-25 text-center">${dataFormatada}</td>
                        <td class="p-4 px-15 text-center">${tarefa.usuario_nome || 'N/A'}</td>
                    </tr>
                `;
            });
        }

        resultsTableHTML += `</tbody></table>`;
        containerTabela.innerHTML = resultsTableHTML;
        
        setupEventListenersTabela();
        updateSelecionados();

    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        containerTabela.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar os dados. Verifique o console.</p>';
    }
};

function setupEventListenersGlobais() {
    const excluirBtn = document.getElementById('bt_del'); // Use o ID do seu botão de excluir
    if (excluirBtn) {
        excluirBtn.addEventListener('click', async () => {
            if (idsSelecionados.length === 0) return;
            if (confirm(`Tem certeza que deseja excluir ${idsSelecionados.length} tarefa(s)?`)) {
                try {
                    const response = await axios.delete(apiUrl, { data: { ids: idsSelecionados } });
                    alert(response.data.message);
                    carregaTarefas();
                } catch (error) {
                    alert(error.response?.data?.message || 'Falha ao excluir tarefas.');
                }
            }
        });
    }
}

function setupEventListenersTabela() {
    const checkTodos = document.getElementById('checkbox-all');
    const checkUnicos = document.querySelectorAll('.checkbox-tarefa');
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
            const tarefaId = linha.dataset.id;
            window.location.href = `editar.html?id=${tarefaId}`;
        });
    });
}

function updateSelecionados() {
    idsSelecionados = Array.from(document.querySelectorAll('.checkbox-tarefa:checked')).map(cb => cb.dataset.id);
    const excluirBtn = document.getElementById('bt_del'); // Use o ID do seu botão
    if (excluirBtn) {
        excluirBtn.disabled = idsSelecionados.length === 0;
        excluirBtn.classList.toggle('opacity-50', excluirBtn.disabled);
        excluirBtn.classList.toggle('cursor-not-allowed', excluirBtn.disabled);
    }
}
