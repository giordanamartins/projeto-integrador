const apiUrl = '/api/contasPagar/relatorio-apagar';

document.addEventListener('DOMContentLoaded', () => {
    carregarTabela();

    const search = document.getElementById('searchInput');
    let timeoutBusca;

    search.addEventListener('input', (event) => {
        clearTimeout(timeoutBusca);
        const termo = event.target.value;

        timeoutBusca = setTimeout(() => {
            carregarTabela(termo);
        }, 300);
    });

    document.getElementById("dataRelatorio").innerText =
        `Gerado em: ${new Date().toLocaleString('pt-BR')}`;
});

const carregarTabela = async (termoBusca = '') => {
    const tabela = document.getElementById('tabelaCPagar');
    const qtdReg = document.getElementById('qtdReg');

    try {
        const response = await axios.get(apiUrl);
        let contas = response.data;

        if (termoBusca) {
            const termoLower = termoBusca.toLowerCase();
            contas = contas.filter(conta =>
                (conta.descricao || '').toLowerCase().includes(termoLower) ||
                (conta.descricao_categoria || conta.descricao_1 || '').toLowerCase().includes(termoLower)
            );
        }

        qtdReg.innerHTML = `<strong>${contas.length}</strong>`;

        let html = `
            <table class="min-w-full table-auto">
                <thead>
                    <tr class="bg-gray-700 text-left text-sm uppercase text-white">
                        <th class="px-6 py-3">Código</th>
                        <th class="px-6 py-3">Descrição</th>
                        <th class="px-6 py-3">Vencimento</th>
                        <th class="px-6 py-3">Categoria</th>
                        <th class="px-6 py-3">Valor (R$)</th>
                    </tr>
                </thead>
                <tbody class="text-sm divide-y divide-gray-600">
        `;

        if (contas.length === 0) {
            html += `<tr><td colspan="5" class="text-center py-4">Nenhuma conta encontrada.</td></tr>`;
        } 
        else {
            contas.forEach(conta => {
                html += `
                    <tr class="hover:bg-gray-800">
                        <td class="px-6 py-3">${conta.codigo}</td>
                        <td class="px-6 py-3">${conta.descricao}</td>
                        <td class="px-6 py-3">${new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}</td>
                        <td class="px-6 py-3">${conta.descricao_categoria || conta.descricao_1 || '---'}</td>
                        <td class="px-6 py-3">R$ ${parseFloat(conta.valor).toFixed(2)}</td>
                    </tr>
                `;
            });
        }

        html += `</tbody></table>`;
        tabela.innerHTML = html;

    } 
    catch (error) {
        console.error('Erro ao carregar contas a pagar:', error);
        tabela.innerHTML = `<p class='p-4 text-red-500'>Erro ao carregar os dados. Verifique o console.</p>`;
        qtdReg.innerHTML = '0';
    }
};
