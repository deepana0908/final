import mongoengine as me

from . import util

class Token(me.Document):
    code = me.StringField(required=True)
    token = me.StringField(required=True)


def get_stored_token(code):
    stored_token = Token.objects(code=code).first()

    if stored_token:
        stored_token = util.decrypt_token(stored_token.token)

    return stored_token