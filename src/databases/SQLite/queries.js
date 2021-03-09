//SETUP
const sqlite3 = require('sqlite3').verbose();

//VARIABLES
let scoreMapCache = new Map();
let db = new sqlite3.Database('src/databases/score.db');

async function scoreCache() {
    scoreMapCache.clear();
    db.all(`SELECT * FROM scores`, function (err, result) {
        if (err) throw err;
        for (i in result) scoreMapCache.set(result[i].id, result[i].points);
    });
}

async function addScore(id, points = 1) {
    const userscore = scoreMapCache.get(id);
    if (userscore == undefined) {
        db.run(`INSERT INTO scores(id, points) VALUES(?, ?)`, [id, points], function (err) {
            if (err) throw err;
            scoreMapCache.set(id, points);
        });
    } else {
        db.run(`UPDATE scores SET points = ? WHERE id = ?`, [Number(userscore) + Number(points), id], function (err) {
            if (err) throw err;
            scoreMapCache.set(id, Number(userscore) + Number(points));
        });
    }
}

async function deleteScore(id, points) {
    const userscore = scoreMapCache.get(id);
    if (userscore == undefined) return false;
    else if (points) {
        db.run(`UPDATE scores SET points = ? WHERE id = ?`, [Number(userscore) - Number(points), id], function (err) {
            if (err) throw err;
            scoreMapCache.set(id, Number(userscore) - Number(points));
        })
    } else {
        db.run(`DELETE FROM scores WHERE id = ?`, [id], function (err) {
            if (err) throw err;
            scoreMapCache.delete(id);
        })
    }
}

module.exports = { addScore, scoreCache, scoreMapCache, deleteScore };