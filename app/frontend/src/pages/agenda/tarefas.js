let idsSelecionados = [];
const apiUrl = '/api/tarefas';

// Função principal que é chamada quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    carregaTarefas();
    setupEventListenersGlobais(); // Configura os eventos que só precisam ser adicionados uma vez
});


const carregaTarefas = async () => {
    const containerTabela = document.getElementById("tabelaTarefas");
    const qtdRegElement = document.getElementById('qtdReg');
    if (!containerTabela) {
        console.error('Elemento #tabelaTarefas não encontrado no DOM.');
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}`);
        const tarefas = response.data;

        if (qtdRegElement) {
            qtdRegElement.innerHTML = `<strong>${tarefas.length}</strong> Registros`;
        }

        let resultsTableHTML = `
            <table id="resultsTable" class="table contentbox ml-10 mx-auto mt-11 text-white">
                <thead>
                    <tr class="py-5">
                        <th scope="col" class="px-5">
                            <input type="checkbox" id="checkbox-all" title="Selecionar Todos">
                        </th>
                        <th scope="col" class="px-50">Descrição</th>
                        <th scope="col" class="col-12">Data/Hora</th>
                    </tr>
                </thead>
                <tbody>
        `;
        console.log(tarefas);

        if (tarefas.length === 0) {
            resultsTableHTML += `<tr><td colspan="5" style="text-align: center;">Nenhum cliente encontrado.</td></tr>`;
        } else {
            tarefas.forEach(tarefa => {
                const data = new Date(tarefa.data_hora); 
                const formatada = data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC' 
                });
                resultsTableHTML += `
                    <tr class="border-b border-gray-700 odd:bg-zinc-800 even:bg-zinc-700 linha-clicavel" data-id="${tarefa.codigo}">
                        <td class="px-5">
                            <input type="checkbox" class="checkbox-cliente" data-id="${tarefa.codigo}">
                        </td>
                        <td class="px-6 py-4 font-medium whitespace-nowrap text-white">${tarefa.descricao || ''}</td>
                        <td class="px-8">${formatada || ''}</td>
                    </tr>
                `;
            });
        }

        resultsTableHTML += `</tbody></table>`;
        containerTabela.innerHTML = resultsTableHTML;


    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        containerTabela.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar os dados. Verifique o console.</p>';
    }

}

function setupEventListenersGlobais() {
    
}