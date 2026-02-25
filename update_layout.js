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
            .replace(/max-w-7xl/g, 'w-full max-w-[1600px]')
            .replace(/p-8 md:p-12 lg:p-16/g, 'p-6 lg:p-8')
            .replace(/p-8 md:p-12/g, 'p-6 lg:p-8')
            .replace(/px-8 md:px-12 py-6/g, 'px-6 lg:px-8 py-4')
            .replace(/px-8 md:px-12 py-10/g, 'px-6 lg:px-8 py-4')
            .replace(/px-6 md:px-12 py-6/g, 'px-6 lg:px-8 py-4')
            .replace(/px-6 md:px-12 py-10/g, 'px-6 lg:px-8 py-4')
            .replace(/px-8 md:px-10 py-6/g, 'px-6 lg:px-8 py-4')
            .replace(/px-8 md:px-10/g, 'px-6 lg:px-8')
            .replace(/p-6 md:p-12/g, 'p-6 lg:p-8');
            
        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Updated: ' + file);
        }
    });
});
