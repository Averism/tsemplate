"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readme1 = exports.afterFirstReconfigure = exports.readmeModule = void 0;
function toCode(s, t) {
    return "```" + (t ? t : "") + "\n" + s + "```";
}
exports.readmeModule = `<!--#!line-writer title mdselect(h1,package,name)-->

<!--#!line-writer desc select(package,description)-->

<!--#!line-writer ver select(package,version)-->

---

## Installation

${toCode("\n<!--#!line-writer install select(package,installRepo)-->\n", "bash")}

---

## overview

<!--#!line-writer ver select(docs,overview)-->

---

<!--#!line-writer copyright mdcopyright(package,${(new Date()).getFullYear()})-->
`;
exports.afterFirstReconfigure = `
tsemplate module has added few dependencies to your package.json
please run 

\u001b[42m\u001b[30mnpm run reconfigure && npm install\u001b[0m

to install these dependencies and configure your project before continuing
`;
exports.readme1 = `# Tsemplate Installation In Progress...

tsemplate module has added few dependencies to your package.json
please run 

${toCode("npm run reconfigure && npm install", "js")}

to install these dependencies and configure your project before continuing
`;
