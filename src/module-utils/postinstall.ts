import fs from 'fs'
import path from 'path'
import {tsconfig} from './templates/tsconfig'
const cwd: string = process.env.INIT_CWD;

//SETTING UP package.json
let packageJson: any = JSON.parse(fs.readFileSync(path.join(cwd,"package.json")).toString());
if(!packageJson.averModule) packageJson.averModule = {};
if(!packageJson.averModule.tsemplate) {
  packageJson.averModule.tsemplate = {
      reconfigure: "tsemplate reconfigure",
      priority: 0,
      firstrun: true
  }
}
if(!packageJson.devDependencies) packageJson.devDependencies = {};
packageJson.devDependencies["@types/mocha"] = "^8.0.3";
packageJson.devDependencies["mocha"] = "^8.0.3";
packageJson.devDependencies["nyc"] = "^15.1.0";
packageJson.devDependencies["rubah"] = "github:averism/rubah";

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

//initializing source folder
if(!fs.existsSync(path.join(cwd, "src"))) fs.mkdirSync(path.join(cwd, "src"));
if(!fs.existsSync(path.join(cwd, "src","index.ts"))) 
  fs.copyFileSync(path.join("src","module-utils","templates","index.ts"),path.join(cwd, "src","index.ts"))
packageJson.scripts.rubah = "rubah generate";
packageJson.scripts.start = "rubah generate && node -r ts-node/register src/index.ts"

//initializing test folder
if(!fs.existsSync(path.join(cwd, "test"))) fs.mkdirSync(path.join(cwd, "test"));

fs.writeFileSync(path.join(cwd,"package.json"),JSON.stringify(packageJson,null,2));

if(!fs.existsSync(path.join(cwd,"tsconfig.json")))
    fs.writeFileSync(path.join(cwd,"tsconfig.json"),JSON.stringify(tsconfig,null,2));

//SETTING UP .gitignore and .npmignore
let gitignore: Set<string> = new Set([
  "coverage",
  "node_modules",
  ".nyc_output",
  "temp",
  ".DS_Store",
  ".avermodule"
]);
let npmignore: Set<string> = new Set([
  "coverage",
  "node_modules",
  "test",
  "docs",
  ".nyc_output",
  "temp",
  ".DS_Store",
  ".avermodule"
]);
if(fs.existsSync(path.join(cwd,".gitignore"))){
  let existing = fs.readFileSync(path.join(cwd,".gitignore")).toString().split('\n');
  for(let s of existing) gitignore.add(s.trim());
}
fs.writeFileSync(path.join(cwd,".gitignore"),Array.from(gitignore).join('\n'));
if(fs.existsSync(path.join(cwd,".npmignore"))){
  let existing = fs.readFileSync(path.join(cwd,".npmignore")).toString().split('\n');
  for(let s of existing) npmignore.add(s.trim());
}
fs.writeFileSync(path.join(cwd,".npmignore"),Array.from(npmignore).join('\n'));


