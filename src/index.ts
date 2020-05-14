import * as core from '@actions/core'
import * as github from '@actions/github'

async function run() {
  try {
    const token = core.getInput('repo-token', { required: true })

    const pullRequest = github.context.payload.pull_request
    if (!pullRequest?.number) {
      console.log('Could not get pull request number from context, exiting')
      return
    }

    if (pullRequest.user.login.includes('dependabot')) {
      const client = new github.GitHub(token)

      const currentOpenPullRequests = await client.pulls.list({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        state: 'open',
      })
      const pullRequestsByDependabot = currentOpenPullRequests.data.filter(
        (pr) => pr.user.type === 'Bot' && pr.user.login.includes('dependabot')
      )

      const currentDependabotAssignees = pullRequestsByDependabot
        .map((dependabotPR) =>
          dependabotPR.requested_reviewers.map((reviewer) => reviewer.login)
        )
        .flat(Infinity)

      const frontEndTeam1 = ['ilyaulyanov']

      const result = await client.pulls.createReviewRequest({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: pullRequest.number,
        reviewers: frontEndTeam1,
      })

      return true
    }

    return true
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()