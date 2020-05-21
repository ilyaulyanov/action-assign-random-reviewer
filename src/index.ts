import * as core from '@actions/core'
import * as github from '@actions/github'
import { loadConfig } from './loadConfig'
import { Webhooks } from '@octokit/webhooks'
import { sample } from 'lodash'

async function run() {
  try {
    const token = core.getInput('repo-token', { required: true })
    const client = new github.GitHub(token)

    const { repo: repository, payload } = github.context
    const { owner, repo } = repository
    const {
      pull_request: pullRequest,
    } = payload as Webhooks.WebhookPayloadPullRequest

    if (!pullRequest?.number) {
      console.log('Could not get pull request number from context, exiting')
      return
    }

    /* DEBUG */
    // const repo = 'release-automatic-changelog'

    const config = await loadConfig({
      client,
      owner,
      repo,
    })

    const matchedLabels = Object.entries(config.labels).filter(
      ([labelName]) => {
        return pullRequest.labels.some((pullRequestLabel) => {
          return pullRequestLabel.name.includes(labelName)
        })
      }
    )

    // If pull request doesn't have an applied label exit
    if (matchedLabels.length === 0) {
      console.log('should return label not found')
      return
    }

    const getReviewersForLabel = ([
      _,
      { reviewers, random },
    ]: typeof matchedLabels[0]) => {
      if (random === true) {
        const reviewer = sample(reviewers) as string
        return [reviewer]
      }
      return reviewers
    }

    const reviewers = new Set(
      ...matchedLabels.map((matchedLabel) => getReviewersForLabel(matchedLabel))
    )

    const result = await client.pulls.createReviewRequest({
      owner,
      repo,
      pull_number: pullRequest.number,
      reviewers: [...reviewers],
    })

    console.log(result)

    // getReviewerForLabel
    // const reviewers = pullRequestAppliedLabels.map((appliedLabel) =>
    //   getReviewerForLabel(appliedLabel)
    // )

    // console.log({ reviewers })

    // if (pullRequest.user.login.includes('dependabot')) {
    //   const client = new github.GitHub(token)

    //   const { repo: repository } = github.context
    //   const { owner, repo } = repository

    //   const config = await loadConfig({
    //     client,
    //     owner,
    //     repo,
    //   })

    //   const labels = Object.entries(config.labels)

    //   const currentOpenPullRequests = await client.pulls.list({
    //     owner: github.context.repo.owner,
    //     repo: github.context.repo.repo,
    //     state: 'open',
    //   })

    //   for (let [label, labelSetting] of labels) {
    //   }

    //   console.log(currentOpenPullRequests)
    //   core.debug(JSON.stringify(currentOpenPullRequests.data))
    //   core.debug(JSON.stringify(labels))

    //   // const pullRequestsByDependabot = currentOpenPullRequests.data.filter(
    //   //   (pr) => pr.user.type === 'Bot' && pr.user.login.includes('dependabot')
    //   // )

    //   // const currentDependabotAssignees = pullRequestsByDependabot
    //   //   .map((dependabotPR) =>
    //   //     dependabotPR.requested_reviewers.map((reviewer) => reviewer.login)
    //   //   )
    //   //   .flat(Infinity)

    //   // const frontEndTeam1 = ['ilyaulyanov']

    //   // const result = await client.pulls.createReviewRequest({
    //   //   owner: github.context.repo.owner,
    //   //   repo: github.context.repo.repo,
    //   //   pull_number: pullRequest.number,
    //   //   reviewers: frontEndTeam1,
    //   // })

    //   // return true
    // } else {
    //   console.log('pull request not from dependabot')
    // }
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
