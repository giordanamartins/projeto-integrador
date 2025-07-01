document.addEventListener('DOMContentLoaded', () => {
    dataLoad();
});


const dataLoad = async () => {
    const totRec = document.getElementById('totRec');
    const qtdRec = document.getElementById('qtdRec');
    const totPag = document.getElementById('totPag');
    const qtdPag = document.getElementById('qtdPag');

    if (!totRec) {
        console.error('Erro: Elemento com id "totRec" não foi encontrado no HTML.');
        return;
    }

    if (!totPag) {
        console.error('Erro: Elemento com id "totRec" não foi encontrado no HTML.');
        return;
    }

    const responser = await axios.get('/api/contasReceber/hoje');
    const contaRec = responser.data;
    const totalHJr = contaRec.reduce((somar, contar) => somar + contar.totalr, 0);
    
    console.log(totalHJr);
    
    if (contaRec.length == 0) {
        qtdRec.innerHTML = `0`;
        totRec.innerHTML = `00,00`;
    } else{
        qtdRec.innerHTML = `${contaRec.length}`;
        totRec.innerHTML = `${totalHJr}`;
    }


    const responsep = await axios.get('/api/contasPagar/hoje');
    const contaPag = responsep.data;
    const totalHJp = contaPag.reduce((somap, contap) => somap + contap.totalp, 0);
    console.log(contaPag);
    
    if (contaPag.length == 0) {
        qtdPag.innerHTML = `0`;
        totPag.innerHTML = `00,00`;
    } else{
        qtdPag.innerHTML = `${contaPag.length}`;
        totPag.innerHTML = `${totalHJp}`;
    }
}