const fs = require('fs');
const path = require('path');

const dirs = [
    'd:\\PROJELER\\Yeni klasör\\MESA\\app\\(restaurant)',
    'd:\\PROJELER\\Yeni klasör\\MESA\\components\\restaurant'
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

dirs.forEach(dir => {
    const files = walk(dir);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        
        let newContent = content
            .replace(/w-full max-w-\[1600px\] mx-auto/g, 'w-full mx-auto')
            .replace(/max-w-7xl mx-auto/g, 'w-full mx-auto')
            .replace(/max-w-6xl mx-auto/g, 'w-full mx-auto')
            .replace(/max-w-5xl mx-auto/g, 'w-full mx-auto')
            .replace(/w-full max-w-7xl mx-auto/g, 'w-full mx-auto')
            .replace(/px-6 md:px-8 py-4/g, 'px-4 lg:px-6 py-4')
            .replace(/px-6 lg:px-8 py-4/g, 'px-4 lg:px-6 py-4')
            .replace(/px-6 lg:px-8/g, 'px-4 lg:px-6')
            .replace(/p-6 lg:p-8/g, 'p-4 lg:p-6')
            .replace(/p-6 md:p-8/g, 'p-4 lg:p-6')
            .replace(/py-6 px-8/g, 'py-4 px-6')
            // Also replace some specific p-8 to p-6 inside cards
            .replace(/p-8 space-y-8/g, 'p-6 space-y-6')
            .replace(/p-8 space-y-6/g, 'p-6 space-y-6')
            .replace(/p-10 space-y-8/g, 'p-6 space-y-6')
            .replace(/p-16 text-center/g, 'p-10 text-center');
            
        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Updated layout: ' + file);
        }
    });
});
