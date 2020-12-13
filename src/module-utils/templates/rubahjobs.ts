export const packagejson = {
    "command": "load_json",
    "location": "package.json"
}

export const index = {
    "command": "line_read",
    "location": "src/index.ts"
}

export const readme = {
    "command": "line_write",
    "location": "readme.md",
    "commentStyle": "html",
    "dependson": ["package","index"]
}