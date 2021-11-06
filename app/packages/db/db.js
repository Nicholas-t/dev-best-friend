var mysql = require('mysql');

var {
    createUserPwTable,
    createDevTable,
    createClientTable,
    createClientCreditTable,
    createLogTable,
    createApiTable,
    createProjectTable,
    createClientPlanTable,
    createClientPlanItemTable,
    createPageTable,
    createInputTable,
    createPlaygroundTable,
    createDashboardItemTable,
    createItemInputTable,
    createItemLocationTable,
    createHeadersTable,
    createItemHeadersTable
} = require('./queries.js');

class databaseHandler {
	/**
	 * @constructor
	 */
	constructor() {
        this.Description = 'Database Handler for DBF';
        this.con = null;
    }
    
    async start(conf) {
        conf.insecureAuth = true;
        this.con = mysql.createConnection(conf);

        this.con.connect(function(err) {
            if (err){
                console.log(err)
            }
        });
        this.con.query("CREATE DATABASE IF NOT EXISTS dbf", function (err, result) {
            if (err){
                console.log(err)
            }
        });
        this.con.query("use dbf", function (err, result){
            if (err){
                console.log(err)
            }
        });
        this.createTable(createUserPwTable, "pw");
        this.createTable(createDevTable, "dev");
        this.createTable(createClientTable, "client");
        this.createTable(createClientCreditTable, "client_credit");
        this.createTable(createLogTable, "log");
        this.createTable(createApiTable, "api");
        this.createTable(createProjectTable, "project");
        this.createTable(createClientPlanTable, "client_plan");
        this.createTable(createClientPlanItemTable, "client_plan_item");
        this.createTable(createPageTable, "page");
        this.createTable(createInputTable, "input");
        this.createTable(createHeadersTable, "headers");
        this.createTable(createItemInputTable, "item_input");
        this.createTable(createItemHeadersTable, "item_headers");
        this.createTable(createPlaygroundTable, "playground");
        this.createTable(createDashboardItemTable, "dashboard_item");
        this.createTable(createItemLocationTable, "item_location");
        return true
    }

    /**
     * Helper function to run query
     * 
     * @param {String} query 
     * @param {String} table
     */
    async createTable(query, table = ""){
        this.con.query(query, function (err, result){
            if (err){
                console.log(err)
            }
        });
    }

    /**
     * a filtering function for mysql to make process easier
     * 
     * @param {String} X 
     * @param {String} Y 
     * @param {Value} value 
     */
    getXbyY(X, Y, value, cb){
        const query = `SELECT * FROM ${X} WHERE ${Y} = '${value}'`;
        this.con.query(query, cb);
    }


    /**
     * add user to database
     * 
     * @param {String} item 
     * @param {Object} object
     * @param {Function} cb
     */
     add(item, object, cb){
        let query = this._formatObjectToAddQuery(item, object);
        this.con.query(query,  cb);
	}

    /**
     * add user to database
     * 
     * @param {String} item 
     * @param {String} key
     * @param {Number / String} value 
     * @param {Function} cb
     */
    remove(item, key, value, cb){
        let v = this._formatValueForQuery(value)
        let query = `DELETE FROM ${item} WHERE ${key} = ${v}`
        this.con.query(query,  cb);
	}

    /**
     * add user to database
     * 
     * @param {String} item 
     * @param {Object} newRow
     * @param {String} whereKey
     * @param {Number / String} whereValue 
     * @param {Function} cb
     */
    modify(item, newRow, whereKey, whereValue, cb){
        let setCommands = [];
        let keys = Object.keys(newRow)
        for (let i = 0 ; i < keys.length ; i++){
            setCommands.push(`${keys[i]} = ${this._formatValueForQuery(newRow[keys[i]])}`)
        }
        let whereV = this._formatValueForQuery(whereValue)
        let query=`UPDATE ${item} SET ${setCommands.join(", ")} where ${whereKey} = ${whereV}`;
        this.con.query(query,  cb);
	}
    
    /**
     * @param {String} item - name of item / table
     * @param {Function} cb 
     */
    getRowCount(item, cb){
        let query = `SELECT COUNT(*) FROM ${item};`
        this.con.query(query, cb);
    }
    
    /**
     * @param {String} item - name of item / table
     * @param {String} Y - name of column
     * @param {String/Number} value
     * @param {Function} cb 
     */
     getRowCountWhereY(item, Y, value, cb){
        let query = `SELECT COUNT(*) as count FROM ${item} WHERE ${Y}=${this._formatValueForQuery(value)};`
        this.con.query(query, cb);
    }

    /**
     * @param {String} item - name of item / table
     * @param {String} Y - name of column
     * @param {String/Number} value
     * @param {String} groupBy - columns to group by
     * @param {Function} cb 
     */
    getRowCountWhereYGroupBy(item, Y, value, groupBy, cb){
        let query = `SELECT COUNT(*) as count FROM ${item} WHERE ${Y}=${this._formatValueForQuery(value)} GROUP BY ${groupBy};`
        this.con.query(query, cb);
    }

    getUserByEmail(email, cb){
        let query = `SELECT dev.id, dev.email, dev.name, pw.hashed_password, pw.type
            FROM dev
            INNER JOIN pw ON pw.user_id = dev.id
            WHERE dev.email = '${email}';`
        this.con.query(query, (err, dev) => {
            if (err){
                cb( err, []) 
            } else {
                let query = `SELECT client.id, client.project_id, client.email, client.name, pw.hashed_password, pw.type
                    FROM client
                    INNER JOIN pw ON pw.user_id = client.id
                    WHERE client.email = '${email}';`
                this.con.query(query, (err, client) => {
                    if (err){
                        cb(err, [])
                    } else {
                        let userList = dev.concat(client)
                        cb(null, userList)
                    }
                });
            }
        });
    }

    getUserById(id, cb){
        let query = `SELECT dev.id, dev.email, dev.name, pw.hashed_password, pw.type
            FROM dev
            INNER JOIN pw ON pw.user_id = dev.id
            WHERE dev.id = '${id}';`
        this.con.query(query, (err, dev) => {
            if (err){
                cb(err, {})
            } else {
                let query = `SELECT client.id, client.project_id, client.email, client.name, pw.hashed_password, pw.type
                    FROM client
                    INNER JOIN pw ON pw.user_id = client.id
                    WHERE client.id = '${id}';`
                this.con.query(query, (err, client) => {
                    if (err){
                        cb(err, {})
                    } else {
                        let userList = dev.concat(client)
                        if (userList.length == 1) {
                            cb(null, userList[0])
                        } else {
                            cb(null, {})
                        }
                    }
                });
            }
        });
    }
    
    getAllLogByDevId(id, n, offset, cb){
        let query = `SELECT 
                api.name as api_name,
                api.endpoint as api_endpoint, 
                client.name as client_name,
                project.name as project_name,
                project.icon as project_icon, 
                log.client_id as log_client_id,
                log.project_id as log_project_id,
                log.timestamp,
                log.status
            FROM log
            LEFT JOIN api ON api.id = log.api_id
            LEFT JOIN client ON client.id = log.client_id
            LEFT JOIN project ON project.uid = log.project_id
            WHERE log.dev_id = '${id}'
            ORDER BY log.timestamp DESC
            LIMIT ${n}
            OFFSET ${offset};`
        this.con.query(query, cb);
    }

    getUsersOfProjectLog(id, cb){
        let query = `SELECT
                COUNT(*) as count,
                client.name as client_name,
                client.email as client_email,
                client.id as client_id
            FROM log
            LEFT JOIN client ON log.client_id = client.id
            WHERE log.project_id = '${id}' AND NOT log.client_id = ""
            GROUP BY log.client_id
            LIMIT 5;`
        this.con.query(query, cb);
    }

    getUsersOfDevProject(id, cb){
        let query = `SELECT
                client.id as client_id,
                client.name as client_name,
                client.email as client_email,
                client.time_created as client_time_created,
                client.plan_id as client_plan_id,
                project.name as project_name,
                project.icon as project_icon
            FROM client
            LEFT JOIN project ON client.project_id = project.uid
            WHERE project.dev_id = '${id}';`
        this.con.query(query, cb);
    }

    getUsersOfProject(id, cb){
        let query = `SELECT
                client.id as client_id,
                client.name as client_name,
                client.email as client_email,
                client.time_created as client_time_created,
                client.plan_id as client_plan_id,
                project.name as project_name,
                project.icon as project_icon
            FROM client
            LEFT JOIN project ON client.project_id = project.uid
            WHERE client.project_id = '${id}';`
        this.con.query(query, cb);
    }

    getAllLogByProjectUid(projectUid, cb){
        let query = `
        SELECT api.endpoint, COUNT(*) as count
            FROM log 
            LEFT JOIN api ON log.api_id = api.id
            WHERE log.project_id = '${projectUid}'
            GROUP BY log.api_id;`
        this.con.query(query, cb);
    }

    // HELPER FUNCTIONS 
    
    /**
     * 
     * @param {String} item - name of object / table in db
     * @param {Object} object - object that wants to be added to the db
     * @returns 
     */
     _formatObjectToAddQuery(item, object){
        var values = Object.values(object)
        var valuesList = []
        for (let i = 0 ; i < values.length ; i++){
            if (typeof(values[i]) == 'number'){
                valuesList.push(`${values[i]}`)
            } else if (typeof(values[i]) == 'string'){
                valuesList.push(`'${values[i].replace("'", "\"")}'`)
            } else {
                console.error(`invalid type of object : ${values[i]} (${typeof(values[i])})`)
            }
        }
        var valuesString = valuesList.join(", ")
        var keysString = Object.keys(object).join(", ")
        return `INSERT INTO ${item} (${keysString}) 
        VALUES(${valuesString})`;
    }

    _formatValueForQuery(value){
        if (typeof(value) == 'number'){
            return `${value}`
        } else if (typeof(value) == 'string'){
            return `'${value.replace("'", "\"")}'`
        } else {
            console.error(`invalid type of object : ${value} (${typeof(value)})`)
            return value
        }
    }
}

module.exports = databaseHandler;
