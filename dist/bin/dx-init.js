#!/usr/bin/env node
import{installDevDependencies as n,updateTsconfigPath as c}from"../scripts/index.js";import{execSync as e}from"child_process";import{Command as t}from"commander";const r=new t;r.option("--src <folder>","source folder name","src").parse(process.argv);const p=()=>{const o=process.cwd(),s=r.opts().src;n(o),c(o,s),e("npx dx-fix")};p();
