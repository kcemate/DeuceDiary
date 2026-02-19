# Contributing to Deuce Diary

## Getting Started

See [skills/dev-setup.md](skills/dev-setup.md) for local development setup.

## Branch Naming

Use prefixed branch names:

- `feat/short-description` — new features
- `fix/short-description` — bug fixes
- `chore/short-description` — maintenance, deps, CI

## Pull Request Process

1. Create a branch from `main` using the naming convention above
2. Make your changes with clear, atomic commits
3. Ensure `npm run check` and `npm run build` pass
4. Open a PR against `main` and fill out the template
5. Request review from at least one team member

## Code Review Expectations

- PRs should be focused — one concern per PR
- Reviewers: check for correctness, readability, and test coverage
- Address all review comments before merging
- Squash-merge to keep `main` history clean

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add match scoring screen
fix: correct date formatting in match history
chore: update dependencies
```
