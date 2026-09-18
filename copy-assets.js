const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) {
        console.log(`Source folder does not exist: ${from}`);
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

// Destination directory
const distDir = path.join(__dirname, 'dist');

console.log('--- Starting Assets Copying ---');

// Copy textures
console.log('Copying textures...');
copyFolderSync(path.join(__dirname, 'demo', 'textures'), path.join(distDir, 'textures'));

// Copy assets
console.log('Copying assets...');
copyFolderSync(path.join(__dirname, 'demo', 'assets'), path.join(distDir, 'assets'));

// Copy models (from both demo/models and root models/)
console.log('Copying demo models...');
copyFolderSync(path.join(__dirname, 'demo', 'models'), path.join(distDir, 'models'));

console.log('Copying catalog models...');
copyFolderSync(path.join(__dirname, 'models'), path.join(distDir, 'models'));

console.log('--- Assets Copy Completed Successfully ---');
