let div = document.getElementById("contenedor");
let imagen = document.createElement("img");
getAlgo().then((res)=>{
    imagen.setAttribute("src", res[0].imagen);
    div.appendChild(imagen)
})

async function getAlgo(){
try {
    const res =  await fetch("http://localhost:3000/platos",{
        headers:{
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hbWUiOiJGYWJpYW5lczk2IiwiaXNBZG1pbiI6MSwiaWF0IjoxNjA4Nzc3MjY1fQ.zrQ9wFN--6WMDCpJJOoi1dlRCrxFB-Roud7kaBI_Zcs `
        }
    });
    const resAsJson = await res.json();
    
    return resAsJson
    
} catch (error) {
    console.log(error);
}
}
