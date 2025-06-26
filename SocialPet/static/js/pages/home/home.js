// Seleciona elementos do DOM
const form = document.getElementById('formPost');
const textarea = document.getElementById('textarea');
const fileInput = document.getElementById('uploadMediaInput');
const btnUpload = document.getElementById('btnUploadImage');
const ulPost = document.querySelector('section.feed');
const previewContainer = document.getElementById('selectedImagePreview');
let selectedMedia = [];

// Função para adicionar o evento de curtida nos posts
const addLikePost = () => {
    ulPost.addEventListener('click', function (event) {
        const likeButton = event.target.closest('.like');
        if (likeButton) {
            const likeIcon = likeButton.querySelector('.like-icon');
            likeIcon.classList.toggle('liked');
            const likeCountSpan = likeButton.querySelector('span');
            if (likeCountSpan) {
                let likesCount = parseInt(likeCountSpan.textContent.replace(/[^\d]/g, '')) || 0;
                likesCount = likeIcon.classList.contains('liked') ? likesCount + 1 : likesCount - 1;
                likeCountSpan.textContent = `${likesCount}`;
            }
        }
    });
};

// Nome do usuario dinamico

const username = document.body.dataset.username || 'usuario';


// Função para validar o campo de texto
const formValidate = (value) => value && value.trim().length >= 3;

// Função para obter a hora atual
const getTime = () => {
    const time = new Date();
    return `${time.getHours()}h ${time.getMinutes()}min`;
};

// Função para gerar números aleatórios em um intervalo
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Função para gerenciar os uploads de mídia (imagens, GIFs, vídeos)
const handleFileSelect = () => {
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        selectedMedia = [];
        previewContainer.innerHTML = "";

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                selectedMedia.push({ type: file.type, src: e.target.result });
                let mediaElement;

                if (file.type.startsWith('image/')) {
                    mediaElement = document.createElement('img');
                } else if (file.type.startsWith('video/')) {
                    mediaElement = document.createElement('video');
                    mediaElement.controls = true; // Adiciona controles para vídeos
                } else {
                    return; // Ignora tipos não suportados
                }

                mediaElement.src = e.target.result;
                mediaElement.style.maxWidth = "100%";
                mediaElement.style.maxHeight = "300px";
                mediaElement.style.objectFit = "contain";
                mediaElement.style.borderRadius = "8px";
                mediaElement.style.marginTop = "10px";
                previewContainer.appendChild(mediaElement);
            };
            reader.readAsDataURL(file);
        });

        if (files.length > 0) previewContainer.style.display = 'block';
    });
};

// Função para abrir o seletor de arquivos ao clicar no botão de upload
const addUploadButtonHandler = () => {
    btnUpload.addEventListener('click', () => {
        fileInput.click();
    });
};

// Função para gerenciar o envio do formulário
const addSubmitHandler = () => {
    form.addEventListener('submit', (event) => {
        if (!formValidate(textarea.value)) {
            //event.preventDefault(); // só bloqueia se o texto for inválido
            alert('Verifique o campo digitado. O texto deve ter pelo menos 3 caracteres.');
        }
        // Se passar na validação, o form envia normalmente pro backend.
        // Não criamos post localmente aqui, o backend vai recarregar a página com o novo post.
    });
};


// Chama as funções de gerenciamento
handleFileSelect();
addUploadButtonHandler();
addSubmitHandler();
addLikePost();

// Seleciona o botão do menu e o menu lateral
const menuToggle = document.getElementById('menuToggle');
const sidebarLeft = document.getElementById('menu');

// Adiciona evento de clique no botão hamburguer
menuToggle.addEventListener('click', () => {
    sidebarLeft.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
