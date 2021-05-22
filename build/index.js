"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = __importDefault(require("child_process"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
let app = express_1.default();
const URL = 'http://localhost:8412';
const rootDir = path_1.default.join(__dirname, '..');
app.get('/', (req, res) => {
    let str = fs_1.default.readFileSync(path_1.default.join(rootDir, 'assets', 'index.html')).toString();
    res.send(str);
});
app.listen(8412, () => {
    if (process.env.BROWSER)
        console.log(child_process_1.default.execSync(`${process.env.BROWSER} "${URL}"`).toString());
    else
        console.log("please open the dashboard at http://localhost:8412");
});
