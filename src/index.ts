import * as core from '@actions/core'

async function run () {
  try {
    const token = core.getInput('repo-token', { required: true })
    console.log('token', { token })
    const stuff = core.info('123')
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
