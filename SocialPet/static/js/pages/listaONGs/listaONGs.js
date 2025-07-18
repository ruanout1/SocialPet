// Seleciona elementos do DOM
const menuToggle = document.getElementById('menuToggle');
const columnLeft = document.getElementById('menu');
const carouselInner = document.getElementById('ongWrapper');
const ongList = document.getElementById('ongList');
const ongs = [
    {
        nome: "Vida Animal",
        logo: "./static/images/pages/listaONGs/vida-animal.jpeg",
        missao: "Oferecendo suporte a animais em situação de vulnerabilidade e promovendo adoções."
    },
    {
        nome: "Guardião da Fauna",
        logo: "./static/images/pages/listaONGs/guardiao-fauna.jpeg",
        missao: "Protegendo a vida selvagem e preservando o meio ambiente para gerações futuras."
    },
    {
        nome: "Patinhas Unidas",
        logo: "./static/images/pages/listaONGs/patinhas-unidas.jpeg",
        missao: "Resgatando animais abandonados e fornecendo cuidados veterinários essenciais."
    },
    {
        nome: "Coração Selvagem",
        logo: "./static/images/pages/listaONGs/coracao-selvagem.jpeg",
        missao: "Trabalhando na preservação de espécies ameaçadas em áreas florestais."
    },
    {
        nome: "Amigos de Penas",
        logo: "./static/images/pages/listaONGs/amigos-penas.jpeg",
        missao: "Apoiando aves resgatadas e promovendo educação ambiental."
    },
    {
        nome: "SOS Bichos",
        logo: "./static/images/pages/listaONGs/sos-bichos.jpeg",
        missao: "Proporcionando ajuda emergencial para animais feridos e abandonados."
    },
    {
        nome: "Casa dos Peludos",
        logo: "./static/images/pages/listaONGs/casa-peludos.jpeg",
        missao: "Oferecendo abrigo temporário e lares adotivos para cães e gatos resgatados."
    },
    {
        nome: "Abrace um Amigo",
        logo: "./static/images/pages/listaONGs/abrace-amigo.jpeg",
        missao: "Promovendo a adoção responsável de animais e educação sobre bem-estar animal."
    },
    {
        nome: "Fauna Livre",
        logo: "./static/images/pages/listaONGs/fauna-livre.jpeg",
        missao: "Reabilitando animais silvestres e devolvendo-os ao habitat natural."
    },
    {
        nome: "Peludos do Amanhã",
        logo: "./static/images/pages/listaONGs/peludos-amanha.jpeg",
        missao: "Construindo um futuro melhor para animais resgatados e negligenciados."
    },
    {
        nome: "Patas e Focinhos",
        logo: "./static/images/pages/listaONGs/patas-focinhos.jpeg",
        missao: "Cuidando de animais com amor e ajudando na reintegração a novos lares."
    },
    {
        nome: "Esperança Animal",
        logo: "./static/images/pages/listaONGs/esperanca-animal.jpeg",
        missao: "Dedicando esforços para salvar vidas e conscientizar sobre o cuidado animal."
    }
];

// Adiciona evento de clique no botão hamburguer
menuToggle.addEventListener('click', () => {
    columnLeft.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

const ongsPrincipais = [ongs[1], ongs[0], ongs[2], ongs[3], ongs[8], ongs[10]];

// Função para renderizar o carrossel de ONGs principais
function renderCarousel() {
    const carouselList = document.querySelector('.wrapper-list');
    carouselList.innerHTML = ongsPrincipais.map(ong => `
        <div class="swiper-slide">
            <div class="wrapper-item">
                <img src="${ong.logo}" alt="${ong.nome}">
                <p>${ong.nome}</p>
            </div>
        </div>
    `).join('');
}

// Função para renderizar a lista completa de ONGs
function renderOngList() {
    ongList.innerHTML = ongs.map(ong => `
        <li class="ong-item">
            <div class="ong-info">
                <img src="${ong.logo}" alt="">
                <h3>${ong.nome}</h3>
            </div>
            <div class="ong-mission">
                <p>${ong.missao}</p>
            </div>
        </li>
    `).join('');
}

// Renderiza o carrossel e a lista de ONGs
renderCarousel();
renderOngList();

// Inicializa o carrossel com Swiper
new Swiper('.ong-wrapper', {
    loop: true,
    centeredSlides : true,
    slidesPerView: 'auto',
    spaceBetween: 30,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        slideChangeTransitionEnd: function () {
            this.update();
        },
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});