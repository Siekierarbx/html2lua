let events={
"onclick":"mouseButton1Click",
"hover":"mouseEnter",
"hoverend":"mouseLeave",
};

exports.convert=(a)=>{
return(events[a]);
};
