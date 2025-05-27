from flask_sqlalchemy import SQLAlchemy

import click
from flask import current_app
from SocialPet.ext import db




def init_db():
    engine = db.get_engine(current_app)

    with current_app.open_resource('schema.sql') as f:
        with engine.connect() as connection:
            for statement in f.read().decode('utf8').split(';'):
                if statement.strip():
                    connection.execute(statement)
      

@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    
    app.cli.add_command(init_db_command)