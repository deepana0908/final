import os
import requests
from github import (Auth, Github)
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import fernet_config


load_dotenv()  # load environment variables from .env file

bytes()

APP_SECRET = fernet_config.APP_SECRET

def get_access_token(code):
    # construct the payload
    payload = {
        'client_id': os.environ.get('CLIENT_ID'),
        'client_secret': os.environ.get('CLIENT_SECRET'),
        'code': code
    }

    # add some header
    headers = {'Accept': 'application/json'}

    # intiate the request
    response = requests.post(
        'https://github.com/login/oauth/access_token/', json=payload, headers=headers)

    # if the response was successful
    if response.status_code == 200:
        body = response.json()

        if not 'error' in body:
            # else the body has a token
            access_token = body['access_token']
            print(body)

            return access_token
        # raise error from server
        raise Exception(body['error_description'])

    return None

def __create_response(data, is_error=False):
    response = {
        'status': "success",
        'data': data,
    }

    if is_error:
        response['status'] = 'error'

    return response

def create_error_response(data):
    return __create_response(data, is_error=True)

def create_success_response(data):
    return __create_response(data)

def encrypt_token(token):
    fernet = Fernet(APP_SECRET)

    return fernet.encrypt(token.encode())


def decrypt_token(token):
    fernet = Fernet(APP_SECRET)

    return fernet.decrypt(token.encode()).decode()


def get_github(token):
    auth = Auth.Token(token)

    g = Github(auth=auth)

    return auth, g

def format_user_data(user):
    return {
        'username': user.login,
        'name': user.name,
        'avatarUrl': user.avatar_url,
        'followers': user.followers,
        'following': user.following,
        'bio': user.bio,
    }