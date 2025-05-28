import i from"fs";const d=(e,n)=>i.readdirSync(e).find(r=>n.some(s=>r.toLowerCase().includes(s.toLowerCase())));export{d as hasKeywordInFilename};
