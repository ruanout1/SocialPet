# -*- coding: utf-8 -*-

from flask import Flask
import os

from .ext import db
from flask_bcrypt import Bcrypt 
from flask_login import LoginManager
from .routes import auth_bp 
from .models import Usuario
from dotenv import load_dotenv

load_dotenv()


# Instanciando os objetos fora da funcao para uso global

login_manager = LoginManager()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)
    # Configuracao da conexao com MySQL usando PyMySQL
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev_key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "mysql+pymysql://root:12345678@localhost/SocialPet")
     # Boa pratica para evitar warning
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    

    # Inicializa com o app
    bcrypt.init_app(app)
    login_manager.init_app(app)
    db.init_app(app)

    

    app.register_blueprint(auth_bp)
    

    return app   



@login_manager.user_loader
def load_usuario(id_usuario):
    return Usuario.query.get(int(id_usuario))

