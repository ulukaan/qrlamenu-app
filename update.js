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

    // Add import if not exists
    if (!content.includes('HeaderActions')) {
        content = content.replace(/(import .*?;?\s*)\n/, '\nimport { MobileMenuToggle, ProfileDropdown } from \'@/components/HeaderActions\';\n');
    }

    // Process Left Side (usually space-y-4)
    // We look for <div className="space-y-4"> immediately following the justify-between wrapper
    // Wait, some might have other classes.
    // Standard layout is:
    // <div className="w-full mx-auto ... justify-between gap-6">
    //     <div className="space-y-
    
    // We can replace the space-y group with the wrapper.
    let searchLeft = /<div className="(space-y-[34])/;
    if (content.match(searchLeft) && !content.includes('<MobileMenuToggle />')) {
        content = content.replace(searchLeft, '<div className="flex items-start md:items-center gap-4 md:gap-6">\n                        <MobileMenuToggle />\n                        <div className=""');
    } else {
        console.log('Could not find left side in: ' + file);
    }
    
    // Check if right side exists by matching the end of the left side.
    // Instead of doing complex regex, we can just find the closing </div> of the space-y-4, but that's hard with regex.
    // Alternatively, just log the file and we can do it manually.
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Added imports and left side wrapper');
