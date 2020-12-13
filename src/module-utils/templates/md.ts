export let readme: string = `<!--#!line-writer title mdselect(h1,package,name)-->

<!--#!line-writer desc select(package,description)-->

<!--#!line-writer ver select(package,version)-->

---

lorem ipsum dolor sit amet

---

<!--#!line-writer copyright mdcopyright(package,${(new Date()).getFullYear()})-->
`