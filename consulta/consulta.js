//=========================================
// CONFIGURACIÓN
//=========================================

const API =
"https://selecoba-api.info-selecoba.workers.dev";


//=========================================
// ELEMENTOS DOM
//=========================================

const txtCodigo=document.getElementById("codigo");
const txtUsuario=document.getElementById("usuario");
const txtPassword=document.getElementById("password");

const btnBuscar=document.getElementById("btnBuscar");
const btnLogin=document.getElementById("btnLogin");
const btnInfo=document.getElementById("btnInfo");

const boxResultado=document.getElementById("resultado");
const boxLogin=document.getElementById("login");
const boxTecnica=document.getElementById("informacionTecnica");

const historial=document.getElementById("historial");

const spinner=document.getElementById("spinner");
const mensajeLogin=document.getElementById("mensajeLogin");


//=========================================
// SESION TECNICA
//=========================================

let sesionTecnica={

codigo:"",
cliente:"",
equipo:"",
usuario:"",
password:"",
nombre:"",
cargo:""

};



//=========================================
// EVENTO ENTER
//=========================================

txtCodigo.addEventListener(
"keypress",
function(e){

if(e.key==="Enter"){

buscarCertificado();

}

});



//=========================================
// FUNCIONES AUXILIARES
//=========================================

function mostrarSpinner(valor){

spinner.style.display=
valor?"block":"none";

}


function bloquearBoton(boton,texto){

boton.disabled=true;

boton.innerHTML=texto;

}


function desbloquearBoton(boton,texto){

boton.disabled=false;

boton.innerHTML=texto;

}


function mostrarMensajeLogin(texto){

mensajeLogin.style.display="block";

mensajeLogin.innerHTML=texto;

}


function ocultarMensajeLogin(){

mensajeLogin.style.display="none";

mensajeLogin.innerHTML="";

}



//=========================================
// BUSCAR CERTIFICADO
//=========================================

async function buscarCertificado(){

const codigo=
txtCodigo.value.trim();


if(!codigo){

return;

}


bloquearBoton(
btnBuscar,
"🔄 Buscando..."
);


mostrarSpinner(true);


try{


const respuesta=
await fetch(

API+
"?accion=buscar&codigo="+
encodeURIComponent(codigo)

);


const data=
await respuesta.json();


mostrarResultado(data);


}
catch(error){


console.error(error);

mostrarError(
"❌ Error de conexión con el servidor."
);


}
finally{


mostrarSpinner(false);


desbloquearBoton(
btnBuscar,
"🔍 Buscar"
);


}


}



//=========================================
// MOSTRAR RESULTADO
//=========================================

function mostrarResultado(data){


boxResultado.style.display="block";


if(data.encontrado){


boxResultado.className="ok";


boxResultado.innerHTML=

`

<h3>✔ Certificado encontrado</h3>

<b>Código:</b>
${data.codigo}

<br><br>

<b>Cliente:</b>
${data.cliente}

<br><br>

<b>Equipo:</b>
${data.equipo}

<br><br>

<b>Fecha mantenimiento:</b>
${data.fecha}

<br><br>

<b>Próximo mantenimiento:</b>
${data.proximo}

`;



btnInfo.style.display="block";


}
else{


boxResultado.className="error";

boxResultado.innerHTML=
"❌ Certificado no encontrado";


btnInfo.style.display="none";


}


}



//=========================================
// MOSTRAR LOGIN
//=========================================

function mostrarLogin(){

boxLogin.style.display="block";

ocultarMensajeLogin();

}



//=========================================
// VALIDAR ACCESO TECNICO (CORREGIDO A MAYÚSCULAS)
//=========================================

async function validarAcceso(){


ocultarMensajeLogin();


// Capturamos el usuario, quitamos espacios y lo forzamos a MAYÚSCULAS (.toUpperCase())
const usuarioMayusculas = txtUsuario.value.trim().toUpperCase();

const datos={


accion:"info",

codigo:
txtCodigo.value.trim(),

usuario:
usuarioMayusculas, // Se envía garantizado en MAYÚSCULAS

password:
txtPassword.value.trim()

};



if(!datos.usuario || !datos.password){


mostrarMensajeLogin(
"❌ Ingrese usuario y contraseña."
);


return;

}



bloquearBoton(
btnLogin,
"🔄 Validando..."
);



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



const data=
await respuesta.json();
if(data.encontrado){
sesionTecnica.codigo=   data.codigo;
sesionTecnica.cliente=  data.cliente;
sesionTecnica.equipo=   data.equipo;
sesionTecnica.usuario=  datos.usuario; // Se guarda en mayúsculas para la sesión
sesionTecnica.password= datos.password;
sesionTecnica.nombre=   data.nombre;
sesionTecnica.cargo=    data.cargo;
historial.value=
data.observaciones;
boxLogin.style.display="none";
boxTecnica.style.display="block";
}
else{


mostrarMensajeLogin(
"❌ Usuario o contraseña incorrectos."
);


}


}
catch(error){


console.error(error);


mostrarMensajeLogin(
"❌ Error de conexión con el servidor."
);


}
finally{


desbloquearBoton(
btnLogin,
"Ingresar"
);


}


}



//=========================================
// ABRIR GARANTIA
//=========================================

function abrirGarantia(){


const url=

"../garantia/garantia.html?"
+"codigo="+encodeURIComponent(sesionTecnica.codigo)
+"&cliente="+encodeURIComponent(sesionTecnica.cliente)
+"&equipo="+encodeURIComponent(sesionTecnica.equipo)
+"&usuario="+encodeURIComponent(sesionTecnica.usuario)
+"&password="+encodeURIComponent(sesionTecnica.password)
+"&nombre="+encodeURIComponent(sesionTecnica.nombre)
+"&cargo="+encodeURIComponent(sesionTecnica.cargo);


window.location.href=url;


}



//=========================================
// ERROR
//=========================================

function mostrarError(texto){


boxResultado.style.display="block";

boxResultado.className="error";

boxResultado.innerHTML=texto;


}
