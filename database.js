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
        //await executeQuery(`TRUNCATE TABLE booking;`);
    })();

    

    return {
        //SIstemare questa parte
        insert: async function (booking) {
            const template = `INSERT INTO booking (idType, date, hour, name) VALUES ('$IDTYPE', '$DATE', '$HOUR', '$NAME' );`;
            
            let keys = Object.keys(booking);
            let values = Object.values(booking);
            let info = keys[keys.length-1].split("-");
            let temp=info[1].split("/");
            let temp2=temp[2]+"-"+(parseInt(temp[1])<10?"0"+temp[1]:temp[1])+"-"+(parseInt(temp[0])<10?"0"+temp[0]:temp[0]);
            
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
            const searchType = `SELECT name FROM type WHERE id=$ID`

            let format = {
                //tipologie: ["Cardiologia", "Psicologia", "Oncologia", "Ortopedia", "Neurologia", "Odontoiatria"]
            }
            let respons = await executeQuery(sql)
            
            for (let i = 0; i < respons.length; i++) {
                let category = await executeQuery(searchType.replace('$ID', respons[i].idType));
                let key = category[0].name + '-' + respons[i].date.getUTCDate() + '/' + (respons[i].date.getUTCMonth() + 1) + '/' + respons[i].date.getUTCFullYear() + '-' + respons[i].hour;
                format[key] = respons[i].name;
            }
            //console.log(format);
            return format
        },
        truncate: async function () {
            const sql = `TRUNCATE TABLE booking;`
            return await executeQuery(sql);
        }
    }
}
