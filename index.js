const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const SocketIO = require("socket.io");

const app = express();

// settings
app.set('port', process.env.PORT || 3000);

// establecer motor de plantilas embebidas de javascript
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.static(path.join(__dirname, '../static')))
app.use(express.static(path.join(__dirname, '/public')));


require('./rutas')(app);

// starting the server
const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

//WebSockets
app.set("ListaEspera", []);
const io = SocketIO(server);
io.on("connection", (socket) => {
    console.log("Nueva conexión: " + socket.id);
    socket.on("offer", function(data) {
        let tmp = {
            nombre: data.nombre,
            peer: data.peer,
            socketID: socket.id
        };
        app.settings.ListaEspera.push(tmp);
        socket.broadcast.emit("offer", app.settings.ListaEspera);
    });

    socket.on("answer", function(data) {
        let objTmp = app.settings.ListaEspera.find((element) => {
            return element.socketID == data.socketID
        });
        if (typeof objTmp != "undefined") {
            app.settings.ListaEspera.splice(app.settings.ListaEspera.indexOf(objTmp), 1);
        }
        io.emit("offer", app.settings.ListaEspera);
        console.log("Emitiendo mi socketID", socket.id);
        io.to(data.socketID).emit("answer", {
            peer: data.peer,
            id: socket.id
        });
    });

    socket.on("receta", function(data) {
        console.log("Redireccionando receta");
        io.to(data.socketID).emit("receta", data.receta);
    });

    socket.on("desconectar", function(data) {
        console.log("Llego el evento de desconectar para ", data);
        io.to(data).emit("desconectar");
    });

    socket.on("disconnect", function() {
        let objTmp = app.settings.ListaEspera.find((element) => {
            return element.socketID = socket.id;
        });
        if (typeof objTmp != "undefined") {
            app.settings.ListaEspera.splice(app.settings.ListaEspera.indexOf(objTmp), 1);
            io.emit("offer", app.settings.ListaEspera);
        }
    });
    io.emit("offer", app.settings.ListaEspera);
});