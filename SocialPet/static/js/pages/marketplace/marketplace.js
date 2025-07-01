//Itens do catálogo
// Espera o DOM estar completamente carregado para executar o código
document.addEventListener('DOMContentLoaded', function() {

    // Itens do catálogo com os caminhos das imagens corrigidos
    // FIX 2: Adicionada a barra "/" no início do caminho da imagem
    const items = [
        {
            id: 0,
            nome: 'Ração Pedigreee para filhote 20.1kg',
            img: '/static/images/pages/marketplace/racas-pequenas-carne-pedigree-pacote-10kg.webp',
            preco: 20.97,
            quantidade: 0,

        },
        {
            id: 1,
            nome: 'Ração de gato Whiskas 10kg',
            img: '/static/images/pages/marketplace/racao gato 10kg.jpg',
            preco: 25.78,
            quantidade: 0,
            
        },
        {
            id: 2,
            nome: 'Ração para Hamters MegaZoo',
            img: '/static/images/pages/marketplace/Racao_para_hamster.webp',
            preco: 87.99,
            quantidade: 0,
            
        },
        {
            id: 3,
            nome: 'Ração de cão VittaMax 20kg',
            img: '/static/images/pages/marketplace/Racao-Caes-Adultos-VITTAMAX-Gold-Pacote-20kg-.webp',
            preco: 50.99,
            quantidade: 0,

        },
        {
            id: 4,
            nome: 'Ração de gato TopiGato sabor frango 10kg',
            img: '/static/images/pages/marketplace/Raçao_para_gato_filhote.webp',
            preco: 20.99,
            quantidade: 0,
            
        },
        {
            id: 5,
            nome: 'Ração de gato GranPlus premium',
            img: '/static/images/pages/marketplace/racao-gato-premium-10kg.jpg',
            preco: 87.99,
            quantidade: 0,
            
        },
    ];

    const containerProdutos = document.getElementById('produtos');
    const containerCarrinho = document.getElementById('carrinho');

    // Função para renderizar os produtos na vitrine
    function inicializarLoja() {
        // Limpa a vitrine antes de adicionar novos itens para evitar duplicação
        containerProdutos.innerHTML = ""; 
        items.forEach((val) => {
            // Usando forEach que é mais apropriado aqui do que map
            containerProdutos.innerHTML += `
            <div class="produto-single">
                <p class="produto-nome">${val.nome}</p>
                <img class="produto-img" src="${val.img}" alt="Imagem de ${val.nome}" />
                <div class="produto-footer">
                    <p class="produto-preco">R$ ${val.preco.toFixed(2)}</p>
                    <a class="carrinho-btn" data-key="${val.id}" href="#">Adicionar ao carrinho!</a>
                </div>
            </div>
            `;
        });
    }

    // Função para atualizar o visual do carrinho
    function atualizarCarrinho() {
        containerCarrinho.innerHTML = "";
        let total = 0;
        items.forEach((val) => {
            if (val.quantidade > 0) {
                containerCarrinho.innerHTML += `
                <div class="carrinho-item">
                    <span>${val.nome} | Qtd: ${val.quantidade}</span>
                </div>
                `;
                total += val.quantidade * val.preco;
            }
        });
        // Adiciona o total no final
        if(total > 0){
             containerCarrinho.innerHTML += `<hr><p><b>Total: R$ ${total.toFixed(2)}</b></p>`;
        } else {
             containerCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
        }
    }

    // FIX 1: Usando Delegação de Eventos
    // Adiciona um único "escutador" de eventos no container dos produtos
    containerProdutos.addEventListener('click', function(event) {
        // Previne o comportamento padrão do link (de navegar para "#")
        event.preventDefault();

        // Verifica se o elemento clicado realmente é um botão de adicionar ao carrinho
        if (event.target && event.target.classList.contains('carrinho-btn')) {
            // Pega o ID do produto a partir do atributo data-key
            const key = event.target.getAttribute('data-key');
            items[key].quantidade++;
            atualizarCarrinho();
            console.log(`Adicionado produto ID: ${key}, Nome: ${items[key].nome}`);
        }
    });

    // Código do menu lateral (mantido como estava)
    const menuToggle = document.getElementById('menuToggle');
    const sidebarLeft = document.getElementById('menu');

    menuToggle.addEventListener('click', () => {
        sidebarLeft.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Finalmente, chama as funções para iniciar a página
    inicializarLoja();
    atualizarCarrinho(); // Para mostrar a mensagem de carrinho vazio
});