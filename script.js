const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iconPlayOuPause = document.querySelector('.app__card-primary-butto-icon');
const tempoEmTela = document.querySelector('#timer');
//Carregar os aúdios
const musica = new Audio('sons/luna-rise-part-one.mp3');
const tempAtcive = new Audio('sons/play.wav');
const tempPause = new Audio('sons/pause.mp3');
const tempFinish = new Audio('sons/beep.mp3');
musica.loop = true;

let tempoSegundos = 1500;
let intervaloId = null;

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

focoBt.addEventListener('click', () => {
    tempoSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    tempoSegundos = 300;
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click', () => {
    tempoSegundos = 900;
    alterarContexto('descanso-longo')
    longoBt.classList.add('active');
});

function alterarContexto(contexto) {
    exibirTempo()

    botoes.forEach(function (contexto) {
        contexto.classList.remove('active')
    })

    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;

        case 'descanso-curto':
            titulo.innerHTML = ` Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            break;

        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície.<br>
            <strong class="app__title-strong"> Faça uma pausa longa.</strong>`
            break;

        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoSegundos <= 0) {
        tempFinish.play();
        alert('Tempo Finalizado!')
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        return
    }

    tempoSegundos -= 1;
    exibirTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        tempPause.play();
        zerar()
        return
    }

    tempAtcive.play()
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = 'Pausar'
    alterarIconePauseOuComeçar('pause')
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = 'Começar'
    alterarIconePauseOuComeçar('play_arrow')
    intervaloId = null;
}

function alterarIconePauseOuComeçar(status) {
    iconPlayOuPause.setAttribute('src', `imagens/${status}.png`)
}

function exibirTempo() {
    let tempo = new Date(tempoSegundos * 1000)
    let tempoFormatado = tempo.toLocaleTimeString('pt-br', { minute: '2-digit', second: '2-digit' });
    tempoEmTela.innerHTML = `${tempoFormatado}`;
}

exibirTempo()
