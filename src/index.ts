import * as core from '@actions/core'
import * as github from '@actions/github'
import { loadConfig } from './loadConfig'

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

      const { repo: repository } = github.context
      const { owner, repo } = repository

      const config = await loadConfig({
        client,
        owner,
        repo,
      })

      const labels = Object.entries(config.labels)

      const currentOpenPullRequests = await client.pulls.list({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        state: 'open',
      })

      for (let [label, labelSetting] of labels) {

      }

      console.log(currentOpenPullRequests)
      core.debug(JSON.stringify(currentOpenPullRequests.data))
      core.debug(JSON.stringify(labels))


      // const pullRequestsByDependabot = currentOpenPullRequests.data.filter(
      //   (pr) => pr.user.type === 'Bot' && pr.user.login.includes('dependabot')
      // )

      // const currentDependabotAssignees = pullRequestsByDependabot
      //   .map((dependabotPR) =>
      //     dependabotPR.requested_reviewers.map((reviewer) => reviewer.login)
      //   )
      //   .flat(Infinity)

      // const frontEndTeam1 = ['ilyaulyanov']

      // const result = await client.pulls.createReviewRequest({
      //   owner: github.context.repo.owner,
      //   repo: github.context.repo.repo,
      //   pull_number: pullRequest.number,
      //   reviewers: frontEndTeam1,
      // })

      // return true
    }

    return true
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
