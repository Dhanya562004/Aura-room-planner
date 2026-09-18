const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) {
        console.log(`❌ Missing: ${from}`);
        return;
    }
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        const stat = fs.lstatSync(fromPath);
        if (stat.isFile()) {
            fs.copyFileSync(fromPath, toPath);
        } else if (stat.isDirectory()) {
            copyFolderSync(fromPath, toPath);
        }
    });
}

const distDir = path.join(__dirname, 'dist');

console.log('--- Copying Assets ---');

// ✅ ONLY THIS PATH IS NEEDED (your correct one)
copyFolderSync(
    path.join(__dirname, 'demo', 'icons'),
    path.join(distDir, 'icons')
);

// keep your existing assets
copyFolderSync(path.join(__dirname, 'demo', 'textures'), path.join(distDir, 'textures'));
copyFolderSync(path.join(__dirname, 'demo', 'assets'), path.join(distDir, 'assets'));
copyFolderSync(path.join(__dirname, 'demo', 'models'), path.join(distDir, 'models'));
copyFolderSync(path.join(__dirname, 'models'), path.join(distDir, 'models'));

console.log('--- DONE ---');