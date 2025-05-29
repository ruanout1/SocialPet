# criar a estrutura do banco de dados

from flask_login import LoginManager
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import DateTime
from SocialPet.ext import db




class Usuario(db.Model, UserMixin):
    __tablename__ = "usuario" 

    id_usuario = db.Column(db.Integer, primary_key=True)
    nome_usuario = db.Column(db.String(90), nullable=False)
    email_usuario = db.Column(db.String(100), nullable=False, unique=True)
    senha_hash = db.Column(db.String(255), nullable=False)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)


    @property
    def id(self):
        return self.id_usuario