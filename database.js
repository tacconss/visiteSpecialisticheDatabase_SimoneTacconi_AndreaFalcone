
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
        //SIstemare questa parte
        insert: async function (booking) {
            console.log(booking);
            const template = `INSERT INTO booking (idType, date, hour, name) VALUES ('$IDTYPE', '$DATE', '$HOUR', '$NAME' );`;
            
            let keys = Object.keys(booking);
            let values = Object.values(booking);
            let info = keys[keys.length-1].split("-");
            let temp=info[1].split("/");
            let temp2=temp[2]+"-"+(parseInt(temp[1])<10?"0"+temp[1]:temp[1])+"-"+(parseInt(temp[0])<10?"0"+temp[0]:temp[0]);

            console.log("-------")
            console.log("keys: " + keys)
            console.log("values: " + values)
            console.log("info: " + info)
            console.log("-------")
            console.log(info[1])
            console.log("-------")
            
            let num;
            if (info[0] == "Cardiologia") {
                num = 1;
            } else if (info[0] == "Psicologia") {
                num = 2;
            } else if (info[0] == "Oncologia") {
                num = 3;
            } else if (info[0] == "Ortopedia") {
                num = 4;
            } else if (info[0] == "Neurologia") {
                num = 5;
            } else if (info[0] == "Odontoiatria") {
                num = 6;
            }

            let sql = template.replace("$IDTYPE", num);
            sql = sql.replace("$DATE", temp2);
            sql = sql.replace("$HOUR", Number(info[2]));
            sql = sql.replace("$NAME", values[values.length-1]);
            
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
