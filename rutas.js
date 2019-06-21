const pool = require('./dbConexion');
const randomstring = require('randomstring');
const mailer = require('./mailer');


module.exports = app => {

    //*********************GET*********************************************

    app.get('/', (req, res) => {
        res.render('index.html');
    });

    app.get('/verificar', (req, res) => {
        res.render('views/verificar.html');
    });

    app.get('/infoMedico', (req, res) => {
        var user = req.query;
        console.log(typeof(user));
        console.log(JSON.stringify(user));
        user = JSON.stringify(user);
        user = JSON.parse(user);
        console.log(user.idMed);
    });

    //******************** POST *****************************************

    app.post('/registroMed', async(req, res) => {
        console.log("entro al metodo post registro medico");
        const { nombre, correo, contra } = req.body;
        const validado = false;
        const activo = false;
        const token = randomstring.generate();
        var ingreso = await pool.query('SELECT * FROM medicos where correo = ?', correo);

        if (ingreso[0]) { //--------------------Verificar si el correo no se repite en la base de datos------------------
            res.status(401).send({
                message: "Registro invalido, correo ocupado, intente de nuevo"
            });
        } else {
            await pool.query('INSERT INTO medicos SET ? ', {
                correo,
                contra,
                nombre,
                activo,
                validado,
                token
            });
            res.status(200).send({
                message: "Registro realizado, favor de verificar su correo"
            });

            //envio del correo
            const html = 'Hola medico <br> gracias por registrarte <br> Te invitamos a verificar tu cuenta <br> Ingresa el siguiente codigo: <b>' + token + '</b><br>en la siguiente página: <a href="http://localhost:3000/verificar">http://localhost:3000/verificar</a>';
            await mailer.sendEmail('consultorioMedico@edu.uaa.mx', correo, 'Verificacion Medico', html);
            console.log("termino post registro medicos");
        }

    });
    //-------------------verificaciones del token --------------------------------
    app.post('/infoToken', async(req, res) => {

        var secretToken = req.body.token;
        var usuario = await pool.query('SELECT * FROM medicos WHERE token =?', secretToken);

        if (!usuario[0]) {
            console.log("token no valido");
            res.status(400).send({
                message: "Token no valido, favor de verificar"
            });
            return;
        }
        console.log("token valido")
        await pool.query('Update medicos SET validado = 1 WHERE token =?', secretToken);

        res.status(200).send({
            message: "Verificacion realizada, ahora podrá ingresar a su cuenta"
        });
    });

    /*-------------------------LOGIN DEL MEDICO----------------------------------- */

    app.post('/login', async(req, res) => {
        var correo = req.body.correo;
        var pass = req.body.pass;

        const resultado = await pool.query('SELECT * FROM medicos WHERE correo = ? AND contra = ?', [correo, pass]);

        //console.log('Resultado: ' + JSON.stringify(resultado));

        if (!resultado[0]) {
            res.status(401).json({ message: "Datos invalidos" });
        } else if (resultado[0].validado != 1) {
            res.status(402).json({ message: "Cuenta no validada, revise su correo" });
        } else {
            res.status(200).send(resultado);
        }
    });

    //----------------REGISTRO DEL PACIENTE ----------------------------

    app.post('/regisPaciente', async(req, res) => {

        const { nombre, fechaNacimiento, sexo, correo, nivelSocioEcon } = req.body;
        var ingreso = await pool.query('SELECT * FROM pacientes where correo = ?', correo);
        if (ingreso[0]) { //--------------------Verificar si el correo no se repite en la base de datos------------------
            res.status(401).send({
                message: "Registro invalido, correo ocupado, intente de nuevo"
            });
        } else {
            await pool.query('INSERT INTO pacientes SET ? ', {
                nombre,
                fechaNacimiento,
                sexo,
                correo,
                nivelSocioEcon
            });
            res.status(200).send({
                message: "Registro realizado"
            });
        }

    });

    //------------------------LOGIN ENFERMERA----------------------------------


    app.post('/loginEnfermera', async(req, res) => {
        var correo = req.body.correo;
        var pass = req.body.contra;
        console.log(correo, pass);
        const resultado = await pool.query('SELECT * FROM enfermeras WHERE correo = ? AND contra = ?', [correo, pass]);

        console.log('Resultado: ' + JSON.stringify(resultado));

        if (!resultado[0]) {
            res.status(401).json({ message: "Datos invalidos" });
        } else {
            res.status(200).send(resultado);
        }
    });

};