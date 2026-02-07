Setting up Decap (Netlify) CMS with GitHub App

1. Install the Decap (Netlify) GitHub App
   - Go to https://github.com/apps/netlify-cms (or Decap's GitHub App page if using Decap)
   - Install it on the `Interlaced-Pixel/interlaced-pixel.github.io` repository and grant read/write permissions.

2. Create a GitHub personal access token (if using OAuth or manual configuration)
   - Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate token with `repo` scope and save it as a secret or use it in the CMS config if required.

3. Configure OAuth / backend if needed
   - For GitHub App integration, follow Decap docs to configure backend in `admin/config.yml` (the repo currently uses the `github` backend in the config).

4. Verify admin UI
   - Push changes and open `https://<your-username>.github.io/admin/` (or `https://interlaced-pixel.github.io/admin/`) and authenticate with GitHub.

Notes
- If you prefer not to install an app, editors can still commit by using GitHub OAuth flow via Decap's hosted console (see Decap docs).  
- Ensure the `admin` folder is accessible (it's copied to output) and `admin/config.yml` points to the correct repo and branch.
