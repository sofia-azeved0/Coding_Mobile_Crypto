const cryptoList = document.getElementById('crypto-list');
const btnAtualizar = document.querySelector('button');

const moedas = [
    { id: 'BTC', nome: 'Bitcoin' },
    { id: 'ETH', nome: 'Ethereum' },
    { id: 'SOL', nome: 'Solana' },
    { id: 'ADA', nome: 'Cardano' }
];

async function buscarPrecos(vibrar = false) {
    // Hardware: Só vibra se o usuário clicar (vibrar = true)
    if (vibrar && navigator.vibrate) {
        navigator.vibrate(50);
    }

    cryptoList.innerHTML = '<div class="loader">Sincronizando...</div>';
    
    try {
        const promessas = moedas.map(async (moeda) => {
            const res = await fetch(`https://www.mercadobitcoin.net/api/${moeda.id}/ticker/`);
            const data = await res.json();
            return {
                nome: moeda.nome,
                simbolo: moeda.id,
                preco: parseFloat(data.ticker.last)
            };
        });

        const resultados = await Promise.all(promessas);
        cryptoList.innerHTML = '';

        resultados.forEach(coin => {
            const card = `
                <div class="coin-card">
                    <div class="coin-info">
                        <p class="coin-name">${coin.nome}</p>
                        <p class="coin-symbol">${coin.simbolo}</p>
                    </div>
                    <div class="coin-price">
                        R$ ${coin.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            `;
            cryptoList.innerHTML += card;
        });
    } catch (error) {
        cryptoList.innerHTML = '<p style="color: #ff4d4d">Erro ao carregar dados.</p>';
    }
}

// Substitua o final do seu arquivo por isso:

/* Registro do Service Worker */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log(err));
}

/* FUNÇÃO DE TESTE FORÇADO */
btnAtualizar.addEventListener('click', function() {
    // Tenta vibrar ANTES de qualquer busca (mais chance de o navegador aceitar)
    try {
        if (navigator.vibrate) {
            // Padrão de vibração: vibra 100ms, para 50ms, vibra 100ms
            navigator.vibrate([100, 50, 100]); 
            console.log("Comando de vibração enviado!");
        }
    } catch (e) {
        console.log("Erro ao vibrar:", e);
    }
    
    // Agora busca os preços
    buscarPrecos(false); 
});