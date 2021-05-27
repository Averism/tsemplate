export function put(target: Object, key: string, value: any) {
    let keys = key.split('.');
    let lastKey = keys.pop();
    let current: any = target;
    for(let k of keys){
        if(typeof current[k] == "undefined") current[k] = {}
        
        if(typeof current[k] == "object")
            current = current[k];
        else throw `invalid addres ${k} of ${key} - not an object`
    }
    current[lastKey] = value;
}

export function get(target: Object, key: string): any {
    let keys = key.split('.');
    let lastKey = keys.pop();
    let current: any = target;
    for(let k of keys){
        if(typeof current[k] == "undefined") return current[k];
        
        if(typeof current[k] == "object")
            current = current[k];
        else throw `invalid addres ${k} of ${key} - not an object`
    }
    return current[lastKey];
}