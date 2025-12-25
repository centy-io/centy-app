# Handle existing worktree folder with user options (open existing or recreate)

When opening an issue in a temp VS Code workspace and the target folder already exists, provide user-friendly options instead of just showing an error.

## Current Behavior

Shows error: “Failed to create git worktree. Try closing other VS Code windows for this project.”

## Desired Behavior

When the workspace folder already exists, prompt the user with:

1. **Open existing** - Focus the already-open VS Code window for this workspace
1. **Delete and recreate** - Remove the existing folder/worktree and create fresh

## UI Implementation

- Add dialog/modal with two action buttons
- Handle daemon response that indicates folder already exists
- Send user choice back to daemon for action
