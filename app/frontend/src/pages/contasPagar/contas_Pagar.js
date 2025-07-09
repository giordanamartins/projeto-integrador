document.addEventListener('DOMContentLoaded', () => {
    carregaCPagar();
    const financeiroToggle = document.getElementById('financeiro-toggle');
    const financeiroSubmenu = document.getElementById('financeiro-submenu');
    const financeiroArrow = document.getElementById('financeiro-arrow');
    if (financeiroToggle) {
        financeiroToggle.addEventListener('click', (event) => {
            // Impede o comportamento padrão do link (que seria navegar para '#')
            event.preventDefault();

            // Alterna a classe 'hidden' no submenu, fazendo-o aparecer ou desaparecer
            financeiroSubmenu.classList.toggle('hidden');

            // Alterna a classe 'rotate-180' no ícone da seta para girá-lo
            financeiroArrow.classList.toggle('rotate-180');
        });
    }
});

const apiUrl = '/api/contasPagar';

const carregaCPagar = async () => {
    const containerTabela = document.getElementById('tabelaCPagar');
   
    const qtdRegElement = document.getElementById('qtdReg');

  
    if (!containerTabela) {
        console.error('Erro: Elemento com id "tabelaCPagar" não foi encontrado no HTML.');
        return;
    }

    try {
        const response = await axios.get(apiUrl);
        const contasp = response.data;

        
        if (qtdRegElement) {
            qtdRegElement.innerHTML = `<strong>${contasp.length}</strong> Registros`;
        }

        let resultsTableHTML = `
            <table id="resultsTable" class="table contentbox ml-10 mx-auto mt-11 text-white">
                <thead>
                    <tr class="py-5">
                        <th scope="col" class="px-5"><ion-icon name="square-outline"></ion-icon></th>
                        <th scope="col" class="px-50">Descrição</th>
                        <th scope="col" class="col-12">Data de vencimento</th>
                        <th scope="col" class="col-12">Valor</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (contasp.length === 0) {
            resultsTableHTML += `<tr><td colspan="5" style="text-align: center;">Nenhuma conta a pagar encontrada.</td></tr>`;
        } else {
            contasp.forEach(contap => {
                const dataVencp = new Date(contap.datavencp);
                const dataFormatada = dataVencp.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    timeZone: 'UTC'
                });
                resultsTableHTML += `
                    <tr class="border-b border-gray-700 odd:bg-zinc-800 even:bg-zinc-700">
                        <td><ion-icon name="square-outline" class="px-5"></ion-icon></td>
                        <td class="px-6 py-4 font-medium whitespace-nowrap text-white">${contap.descricaop || ''}</td>
                        <td class="px-20">${dataFormatada || ''}</td>
                        <td class="px-20">${contap.totalp || ''}</td>
                    </tr>
                `;
            });
        }

        resultsTableHTML += `</tbody></table>`;
        containerTabela.innerHTML = resultsTableHTML;

    } catch (error) {
        console.error('Erro ao buscar contas a pagar:', error);
        containerTabela.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar os dados. Verifique o console.</p>';
    }
}