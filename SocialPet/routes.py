# criar as rotas do site
from flask import render_template, url_for, flash, request, redirect, Blueprint

from flask_login import login_required, login_user, logout_user
from SocialPet.forms import FormLogin, FormCadastro
from SocialPet.models import Usuario
from SocialPet.ext import db, bcrypt



auth_bp = Blueprint("routes", __name__)

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    form = FormLogin()
    if form.validate_on_submit():
        usuario = Usuario.query.filter_by(email_usuario=form.email.data).first()
        if usuario and bcrypt.check_password_hash(usuario.senha_hash, form.senha.data):
            login_user(usuario)
            return redirect(url_for("routes.subcadastro"))
        else:
            flash("Login falhou. Verifique e-mail e senha.", "danger")
    return render_template("index.html", form=form)

@auth_bp.route("/", methods=["GET", "POST"])
def cadastro():
    form = FormCadastro()
    if form.validate_on_submit():
        # Cria usuario com senha hasheada
        senha_hash = bcrypt.generate_password_hash(form.senha.data).decode("utf-8")
        usuario = Usuario(
            nome_usuario=form.username.data,
            email_usuario=form.email.data,
            senha_hash=senha_hash
        )
        
        db.session.add(usuario)
        db.session.commit()
        flash("Conta criada com sucesso! Faça login.", "success")
        return redirect(url_for("routes.login"))
    return render_template("cadastro.html", form=form)



@auth_bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("routes.login"))

@auth_bp.route("/subcadastro", methods=["GET", "POST"])
@login_required
def subcadastro():
    # Aqui você pode renderizar o template do formulário do pet ou outra coisa
    return render_template("subcadastro.html")

@auth_bp.route("/cadastro-pet")
@login_required
def cadastro_pet():
    return render_template("cadastro-pet.html")

@auth_bp.route("/cadastro-ong")
@login_required
def cadastro_ong():
    return render_template("cadastro-ong.html")

@auth_bp.route("/cadastro-empresa")
@login_required
def cadastro_empresa():
    return render_template("cadastro-empresa.html")

@auth_bp.route("/cadastro-petshop")
@login_required
def cadastro_petshop():
    return render_template("cadastro-petshop.html")

@auth_bp.route("/cadastro-veterinario")
@login_required
def cadastro_veterinario():
    return render_template("cadastro-veterinario.html")

@auth_bp.route("/cadastro-clinica")
@login_required
def cadastro_clinica():
    return render_template("cadastro-clinica.html")