from SocialPet import database
from . import app

with app.app_context():
    database.create_all()