document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.right-sign');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const erroEmail = document.getElementById('erro-email');
    const erroSenha = document.getElementById('erro-senha');

    form.addEventListener('submit', function (e) {
        let valido = true;

        // Validação do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            erroEmail.textContent = 'E-mail inválido.';
            erroEmail.style.display = 'block';
            valido = false;
        } else {
            erroEmail.style.display = 'none';
        }

        // Validação da senha
        const senhaValor = senha.value;
        if (senhaValor.length < 6 || !/[0-9]/.test(senhaValor) || !/[a-zA-Z]/.test(senhaValor)) {
            erroSenha.textContent = 'A senha deve ter ao menos 6 caracteres, com letras e números.';
            erroSenha.style.display = 'block';
            valido = false;
        } else {
            erroSenha.style.display = 'none';
        }

        if (!valido) {
            e.preventDefault(); // Impede envio do formulário
        }
    });
});