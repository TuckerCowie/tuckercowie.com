# tuckercowie.com

Tucker Cowie's portfolio: the work and how it was made, how to work with
him, and the system he builds with. One body of content, several moods.

- The brief is in [`docs/product/`](docs/product/README.md). `intent.md` is ground truth.
- How to add an entry, a collection or a mood: [`AGENTS.md`](AGENTS.md).
- Why each dependency is here: [`DEPENDENCIES.md`](DEPENDENCIES.md).

## Run it

```
npm install
npm run preview     # build with drafts included, tagged as drafts
npm run serve       # http://127.0.0.1:4173/
npm run build       # production: only entries marked visibility: public
npm run check       # static lints, then the browser checks in every mood
```

A production build needs `email` set in `content/site.yaml`. This repo is
public, so nothing private is committed, including in docs and fixtures.

The legacy 2021 site is on the `develop` branch.
