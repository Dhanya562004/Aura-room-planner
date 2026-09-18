const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) return;

    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }

    fs.readdirSync(from).forEach(file => {
        const src = path.join(from, file);
        const dest = path.join(to, file);

        if (fs.lstatSync(src).isDirectory()) {
            copyFolderSync(src, dest);
        } else {
            fs.copyFileSync(src, dest);
        }
    });
}

const distDir = path.join(__dirname, 'dist');

// ✅ COPY ICONS (your correct path)
copyFolderSync(
    path.join(__dirname, 'demo', 'icons'),
    path.join(distDir, 'icons')
);

// Other assets (keep these)
copyFolderSync(path.join(__dirname, 'demo', 'textures'), path.join(distDir, 'textures'));
copyFolderSync(path.join(__dirname, 'demo', 'assets'), path.join(distDir, 'assets'));
copyFolderSync(path.join(__dirname, 'demo', 'models'), path.join(distDir, 'models'));
copyFolderSync(path.join(__dirname, 'models'), path.join(distDir, 'models'));