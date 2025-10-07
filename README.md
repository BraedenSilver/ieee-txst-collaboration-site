# IEEE TXST Computer Society — Collaborative Roster

This repository powers the live roster that showcases everyone who participates in the IEEE TXST Computer Society collaborative workshop. Each student adds their own information by creating a small JSON file (a plain-text file that follows a simple structure). Once the file is approved, the live site updates to include the new entry. The exercise also gives you hands-on practice with Git version control, showing how teams coordinate changes without overwriting each other’s work.

The README below explains everything in plain language, so even if you have never used GitHub before you can still follow along.

---

## Contents

- [1. What you need before you start](#1-what-you-need-before-you-start)
- [2. Vocabulary: Git & GitHub words in plain English](#2-vocabulary-git--github-words-in-plain-english)
- [3. Live site location](#3-live-site-location)
- [4. Student checklist (step-by-step)](#4-student-checklist-step-by-step)
- [5. Participation rules (for students)](#5-participation-rules-for-students)
- [6. Organizer workflow (officers only)](#6-organizer-workflow-officers-only)
- [7. Powered by GitHub Pages](#7-powered-by-github-pages)
- [8. Need help?](#8-need-help)

---

## 1. What you need before you start

1. **A GitHub account.** If you do not have one, visit [github.com](https://github.com) and sign up. The free plan is all you need. Officers will share the club repository link after the organization account is ready, so for now simply create your personal account.
2. **GitHub Desktop installed on your computer.** Download it from [desktop.github.com](https://desktop.github.com/). Once installed, open it and sign in using the GitHub account you created in the previous step.
3. **A text editor.** Notepad (Windows), TextEdit (macOS in plain-text mode), or any code editor such as VS Code will work.

That is everything. No programming experience is required, and the steps are guided below.

---

## 2. Vocabulary: Git & GitHub words in plain English

If this is your first time seeing Git or GitHub, start with this glossary. Refer back to it whenever a new word shows up.

### Must-learn definitions

These are the terms you will use every time you contribute to the group project.

- **Git:** The version control system (a tool that tracks file changes) that runs behind the scenes.
- **GitHub:** A website that stores Git repositories online and makes it easy for people to collaborate.
- **Repository (repo):** A project folder tracked by Git. It includes every file, plus a history of all changes. Repositories can be public to the world, shared with an organization, or private just for you.
- **Fork:** Your personal copy of the organization’s repository on GitHub. Forking lets you make changes safely because the original project stays untouched until your pull request is merged.
- **Clone:** A download of a remote repository to your own computer so you can work on it locally. GitHub Desktop performs this step when you sign in and choose your fork.
- **Directory (local repo):** The copy of the project stored on your computer. To keep it in sync with GitHub, start by pulling the latest changes from your fork, edit your files, commit those edits, and finally push the new commit back to GitHub.
- **Remote:** A repository stored online (for example, on GitHub). Your computer copies changes to and from the remote.
- **Branch:** A named line of work inside a repository. Branches let you try changes separately from the main project.
- **Main branch (`main`):** The branch that represents the live project. Other branches are merged into it after review.
- **Commit:** A saved snapshot of your changes with a message that explains what you did. Think of it as a checkpoint you can return to if needed.
- **Push:** Uploading your commits from your computer to the remote repository on GitHub so everyone else can see them.
- **Pull:** Downloading commits from the remote repository to your computer so you stay up to date before you start working.
- **Merge:** Combining the commits from one branch into another. Merging adds your changes to the main branch after approval.
- **Pull request (PR):** A request on GitHub asking maintainers to review your branch and merge it into the main branch.
- **GitHub Pages:** GitHub’s static site hosting service. When this project’s main branch updates, GitHub Pages rebuilds and publishes the live roster website automatically.

### Additional definitions

These words are helpful but not required for the roster workflow.

- **Origin / upstream:** The default nicknames Git uses for remotes. `origin` usually points to your fork; `upstream` often points to the original project.
- **Fetch:** Ask the remote whether anything changed and download those updates without merging them yet.
- **Issue:** A conversation thread on GitHub used to report problems, ask questions, or propose features.
- **Markdown (`.md`) file:** A plain-text file that uses simple symbols (like `#` for headings) to format text. The README you are reading is written in Markdown.
- **License:** A document that explains how others are allowed to use the project’s code and content. Software repositories typically include one so contributors know the rules.

You will see these terms throughout the instructions, so keep this list handy while you work.

---

## 3. Live site location

After the workshop entries are merged, the live roster will publish through the club’s GitHub Pages site. Officers will share the direct link when the organization account goes live.

---

## 4. Student checklist (step-by-step)

Follow these instructions one at a time. Every bullet tells you exactly what to click or type so you can finish even if GitHub is brand new to you.

1. **Fork the project on GitHub.**
   - Open the repository link shared by the officers.
   - Click the **Fork** button in the top-right corner and accept the defaults. GitHub creates a safe copy in your account.
2. **Clone your fork with GitHub Desktop.**
   - Launch GitHub Desktop. Sign in if prompted (Windows: `File > Options > Accounts`, macOS: `GitHub Desktop > Preferences > Accounts`).
   - Choose **File > Clone Repository**, switch to the **GitHub.com** tab, select your fork, pick a folder on your computer, and click **Clone** to download the files.
3. **Create your working branch.**
   - In GitHub Desktop open the **Current Branch** menu.
   - Select **New Branch...**, name it `add-your-name`, and click **Create Branch**. This branch is your personal work area.
4. **Make your student JSON file.**
   - Open the project folder on your computer and go to `data/students/`.
   - Copy `example.json` and rename the copy to `first-last.json`. Use lowercase letters and dashes (for example, `alex-smith.json`). A school-appropriate pseudonym is fine if you prefer anonymity.
   - Open the new file in a plain-text editor and update the `name`, `major`, and `grad_year` values to match what you want displayed.
   - Set `link_url` to a site you are comfortable sharing (GitHub, LinkedIn, personal page, etc.). If you do not want to share a link, leave it blank or remove the line.
   - Optional photo: add an image to the `assets/` folder and set the `photo` field to that filename (for example, `alex-smith.jpg`). Use a unique name ending with `.gif`, `.png`, `.jpg`, or `.jpeg`. Leaving the value `default.gif` tells the site to pick a random club image from `assets/defaults/` for you.
   - If you added a custom photo, make sure the image file is inside the project so it can be uploaded with your JSON file.
5. **Save and confirm the change.**
   - Save the JSON file in your editor.
   - Switch back to GitHub Desktop and make sure the file appears under **Changes**. That confirms Git noticed your edit.
6. **Commit (save a snapshot).**
   - In GitHub Desktop type a short summary such as `Add Alex Smith roster entry`.
   - Click **Commit to add-your-name** to store the snapshot on your computer.
7. **Push your branch to GitHub.**
   - Click **Publish branch** (or **Push origin** if you have already published). Your branch now lives on GitHub.
8. **Open a pull request.**
   - GitHub Desktop shows a **Create Pull Request** button. Click it to open the pull request form in your browser.
   - Confirm the base repository is the IEEE TXST project and the base branch is `main`. Add a short description (for example, `Add Alex Smith to roster`) and submit the pull request.
9. **Watch for reviewer feedback.**
   - Officers review your pull request. If they ask for changes, edit the same JSON file, save, commit, and push again; the pull request updates automatically.
10. **See your entry on the live site.**
    - After your pull request is merged and the roster manifest is refreshed, GitHub Pages rebuilds the site. Give it a few minutes, reload the roster, and celebrate seeing your entry.
    - During the workshop the repository stays public so everyone can learn together; it may be set to private afterward.

---

## 5. Participation rules (for students)

- Add exactly **one** JSON file in `data/students/` per pull request.
- Keep filenames lowercase with dashes instead of spaces (example: `first-last.json`).
- Do **not** change `index.html` or anything in the `js/` folder.
- Profile photos are optional. If you add one, place the image in `assets/`, give it a unique filename, and only use `.gif`, `.png`, `.jpg`, or `.jpeg`. You may leave the `photo` field set to `default.gif` to have the site randomly choose one of the club-provided images in `assets/defaults/`.
- Prefer a real name, but if you want to stay anonymous you can use an appropriate pseudonym; just complete the steps so you still learn the Git basics.
- Do **not** include personal secrets such as passwords, phone numbers, or private emails.

---

<details>
<summary><strong>6. Organizer workflow (officers only)</strong></summary>

These steps are for IEEE TXST officers who manage the roster.

### 6.1 Update the student manifest

The roster page needs a list of all student files. The manifest (`data/students/index.json`) provides that list. Update it with:

```
python3 scripts/update_manifest.py
```

The script scans every JSON file in `data/students/` (except `index.json`), sorts the filenames, and rewrites the manifest. Commit and push the updated manifest so GitHub Pages rebuilds the live site.

### 6.2 Suggested cadence for organizers

1. Merge student pull requests that add their JSON files.
2. Run the manifest updater shown above.
3. Commit the regenerated `data/students/index.json` with a message like `Update student manifest`.
4. Push to the `main` branch so GitHub Pages rebuilds with the new entries.
5. When the workshop window closes, you can make the organization repository private again if desired.

</details>

---

---

## 7. Powered by GitHub Pages

The roster is hosted through GitHub Pages, so every accepted pull request automatically updates the live site. The footer now includes a short “Powered by GitHub Pages” callout that links to the service in case curious visitors want to learn more.

---

## 8. Need help?

If you get stuck at any point, reach out to an IEEE TXST Computer Society officer. They can walk you through the steps live or share screenshots of what to click.

Happy collaborating!
