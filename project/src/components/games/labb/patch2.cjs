const fs = require('fs');
const labPath = 'virtual-lab/src/lab.js';
let content = fs.readFileSync(labPath, 'utf8');

const fxAdd = `,
  circuit:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  lens:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  stomata:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  foodtest:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ]`;

content = content.replace(
  `    {showProps:[], tableFx:'leafBlueBlack'},
    {showProps:[], tableFx:null},
  ],`,
  `    {showProps:[], tableFx:'leafBlueBlack'},
    {showProps:[], tableFx:null},
  ]${fxAdd}`
);

fs.writeFileSync(labPath, content);
console.log('Patch2 complete!');
