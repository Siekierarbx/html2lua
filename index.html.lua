--[[
Code was compiled by HTML2Lua v0.0.1 [BETA]
Source was compiled from "c:/Users/Admin/Downloads/Html parser rosync/index.html"
Compile time took 22 ms | Compile was started at 1653428851637 ms
]]

-- Variables --
local Ids={};
local Names={};
Instance=Instance.new;

-- CSS --
local CSS={};
local ApplyCSS=function(n,i)-- classname, item name

end;

-- Scripts --
document={['getElementById']=function(n)return(Ids[n]);end;['getElementsByName']=function(n)return(Names[n]);end;};
Spawn(function()
local HelloWorld=function() print('Hello world!'); document.getElementById('TestId').setAttribute('class','testStyle');
end;
end);

-- UI Variables --
local _56ee534519413294f678=Instance'ScreenGui';
local _56ee534519413294f678_d80ea9e582f72d46389f=Instance'Frame';
local _56ee534519413294f678_d80ea9e582f72d46389f_287b8979da320715a233=Instance'Frame';

-- Configure ui --
_56ee534519413294f678.Name=TestGui;
_56ee534519413294f678.Parent=Game.StarterGui;
_56ee534519413294f678_d80ea9e582f72d46389f.Parent=_56ee534519413294f678;
_56ee534519413294f678_d80ea9e582f72d46389f_287b8979da320715a233.Parent=_56ee534519413294f678_d80ea9e582f72d46389f;