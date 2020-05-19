module.exports = {
  debug: true,
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          {
            type: 'build',
            release: 'patch',
          },
          {
            type: 'ci',
            release: 'patch',
          },
          {
            type: 'chore',
            release: 'patch',
          },
          {
            type: 'docs',
            release: 'patch',
          },
          {
            type: 'refactor',
            release: 'patch',
          },
          {
            type: 'style',
            release: 'patch',
          },
          {
            type: 'test',
            release: 'patch',
          },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogTitle:
          '# Changelog\n\nSee\n[Conventional Commits](https://conventionalcommits.org) for commit guidelines.',
      },
    ],

    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        tarballDir: 'dist',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: 'dist/**',
      },
    ],
  ],
}
