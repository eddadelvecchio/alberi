import sqlite3
from flask import Flask, render_template, request, jsonify #added to top of file
from flask_cors import CORS
from models import Albero

def connect_to_db():
    conn = sqlite3.connect('Alberi.db')
    return conn
    
def get_trees():
    trees = []
    try:
        conn = connect_to_db()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM features")
        rows = cur.fetchall()

        # convert row objects to dictionary
        for i in rows:
            tree = {}
            tree["ID"] = i["ID"]
            tree["CODSITO_AL"] = i["CODSITO_AL"]
            tree["QUARTIERE"] = i["QUARTIERE"]
            tree["SPECIE"] = i["SPECIE"]
            tree["NOME_COMUN"] = i["NOME_COMUN"]
            tree["CIRCONF_CM"] = i["CIRCONF_CM"]
            tree["ADOTTATO"] = i["ADOTTATO"]
            tree["NUOVO_NOME"] = i["NUOVO_NOME"]
            trees.append(tree)

    except:
        trees = []

    return trees


def get_tree_by_id(id):
    tree = {}
    try:
        conn = connect_to_db()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM features WHERE ID = ?", 
                       (id,))
        row = cur.fetchone()

        # convert row object to dictionary
        tree["ID"] = row["ID"]
        tree["CODSITO_AL"] = row["CODSITO_AL"]
        tree["QUARTIERE"] = row["QUARTIERE"]
        tree["SPECIE"] = row["SPECIE"]
        tree["NOME_COMUN"] = row["NOME_COMUN"]
        tree["CIRCONF_CM"] = row["CIRCONF_CM"]
        tree["ADOTTATO"] = row["ADOTTATO"]
        tree["NUOVO_NOME"] = row["NUOVO_NOME"]
    except:
        tree = {}

    return tree

def update_tree(tree):
    updated_tree = {}
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        cur.execute("UPDATE features SET NUOVO_NOME = ?, ADOTTATO = true WHERE id =?",  
                     (tree["NUOVO NOME"], tree["ID"]))
        conn.commit()
        #return the user
        updated_tree = get_tree_by_id(tree["ID"])

    except:
        conn.rollback()
        updated_tree = {}
    finally:
        conn.close()

    return updated_tree

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/map', methods= ['GET'])
def api_get_trees():
    return jsonify(get_trees())

@app.route('/map/ID', methods= ['GET'])
def api_get_tree(id):
    return jsonify(get_tree_by_id(id))

@app.route('/map/update',  methods = ['PUT'])
def api_update_user(tree):
    tree = request.get_json()
    return jsonify(update_tree(tree))


if __name__ == "__main__":
    #app.debug = True
    #app.run(debug=True)
    app.run() #run app