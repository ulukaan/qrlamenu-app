const fs = require('fs');
const path = require('path');

const dirs = [
    'd:\\PROJELER\\Yeni klasör\\MESA\\app',
    'd:\\PROJELER\\Yeni klasör\\MESA\\components'
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
            results.push(file);
        }
    });
    return results;
}

dirs.forEach(dir => {
    const files = walk(dir);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        
        // Replace exact hex colors
        let newContent = content
            .replace(/#ff7a21/gi, '#ea580c')
            .replace(/text-orange-500/g, 'text-orange-600')
            .replace(/bg-orange-500/g, 'bg-orange-600')
            .replace(/border-orange-500/g, 'border-orange-600')
            .replace(/ring-orange-500/g, 'ring-orange-600')
            .replace(/from-orange-500/g, 'from-orange-600')
            .replace(/to-orange-500/g, 'to-orange-600');
            
        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Updated colors in: ' + file);
        }
    });
});
