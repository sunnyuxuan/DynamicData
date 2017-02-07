
var h1List = document.getElementById("title");
    console.log(h1List.length);

    h1List.innerHTML = "Hello, My Panda Friend";


var changetitle = document.getElementById("title");
changetitle.style.color = "grey";



function changebackgroundcolor(id, color){
var currentId = document.getElementById(id);
currentId.style.backgroundColor = color;
}

changebackgroundcolor("pannel1", "#EDD772");
    

document.getElementById("pannel4").style.display = "none";

var h3list = document.getElementsByTagName("H3")[0];
 h3list.style.color = "blue";

function Magic(item){
item.style.width = "50%";
item.style.height = "50%";
}

function MagicOut(item){
item.style.width = "100%";
item.style.height = "100%";
}