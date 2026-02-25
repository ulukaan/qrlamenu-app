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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Remove the previously added unclosed div if present
    content = content.replace(/<div className="flex items-start md:items-center gap-4 md:gap-6">\s*<MobileMenuToggle \/>\s*<div className="(space-y-[34])"/g, '<div className=""');

    // And remove imports that were added by script
    content = content.replace(/import \{ MobileMenuToggle, ProfileDropdown \} from '@\/components\/HeaderActions';\n?/g, '');

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Reverted script changes');
