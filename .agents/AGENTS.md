# Antigravity Rules for Q-Portal

## Git Auto-Sync Rules

- Before starting any coding task or making any file modifications, the agent must check the git status by running git status.
- Before making edits, pull the latest changes from the remote repository to ensure local code is up-to-date:
  `git pull origin main` (Use the full path `"C:\Program Files\Git\cmd\git.exe"` if git is not in PATH).
- After making any file edits or successfully verifying changes, and BEFORE concluding the turn, the agent must automatically add, commit, and push the changes to GitHub:
  1. `git add .`
  2. `git commit -m "Auto-commit: [Brief description of changes made]"`
  3. `git push`
  (Use the full path `"C:\Program Files\Git\cmd\git.exe"` if git is not in PATH).
