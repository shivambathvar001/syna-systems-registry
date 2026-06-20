# Syna Systems Website CI/CD Workflow

This directory contains the GitHub Actions workflow to build, lint, type-check, and deploy the Syna Systems website to Vercel automatically upon pushes to the `main` branch.

## Workflow Overview (`deploy.yml`)

The [deploy.yml](file:///D:/ShivamGem/SynaSystems/.github/workflows/deploy.yml) workflow performs the following steps:
1. **Checkout Repository**: Checks out the codebase.
2. **Node.js Setup**: Prepares Node.js 20 environment and enables caching for npm dependencies (targeting `website/package.json`).
3. **Install Dependencies**: Runs `npm ci` in the `./website` working directory.
4. **Run Lint and Format Checks**: Runs `npm run lint` to enforce style and code quality.
5. **Run Type Checks**: Executes `npx tsc --noEmit` to verify type safety.
6. **Trigger Vercel Deploy Hook**: If all quality checks pass, it sends an HTTP POST request to the Vercel Deploy Hook, triggering an automated production build and release in Vercel.

---

## Deployment Integration Details

The workflow is integrated directly with Vercel using the secure deploy hook:
`https://api.vercel.com/v1/integrations/deploy/prj_ZL6Iwwpz3sDTEQorJrj8I4ihTyLv/75kT6OG12h`

### Advantages of this Setup:
- **No Repository Secrets Needed:** This mechanism eliminates the need to configure `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or `VERCEL_PROJECT_ID` inside GitHub Secrets.
- **Pre-deployment Verification:** The pipeline acts as a quality gate, ensuring that broken builds, compilation bugs, or type mismatches are caught *before* hitting production.
