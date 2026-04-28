# Self Direction Page

A static personal navigation page built with plain HTML, CSS, and JavaScript.

## Local use

You can open `index.html` directly with `file://` for personal use, or serve the folder locally with any static file server.

## GitHub Pages deployment

This project is ready for GitHub Pages project-site deployment:

`https://<username>.github.io/<repo-name>/`

### 1. Create a GitHub repository

Create a normal repository, for example `self-direction-page`.

### 2. Push this folder

After initializing Git locally, add your GitHub repository as `origin` and push the `main` branch.

Example:

```bash
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

### 3. Enable GitHub Pages

In GitHub:

1. Open the repository
2. Go to `Settings`
3. Open `Pages`
4. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`

GitHub will publish the site at:

`https://<username>.github.io/<repo-name>/`

## Updating the site

Update the files, commit your changes, and push to `main`. GitHub Pages will redeploy automatically.

## Notes

- Local files are referenced with relative paths, so the project works under a GitHub Pages project subpath.
- This version stays fully static. If you later want stronger favicon extraction or cloud sync, add that in a separate deployment phase.
