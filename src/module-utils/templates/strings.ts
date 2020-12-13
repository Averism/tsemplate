function toCode(s: string, t: string): string {
    return "```"+(t?t:"")+"\n"+s+"```";
}

export let readmeModule: string = `<!--#!line-writer title mdselect(h1,package,name)-->

<!--#!line-writer desc select(package,description)-->

<!--#!line-writer ver select(package,version)-->

---

## Installation

${toCode("\n<!--#!line-writer install select(package,installRepo)-->\n","bash")}

---

## overview

<!--#!line-writer ver select(docs,overview)-->

---

<!--#!line-writer copyright mdcopyright(package,${(new Date()).getFullYear()})-->
`

export let afterFirstReconfigure = `
tsemplate module has added few dependencies to your package.json
please run 

\u001b[42m\u001b[30mnpm run reconfigure && npm install\u001b[0m

to install these dependencies and configure your project before continuing
`

export let readme1 = `# Tsemplate Installation In Progress...

tsemplate module has added few dependencies to your package.json
please run 

${toCode("npm run reconfigure && npm install","js")}

to install these dependencies and configure your project before continuing
`