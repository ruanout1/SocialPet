document.addEventListener("DOMContentLoaded", function() {
    console.log("Script carregado!");

    // Verifica perfil selecionado
    const perfilSelecionado = localStorage.getItem("userProfile");
    if (perfilSelecionado) {
        console.log("Perfil já escolhido:", perfilSelecionado);
    }

    // Inicializa todos os componentes
    inicializarDropdowns();
    inicializarCadastroPet(); // Agora com a lógica de raças
    vincularEventosGerais();
});

// ==============================================
// 1. FUNÇÕES EXISTENTES (PERFIS, DROPDOWNS)
// ==============================================
function escolherPerfil(tipoPerfil) {
    console.log("Perfil escolhido:", tipoPerfil);
    localStorage.setItem("userProfile", tipoPerfil);

    const paginas = {
        pet: "cadastro-pet.html",
        empresa: "cadastro-empresa.html",
        ong: "cadastro-ong.html",
        petshop: "cadastro-petshop.html",
        veterinario: "cadastro-veterinario.html",
        clinica: "cadastro-clinica.html"
    };

    if (paginas[tipoPerfil]) {
        window.location.href = paginas[tipoPerfil];
    } else {
        alert("Tipo de perfil desconhecido. Por favor, selecione um perfil válido.");
    }
}

function inicializarDropdowns() {
    document.querySelectorAll('.dropdown-checklist').forEach(dropdown => {
        dropdown.querySelector('.dropdown-text').replaceWith(dropdown.querySelector('.dropdown-text').cloneNode(true));
        
        const dropdownText = dropdown.querySelector('.dropdown-text');
        
        if (!dropdownText.querySelector('.dropdown-arrow')) {
            const arrow = document.createElement('span');
            arrow.className = 'dropdown-arrow';
            arrow.textContent = '▼';
            dropdownText.appendChild(arrow);
        }
        
        dropdownText.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDropdown(dropdown);
        });
        
        const options = dropdown.querySelector('.dropdown-options');
        if (options) {
            options.addEventListener('click', function(e) {
                e.stopPropagation();
                updateSelectedText(dropdown);
            });
        }
    });

    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-checklist').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    });
}

function toggleDropdown(dropdown) {
    document.querySelectorAll('.dropdown-checklist').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
    });
    dropdown.classList.toggle('open');
}

function updateSelectedText(dropdown) {
    const options = dropdown.querySelector('.dropdown-options');
    const textElement = dropdown.querySelector('.dropdown-text');
    const checkboxes = options.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkboxes.length > 0) {
        textElement.firstChild.textContent = Array.from(checkboxes).map(cb => cb.value).join(', ');
    } else {
        textElement.firstChild.textContent = 'Selecione as opções';
    }
}

// ==============================================
// 2. FUNÇÕES PARA CADASTRO DE PET 
// ==============================================
function inicializarCadastroPet() {
    // Só executa se estiver na página de cadastro de pet
    if (!document.getElementById("pet-raca")) return;

    const speciesRadios = document.querySelectorAll("input[name='especie']");
    const breedSelect = document.getElementById("pet-raca");

    // Raças populares (cães e gatos)
    const breedOptions = {
        cachorro: [
            "Labrador Retriever", "Bulldog Francês", "Golden Retriever", "Poodle", "Beagle",
            "Pastor Alemão", "Pug", "Rottweiler", "Dachshund", "Outro"
        ],
        gato: [
            "Persa", "Siamês", "Maine Coon", "Bengal", "Sphynx",
            "British Shorthair", "Ragdoll", "Siberiano", "Outro"
        ],
        outra: ["Coelho", "Hamster", "Pássaro", "Outro"]
    };

    function updateBreedOptions(selectedSpecies) {
        breedSelect.innerHTML = '';
        const placeholder = document.createElement("option");
        placeholder.textContent = "Escolha a raça ▼";
        placeholder.disabled = true;
        placeholder.selected = true;
        breedSelect.appendChild(placeholder);

        const speciesKey = selectedSpecies.toLowerCase();
        if (breedOptions[speciesKey]) {
            breedOptions[speciesKey].forEach(breed => {
                const option = document.createElement("option");
                option.value = breed.replace(/\s+/g, "-").toLowerCase();
                option.textContent = breed;
                breedSelect.appendChild(option);
            });
        }
    }

    speciesRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            updateBreedOptions(this.value);
            validatePetForm();
        });
    });

    // Inicializa se já houver uma espécie selecionada
    const selectedSpecies = document.querySelector("input[name='especie']:checked")?.value;
    if (selectedSpecies) updateBreedOptions(selectedSpecies);
}

function cadastrarPet(event) {
    event.preventDefault();

    const nomePet = document.getElementById("pet-name").value;
    const usernamePet = document.getElementById("pet-username").value;
    const especie = document.querySelector("input[name='especie']:checked")?.value;
    const raca = document.getElementById("pet-raca").value;

    if (!nomePet || !usernamePet || !especie || !raca) {
        alert("Preencha todos os campos!");
        return;
    }

    localStorage.setItem("petData", JSON.stringify({
        nome: nomePet,
        username: usernamePet,
        especie: especie,
        raca: raca
    }));

    alert("Pet cadastrado com sucesso!");
    window.location.href = "profile.html"; 
}

function validatePetForm() {
    const nomePet = document.getElementById("pet-name")?.value;
    const usernamePet = document.getElementById("pet-username")?.value;
    const especie = document.querySelector("input[name='especie']:checked");
    const raca = document.getElementById("pet-raca")?.value;
    const saveBtn = document.getElementById("save-btn");

    if (saveBtn) {
        saveBtn.disabled = !(nomePet && usernamePet && especie && raca);
    }
}

// ==============================================
// 3. VINCULAÇÃO GERAL DE EVENTOS 
// ==============================================
function vincularEventosGerais() {
    // Formulário de pet
    const petForm = document.getElementById("cadastroPetForm");
    if (petForm) {
        petForm.addEventListener("submit", cadastrarPet);
        document.getElementById("pet-name")?.addEventListener("input", validatePetForm);
        document.getElementById("pet-username")?.addEventListener("input", validatePetForm);
        document.getElementById("pet-raca")?.addEventListener("change", validatePetForm);
    }

    // Botões de salvar genéricos (ONG, Petshop, etc.)
    document.querySelectorAll('#save-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Dados salvos com sucesso!');
            window.location.href = "profile.html";  // Adicionado redirecionamento
        });
    });
}