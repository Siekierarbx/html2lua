/* Variables */
const htmlprettyprint=require('html').prettyPrint;
const crypto=require('crypto');
const cheerio=require('cheerio');
const randomBytes=crypto.randomBytes;
let doc={};
let scripts=[];
let css=[];
let htmll;
let htmlr;

/* Makes the HTML "minified" so its easier to parse */
const minifyHTML=(a)=>{
return(htmlprettyprint(a,{indent_size:-1,max_char:0}).replace(/>\n\n</g,'>\n<'));
};

/* Gets all attributes of html code */
const getAllAttributes=(h,c)=>{
let e=cheerio.load(h)(c).get(0);
return(e.attributes||Object.keys(e.attribs).map(n=>({n,value:e.attribs[n]})));
};

/* Make random hash */
const randomHash=(n=10)=>{
return(randomBytes(n).toString('hex'));
};

/* Compile script */
const compileScript=(s='')=>{
/* Split into lines */
let l=s.split('\n');

/* Remove first and last line */
l.pop();
l.shift();

/* Join script's content */
l=htmlprettyprint(l.join('\n'));

/* Add to scripts */
scripts.push(`Spawn(function()\n${l}\nend);`);
};

/* Compile script */
const compileCSS=(s='')=>{
/* Split into lines */
let l=s.split('\n');

/* Remove first and last line */
l.pop();
l.shift();

/* Join css's content */
l=htmlprettyprint(l.join('\n'));

/* Add to css */
//css.push(`${l}`);
};

/* Parses all properties from a html line */
const parseProperties=(a)=>{
/* Get attributes using cheerio */
let _a=getAllAttributes(a,(a.split(' ').slice(0,1)[0].substring(1).split('</')[0].replace(/>/g,'')));

/* Sort correctly */
a={};
_a.forEach(p=>{
a[p.name]=p.value;
});

/* Return arguments */
return(a||[]);
};

/* Parses a body element */
const parseBodyElement=(e,p)=>{//line,parent
/* Check if script */
if(e.trimStart().startsWith('<script type="text/lua">')&&e.trimEnd().endsWith('</script>')){
compileScript(e.trimEnd());
return;
};

/* Check if css */
if(e.trimStart().startsWith('<style')&&e.trimEnd().endsWith('</style>')){
compileCSS(e.trimEnd());
return;
};

/* Handle element's properties */
let ElementProperties={id:`${p.id}_${randomHash()}`,children:[],type:"Frame",properties:parseProperties(e.split('\n')[0])||{}};

/* Add parent */
ElementProperties.properties.Parent=p.id;

/* Scan children */
let htmlr=e.trimEnd().split('\n');
htmlr.pop();
htmlr.shift();
let Stage=0;
let wl='';
for(let l of htmlr){
if((l.startsWith('<')&&l.includes('</')&&Stage===0))Stage=2;
if(l.startsWith('<')&&Stage===0)Stage=1;
if(l.startsWith('</')&&Stage===1)Stage=2;
if(Stage!==0)wl+=`${l}\n`;
if(Stage===2){
Stage=0;
parseBodyElement(wl,ElementProperties);
wl='';
};
};

/* Add as child to parent */
p.children.push(ElementProperties);
};

/**
* @param {string} HTML Text
* @returns {object} HTML Body
*/
exports.parseDocument=(html='')=>{
/* Minify html */
html=minifyHTML(html);
doc={};
scripts=[];
css=[];
htmll=html.toLowerCase();
htmlr=html.split('\n');

/* Check if doctype tag is missing */
if(!htmll.startsWith('<!doctype html>')){
console.error('HTML file is missing/has an invalid tag at line 1, add the following tag to line 1: <!DOCTYPE html>');
return;
};

/* Check if html tag is missing */
if(!(htmll.includes('<html')&&htmll.includes('</html>'))){
console.error('HTML file is missing a valid <html> tag');
return;
};

/* Check if a head tag is missing */
if(!(htmll.includes('<head')&&htmll.includes('</head>'))){
console.error('HTML file is missing a valid <head> tag');
return;
};

/* Check if a body tag is missing */
if(!(htmll.includes('<body')&&htmll.includes('</body>'))){
console.error('HTML file is missing a valid <body> tag');
return;
};

/* Parse <head> tag */
let GuiProperties={id:`_${randomHash()}`,children:[],type:"ScreenGui",properties:{}};
for(let l of htmlr){
if(l.startsWith('<head')){
let props=parseProperties(l);
GuiProperties.properties.Name=props.name;
GuiProperties.properties.Parent=props.parent;
break;
};
};

/* Add gui to doc */
doc=GuiProperties;

/* Loop through body */
let Capturing=false;
let Stage=0;
let wl='';
for(let l of htmlr){
if(l==='</body>'){
Capturing=false;
};
if(Capturing){
if((l.startsWith('<')&&l.includes('</')&&Stage===0))Stage=2;
if(l.startsWith('<')&&Stage===0)Stage=1;
if(l.startsWith('</')&&Stage===1)Stage=2;
if(Stage!==0)wl+=`${l}\n`;
if(Stage===2){
Stage=0;
parseBodyElement(wl,GuiProperties);
wl='';
};
};
if(l.startsWith('<body')&&!l.includes('</body>')){
Capturing=true;
};
};

/* Return document body */
return({doc:doc||{},scripts:scripts||[],css:css||[]});
};