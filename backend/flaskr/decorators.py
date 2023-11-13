import functools
from flask import (g, request)
from github import (Auth, Github)

from . import util
from . import models


def check_auth_code(view):
    @functools.wraps(view)
    def wrapped(**kwargs):
        auth_code = request.args.get('code')
        print("Auth code")
        print(auth_code)

        if not auth_code:
            # for bad request
            return util.create_error_response("Invalid request: missing 'code' query parameter.")
        # check if code is in database
        storedToken = models.get_stored_token(auth_code)
        print("Got code")
        print(storedToken)
        if not storedToken:
            return util.create_error_response("Unauthorized")
        
        # attach GitHub client to request session
        g.github = Github(auth=Auth.Token(storedToken))
        
        return view(**kwargs)
    
    return wrapped