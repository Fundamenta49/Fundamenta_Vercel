# Git Deployment Instructions for Vercel

Follow these steps to prepare and push your clean Fundamenta codebase to GitHub for Vercel deployment.

## Step 1: Check Git Status

```bash
git status
```

This shows you what files have been modified and would be included in your commit.

## Step 2: Add Deployment Files to Staging

```bash
git add vercel.json vercel.js vercel-build.sh server/db-adapter.ts server/db-vercel.ts DEPLOYMENT_CHECKLIST.md VERCEL_DEPLOYMENT_GUIDE.md DEPLOYMENT_FILES.md .gitignore
```

This stages only the essential deployment configuration files we've created.

## Step 3: Commit Changes

```bash
git commit -m "Add Vercel deployment configuration with Supabase integration"
```

This commits the staged files with a descriptive message.

## Step 4: Push to GitHub

```bash
git push origin main
```

This pushes your committed changes to the main branch on GitHub.

## Step 5: Vercel Deployment

1. Log in to your Vercel dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the settings as described in the VERCEL_DEPLOYMENT_GUIDE.md file
5. Add the required environment variables (DATABASE_URL, USE_SUPABASE, etc.)
6. Deploy your application

## Troubleshooting

If you encounter Git issues:

- **Merge conflicts**: If pushing to main results in conflicts, consider creating a new branch first:
  ```bash
  git checkout -b vercel-deployment
  git add <files>
  git commit -m "Add Vercel deployment configuration"
  git push origin vercel-deployment
  ```
  Then create a pull request on GitHub.

- **Permission issues**: Ensure you have write access to the repository:
  ```bash
  git remote -v
  ```
  Check if the remote URL matches your GitHub repository.

- **Large file issues**: If any files are too large for GitHub, add them to .gitignore:
  ```bash
  git reset <large-file>
  ```
  Then update .gitignore to exclude that file and commit again.