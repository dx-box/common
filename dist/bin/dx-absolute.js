#!/usr/bin/env node
import{convertImports as c,updateTsconfigPath as n}from"../scripts/index.js";import p from"path";import{Command as e}from"commander";const r=new e;r.option("--src <folder>","source folder name","src").parse(process.argv);const m=()=>{const o=process.cwd(),s=r.opts().src,t=p.resolve(o,"tsconfig.json");n(o,s),c(t)};m();
