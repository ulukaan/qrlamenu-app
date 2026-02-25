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

    // Add Imports
    if (!content.includes('HeaderActions')) {
        content = content.replace(/(import .*?;?\s*)\n/, '\nimport { MobileMenuToggle, ProfileDropdown } from \'@/components/HeaderActions\';\n');
    }

    // Step 1: Wrap Left Content
    // We look for:
    // <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
    //      <div className="space-y-4">
    // and we replace with a wrapper. But we MUST find the closing div of space-y-4.
    // Instead of doing that, we can use a simpler approach.
    // Look for breadcrumbs. It's usually the first child of space-y-4.
    // Let's replace:
    // <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
    //     <div className="flex items-start md:items-center gap-4 md:gap-6">
    //         <MobileMenuToggle />
    //         <div className="flex-1">...
    
    // Instead, I'll do manual AST later if this is too hard. 
    // Wait, let's just make Header a floating absolute component? 
    
});
