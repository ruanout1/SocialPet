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
            return redirect(url_for("routes.home"))
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
