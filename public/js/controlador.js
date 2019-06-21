/* ----------------------------------- ROUTING -----------------------------------*/
var app = angular.module("myApp", ["ngRoute"]);

app.factory('Shared', function() {
    return {
        rol: ""
    };
});

//Factory Socket.io
app.factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

//Facotory Peer
app.factory("PeerData", function() {
    return {
        data: "",
        consulta: ""
    };
});

app.factory("Consulta", function() {
    return {
        signos: "",
        idEnf: "",
        idPac: "",
        idMed: ""
    }
});


app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../views/principal.html",
            controller: "homeController"
        })
        .when("/about", {
            templateUrl: "../views/about.html"
        })
        .when("/registro", {
            templateUrl: "../views/registro.html"
        })
        /* -----------------------AUTO REGISTRO DE PACIENTES------------------------------------ */
        .when("/altaRegistro", {
            templateUrl: "../views/altaRegistro.html",
            controller: "registroPac"
        })
        .when("/altaRegistro-success", {
            templateUrl: "../views/principal.html",
            controller: "registroPac"
        })
        /* ------------------------REGISTRO DE MÉDICOS----------------------------------- */
        .when("/medico", {
            templateUrl: "../views/medico.html",
            controller: "inicioMed"
        })
        .when("/regisMedico", {
            templateUrl: "../views/registroMedico.html",
            controller: "registroMed"
        })
        .when("/medico-success", {
            templateUrl: "../views/principal.html",
            controller: "registroMed"
        })

    /* -------------------------PÁGINAS DEL MÉDICO---------------------------------- */
    .when("/indexMed", {
            templateUrl: "../views/logins/medico/medico.html",
            controller: "indexMedico"
        })
        .when("/consulta", {
            templateUrl: "../views/logins/medico/videochat.html",
            controller: "sala"
        })
        .when("/misCons", {
            templateUrl: "../views/logins/medico/consultas.html",
            controller: "misConsultas"
        })
        .when("/statistics", {
            templateUrl: "../views/logins/medico/estadisticas.html",
            controller: "stds"
        })
        .when("/regisEnfermera", {
            templateUrl: "../views/logins/medico/registroEnfermera.html",
            controller: "registroEnf"
        })

    // Este controlador supongo que debe de llevar a un controlador de cerrar sesión (?) 
    // De mientras lo voy a dejar comentado, si lo dejo activo se traba la página (idk) 
    /*.when("/logOut", {
        templateUrl: "../index.html"
    })*/
    /* -------------------------PÁGINAS DE LA ENFERMERA---------------------------------- */
    .when("/enfermera", {
            templateUrl: "../views/enfermera.html",
            controller: "loginEnfermera"
        })
        .when("/indexEnf", {
            templateUrl: "../views/logins/enfermera/enfermera.html",
            controller: "indexEnf"
        })
        .when("/salaEnf", {
            templateUrl: "../views/logins/enfermera/formConsulta.html",
            controller: "formConsulta"
        })
        .when("/salaEnfermera", {
            templateUrl: "../views/logins/enfermera/enfermera.html",
            controller: "sala-Enf"
        })
        /* -------------------------PÁGINAS DEL ADMINISTRADOR---------------------------------- 
        .when("/admin", {
            templateUrl: "../views/logins/admin/admin.html",
            controller: "indexAdmin"
        })
*/

    /* -------------------------ERROR---------------------------------- */
    .otherwise({
        templateUrl: "../views/error.html"
    });
});
/* NUNCA BORRAR ESTE CONTROLADOR */
app.controller('homeController', function($scope) {
    $scope.message = 'Realiza tu consulta online con nosotros';
});

// SERVICIO DE AUTOIDENTIFICACIÓN

app.service('credenciales', function() {
    var credenciales;

    var setCredenciales = function(obj) {
        credenciales = obj[0];
        //console.log('Credenciales: ' + JSON.stringify(credenciales));
    }

    var getCredenciales = function() {
        return credenciales;
    }

    return {
        setCredenciales: setCredenciales,
        getCredenciales: getCredenciales
    };

});

/* -------------------------------- FORMULARIO ALTA REGISTRO PACIENTE -------------------------------*/

app.controller('registroPac', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.paciente = [];
    $scope.paciente.sexo = [
        { value: "Masculino", label: "Masculino" },
        { value: "Femenino", label: "Femenino" }
    ]
    $scope.paciente.nivelEcon = [
        { value: "Bajo", label: "Bajo" },
        { value: "Medio", label: "Medio" },
        { value: "Alto", label: "Alto" }
    ]
    $scope.registrar = function() {

        var nombre = $scope.paciente.nombre;
        var fechaNacimiento = $scope.paciente.fecha;
        var genero = $scope.paciente.gender;
        var correo = $scope.paciente.email;
        var nivelSocioEcono = $scope.paciente.nivelEcono;

        //parametrizacion

        var data = {
            nombre: nombre,
            fechaNacimiento: fechaNacimiento,
            sexo: genero,
            correo: correo,
            nivelSocioEcon: nivelSocioEcono
        };

        console.log(data);
        $http.post('/regisPaciente', data)
            .then(function(response) {
                    alert(response.data.message);
                    $location.path('/altaRegistro-success');
                },
                function(response) {
                    alert(response.data.message);
                    $location.path('/altaRegistro');
                }
            );
    };
}]);
/* -------------------------------- FORMULARIO REGISTRO MÉDICO -------------------------------*/

app.controller('registroMed', ['$scope', '$location', '$http', function($scope, $location, $http) {
    console.log("Inicio controlador registro medico");
    $scope.medico = [];
    var pass1 = $scope.medico.contra;
    var pass2 = $scope.medico.contra2;
    if (pass1 != pass2) {
        alert("Contraseñas no coinciden");
    } else {
        $scope.registrarMed = function() {
            $location.path('/medico');
        };
    }

    $scope.registro = function() {
        console.log("boton registro presionado");
        let nombre = $scope.medico.nombre;
        let correo = $scope.medico.correo;
        let contra = $scope.medico.contra;

        let data = {
            nombre: nombre,
            correo: correo,
            contra: contra
        };

        $http.post('/registroMed', data)
            .then(function(response) {
                    alert(response.data.message);

                },
                function(response) {
                    alert(response.data.message);

                }
            );
    };
}]);

/*--------------------------------- INICIO SESION MEDICO-------------------------------------*/

app.controller('inicioMed', ['$scope', '$http', '$location', 'credenciales', function($scope, $http, $location, credenciales) {
    //console.log("Inicio controlador inicio medico");
    $scope.medico = [];
    $scope.login = function() {
        let correo = $scope.medico.correo;
        let pass = $scope.medico.pass;

        let data = {
            correo: correo,
            pass: pass
        };

        $http.post('/login', data)
            .then(function(response) {
                credenciales.setCredenciales(response.data);
                //console.log('Credenciales:' + JSON.stringify(credenciales.getCredenciales()));
                console.log(response.data[0]);
                sessionStorage.setItem('user', JSON.stringify(response.data[0]));
                sessionStorage.setItem('rol', "medico");
                $location.path("/indexMed");
                //almacenar sesion en local storage
                //console.log(response.data);

            }, function(response) {
                alert(JSON.stringify(response.data));
            });
    }
}]);

//------------------------------------Verificacion cuenta-------------------------------------

app.controller('verificacion', ['$scope', '$location', '$http', function($scope, $location, $http) {
    console.log("Inicio controlador verificacion");

    $scope.verificar = function() {
        let data = $.param({
                token: $scope.tokenU
            }

        );
        console.log(data);
        $http({
            url: '/infoToken',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: data
        }).then(function success(response) {
            alert(response.data.message);
            //redirigir a la pagina principal
            window.location.replace("http://localhost:3000/#!/medico");

        }, function error(response) {
            alert(response.data.message);
        });
    };
}]);
//--------------------------------PÁGINAS DEL MÉDICO------------------------------

app.controller('indexMedico', function($scope, $location, $http) {
    if (JSON.parse(sessionStorage.getItem('user'))) {
        document.getElementById('cabecera').style.display = "none";

        //console.log(JSON.parse(sessionStorage.getItem('user')).nombre);
        var user = JSON.parse(sessionStorage.getItem('user'));
        $scope.medico = user.nombre;
        $scope.id = user.idMed;
        $scope.nombre = user.nombre;
        $scope.correo = user.correo;
        //var data = user;

        /*$http({
            method: 'GET',
            url: 'infoMedico',
            params: data
        }).then(function(response) {

        }, function(response) {
            //alert(JSON.stringify(response.data));
        });
        /*$http.get('/infoMedico', data)
            .then(function(response) {

            }, function(response) {
                alert(JSON.stringify(response.data));
            });*/

    } else {
        $location.path('/');
    }

    $scope.cerrar = function() {
        var correo = (JSON.parse(sessionStorage.getItem("user"))).correo;
        console.log(data);
        var data = {
            correo: correo
        };
        $http.post('/cerrar', data)
            .then(function(response) {
                console.log("cerrar Session");
                sessionStorage.clear();
                $location.path("/");
                alert(JSON.stringify(response.data));
            }, function(response) {
                alert(JSON.stringify(response.data));
            });
    }

});

app.controller('sala', function($scope, $location, $http) {
    if (JSON.parse(sessionStorage.getItem('user'))) {
        document.getElementById('cabecera').style.display = "none";
        $scope.medico = JSON.parse(sessionStorage.getItem('user')).nombre;
    } else {
        $location.path('/');
    }
    $scope.iniciar = function() {

    };

    $scope.cerrar = function() {
        var correo = (JSON.parse(sessionStorage.getItem("user"))).correo;
        console.log(data);
        var data = {
            correo: correo
        };
        $http.post('/cerrar', data)
            .then(function(response) {
                console.log("cerrar Session");
                sessionStorage.clear();
                $location.path("/");
                alert(JSON.stringify(response.data));
            }, function(response) {
                alert(JSON.stringify(response.data));
            });
    }
});

app.controller('misConsultas', function($scope, $location, $http) {
    if (JSON.parse(sessionStorage.getItem('user'))) {
        document.getElementById('cabecera').style.display = "none";
        console.log(JSON.parse(sessionStorage.getItem('user')).nombre);
        $scope.medico = JSON.parse(sessionStorage.getItem('user')).nombre;
    } else {
        $location.path('/');
    }

    $http({
        url: 'recuperarConsultas',
        method: 'GET',
        params: {
            idMed: JSON.parse(sessionStorage.getItem('user')).idMed
        }
    }).then(function successCallback(response) {
        console.log(JSON.stringify(response.data.pacientes));
        console.log("----------------------------------------")
        console.log(JSON.stringify(response.data.consultas));
        $scope.Consultas = response.data.consultas;
        $scope.Pacientes = response.data.pacientes;
    });


    $scope.cerrar = function() {
        var correo = (JSON.parse(sessionStorage.getItem("user"))).correo;
        console.log(data);
        var data = {
            correo: correo
        };
        $http.post('/cerrar', data)
            .then(function(response) {
                console.log("cerrar Session");
                sessionStorage.clear();
                $location.path("/");
                alert(JSON.stringify(response.data));
            }, function(response) {
                alert(JSON.stringify(response.data));

            });
    }
});


app.controller('stds', function($scope, $location, $http) {
    if (JSON.parse(sessionStorage.getItem('user'))) {
        document.getElementById('cabecera').style.display = "none";
        console.log(JSON.parse(sessionStorage.getItem('user')).nombre);
        $scope.medico = JSON.parse(sessionStorage.getItem('user')).nombre;
    } else {
        $location.path('/');
    }

    $scope.cerrar = function() {
        var correo = (JSON.parse(sessionStorage.getItem("user"))).correo;
        console.log(data);
        var data = {
            correo: correo
        };
        $http.post('/cerrar', data)
            .then(function(response) {
                console.log("cerrar Session");
                sessionStorage.clear();
                $location.path("/");
                alert(JSON.stringify(response.data));
            }, function(response) {
                alert(JSON.stringify(response.data));
            });
    }
});

//-------------------------Registro Enfermera ------------------------

app.controller('registroEnf', function($scope, $location, $http) {
    console.log("controlador registro enfermera");
    if (JSON.parse(sessionStorage.getItem('user'))) {
        document.getElementById('cabecera').style.display = "none";
        console.log(JSON.parse(sessionStorage.getItem('user')).nombre);
        $scope.medico = JSON.parse(sessionStorage.getItem('user')).nombre;
    } else {
        $location.path('/');
    }

    $scope.registrar = function() {
        console.log("click");

        var correo = $scope.correo;
        var nombre = $scope.nombre;
        var contra = $scope.contra;

        var data = {
            correo: correo,
            contra: contra,
            nombre: nombre
        };


        $http.post('/registroEnf', data)
            .then(function(response) {
                    alert(response.data.message);
                    $location.path('/indexMed');

                },
                function(response) {
                    alert(response.data.message);
                    $location.path('/indexMed');
                }
            );


    }

    $scope.cerrar = function() {
        var correo = (JSON.parse(sessionStorage.getItem("user"))).correo;
        console.log(data);
        var data = {
            correo: correo
        };
        $http.post('/cerrar', data)
            .then(function(response) {
                console.log("cerrar Session");
                sessionStorage.clear();
                $location.path("/");
                alert(JSON.stringify(response.data));
            }, function(response) {
                alert(JSON.stringify(response.data));
            });
    }

});

/* ------------------------------ PÁGINAS DE LA ENFERMERA -----------------------------*/

app.controller('indexEnf', function($scope, $location) {
    console.log("inicio controlador index enfermera");
    if (JSON.parse(sessionStorage.getItem('user'))) {
        document.getElementById('cabecera').style.display = "none";
        console.log(JSON.parse(sessionStorage.getItem('user')).nombre);
        $scope.enfermera = JSON.parse(sessionStorage.getItem('user')).nombre;
    } else {
        $location.path('/');
    }

    $scope.cerrar = function() {

        console.log("cerrar Session");
        sessionStorage.clear();
        $location.path("/");

    }

});

app.controller('formConsulta', function($scope, $location, Consulta) {
    console.log("inicio controlador index");
    if (JSON.parse(sessionStorage.getItem('user'))) {
        document.getElementById('cabecera').style.display = "none";
        console.log(JSON.parse(sessionStorage.getItem('user')).nombre);
        $scope.enfermera = JSON.parse(sessionStorage.getItem('user')).nombre;
    } else {
        $location.path('/');
    }

    $scope.enviarForm = function() {
        var idPac = $scope.idPac;
        var fecha = $scope.fecha;
        var presion = $scope.presion;
        var altura = $scope.altura;
        var peso = $scope.peso;

        var signos = {
            fecha: fecha,
            presion: presion,
            altura: altura,
            peso: peso
        };

        var idEnf = JSON.parse(sessionStorage.getItem("user")).idEnf;
        console.log(idEnf, signos);
        Consulta.signos = signos;
        Consulta.idEnf = idEnf;
        Consulta.idPac = idPac;
        $location.path("/salaEnf");
    }

    $scope.cerrar = function() {

        console.log("cerrar Session");
        sessionStorage.clear();
        $location.path("/");
    }

});


app.controller('loginEnfermera', function($scope, $location, $http) {
    //console.log("inicio controlador  login");


    $scope.ingresar = function() {
        var correo = $scope.correo;
        var contra = $scope.contra;

        var data = {
            correo: correo,
            contra: contra
        };
        console.log(data);
        $http.post('/loginEnfermera', data)
            .then(function(response) {

                console.log(response.data[0]);
                sessionStorage.setItem('user', JSON.stringify(response.data[0]));
                sessionStorage.setItem('rol', "enfermera");
                $location.path("/indexEnf");

            }, function(response) {
                alert(JSON.stringify(response.data));
            });
    }

});