def get_repo_commits(g, username, reponame):
    commits = []

    repo = g.get_repo(username + "/" + reponame)

    if repo:
        for commit in repo.get_commits():
            date = commit.commit.author.date
            author = commit.commit.author.name
            commits.append([author, date])

    return commits



def get_user_repos(g, username):
    repos = []

    for repo in g.get_user(username).get_repos():
        repos.append({
            "id": repo.id,
            "name": repo.name
        })

    return repos



def get_repo_prs(g, username, reponame):
    pulls = []

    repo = g.get_repo(username + "/" + reponame)
    if repo:
        for pull in repo.get_pulls():
            title = pull.title
            date = pull.created_at
            pulls.append([title, date])

    return pulls


def get_issue_stats(g, username):
    openIssues = 0
    closedIssues = 0

    for repo in g.get_user(username).get_repos():
        for issue in repo.get_issues():
            if issue.state == "open":
                openIssues += 1
            else:
                closedIssues += 1

    return {
        "open": openIssues,
        "closed": closedIssues
    }