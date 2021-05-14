export const packagejson = {
    "command": "load_json",
    "location": "package.json"
}

export const index = {
    "command": "line_read",
    "location": "src/index.ts"
}

export const readme = (mode:string) => { 
    let dependson = ["package"];
    if (mode == "module") dependson.push("index");
    return {
        command: "line_write",
        location: "readme.md",
        commentStyle: "html",
        dependson
    }
}