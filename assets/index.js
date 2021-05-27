let btn = (title,cb,cbparam) => `<div class="button" onclick="${cb}(${cbparam})">${title}</div>`
let btn2 = (title,cb,cbparam) => `<div class="button2" onclick="${cb}(${cbparam})">${title}</div>`

fetch("api/getTitle").then(x=>x.text()).then(x=>{
    document.getElementById("header").children[0].innerHTML = x;
})

window.getTasks = function(){
    fetch("api/getTasks").then(x=>x.json()).then(tasks=>{
        window.tasksById = 
        window.taskGroup = tasks.reduce((p,c)=>{
            p[c.id] = c;
            return p;
        },{})
        window.taskGroup = tasks.reduce((p,c)=>{
            if(p[c.group]) p[c.group].push(c);
            else p[c.group] = [c];
            return p;
        },{})
        let leftMenu = document.getElementById("leftmenu");
        leftMenu.innerHTML=Object.keys(window.taskGroup).map(x=>{
            let b = btn(x,"viewTaskGroup",`'${x}'`);
            let id = `tg_${btoa(x)}`;
            return `<div>${b}<div id="${id}"></div></div>`
        });
    });
}

window.viewTaskGroup = function(taskGroupName){
    let content = document.getElementById(`tg_${btoa(taskGroupName)}`);
    let expanded = content.classList.toggle("expanded");
    if(expanded) {
        let tasks = window.taskGroup[taskGroupName];
        content.innerHTML = tasks.map(x=>btn2(x.title,"viewTask",`'${x.id}'`)).join("");
    } else {
        content.innerHTML = "";
    }
}

window.viewTask = function(taskId){
    let content = document.getElementById(`content`);
    let task = window.tasksById[taskId];
    content.innerHTML = `<div style="display:block">
        <h3>${task.title}</h3>
        <div>
            ${task.description}
        </div>
    </div>
    `
}

getTasks();