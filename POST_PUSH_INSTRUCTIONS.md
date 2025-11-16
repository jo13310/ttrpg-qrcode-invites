# Post-Push Instructions

## Add Manifest URL After Initial Push

After your first successful push to GitHub, you need to add back the manifest URL to enable GitHub installations.

### Step 1: Push to GitHub First
1. Commit and push all current files to GitHub
2. Verify the files are visible in your GitHub repository

### Step 2: Add Manifest URL
Once the files are on GitHub, add this line back to your `module.json`:

```json
"manifest": "https://raw.githubusercontent.com/jo13310/ttrpg-qrcode-invites/main/module.json",
```

The complete section should look like:
```json
"url": "https://github.com/jo13310/ttrpg-qrcode-invites",
"manifest": "https://raw.githubusercontent.com/jo13310/ttrpg-qrcode-invites/main/module.json",
"download": "https://github.com/jo13310/ttrpg-qrcode-invites/archive/main.zip"
```

### Step 3: Update and Push Again
1. Save the updated `module.json`
2. Commit the change
3. Push to GitHub again

### Why This is Needed

- FoundryVTT tries to access the manifest URL during installation
- The manifest URL must point to an existing, accessible file
- Until you push to GitHub, the manifest URL would return a 404 error
- This two-step approach ensures the manifest URL works when users try to install

### Verification

After adding the manifest URL back, test it:
1. Visit `https://raw.githubusercontent.com/jo13310/ttrpg-qrcode-invites/main/module.json`
2. Confirm it displays your module.json content
3. Then users can install using this URL in FoundryVTT