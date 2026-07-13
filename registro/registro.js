const API =

"https://selecoba-api.info-selecoba.workers.dev";





let sesion={

usuario:"",

nombre:"",

cargo:""

};






async function iniciarSesion(){



const usuario =

document
.getElementById("usuario")
.value.trim();



const password =

document
.getElementById("password")
.value.trim();




if(!usuario || !password){

alert("Ingrese usuario y contraseña");

return;

}





try{



const respuesta =

await fetch(

API,

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},


body:JSON.stringify({

accion:"login",

usuario:usuario,

password:password

})


}

);



const data=

await respuesta.json();




if(data.encontrado){



sesion.usuario=data.usuario;

sesion.nombre=data.nombre;

sesion.cargo=data.cargo;





document

.getElementById("loginBox")

.style.display="none";




document

.getElementById("formulario")

.style.display="block";




document

.getElementById("usuarioActivo")

.innerHTML=

`

Usuario:

<b>${sesion.nombre}</b>

<br>

Cargo:

${sesion.cargo}

`;



}

else{


alert(data.mensaje);


}



}

catch(error){

console.error(error);

alert(
error.message
);

}


}









async function registrar(){



if(!sesion.usuario){

if(!/^[0-9]+$/.test(datos.oc)){


alert(
"La orden de compra solo debe contener números"
);


return;


}
  
alert(
"Debe iniciar sesión"
);


return;


}





const datos={



accion:"registrar",


cliente:

cliente.value,


oc:

oc.value,


equipo:

equipo.value,


tipo:

tipo.value,


observaciones:

observaciones.value,


usuario:

sesion.usuario,


nombre:

sesion.nombre



};





if(

!datos.cliente ||

!datos.oc ||

!datos.equipo


){


alert(
"Complete los campos obligatorios"
);


return;


}






document

.getElementById("spinner")

.style.display="block";






try{


const respuesta=

await fetch(

API,

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},


body:

JSON.stringify(datos)

}


);




const resultado=

await respuesta.json();




if(resultado.encontrado){



alert(

"Registro creado correctamente\n\nCódigo:\n"

+

resultado.codigo

);



limpiar();


}

else{


alert(resultado.mensaje);


}




}

catch(error){


alert(

"Error al registrar"

);


}



finally{


document

.getElementById("spinner")

.style.display="none";


}



}








function limpiar(){



cliente.value="";

oc.value="";

equipo.value="";

tipo.value="";

observaciones.value="";


}

//=========================================
// FECHA AUTOMATICA
//=========================================


window.onload=function(){


const fecha =
document.getElementById("fecha");



if(fecha){


const hoy =
new Date();



const dia =
String(
hoy.getDate()
)
.padStart(2,"0");



const mes =
String(
hoy.getMonth()+1
)
.padStart(2,"0");



const anio =
hoy.getFullYear();



fecha.value =
dia+"/"+mes+"/"+anio;



}


};
