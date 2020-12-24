let div = document.getElementById("contenedor");
let imagen = document.createElement("img");


const res = fetch("http://localhost:3000/platos",{mode: 'cors'}).then((e)=>{    
    console.log(e);    
}
)

