# criar as rotas do site
from flask import render_template, url_for, flash, request, redirect, Blueprint, current_app, abort, jsonify

from flask_login import login_required, login_user, logout_user, current_user
from SocialPet.forms import FormLogin, FormCadastro
from SocialPet.models import Usuario, Post, Raca, Especie, Pet
from SocialPet.ext import db, bcrypt
from werkzeug.utils import secure_filename
from datetime import datetime
import os



auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    form = FormLogin()
    if form.validate_on_submit():
        usuario = Usuario.query.filter_by(email_usuario=form.email.data).first()
        if usuario and bcrypt.check_password_hash(usuario.senha_hash, form.senha.data):
            login_user(usuario)
            return redirect(url_for("auth.subcadastro"))
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
        return redirect(url_for("auth.login"))
    return render_template("cadastro.html", form=form)

main_bp = Blueprint('main', __name__)

@main_bp.route('/home')
@login_required
def home():
    posts_usuario = Post.query.filter_by(id_usuario=current_user.id_usuario).order_by(Post.hora_postagem.desc()).all()
    return render_template("home.html", posts_usuario=posts_usuario)

# Nova rota para envio de posts (criar_post)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'webm'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@main_bp.route("/criar_post", methods=["POST"], endpoint='criar_post')
@login_required
def criar_post():
    legenda = request.form.get("legenda")
    arquivo = request.files.get("imagem")
    print("Legenda recebida:", legenda)
    print("Arquivo recebido:", arquivo.filename if arquivo else "Nenhum arquivo")

    if not legenda and not arquivo:
        flash("Você precisa adicionar uma legenda ou uma mídia.", "warning")
        return redirect(url_for("main.home"))

    filename = None
    if arquivo and allowed_file(arquivo.filename):
        filename = secure_filename(arquivo.filename)
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = f"{timestamp}_{filename}"

        pasta_uploads = os.path.join(current_app.root_path, "static/uploads/pets")
        os.makedirs(pasta_uploads, exist_ok=True)
        caminho = os.path.join(pasta_uploads, filename)
        arquivo.save(caminho)
    elif arquivo and not allowed_file(arquivo.filename):
        flash("Tipo de arquivo não suportado.", "danger")
        return redirect(url_for("main.home"))
     # Criar o post
    novo_post = Post(
        legenda_post=legenda,
        img_post=filename,
        hora_postagem=datetime.now(),
        id_usuario=current_user.id_usuario
    )
    print("Novo post pronto para salvar:")
    print("Legenda:", novo_post.legenda_post)
    print("Imagem:", novo_post.img_post)
    print("Hora:", novo_post.hora_postagem)
    print("ID usuário:", novo_post.id_usuario)
    
    db.session.add(novo_post)
    db.session.commit()
    flash("Post enviado com sucesso!", "success")
    return redirect(url_for("main.home"))

@auth_bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("auth.login"))

@auth_bp.route("/subcadastro", methods=["GET", "POST"])
@login_required
def subcadastro():
    # Aqui você pode renderizar o template do formulário do pet ou outra coisa
    return render_template("subcadastro.html")

@auth_bp.route("/cadastro-pet", methods=["GET", "POST"])
@login_required
def cadastro_pet():
    if request.method == "POST":
        nome_pet = request.form.get("pet_name")
        username_pet = request.form.get("pet_username")  # Você pode salvar em outra tabela se quiser
        especie_id = request.form.get("especie")
        raca_id = request.form.get("pet_raca")
        data_nasc_str = request.form.get("data_nasc")
        foto = request.files.get("foto_pet")

        # Validar campos obrigatórios
        if not nome_pet or not especie_id or not raca_id or not data_nasc_str:
            flash("Por favor, preencha todos os campos obrigatórios.", "warning")
            return redirect(url_for("auth.cadastro_pet"))

         # Verificar se espécie existe pelo ID
        especie = Especie.query.get(especie_id)
        if not especie:
            flash("Espécie inválida.", "danger")
            return redirect(url_for("auth.cadastro_pet"))

        # Processar a data
        try:
            data_nasc = datetime.strptime(data_nasc_str, "%Y-%m-%d")
        except ValueError:
            flash("Data de nascimento inválida.", "danger")
            return redirect(url_for("auth.cadastro_pet"))

        # Processar a foto (se houver)
        nome_arquivo = None
        if foto and foto.filename:
            if allowed_file(foto.filename):
                filename = secure_filename(foto.filename)
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                nome_arquivo = f"{timestamp}_{filename}"
                pasta = os.path.join(current_app.root_path, "static/uploads/pets")
                os.makedirs(pasta, exist_ok=True)
                caminho = os.path.join(pasta, nome_arquivo)
                foto.save(caminho)
            else:
                flash("Tipo de arquivo de imagem inválido.", "danger")
                return redirect(url_for("auth.cadastro_pet"))

        # Criar o novo pet
        novo_pet = Pet(
            nome_pet=nome_pet,
            username_pet=username_pet,
            data_nasc=data_nasc,
            foto_pet=nome_arquivo,
            id_usuario=current_user.id_usuario,
            id_raca=int(raca_id),
            id_especie=int(especie_id)
        )
        db.session.add(novo_pet)
        db.session.commit()
        flash("Pet cadastrado com sucesso!", "success")
        return redirect(url_for("main.home"))

    # GET
    racas = Raca.query.all()
    especies = Especie.query.all()
    return render_template("cadastro-pet.html", racas=racas,especies=especies)

@auth_bp.route('/api/racas/<int:id_especie>')
@login_required
def racas_por_especie(id_especie):
    racas = Raca.query.filter_by(id_especie=id_especie).order_by(Raca.nome_raca).all()
    resultado = [{'id_raca': r.id_raca, 'nome_raca': r.nome_raca} for r in racas]
    return jsonify(resultado)



@main_bp.route("/perfil")
@login_required
def perfil():
    return render_template("profile.html")

@main_bp.route("/ongs")
@login_required
def ongs():
    return render_template("listaONGs.html")

@main_bp.route("/market")
@login_required
def market():
    return render_template("market.html")


@main_bp.route("/cadastro-ong")
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