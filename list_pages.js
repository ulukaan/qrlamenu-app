const fs = require('fs');
const path = require('path');

const dir = 'd:\\PROJELER\\Yeni klasör\\MESA\\app\\(restaurant)';

function getFiles(baseDir) {
    let results = [];
    const list = fs.readdirSync(baseDir);
    list.forEach(file => {
        const fullPath = path.join(baseDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(getFiles(fullPath));
        } else if (file === 'page.tsx') {
            results.push(fullPath);
        }
    });
    return results;
}

const files = getFiles(dir);
console.log(files.join('\n'));
