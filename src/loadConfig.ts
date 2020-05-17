import * as core from '@actions/core'
import * as yaml from 'js-yaml'
import * as github from '@actions/github'

export interface ActionConfig {
  labels: {
    [key: string]: {
      reviewers: string[]
      random?: boolean
      numReviewsPerReviewer?: number
    }
  }
}

export const loadConfig = async ({
  client,
  owner,
  repo,
}: {
  client: github.GitHub
  owner: string
  repo: string
}): Promise<ActionConfig> => {
  const configPath = core.getInput('action-config', { required: false })

  const remoteConfig = await client.repos.getContents({
    owner,
    repo,
    path: configPath,
  })

  // ReposGetContentsResponseItem
  const { content } = remoteConfig.data as any

  if (!content) {
    throw new Error('Config file not found')
  }

  const configString = Buffer.from(content, 'base64').toString()
  const config = yaml.safeLoad(configString)

  return config
}
