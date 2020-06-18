# rbx-icons

Automatically generates Roblox Studio's latest class icons as individual .png files

Usage:
```JavaScript
const path = require('path');
const rbxIcons = require('rbx-icons');

rbxIcons.generate(path.join(__dirname, 'icons')).then(iconPaths => {
    console.log(iconPaths['Part']);
})
```

Package includes type definitions for TypeScript
