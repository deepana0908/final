import os

from flask import Flask
from mongoengine import connect
from flask_cors import CORS

from . import auth
from . import github


def create_app(test_config=None):
    """
    Create and configure Flask application
    """
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY = 'dev'  # should be replaced with a random value when deploying
    )

    if test_config is not None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # connect to database
    connect("gitdeck")

    # allow CORS to this server
    CORS(app)

    # register Blueprints
    app.register_blueprint(auth.bp)
    app.register_blueprint(github.bp)
    
    # return the application instance
    return app