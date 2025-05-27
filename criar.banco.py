# from SocialPet import database
#from . import app

#with app.app_context():
 #   database.create_all()

# teste_insercao.py

from SocialPet import create_app, db
from SocialPet.models import Usuario
from datetime import datetime

app = create_app()

with app.app_context():
    print(">> Criando tabelas (se não existirem)...")
    db.create_all()

    print(">> Inserindo usuário de teste...")

    usuario_teste = Usuario(
        nome_usuario="Teste Usuário",
        email_usuario="teste@example.com",
        senha_hash="senha_fake_hash",
        data_cadastro=datetime.utcnow()
    )

    db.session.add(usuario_teste)

    try:
        db.session.commit()
        print("✅ Usuário inserido com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao inserir usuário: {e}")
        db.session.rollback()
