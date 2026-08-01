const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const splitMarker = "} from 'motion/react';";
const splitIdx = app.lastIndexOf(splitMarker);
if (splitIdx !== -1) {
    const correctPart = app.substring(splitIdx - 2); 
    const original = "import React, { useState, useEffect, useRef } from 'react';\nimport " + correctPart.trimStart();
    fs.writeFileSync('src/App.tsx', original);
    console.log("Restored");
}
