/* Variables */
const fs=require('fs');
const Library=require('./library');
const Version='0.0.1 [BETA]';
let Code=`-- Variables --\nInstance=Instance.new;\n\n-- UI Variables --`;

// adds children variables
const addChildrenVariables=(c)=>{
c.forEach(r=>{
/* Add ui variable */
Code+=`\nlocal ${r.id}=Instance'${r.type}';`;

/* Add children */
addChildrenVariables(r.children,Code);
});
};

// adds children properties
const addChildrenProperties=(c)=>{
c.forEach(r=>{
let properties=r.properties;
for(let property in properties){
Code+=`\n${r.id}.${property}=${properties[property]};`;
};

/* Add children */
addChildrenProperties(r.children,Code);
});
};

exports.ConvertFromHTML=(file)=>{
// notify user about operation start
let starttime=Date.now();
console.log(`Started compiling ${file}`);

// read all the file's contents
let HTML=fs.readFileSync(file,'utf-8');

// Reset code variable
Code=`-- Variables --\nlocal Ids={};\nlocal Names={};\nInstance=Instance.new;\n\n-- CSS --\n\n-- Scripts --\n\n-- UI Variables --`;

// parse the html document
let Result=Library.parseDocument(HTML);
let ParsedDoc=Result.doc;

/* Add scripts */
let Scripts='-- Scripts --\ndocument={[\'getElementById\']=function(n)return(Ids[n]);end;[\'getElementsByName\']=function(n)return(Names[n]);end;};';
Result.scripts.forEach(s=>{
Scripts+=`\n${s}`;
});
Code=Code.replace('-- Scripts --',Scripts);

/* Add css */
let CSS='-- CSS --\nlocal CSS={};\nlocal ApplyCSS=function(n,i)-- classname, item name\n\nend;';
Result.css.forEach(c=>{
CSS+=`\n${c}`;
});
Code=Code.replace('-- CSS --',CSS);

/* Add gui */
Code+=`\nlocal ${ParsedDoc.id}=Instance'${ParsedDoc.type}';`;

/* Add children */
addChildrenVariables(ParsedDoc.children);

/* Add configure ui comment */
Code+='\n\n-- Configure ui --';

/* Add gui's config */
let properties=ParsedDoc.properties;
for(let property in properties){
Code+=`\n${ParsedDoc.id}.${property}=${properties[property]};`;
};

/* Add config for children */
addChildrenProperties(ParsedDoc.children);

/* Add "header" to compiled code */
let compiletime=Date.now()-starttime;
Code=`--[[\nCode was compiled by HTML2Lua v${Version}\nSource was compiled from "${__dirname.replace(/\\/g,'/')}/${file}"\nCompile time took ${compiletime} ms | Compile was started at ${starttime} ms\n]]\n\n${Code}`;

// write code to the lua file
fs.writeFileSync(`${file}.lua`,Code);

// notify user about operation end
console.log(`Finished compiling ${file} in ${compiletime} ms`);
};

this.ConvertFromHTML('index.html');