const fs = require('fs');

const files = [
    'd:\\PROJELER\\Yeni klasör\\MESA\\app\\(restaurant)\\restoran-bilgileri\\page.tsx',
    'd:\\PROJELER\\Yeni klasör\\MESA\\app\\(restaurant)\\kampanyalar\\page.tsx',
    'd:\\PROJELER\\Yeni klasör\\MESA\\app\\(restaurant)\\import-export\\page.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find the 3 divs closing before the p-6 lg:p-8 flex-1 div
    const targetPattern = /                    <\/div>\s*                <\/div>\s*            <\/div>\s*            <div className="p-6 lg:p-8 flex-1/g;
    
    // Replace with 2 divs
    const newPattern =                     </div>\r\n            </div>\r\n\r\n            <div className="p-6 lg:p-8 flex-1;
    
    let newContent = content.replace(targetPattern, newPattern);
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed early close in: ' + file);
    } else {
        console.log('Pattern not found in: ' + file);
    }
});
