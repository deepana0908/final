import request from "./request";

const PATH = "/github";

async function getRepositories(authCode) {
  return await request(`${PATH}/repos?code=${authCode}`);
}

async function getRepoCommits(repoName, authCode) {
  return await request(`${PATH}/commits/${repoName}?code=${authCode}`);
}

async function getRepoPRs(repoName, authCode) {
  return await request(`${PATH}/pull-requests/${repoName}?code=${authCode}`);
}

async function getIssueRating(authCode) {
    return await request(`${PATH}/issue-stats?code=${authCode}`);
  }

const GitHub = {
    getRepositories,
    getRepoCommits,
    getRepoPRs,
    getIssueRating,
}

export default GitHub;