document.addEventListener('DOMContentLoaded', () => {

    popularSelect('cliente_codigo', '/api/clientes', 'codigo', 'nome', 'cliente');
    popularSelect('usuario_codigo', '/api/usuarios/advogados', 'codigo', 'nome', 'advogado');
    popularSelect('categoria_codigo', '/api/catProcessos', 'codigo', 'nome', 'categoria');
    

    popularSelect('modelo_contrato_codigo', '/api/modelos', 'codigo', 'nome', 'modelo');

    const formProcesso = document.getElementById('form-novo-processo');

    if (formProcesso) {
        formProcesso.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const submitButton = formProcesso.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Salvando...';


            const dadosProcesso = {

                descricao: document.getElementById('descricao').value,
                comentarios: document.getElementById('comentarios').value,
                cliente_codigo: document.getElementById('cliente_codigo').value,
                usuario_codigo: document.getElementById('usuario_codigo').value,
                categoria_codigo: document.getElementById('categoria_codigo').value,
                modelo_contrato_codigo: document.getElementById('modelo_contrato_codigo').value
            };

            try {

                const response = await axios.post('/api/processos', dadosProcesso);
                alert(response.data.message);
                formProcesso.reset();
                window.location.href = 'processos.html';
            } catch (error) {
                const msgErro = error.response ? error.response.data.message : 'Falha ao criar processo.';
                alert(msgErro);
                console.error('Erro ao criar processo:', error);
            } finally {

                submitButton.disabled = false;
                submitButton.textContent = 'Salvar Processo';
            }
        });
    }
});

/**
 * Função genérica e reutilizável para popular um <select> a partir de uma API.
 * @param {string} elementId - O ID do elemento <select> no HTML.
 * @param {string} apiUrl - A URL da API para buscar os dados.
 * @param {string} valueField - O nome da propriedade para usar no 'value' do <option>.
 * @param {string} textField - O nome da propriedade para usar como texto visível do <option>.
 * @param {string} selectName - O nome do tipo de item (ex: "cliente", "advogado").
 */
async function popularSelect(elementId, apiUrl, valueField, textField, selectName) {
    const selectElement = document.getElementById(elementId);
    if (!selectElement) {
        console.error(`Elemento select com id "${elementId}" não foi encontrado.`);
        return;
    }

    try {
        const response = await axios.get(apiUrl);
        const items = response.data;

        selectElement.innerHTML = `<option value="">Selecione um ${selectName}</option>`;

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];

            option.textContent = item[textField] || `Item #${item[valueField]}`;
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error(`Erro ao carregar ${selectName}s:`, error);
        selectElement.innerHTML = `<option value="">Erro ao carregar</option>`;
    }
}
