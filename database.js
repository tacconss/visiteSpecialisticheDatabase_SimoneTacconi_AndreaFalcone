
module.exports = function generateDatabase (conf, mysql) {
    const connection = mysql.createConnection(conf);

    //Query Executers
    const executeQuery = (sql) => {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                    reject();
                }
                resolve(result);
            });
        })
    }

    //Create Table
    const createTable = async function () {
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS type (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name varchar(20)
            );`
        )
        return await executeQuery(`
            CREATE TABLE IF NOT EXISTS booking (
                id int PRIMARY KEY AUTO_INCREMENT,
                idType int NOT NULL,
                date DATE NOT NULL,
                hour INT NOT NULL,
                name VARCHAR(50),
                FOREIGN KEY (idType) REFERENCES type(id) 
            );
        `);
    };(async() => {
        await createTable();
    })();

    

    return {
        insert: async function (visit) {
            const template = `INSERT INTO booking (idType, date, hour, name) VALUES ('$IDTYPE', '$DATE', '$HOUR', '$NAME' );`;
            let sql = template.replace("$IDTYPE", visit.idType);
            sql = sql.replace("$DATE", visit.data);
            sql = sql.replace("$HOUR", visit.hour);
            sql = sql.replace("$NAME", visit.name);
            return await executeQuery(sql);
        },
        select: async function () {
            const sql = `SELECT * FROM booking;`;
            return await executeQuery(sql);
        },
        truncate: async function () {
            const sql = `TRUNCATE TABLE booking;`
            return await executeQuery(sql);
        }
    }
}
