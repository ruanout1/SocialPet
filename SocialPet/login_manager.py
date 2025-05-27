from flask_login import LoginManager

from flask import g

def get_login_manager():
    if 'login_manager' not in g:
        g.login_manager = LoginManager()

    return g.login_manager

def init_app(app):
    with app.app_context():
        login_manager = get_login_manager()
        login_manager.login_view = "routes.login"
        login_manager.init_app(app)