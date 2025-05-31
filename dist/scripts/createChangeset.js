import m from"chalk";import{execSync as g}from"child_process";import{randomUUID as p}from"crypto";import s from"fs";import l from"path";const f=()=>JSON.parse(s.readFileSync("package.json","utf-8")).name||"your-package",d=()=>JSON.parse(s.readFileSync("package.json","utf-8")).version||"0.0.0",h=n=>{try{const t=g('git log --pretty=format:"%H %s"',{encoding:"utf-8"}).split(`
`).map(e=>{const o=e.indexOf(" ");return{hash:e.slice(0,o),message:e.slice(o+1)}}),r=t.findIndex(e=>e.message.includes(n));if(r===-1)return t.map(e=>`- ${e.message}`);const c=t.slice(0,r);return c.length===0?["- (no new commits since version)"]:c.map(e=>`- ${e.message}`)}catch{return["- (no commits found)"]}},j=async n=>{if(!["patch","minor","major"].includes(n))throw new Error("Version type must be one of patch, minor, or major.");const t=f(),r=d(),c=h(r),e=`---
"${t}": ${n}
---

### \u2728 Summary

- 

### \u{1F4CC} Detailed Description (optional)

${c.join(`
`)}

### \u{1F527} Migration Needed?

- 
`,o=`${p().split("-")[0]}-${n}.md`,a=l.join(".changeset",o);s.existsSync(".changeset")||s.mkdirSync(".changeset"),s.writeFileSync(a,e.trim()),console.log(`\u2705 Changeset template created: .changeset/${o}`),console.log(`\u{1F4E6} Package: ${m.green(t)}  |  bump: ${n}`)};export{j as createChangeset};
