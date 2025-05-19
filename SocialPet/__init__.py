# -*- coding: utf-8 -*-

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
import os
from SocialPet.routes import auth_bp as routes_bp

# Instanciando os objetos fora da funcao para uso global
database = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = "routes.login"

def create_app():
    app = Flask(__name__)
    # Configuracao da conexao com MySQL usando PyMySQL
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev_key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "mysql+pymysql://usuario:senha@localhost/socialpet")
     # Boa pratica para evitar warning
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False 

     # Inicializa com o app
    database.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)


    
      # Importa as todas
    
    app.register_blueprint(routes_bp)  
    
    with app.app_context():
        database.create_all()
    return app    


