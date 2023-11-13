from flask import (Blueprint, g, request)
from github import (Github, Auth)
from . import models
from . import util
from . import models
from . import decorators
from . import github_api


bp = Blueprint('github', __name__, url_prefix='/github')


@bp.route('/repos/', methods=['GET'])
@decorators.check_auth_code
def repos():
    user = g.github.get_user()
    username = user.login

    repos = github_api.get_user_repos(g.github, username)

    return util.create_success_response(repos)


@bp.route('/commits/<string:reponame>', methods=['GET'])
@decorators.check_auth_code
def commits(reponame):
    user = g.github.get_user()
    username = user.login

    commits = github_api.get_repo_commits(g.github, username, reponame)

    return util.create_success_response(commits)


@bp.route('/pull-requests/<string:reponame>', methods=['GET'])
@decorators.check_auth_code
def pull_requests(reponame):
    user = g.github.get_user()
    username = user.login

    pulls = github_api.get_repo_prs(g.github, username, reponame)

    return util.create_success_response(pulls)


@bp.route('/issue-stats/', methods=['GET'])
@decorators.check_auth_code
def issue_stats():
    user = g.github.get_user()
    username = user.login

    stats = github_api.get_issue_stats(g.github, username)

    return util.create_success_response(stats)
