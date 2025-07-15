const apiUrl = '/api/contasPagar/relatorio-pagamentos';

document.addEventListener('DOMContentLoaded', () => {
    carregarTabela();

    document.getElementById("dataRelatorio").innerText =
        `Gerado em: ${new Date().toLocaleString('pt-BR')}`;
});

const carregarTabela = async (termoBusca = '') => {
    const tabela = document.getElementById('tabelaPagamentos');
    const qtdReg = document.getElementById('qtdReg');

    try {
        const response = await axios.get(apiUrl);
        let pagamentos = response.data;
        console.log(pagamentos);

        if (termoBusca) {
            const termoLower = termoBusca.toLowerCase();
            pagamentos = pagamentos.filter(pagamento =>
                (pagamento.descricao || '').toLowerCase().includes(termoLower) ||
                (pagamento.descricao_categoria || pagamento.descricao_1 || '').toLowerCase().includes(termoLower)
            );
        }

        qtdReg.innerHTML = `<strong>${pagamentos.length}</strong>`;

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

        if (pagamentos.length === 0) {
            html += `<tr><td colspan="5" class="text-center py-4">Nenhum pagamento encontrado.</td></tr>`;
        } 
        else {
            pagamentos.forEach(pagamento => {
                html += `
                    <tr class="hover:bg-gray-800">
                        <td class="px-6 py-3">${pagamento.codigo}</td>
                        <td class="px-6 py-3">${pagamento.descricao}</td>
                        <td class="px-6 py-3">${new Date(pagamento.data_vencimento).toLocaleDateString('pt-BR')}</td>
                        <td class="px-6 py-3">${pagamento.descricao_categoria || pagamento.descricao_1 || '---'}</td>
                        <td class="px-6 py-3">R$ ${parseFloat(pagamento.valor).toFixed(2)}</td>
                    </tr>
                `;
            });
        }

        html += `</tbody></table>`;
        tabela.innerHTML = html;

    } 
    catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
        tabela.innerHTML = `<p class='p-4 text-red-500'>Erro ao carregar os dados. Verifique o console.</p>`;
        qtdReg.innerHTML = '0';
    }
};
