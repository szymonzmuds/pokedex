var socket = io.connect('http://localhost:3456');

//here get elements
var pokemon = document.getElementById("poke");
var button = document.getElementById("button");
var inf = document.getElementById("inf");


//emit events
button.addEventListener('click', function () {
   socket.emit('get_poke', {
       url : 'https://pokeapi.co/api/v2/pokemon/',
       type: 'pokemon'
   });
});

//listen for events
socket.on('pokemon', function (data){
    pokemon.innerHTML='';

    var inf_bt_next = document.createElement("button");
    var inf_bt_prev = document.createElement("button");
    inf_bt_prev.innerHTML="prev";
    if(!data.previous){
        inf_bt_prev.disabled=true;
    }
    else{
        inf_bt_prev.id = data.previous;
        inf_bt_prev.addEventListener("click", change);
    }
    if(!data.next){
        inf_bt_next.disabled=true;
    }
    else{
        inf_bt_next.id=data.next;
        inf_bt_next.addEventListener("click", change);
    }


    inf_bt_next.innerHTML="next";
    ddiv = document.createElement("div");
    ddiv.id = "kier";
    inf.innerHTML="";
    inf.appendChild(inf_bt_prev);
    inf.appendChild(inf_bt_next);
    var new_table=document.createElement("table");
    var new_div = document.createElement("div");
    data = data['results'];
    var rows = [];
    var temp_row = document.createElement("div");
    temp_row.setAttribute("id", "poke_row");
    rows.push(temp_row);
    for(var i = 0; i<20; i++) {
        var temp=rows[(rows.length-1)];
        var boxx = document.createElement("div");
        boxx.setAttribute("id", "poke_box");
        var name = document.createElement("p");
        name.innerHTML = data[i].name;
        var link = document.createElement("div");
        link.setAttribute("id", "parent");
        var bt = document.createElement("button");
        bt.innerHTML = "see more info";
        bt.setAttribute("id", data[i].url);
        bt.addEventListener('click', req, false);
        boxx.appendChild(name);
        link.appendChild(bt);
        boxx.appendChild(link);
        pokemon.appendChild(boxx);

        }

});


socket.on('poke', function (data) {
    //change button
    var div = document.getElementById(data.idd).parentElement;
    var button = document.getElementById(data.idd);
    button.disabled = false;
    button.removeEventListener("click", req);
    button.addEventListener("click", hide);
    button.innerHTML="hide";

    //create containers for elements
    var img_div = document.createElement("div");
    img_div.id="img";
    var text_div = document.createElement("div");
    text_div.id = "text";
    var img = document.createElement("img");
    var text = document.createElement("p");
    var br = document.createElement("br");

    //add text
    var par = document.createElement("p");
    var h = document.createElement("b");
    h.innerHTML="height: ";
    par.appendChild(h);
    par.innerHTML+=data.height;
    par.appendChild(br);
    h.innerHTML="weight: ";
    par.appendChild(h);
    par.innerHTML+=data.height;
    par.appendChild(br);
    text_div.appendChild(par);
    div.appendChild(img_div);
    div.appendChild(text_div);

    //in the end add sprite
    var scr = data.sprites;
    scr = scr["front_default"];
    var img = document.createElement("img");
    img.src=scr;
    img_div.appendChild(img);

});

function hide() {
    this.removeEventListener("click", hide);
    var element = this.id;
    var id = this.id;
    element = document.getElementById(element).parentElement;
    element.innerHTML="";
    var btn = document.createElement("button");
    btn.innerHTML="see more info";
    btn.id = id;
    btn.addEventListener("click", req);
    element.appendChild(btn);
}


function req(){
    this.innerHTML="wait for data";
    this.disabled=true;
        socket.emit('get_poke', {
            url: this.id,
            type: 'poke'
        });
}

function change() {
    this.disabled=true;
    socket.emit('get_poke', {
        url: this.id,
        type: 'pokemon'
    });
}
