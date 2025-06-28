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
        pet: "/cadastro-pet",
        empresa: "/cadastro-empresa",
        ong: "/cadastro-ong",
        petshop: "/cadastro-petshop",
        veterinario: "/cadastro-veterinario",
        clinica: "/cadastro-clinica"
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
    const selectEspecie = document.getElementById("especie");
    const selectRaca = document.getElementById("pet-raca");
    if (!selectEspecie || !selectRaca) return;
  
    selectEspecie.addEventListener("change", async function() {
      const idEspecie = this.value;
      
      // Limpa opções de raça e coloca placeholder
      selectRaca.innerHTML = '<option value="">Escolha a raça</option>';
  
      if (!idEspecie) return; // se não escolheu espécie, não faz nada
  
      try {
        // Faz a requisição para buscar as raças do backend
        const response = await fetch(`/api/racas/${idEspecie}`);
        if (!response.ok) throw new Error("Erro ao carregar raças");
  
        const racas = await response.json();
  
        racas.forEach(raca => {
          const option = document.createElement("option");
          option.value = raca.id_raca;
          option.textContent = raca.nome_raca;
          selectRaca.appendChild(option);
        });
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar raças. Tente novamente.");
      }
    });
  
    // Se já tiver espécie selecionada (editar), carrega as raças logo de cara
    if (selectEspecie.value) {
      selectEspecie.dispatchEvent(new Event('change'));
    }
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
    window.location.href = "home.html";
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
        // Validação em tempo real
        document.getElementById("pet-name")?.addEventListener("input", validatePetForm);
        document.getElementById("pet-username")?.addEventListener("input", validatePetForm);
        document.getElementById("pet-raca")?.addEventListener("change", validatePetForm);
    }

    // Botões de salvar genéricos
    document.querySelectorAll('#save-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Dados salvos com sucesso!');
        });
    });
}