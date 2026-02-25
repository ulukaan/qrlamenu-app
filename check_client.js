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
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

let missingClient = [];
dirs.forEach(dir => {
    const files = walk(dir);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('framer-motion') && !content.includes('"use client"') && !content.includes("'use client'")) {
            missingClient.push(file);
        }
    });
});

console.log('Files missing use client: ', missingClient);
