const apiUrl = '/api/processos/relatorio';

document.addEventListener('DOMContentLoaded', () => {
    carregarTabela();

    document.getElementById("dataRelatorio").innerText =
        `Gerado em: ${new Date().toLocaleString('pt-BR')}`;
    });

    const carregarTabela = async () => {
    const tabela = document.getElementById('tabelaProcessos');
    const qtdReg = document.getElementById('qtdReg');

    try {
        const response = await axios.get(apiUrl);
        const processos = response.data;

        qtdReg.innerHTML = `<strong>${processos.length}</strong>`;

        let html = `
            <table class="min-w-full table-auto">
                <thead>
                <tr class="bg-gray-700 text-left text-sm uppercase text-white">
                    <th class="px-6 py-3">Código</th>
                    <th class="px-6 py-3">Descrição</th>
                    <th class="px-6 py-3">Comentários</th>
                    <th class="px-6 py-3">Status</th>
                    <th class="px-6 py-3">Cliente</th>
                    <th class="px-6 py-3">Usuário</th>
                    <th class="px-6 py-3">Categoria</th>
                    <th class="px-6 py-3">Modelo Contrato</th>
                </tr>
                </thead>
                <tbody class="text-sm divide-y divide-gray-600">
            `;

            if (processos.length === 0) {
            html += `<tr><td colspan="8" class="text-center py-4">Nenhum processo encontrado.</td></tr>`;
            } 
            else {
            processos.forEach(p => {
                html += `
                <tr class="hover:bg-gray-800">
                    <td class="px-6 py-3">${p.codigo}</td>
                    <td class="px-6 py-3">${p.descricao}</td>
                    <td class="px-6 py-3">${p.comentarios || ''}</td>
                    <td class="px-6 py-3">${p.status}</td>
                    <td class="px-6 py-3">${p.cliente}</td>
                    <td class="px-6 py-3">${p.usuario}</td>
                    <td class="px-6 py-3">${p.categoria}</td>
                    <td class="px-6 py-3">${p.modelo_contrato_codigo || ''}</td>
                </tr>
                `;
            });
            }
            html += `</tbody></table>`;
            tabela.innerHTML = html;
        } 
    catch (error) {
        console.error('Erro ao carregar processos:', error);
        tabela.innerHTML = `<p class='p-4 text-red-500'>Erro ao carregar os dados. Verifique o console.</p>`;
        qtdReg.innerHTML = '0';
    }
};
