# IEEE TXST Computer Society — Collaborative Roster

Welcome to the IEEE TXST Computer Society collaborative workshop site. This repository powers the single live roster where members appear after contributing a JSON file through a pull request.

## Live site

The production site will be hosted from the IEEE TXST organization fork once it is renamed to [`ieee-txst.github.io`](https://ieee-txst.github.io/).

## Student workflow (GitHub Desktop)

1. Fork the **organization** repository and clone your fork in GitHub Desktop.
2. Create a new branch named `add-your-name`.
3. Copy `data/students/example.json` to `data/students/first-last.json` (lowercase, use dashes instead of spaces).
4. Edit the new file and update the values for `name`, `major`, and `grad_year`.
5. Commit your changes with a message like `Add <Your Name> JSON entry`, push, and open a pull request to the organization repository.
6. After an officer merges your pull request and runs the manifest update script, refresh the site to see your entry live.

## Organizer workflow

### Update the student manifest

Officers can regenerate the manifest in a single step at the end of the workshop (or any time new entries are merged):

```
python3 scripts/update_manifest.py
```

The script scans `data/students/`, gathers every `.json` file except `index.json`, sorts the filenames, and overwrites `data/students/index.json`. Commit and push the updated manifest so GitHub Pages rebuilds the site with the new roster.

### Suggested cadence

1. Merge student pull requests that add their JSON files.
2. Run the manifest updater shown above.
3. Commit the regenerated `data/students/index.json` with a message like `Update student manifest`.
4. Push to `main` so the live site rebuilds with the new entries.

## Participation rules

- Do not modify `index.html` or files in the `js/` directory.
- Add exactly one new JSON file per pull request under `data/students/`.
- Keep filenames lowercase, with dashes instead of spaces (example: `first-last.json`).
- Do not include secrets, API keys, or personal contact information.

## Why the manifest exists

Browsers cannot list directory contents directly. The roster script reads `data/students/index.json` to know which student files to load, and the Python helper keeps that manifest in sync with the JSON files.

## Need help?

If you get stuck, reach out to an IEEE TXST Computer Society officer.
