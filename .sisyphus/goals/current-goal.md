# Current Goal

## Goal As Stated

Migrate `/Users/hassoncs/src/ch5/ch5-landing-page` off GitHub surfaces for CH5 HQ.

## Interpreted Goal

Make Forgejo/HQ the authoritative git and CI surface for the landing page while keeping GitHub only as an explicit mirror if configured.

## Success Criteria

- `hq` remote points at `git.ch5.me` and receives `main`.
- GitHub `origin`, if present, is mirror-only.
- No `.github/workflows` CH5-owned CI remains.
- Forgejo workflow owns deploy CI.
- GitHub Packages registry/lock references are absent.
- CH5-owned GHCR references are absent or moved to `oci.ch5.me`.
- Closest local install/build/test proof passes.
- Main is committed, pushed to `hq`, and mirrored to `origin` if configured.
- Forgejo run status checked when workflow exists.

## Constraints

- Work only in this repo.
- Do not edit `/Users/hassoncs/src/ch5/ch5-company/docs/company/hq-migration-status.md`.
- Preserve unrelated work and never revert other agents' edits.

## Non-Goals

- No ch5-company audit doc edits.
- No product redesign.
- No GitHub PR.

## Current State

Migration complete. Install, check, and build proof passed. Forgejo run 11 for `36b4008` succeeded. Earlier run 9 stayed pending because `docker` did not match available runner labels; workflow now targets the proven `ubuntu-latest` runner with Forgejo-hosted actions.

## Plan

1. Sync and classify repo state.
2. Replace GitHub-hosted workflow/package surfaces with HQ surfaces.
3. Run local proof.
4. Commit on `main`, push `hq`, mirror `origin`, verify Forgejo run.

## Next Update Triggers

- New blocker.
- Verification result changes.
- Forgejo run result changes.
