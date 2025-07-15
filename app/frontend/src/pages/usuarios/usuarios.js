let idsSelecionados = [];
const apiUrl = '/api/usuarios';

document.addEventListener('DOMContentLoaded', () => {
    carregaUsuarios();
    setupEventListenersGlobais();
});

const carregaUsuarios = async (termoBusca = '') => {
    const containerTabela = document.getElementById('tabelaUser');
    const qtdRegElement = document.getElementById('qtdReg');
    if (!containerTabela) return;

    try {
        const response = await axios.get(`${apiUrl}?busca=${termoBusca}`);
        const usuarios = response.data;

        if (qtdRegElement) {
            qtdRegElement.innerHTML = `<strong>${usuarios.length}</strong> Registros`;
        }

        let tableHTML = `
            <table class="w-[750px] text-left text-white">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="p-4 w-12"><input type="checkbox" id="checkbox-all"></th>
                        <th class="p-4">Nome</th>
                        <th class="p-4">Email</th>
                        <th class="p-4 text-center">Tipo</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (usuarios.length === 0) {
            tableHTML += `<tr><td colspan="4" class="text-center p-4">Nenhum usuário encontrado.</td></tr>`;
        } else {
            usuarios.forEach(usuario => {
                const tipoTexto = usuario.tipo_usuario === 'A' ? 'Advogado' : (usuario.tipo_usuario === 'J' ? 'Assessor' : 'Desconhecido');

                tableHTML += `
                    <tr class="border-b border-gray-700 hover:bg-gray-700 odd:bg-zinc-800 even:bg-zinc-700 cursor-pointer linha-clicavel" data-id="${usuario.codigo}">
                        <td class="p-4 text-center"><input type="checkbox" class="checkbox-usuario" data-id="${usuario.codigo}"></td>
                        <td class="p-4 font-medium">${usuario.nome || ''}</td>
                        <td class="p-4 text-gray-300">${usuario.email || ''}</td>
                        <td class="p-4 text-gray-300">${tipoTexto || ''}</td>

                    </tr>
                `;
            });
        }
        tableHTML += `</tbody></table>`;
        containerTabela.innerHTML = tableHTML;
        
        setupEventListenersTabela();
        updateSelecionados();

    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        containerTabela.innerHTML = '<p class="text-red-500 text-center">Erro ao carregar os dados.</p>';
    }
};

function setupEventListenersGlobais() {
    const excluirBtn = document.getElementById('bt_excluir');
    if (excluirBtn) {
        excluirBtn.addEventListener('click', async () => {
            if (idsSelecionados.length === 0) return;
            if (confirm(`Tem certeza que deseja excluir ${idsSelecionados.length} usuário(s)?`)) {
                try {
                    const response = await axios.delete(apiUrl, { data: { ids: idsSelecionados } });
                    alert(response.data.message);
                    carregaUsuarios();
                } catch (error) {
                    alert(error.response?.data?.message || 'Falha ao excluir usuários.');
                }
            }
        });
    }
}

function setupEventListenersTabela() {
    const checkTodos = document.getElementById('checkbox-all');
    const checkUnicos = document.querySelectorAll('.checkbox-usuario');
    const linhasTabela = document.querySelectorAll('.linha-clicavel');


    linhasTabela.forEach(linha => {
        linha.addEventListener('click', (event) => {

            if (event.target.type === 'checkbox') {
                return;
            }
            const usuarioId = linha.dataset.id;
            window.location.href = `editar.html?id=${usuarioId}`;
        });
    });

    if (checkTodos) {
        checkTodos.addEventListener('change', () => {
            checkUnicos.forEach(checkbox => checkbox.checked = checkTodos.checked);
            updateSelecionados();
        });
    }

    checkUnicos.forEach(checkbox => {
        checkbox.addEventListener('change', () => {

            if (!checkbox.checked) {
                checkTodos.checked = false;
            }
            updateSelecionados();
        });
    });
}

function updateSelecionados() {
    idsSelecionados = Array.from(document.querySelectorAll('.checkbox-usuario:checked')).map(cb => cb.dataset.id);
    const excluirBtn = document.getElementById('bt_excluir');
    if (excluirBtn) {
        excluirBtn.disabled = idsSelecionados.length === 0;
        excluirBtn.classList.toggle('opacity-50', excluirBtn.disabled);
        excluirBtn.classList.toggle('cursor-not-allowed', excluirBtn.disabled);
    }
}
