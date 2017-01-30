
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
