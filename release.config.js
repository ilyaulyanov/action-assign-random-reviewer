module.exports = {
  ci: false,
  debug: true,
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        "releaseRules": [
          {
            "type": "build",
            "release": "patch"
          },
          {
            "type": "ci",
            "release": "patch"
          },
          {
            "type": "chore",
            "release": "patch"
          },
          {
            "type": "docs",
            "release": "patch"
          },
          {
            "type": "refactor",
            "release": "patch"
          },
          {
            "type": "style",
            "release": "patch"
          },
          {
            "type": "test",
            "release": "patch"
          }
        ]
      }
    ],
    "@semantic-release/release-notes-generator",
    [
			"@semantic-release/changelog",
			{
				"changelogTitle": "# Changelog\n\nAll notable changes to this project will be documented in this file. See\n[Conventional Commits](https://conventionalcommits.org) for commit guidelines."
			}
		],
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "yarn.lock", "CHANGELOG.md", "dist"],
        "message": "release(version): Release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}
