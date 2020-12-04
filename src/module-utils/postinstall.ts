import fs from 'fs'
import path from 'path'
const cwd: string = process.env.INIT_CWD;

//SETTING UP package.json
let packageJson: any = JSON.parse(fs.readFileSync(path.join(cwd,"package.json")).toString());
if(!packageJson.averModule) packageJson.averModule = {};
packageJson.averModule.tsemplate = {
    reconfigure: "tsemplate reconfigure",
    priority: 0,
    firstrun: true
}
if(!packageJson.devDependencies) packageJson.devDependencies = {};
packageJson.devDependencies["@types/mocha"] = "^8.0.3";
packageJson.devDependencies["mocha"] = "^8.0.3";
packageJson.devDependencies["nyc"] = "^15.1.0";

packageJson.scripts.test = "mocha";
packageJson.scripts.cov = "nyc mocha"

if(!packageJson.nyc) packageJson.nyc = {
    "require": [
      "ts-node/register"
    ],
    "extension": [
      ".ts"
    ],
    "reporter": [
      "text",
      "html"
    ],
    "excludeNodeModules": true,
    "instrument": true,
    "sourceMap": true,
    "produce-source-map": true
  }

fs.writeFileSync(path.join(cwd,"package.json"),JSON.stringify(packageJson,null,2));


//SETTING UP tsconfig.json
const tsconfig = {
    "compilerOptions": {
      "noImplicitAny": true,
      "target": "es6",
      "outDir": "temp",
      "sourceMap": true,
      "moduleResolution": "node",
      "pretty": true,
      "esModuleInterop": true,
      "module": "commonjs",
      "lib": [
        "es2017",
        "es6",
      ]
    },
    "include": [
      "src/**/*",
      "index.ts",
      "test/*"
    ],
    "exclude": [
      "node_modules",
      "**/*.spec.ts"
    ],
    "compileOnSave": true,
    "lib": [
      "es2017",
      "es6",
    ]
  };

if(!fs.existsSync(path.join(cwd,"tsconfig.json")))
    fs.writeFileSync(path.join(cwd,"tsconfig.json"),JSON.stringify(tsconfig,null,2));

//SETTING UP .gitignore and .npmignore
let gitignore: Set<string> = new Set([
  "coverage",
  "node_modules",
  ".nyc_output",
  "temp",
  ".DS_Store"
]);
let npmignore: Set<string> = new Set([
  "coverage",
  "node_modules",
  ".nyc_output",
  "temp",
  ".DS_Store"
]);
if(fs.existsSync(path.join(cwd,".gitignore"))){
  let existing = fs.readFileSync(path.join(cwd,".gitignore")).toString().split('\n');
  for(let s of existing) gitignore.add(s);
}
fs.writeFileSync(path.join(cwd,".gitignore"),Array.from(gitignore).join('\n'));
if(fs.existsSync(path.join(cwd,".npmignore"))){
  let existing = fs.readFileSync(path.join(cwd,".npmignore")).toString().split('\n');
  for(let s of existing) npmignore.add(s);
}
fs.writeFileSync(path.join(cwd,".npmignore"),Array.from(gitignore).join('\n'));


