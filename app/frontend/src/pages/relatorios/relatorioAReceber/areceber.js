const apiUrl = '/api/contasReceber/relatorio-areceber';

document.addEventListener('DOMContentLoaded', () => {
    carregarTabela();

    

    document.getElementById("dataRelatorio").innerText = `Gerado em: ${new Date().toLocaleString('pt-BR')}`;
});

//pensei em fazer uma busca, mas deixa
const carregarTabela = async (termoBusca = '') => {
    const tabela = document.getElementById('tabelaCReceber');
    const qtdReg = document.getElementById('qtdReg');

    try {
        const response = await axios.get(`${apiUrl}?busca=${termoBusca}`);
        const contas = response.data;

        qtdReg.innerHTML = `<strong>${contas.length}</strong>`;

        let html = `
            <table class="min-w-full table-auto">
                <thead>
                    <tr class="bg-gray-700 text-left text-sm uppercase text-white">
                        <th class="px-6 py-3">Cliente</th>
                        <th class="px-6 py-3">Processo</th>
                        <th class="px-6 py-3">Descrição da Conta</th>
                        <th class="px-6 py-3 text-center">Vencimento</th>
                        <th class="px-6 py-3 text-right">Valor</th>
                    </tr>
                </thead>
                <tbody class="text-sm divide-y divide-gray-600">
        `;

        if (contas.length === 0) {
            html += `<tr><td colspan="5" class="text-center py-4">Nenhuma conta encontrada.</td></tr>`;
        } else {
            let total = 0;
            contas.forEach(conta => {
                total += parseFloat(conta.valor);
                html += `
                    <tr class="hover:bg-gray-800">
                        <td class="px-6 py-3">${conta.cliente || ''}</td>
                        <td class="px-6 py-3 text-gray-400">${conta.processo || 'N/A'}</td>
                        <td class="px-6 py-3">${conta.descricao || ''}</td>
                        <td class="px-6 py-3 text-center">${new Date(conta.data_vencimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                        <td class="px-6 py-3 text-right">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.valor)}</td>
                    </tr>
                `;
            });

            html += `
                <tr class="bg-gray-700 font-bold">
                    <td colspan="4" class="px-6 py-3 text-right">TOTAL A RECEBER:</td>
                    <td class="px-6 py-3 text-right">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</td>
                </tr>
            `;
        }

        html += `</tbody></table>`;
        tabela.innerHTML = html;

    } catch (error) {
        console.error('Erro ao carregar contas a receber:', error);
        tabela.innerHTML = `<p class='p-4 text-red-500'>Erro ao carregar os dados. Verifique o console.</p>`;
        qtdReg.innerHTML = '0';
    }
};
