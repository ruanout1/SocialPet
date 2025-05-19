# criar a estrutura do banco de dados

from SocialPet import database, login_manager
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import DateTime


@login_manager.user_loader
def load_usuario(id_usuario):
    return Usuario.query.get(int(id_usuario))

class Usuario(database.Model, UserMixin):
    id = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String, nullable=False)
    email = database.Column(database.String(255), nullable=False, unique=True)
    senha_hash = database.Column(database.String(255), nullable=False)
    data_cadastro = database.Column(database.DateTime, default=datetime.utcnow)


 