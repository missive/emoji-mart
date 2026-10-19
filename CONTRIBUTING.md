# Contributing

Thanks for helping improve Emoji Mart. This document covers the process; the
[Development section of the README](README.md#-development) covers the tooling.

## Before you start

- **Bugs and features go through issues first.** Open an issue before starting
  significant work so we can agree on the approach. Small fixes and typo
  corrections can go straight to a pull request.
- **Search existing issues** to avoid duplicates.

## Making a change

1. Fork the repository and create a branch from `main`:

   ```sh
   git checkout -b fix/search-focus main
   ```

2. Install dependencies and start the demo site:

   ```sh
   npm install
   npm run dev
   ```

3. Make your change. Keep it focused: one fix or feature per pull request.

4. Run the full verification loop before pushing:

   ```sh
   npm run prettier && npm run check:types && npm test && npm run build && npm run build:react
   ```

   `npm run prettier:fix` corrects formatting for you.

5. Open a pull request against `main` and fill in the template. Link the issue
   it addresses.

## What happens next

- **CI runs automatically.** Formatting, type-check, tests, and builds all have
  to pass.
- **A maintainer reviews it.** One approval is required to merge. Review
  comments must be resolved.
- **We merge with a merge commit.** Your branch is deleted automatically after
  merging.

## Guidelines

- Follow the existing code style. Prettier enforces the mechanics; match the
  surrounding code for everything else.
- Add or update tests when you change behaviour in `packages/emoji-mart/src`.
- Do not hand-edit anything under `packages/emoji-mart-data/sets`. It is
  generated; change `build.js` and regenerate instead.
- Do not bump package versions in a feature pull request. Releases are cut
  separately by maintainers.

## Releases (maintainers)

1. Bump the version in each changed package, keeping the React wrapper's peer
   dependency range in step with the core package.
2. Merge the version bump to `main`.
3. Create a GitHub Release with a tag like `v0.2.0`. The **Publish to npm**
   workflow publishes every package whose version is not yet on npm, in the
   order data, core, react.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By
participating you agree to uphold it.
