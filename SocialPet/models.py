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

    # Relacionamento com Post
    posts = db.relationship('Post', backref='usuario', lazy=True)


    @property
    def id(self):
        return self.id_usuario
        
    
class Post(db.Model):
    __tablename__ = "post" 
    id_post = db.Column(db.Integer, primary_key=True)
    legenda_post = db.Column(db.String(255), nullable=True)
    img_post = db.Column(db.String(255))  # caminho no static
    hora_postagem = db.Column(db.DateTime, default=datetime.now)
    
     # Chave estrangeira
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)

class Pet(db.Model):
    __tablename__ = 'pet'

    id_pet = db.Column(db.Integer, primary_key=True)
    nome_pet = db.Column(db.String(90), nullable=False)
    username_pet = db.Column(db.String(100), unique=True)
    data_nasc = db.Column(db.Date, nullable=False)
    foto_pet = db.Column(db.String(255), nullable=True)

    # Chaves estrangeiras
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    id_raca = db.Column(db.Integer, db.ForeignKey('raca.id_raca'), nullable=False)
    id_especie = db.Column(db.Integer, db.ForeignKey('especie.id_especie'), nullable=False)    

class Raca(db.Model):
    __tablename__ = 'raca'

    id_raca = db.Column(db.Integer, primary_key=True)
    nome_raca = db.Column(db.String(50), nullable=False)
    id_especie = db.Column(db.Integer, db.ForeignKey('especie.id_especie'), nullable=False)

    # Relacionamento com Pet
    pets = db.relationship('Pet', backref='raca', lazy=True)

class Especie(db.Model):
    __tablename__ = 'especie'

    id_especie = db.Column(db.Integer, primary_key=True)
    nome_especie = db.Column(db.String(50), nullable=False, unique=True)

    # Relacionamento com Pet
    pets = db.relationship('Pet', backref='especie', lazy=True)

   
    
