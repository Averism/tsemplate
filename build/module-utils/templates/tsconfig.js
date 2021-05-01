"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webconfig = exports.tsconfig = exports.buildconfig = void 0;
exports.buildconfig = {
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es6",
        "outDir": "build",
        "sourceMap": false,
        "moduleResolution": "node",
        "pretty": false,
        "esModuleInterop": true,
        "module": "commonjs",
    },
    "include": [
        "src/**/*",
        "index.ts",
    ],
    "exclude": [
        "node_modules",
        "**/*.spec.ts"
    ],
    "compileOnSave": true,
    "lib": ["es2017", "es6"]
};
exports.tsconfig = {
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
exports.webconfig = {
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
            "dom"
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
        "dom"
    ]
};
