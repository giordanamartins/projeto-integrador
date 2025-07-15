const apiUrl = '/api/processos/relatorio';

document.addEventListener('DOMContentLoaded', () => {

    popularFiltroCategorias();
    

    const filtroCategoria = document.getElementById('filtro-categoria');
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', () => {
            carregarTabela(filtroCategoria.value);
        });
    }

    document.getElementById("dataRelatorio").innerText = `Gerado em: ${new Date().toLocaleString('pt-BR')}`;
});

/**
 * Popula o dropdown de filtro com as categorias de processo.
 */
const popularFiltroCategorias = async () => {
    const selectFiltro = document.getElementById('filtro-categoria');
    if (!selectFiltro) return;

    try {

        const response = await axios.get('/api/catProcessos');
        const categorias = response.data;
        
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.codigo;
            option.textContent = cat.nome;
            selectFiltro.appendChild(option);
        });


        carregarTabela('all');

    } catch (error) {
        console.error('Erro ao carregar categorias para o filtro:', error);
        selectFiltro.innerHTML += '<option value="">Erro ao carregar</option>';
    }
};

/**
 * Carrega a tabela de processos, opcionalmente filtrada por categoria.
 * @param {string} categoriaId - O ID da categoria para filtrar, ou 'all'.
 */
const carregarTabela = async (categoriaId = 'all') => {
    const tabelaContainer = document.getElementById('tabelaProcessos');
    const qtdReg = document.getElementById('qtdReg');
    if (!tabelaContainer) return;

    tabelaContainer.innerHTML = `<p class="p-4 text-center">Carregando dados...</p>`;

    try {

        const response = await axios.get(`${apiUrl}?categoriaId=${categoriaId}`);
        const processos = response.data;

        if (qtdReg) {
            qtdReg.innerHTML = `<strong>${processos.length}</strong>`;
        }

        let html = `
            <table class="min-w-full table-auto">
                <thead>
                    <tr class="bg-gray-700 text-left text-sm uppercase text-white">
                        <th class="px-6 py-3">Código</th>
                        <th class="px-6 py-3">Descrição</th>
                        <th class="px-6 py-3">Cliente</th>
                        <th class="px-6 py-3">Advogado</th>
                        <th class="px-6 py-3">Categoria</th>
                        <th class="px-6 py-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody class="text-sm divide-y divide-gray-600">
        `;

        if (processos.length === 0) {
            html += `<tr><td colspan="6" class="text-center py-4">Nenhum processo encontrado para os filtros selecionados.</td></tr>`;
        } else {
            processos.forEach(p => {
                const statusTexto = p.status === 'A' ? 'Em Andamento' : p.status;
                html += `
                    <tr class="hover:bg-gray-800">
                        <td class="px-6 py-3">${p.codigo}</td>
                        <td class="px-6 py-3">${p.descricao || ''}</td>
                        <td class="px-6 py-3">${p.cliente}</td>
                        <td class="px-6 py-3">${p.usuario}</td>
                        <td class="px-6 py-3">${p.categoria}</td>
                        <td class="px-6 py-3 text-center">${statusTexto}</td>
                    </tr>
                `;
            });
        }

        html += `</tbody></table>`;
        tabelaContainer.innerHTML = html;

    } catch (error) {
        console.error('Erro ao carregar relatório de processos:', error);
        tabelaContainer.innerHTML = `<p class='p-4 text-red-500'>Erro ao carregar os dados. Verifique o console.</p>`;
        if (qtdReg) qtdReg.innerHTML = '0';
    }
};
