#!/usr/bin/env node
import{execSync as n}from"child_process";const o=()=>{n("npx dx-absolute"),n("npx dx-lint"),n("npx dx-format"),console.log("\u2705 Successfully updated tsconfig.json paths and applied linting & formatting.")};o();
