//=========================================
// CONFIGURACIÓN
//=========================================

const API =
"https://pruebas.info-selecoba.workers.dev";

//=========================================
// SESIÓN
//=========================================

let sesion = {
    usuario:"",
    nombre:"",
    cargo:""
};

//=========================================
// ELEMENTOS DEL DOM
//=========================================

const txtUsuario =          document.getElementById("usuario");
const txtPassword =         document.getElementById("password");
const txtCliente =          document.getElementById("cliente");
const txtOC =               document.getElementById("oc");
const txtEquipo =           document.getElementById("equipo");
const cboTipo =             document.getElementById("tipo");
const txtObservaciones =    document.getElementById("observaciones");
const btnLogin =            document.getElementById("btnLogin");
const btnGuardar =          document.getElementById("btnGuardar");
const boxLogin =            document.getElementById("loginBox");
const boxFormulario =       document.getElementById("formulario");
const lblUsuario =          document.getElementById("usuarioActivo");
const lblMensaje =          document.getElementById("mensajeLogin");

//=========================================
// FUNCIONES AUXILIARES
//=========================================

function mostrarMensaje(texto){
    lblMensaje.style.display="block";
    lblMensaje.innerHTML=texto;
}
function ocultarMensaje(){
    lblMensaje.style.display="none";
    lblMensaje.innerHTML="";
}
function bloquearBoton(boton,texto){
    boton.disabled=true;
    boton.innerHTML=texto;
}
function desbloquearBoton(boton,texto){
    boton.disabled=false;
    boton.innerHTML=texto;
}

//=========================================
// LOGIN (FORZADO A MAYÚSCULAS)
//=========================================

async function iniciarSesion(){
    // Tomamos el usuario, quitamos espacios y lo forzamos a MAYÚSCULAS
    const usuario =     txtUsuario.value.trim().toUpperCase();
    const password =    txtPassword.value.trim();
    
    ocultarMensaje();
    if(!usuario || !password){
        mostrarMensaje("❌ Ingrese usuario y contraseña.");
        return;
    }
    bloquearBoton(btnLogin,"🔄 Validando...");
    try{
        const respuesta =   await fetch(API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                accion:"login",
                usuario: usuario, // Se envía garantizado en MAYÚSCULAS (ej. CAANYA)
                password: password
            })
        });
        const data =    await respuesta.json();
        if(data.encontrado){
            sesion.usuario=data.usuario;
            sesion.nombre=data.nombre;
            sesion.cargo=data.cargo;
            boxLogin.style.display="none";
            boxFormulario.style.display="block";
            lblUsuario.innerHTML=`Usuario: <b>${sesion.nombre}</b><br>Cargo: ${sesion.cargo}`;
        }
        else{
            mostrarMensaje("❌ Usuario o contraseña incorrectos.");
        }
    }
    catch(error){
        console.error(error);
        mostrarMensaje("❌ Error de conexión con el servidor.");
    }
    finally{
        desbloquearBoton(btnLogin,"Ingresar");
    }
}

//=========================================
// REGISTRAR (FORZANDO MAYÚSCULAS EN CLIENTE Y EQUIPO)
//=========================================

async function registrar(){
    if(!sesion.usuario){
        alert("Debe iniciar sesión");
        return;
    }

    const datos={
        accion:"registrar",
        cliente:        txtCliente.value.trim().toUpperCase(), // ◄ Convertido a MAYÚSCULAS
        oc:             txtOC.value.trim(),
        equipo:         txtEquipo.value.trim().toUpperCase(),  // ◄ Convertido a MAYÚSCULAS
        tipo:           cboTipo.value,
        observaciones:  txtObservaciones.value.trim(),
        usuario:        sesion.usuario,
        nombre:         sesion.nombre
    };
    if(
        !datos.cliente ||
        !datos.oc ||
        !datos.equipo ||
        !datos.tipo
    ){
        alert("Complete los campos obligatorios");
        return;
    }
    if(!/^[0-9]+$/.test(datos.oc)){
        alert("La orden de compra solo debe contener números");
        return;
    }
    bloquearBoton(btnGuardar,"🔄 Guardando...");
    try{
        const respuesta=
        await fetch(API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(datos)
        });
        const resultado=    await respuesta.json();
        if(resultado.encontrado){
            alert("Registro creado correctamente\n\nCódigo:\n"+resultado.codigo);
            limpiar();
        }
        else{
            alert(resultado.mensaje);
        }
    }
    catch(error){
        console.error(error);
        alert("Error al registrar");
    }
    finally{
        desbloquearBoton(btnGuardar,"Guardar mantenimiento");
    }
}

//=========================================
// LIMPIAR FORMULARIO
//=========================================

function limpiar(){
    txtCliente.value="";
    txtOC.value="";
    txtEquipo.value="";
    cboTipo.selectedIndex=0;
    txtObservaciones.value="";
}

//=========================================
// EVENTOS
//=========================================

txtUsuario.addEventListener("input",ocultarMensaje);
txtPassword.addEventListener("input",ocultarMensaje);
