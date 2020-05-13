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

    console.log({ pullRequest })

    const client = new github.GitHub(token)
    const result = await client.pulls.list({
      owner: 'procurify',
      repo: 'procurify-react',
      state: 'open',
    })
    console.log(result)
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
