import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async () => {
  try {
    const token = core.getInput('repo-token', { required: true })
    console.log('token', { token })
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
