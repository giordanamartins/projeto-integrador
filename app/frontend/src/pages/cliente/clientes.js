let idsSelecionados = [];

document.addEventListener('DOMContentLoaded', () => {
    carregaTable();
});

const apiUrl = '/api/clientes';

const carregaTable = async () => {
    const containerTabela = document.getElementById('tabelaClis');
    // CORREÇÃO: Captura o elemento que mostrará a quantidade de registros.
    const qtdRegElement = document.getElementById('qtdReg');

    // Validação para garantir que os elementos existem no HTML
    if (!containerTabela) {
        console.error('Erro: Elemento com id "tabelaClis" não foi encontrado no HTML.');
        return;
    }

    try {
        const response = await axios.get(apiUrl);
        const clientes = response.data;

        // CORREÇÃO: Garante que o elemento existe antes de tentar usá-lo.
        if (qtdRegElement) {
            qtdRegElement.innerHTML = `<strong>${clientes.length}</strong> Registros`;
        }

        let resultsTableHTML = `
            <table id="resultsTable" class="table contentbox ml-10 mx-auto mt-11 text-white">
                <thead>
                    <tr class="py-5">
                        <th scope="col" class="px-5">
                            <input type="checkbox" id="checkbox-all" title="Selecionar Todos">
                        </th>
                        <th scope="col" class="px-50">Nome</th>
                        <th scope="col" class="col-12">Email</th>
                        <th scope="col" class="col-12">CPF</th>
                        <th scope="col" class="col-12">Telefone</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (clientes.length === 0) {
            resultsTableHTML += `<tr><td colspan="5" style="text-align: center;">Nenhum cliente encontrado.</td></tr>`;
        } else {
            clientes.forEach(cliente => {
                resultsTableHTML += `
                    <tr class="border-b border-gray-700 odd:bg-zinc-800 even:bg-zinc-700">
                        <td class="px-5">
                            <input type="checkbox" class="checkbox-cliente" data-id="${cliente.idc}">
                        </td>
                        <td class="px-6 py-4 font-medium whitespace-nowrap text-white">${cliente.nome || ''}</td>
                        <td class="px-8">${cliente.email || ''}</td>
                        <td class="px-8">${cliente.cpf || ''}</td>
                        <td class="px-8">${cliente.telefone || ''}</td>
                    </tr>
                `;
            });
        }

        resultsTableHTML += `</tbody></table>`;
        containerTabela.innerHTML = resultsTableHTML;

        listenerCheck();

    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        containerTabela.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar os dados. Verifique o console.</p>';
    }
};

function listenerCheck(){
    const checkTodos = document.getElementById('checkbox-all');
    const checkUnico = document.querySelectorAll('.checkbox-cliente');

    checkTodos.addEventListener('change', () => {
        checkUnico.forEach(checkbox => {
            checkbox.checked = checkTodos.checked;
        });
        updateSelecionados();
    });

    checkUnico.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (!checkbox.checked) {
                checkTodos.checked = false;
            }
            updateSelecionados();
        });
    });

}

function updateSelecionados(){
    idsSelecionados = [];
    const checkMarcados = document.querySelectorAll('.checkbox-cliente:checked');

    checkMarcados.forEach(checkbox => {
        idsSelecionados.push(checkbox.dataset.id); // Adiciona o ID do checkbox marcado
    });

    const excluir = document.getElementById('bt_excluir');
    if(idsSelecionados.lenght > 0){
        excluir.disabled = false;
    }else{
        excluir.disable = true;
    }

    excluir.addEventListener('click', async() =>{
        
        if (confirm(`Tem certeza que deseja excluir ${idsSelecionados.length} cliente(s)?`)) {
            try {
                // Envia a requisição DELETE para o backend, passando os IDs no corpo
                const response = await axios.delete('/api/clientes', {
                    data: { ids: idsSelecionados }
                });
                
                alert(response.data.message); // Exibe a mensagem de sucesso do backend
                carregaTable(); // Recarrega a tabela para mostrar as mudanças
                
            } catch (error) {
                console.error('Erro ao excluir clientes:', error);
                alert('Falha ao excluir clientes. Verifique o console.');
            }
        }
    })
}