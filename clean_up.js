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

    // Remove the imported MobileMenuToggle line safely
    content = content.replace(/import\s+{\s*MobileMenuToggle,\s*ProfileDropdown\s*}\s*from\s*'@\/components\/HeaderActions';\s*\n?/g, '');
    
    // Clean up the broken div wrapper
    content = content.replace(/<div className="flex items-start md:items-center gap-4 md:gap-6">\s*<MobileMenuToggle \/>\s*<div className="""\s*>/g, '<div className="space-y-4">');
    // Just in case it was left partially
    content = content.replace(/<div className="""\s*>/g, '<div className="space-y-4">');

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Cleaned up files safely.');
