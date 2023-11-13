from flask import (Blueprint, g, request)
from github import (Github, Auth)
from . import models
from . import util
from . import models


bp = Blueprint('/auth', __name__, url_prefix='/auth')


@bp.route('/access-token/', methods=['GET'])
def access_token():
    auth_code = request.args.get('code')

    if not auth_code:
        # for bad request
        return util.create_error_response("Invalid request: missing 'code' query parameter.")

    try:
        token = util.get_access_token(auth_code)
        # save token to DB
        tokenData = models.Token(code=auth_code, token=util.encrypt_token(token))
        tokenData.save()

        # get user data and return to client
        _, g = util.get_github(token)

        return util.create_success_response(
            util.format_user_data(g.get_user())
        )
    except Exception as e:
        return util.create_error_response(
            str(e)
        )


@bp.route('/check/', methods=['GET'])
def check():
    auth_code = request.args.get('code')

    if not auth_code:
        return util.create_error_response("Invalid request: missing 'code' query parameter.")

    stored_token = models.get_stored_token(auth_code)
    if stored_token:
        try:
            _, g = util.get_github(stored_token)

            # return user data to client
            return util.create_success_response(
                util.format_user_data(g.get_user())
            )
        except Exception as e: # if any GitHub error occurred
            # could be an expiration or deformity
            # delete the auth code and associated auth code from the
            # database
            models.Token.objects(code=auth_code).delete()
            return util.create_error_response("Invalid or expired access token.")
    else:
        return util.create_error_response("Invalid or missing access token.")


@bp.route('/logout/', methods=['GET'])
def logout():
    auth_code = request.args.get('code')

    if not auth_code:
        return util.create_error_response("Invalid request: missing 'code' query parameter.")
    # this removes the given code and associated token from 
    # the database if it existed
    models.Token.objects(code=auth_code).delete()
    return util.create_success_response("Session cleared successfully.")
