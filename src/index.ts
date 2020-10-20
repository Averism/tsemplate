import path from "path"

export default function main():number{
    //put your main logic here
    console.log("Hello World");
    return 0;
}

/* istanbul ignore if */
if(process.argv[1] == path.join(process.cwd(),"src","index.ts"))
    main(); 