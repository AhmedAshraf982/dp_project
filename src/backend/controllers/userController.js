const axios = require('axios');
const con = require('../connect');

const sendResponse = (message, statusCode, res, isStatus) => {
    return res.status(statusCode).json({
        status: isStatus,
        data: {
            tournament: message,
        },
    });
};
exports.getUsers = (req, res) => {
    con.query("SELECT * FROM gamesystem_modified.players", function (err, result, fields) {
        if (err) throw err;
        res.set('Access-Control-Expose-Headers', 'X-Total-Count')
        res.set('X-Total-Count', result.length)
        res.send(result)
        console.log("Records sent!");
    });
}

exports.updateUser = (req, res) => {
    console.log('here', req.body);
    let {id} = req.params;
    let id_ = String(req.body.id);
    let userName = String(req.body.userName);
    let email = String(req.body.EMAIL);
    let password = String(req.body.password);
    let phone = String(req.body.phone);
    let isBanned = req.body.isBanned;
    let noOfTournaments = req.body.noOfTournaments;
    let tour_id = req.body.tour_id;
    let team_id = req.body.team_id;

    con.query("UPDATE gamesystem_modified.players SET id = " + id_ + ", userName = '" + userName + "', email = '" + email + "', password = '" + password + "', isBanned = '" + isBanned + "', phone = '" + phone + "', noOfTournaments = '" + noOfTournaments + "', tour_id = '" + tour_id + "', team_id = '" + team_id + "'  WHERE id = " + id + ";", function (err, result, fields) {
        if (err) throw err;
        console.log("new record added to db");
    });
}

exports.getAUser = (req, res) => {
    const { id } = req.params;
    console.log(id);
    const sql = `SELECT * FROM gamesystem_modified.players where id = ?`;
    const values = [id];
    con.query(sql, values, function (err, result, fields) {
        if (err) throw err;
        res.set('Access-Control-Expose-Headers', 'X-Total-Count')
        res.set('X-Total-Count', result.length)
        res.send(result[0])
        console.log("Records sent!");
    });
}

exports.deleteUser = (req, res) => {
    let id = (req.params.id);
    con.query("DELETE FROM gamesystem_modified.players WHERE id='" + id + "';", function (err, result, fields) {
        if (err) throw err;
        console.log("record deleted from db");
    });
}

exports.addUser = (req, res) => {
    let { id, userName, password, phone, email, isBanned, noOfTournaments } = req.body;
    noOfTournaments = 1;
    isBanned = 0;
    console.log("here", req.body);
    con.query("INSERT INTO gamesystem_modified.players(id, userName, password, phone, email, isBanned, noOfTournaments) VALUES('" + id + "','" + userName + "','" + password + "','" + phone + "','" + email + "','" + isBanned + "','" + noOfTournaments + "');", function (err, result, fields) {
        if (err) throw err;
        console.log("new record added to db");
        res.send({ status: "success" });
    });
}

exports.playerProfile = (req, res) => {
    const player_id = req.params.name;
    console.log(player_id);
    const sql = `select * from gamesystem_modified.players where userName = ?`;

    const value = [player_id];

    con.query(sql, [value], (err, docs) => {
        if (err) {
            return res.status(400).json({
                status: 'error',
                error: {
                    message: err.message,
                },
            });
        }
        console.log(docs);
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Users Data',
                docs,
            },
        });
    });
}

// exports.registerUserInEvent = async (req, res) => {
//     const { tour_id, id } = req.body;
//     let sql = `UPDATE gamesystem_modified.players set tour_id = ? where id = ?`;
//     let values = [tour_id, id];
//     con.query(sql, values, (err, docs) => {
//         if (err) {
//             res.send({ status: 'failed' })
//             throw err
//         };
//         console.log("user registered!");
//     });
//     res.send({ status: 'success' });
//     let response = await axios({
//         method: "GET",
//         url: `http://localhost:4500/registeredPlayers/${tour_id}`
//     });
//     let count = response.data[0].count;
//     console.log(count);
//     response = await axios({
//         method: "GET",
//         url: `http://localhost:4500/eventinfo/${tour_id}`
//     });
//     // count is the max players to start the tournament
//     let max = response.data[0].maxplayers;
//     let members_per_team = parseInt(response.data[0].players_per_team);
//     if (count == max) {
//         console.log("limit has reached");
//         sql = `SELECT * FROM gamesystem_modified.PLAYERS WHERE tour_id = ? ORDER BY userName desc`;
//         values = [tour_id];
//         let team_id = '1';
//         const transport = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: "ahmrledsmart77@gmail.com",
//                 pass: "hdtyrgzpjwxuejcb",
//             },
//         });
//         con.query(sql, values, (err, docs) => {
//             if (err) throw err;
//             console.log(docs);
//             sql = `UPDATE gamesystem_modified.PLAYERS SET team_id = ? where id = ?`;
//             for (let x = 0; x < docs.length; x++) {
//                 let id = docs[x].id;
//                 values = [team_id, id];
//                 console.log(docs[x].EMAIL);
//                 con.query(sql, values, (err, docs) => {
//                     if (err) throw err;
//                     console.log("team set");
//                 });
//                 mailOptions = {
//                     from: "ahmrledsmart77@gmail.com",
//                     to: docs[x].EMAIL,
//                     text: `Hello From World Of Gaming ${docs[x].userName}! Your team id is ${team_id}. Have fun in your gaming!`,
//                 };

//                 // 3) Create a transport and send Email
//                 transport.sendMail(mailOptions);
//                 if ((x + 1) % members_per_team == 0) {
//                     team_id = parseInt(team_id);
//                     team_id++;
//                     team_id = team_id.toString();
//                     console.log(team_id);
//                 }
//             }
//         });
//     }
// }

exports.cancelRegistration = (req, res) => {
    const { tour_id, id } = req.body;
    let sql = `UPDATE gamesystem_modified.players set tour_id = null, team_id = null where id = ?`;
    let values = [id];
    con.query(sql, values, (err, docs) => {
        if (err) {
            res.send({ status: 'failed' })
            throw err
        };
        console.log("user registered!");
    });
    res.send({ status: 'success' });
}

exports.getAUserbyName = (req, res) => {
    const { userName } = req.params;
    // const sql = `SELECT * FROM gamesystem_modified.players where userName = ?`;
    const values = [userName];
    con.query(sql, values, function (err, result, fields) {
        if (err) throw err;
        res.set('Access-Control-Expose-Headers', 'X-Total-Count')
        res.set('X-Total-Count', result.length)
        res.send(result)
        console.log("Records sent!");
    });
}

exports.getTeams = (req, res) => {
    const {id} = req.params;
    const player_id = id;
    const values = [player_id];
    let sql = `SELECT TEAM_ID FROM gamesystem_modified.PREVTEAMS WHERE PLAYER_ID = ?`;
    con.query(sql, values, (err, docs) => {
        res.send(docs);
    });
}

exports.getEvents = (req, res) => {
    const {id} = req.params;
    const player_id = id;
    const values = [player_id];
    let sql = `SELECT TOUR_ID FROM gamesystem_modified.PREVEVENTS WHERE PLAYER_ID = ?`;
    con.query(sql, values, (err, docs) => {
        res.send(docs);
    });
}