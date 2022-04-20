from flask_login import UserMixin
from sqlalchemy import true
from . import db


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))

class Albero(db.Model):
    __tablename__ = 'features'
    ID = db.Column(db.Integer, primary_key=True)
    CODSITO_AL = db.Column(db.String(100))
    QUARTIERE = db.Column(db.Integer)
    SPECIE = db.Column(db.String(100))
    NOME_COMUN = db.Column(db.String(100))
    CIRCONF_CM = db.Column(db.Float)
    ADOTTATO = db.Column(db.Boolean)
    NUOVO_NOME = db.Column(db.String(100))
