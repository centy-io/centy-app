# Browse button shows folder name instead of full path on Init page

When using the 'Browse...' button on the Initialize Centy Project page, the selected folder path displays only the folder name instead of the full absolute path.

**Steps to reproduce:**

1. Open the app
2. Go to the Init page (Initialize Centy Project)
3. Click 'Browse...' button
4. Select a folder

**Expected behavior:**
The input field should display the full absolute path, e.g., `/Users/you/projects/replace-homedir`

**Actual behavior:**
The input field only displays the folder name, e.g., `replace-homedir`

**Note:** The placeholder text itself shows the expected format: 'Enter the full path to your project folder (e.g., /Users/you/projects/replace-homedir)'
