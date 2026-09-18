const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) {
        console.log("Missing:", from);
        return;
    }

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

// 🔥 YOUR REAL PATH
copyFolderSync(
    path.join(__dirname, 'demo', 'icons'),
    path.join(distDir, 'icons')
);

console.log("Icons copied successfully");