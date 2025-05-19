# criar formularios do site
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError
from SocialPet.models import Usuario


class FormLogin(FlaskForm):
    email = StringField("E-mail", validators=[DataRequired(), Email()])
    senha = PasswordField("Senha", validators=[DataRequired()])
    botao_confirma = SubmitField("Fazer Login")


class FormCadastro(FlaskForm):
    email = StringField("E-mail", validators=[DataRequired(), Email()])
    username = StringField("Nome do usuario", validators=[DataRequired()])
    senha = PasswordField("Senha", validators=[DataRequired(), Length(min=6, max=20)])
    confirmacao_senha = PasswordField("Confirmacao de senha", validators=[DataRequired(), EqualTo("senha")])
    botao_confirma = SubmitField("Cadastrar")

    def validate_email(self, email):
        usuario = Usuario.query.filter_by(email=email.data).first()
        if usuario:
            raise ValidationError("E-mail ja cadastrado, faca login para continuar")

