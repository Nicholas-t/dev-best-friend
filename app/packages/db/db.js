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
    createItemHeadersTable,
    createBatchConfigTable,
    createBatchProcessTable,
    createBatchInputTable,
    createBatchHeaderTable,
    createPlanPriceStripeTable,
    createCheckoutStripeTable,
    createUserSubscriptionStripeTable
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
        this.createTable(createBatchConfigTable, "batch_config");
        this.createTable(createBatchProcessTable, "batch_process");
        this.createTable(createBatchInputTable, "batch_input");
        this.createTable(createBatchHeaderTable, "batch_header");
        this.createTable(createPlanPriceStripeTable, "plan_price_stripe");
        this.createTable(createCheckoutStripeTable, "checkout_stripe");
        this.createTable(createUserSubscriptionStripeTable, "user_subscription_stripe");
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

    getProjectPlan(projectId, cb){
        let query = `SELECT * FROM client_plan WHERE project_id='${projectId}' ORDER BY price ASC;`
        this.con.query(query, cb);
    }
    
    getUserLog(clientId, apiId, cb){
        let query = `SELECT * FROM log WHERE client_id='${clientId}' AND api_id='${apiId}';`
        this.con.query(query, cb);
    }

    getCheckout(currentTime, userId, cb){
        let query = `SELECT * FROM checkout_stripe
         WHERE user_id='${userId}' AND time_created=${currentTime};`
        this.con.query(query, cb);
    }

    decrementCreditUser(clientId, apiId, cb){
        let query = `UPDATE client_credit
        SET credit = credit - 1
        WHERE client_id = '${clientId}'
        AND api_id = '${apiId}';`
        this.con.query(query, cb);
    }

    getAvailableApiInProject(projectUid, cb){
        let query = `SELECT 
            DISTINCT client_plan_item.api_id
            FROM client_plan
            LEFT JOIN client_plan_item ON client_plan.id = client_plan_item.plan_id
            WHERE client_plan.project_id = '${projectUid}';`
        this.con.query(query, (err, result) => {
            let queryApiId = []
            let queryApiIdString = ''
            for (let i = 0 ; i < result.length ; i++){
                queryApiId.push(`'${result[i].api_id}'`)
            }
            queryApiIdString = queryApiId.join(", ")
            query = `SELECT *
                FROM api
                WHERE api.id IN (${queryApiIdString});`
            this.con.query(query, cb);
        })
    }

    checkUserAvailableCredit(apiId, userId, planId, cb){
        let query = `SELECT *
            FROM client_credit
            WHERE client_credit.client_id = '${userId}'
            AND client_credit.api_id = '${apiId}';`
        this.con.query(query, (err, clientCreditItem) => {
            if (err){
                cb(err, null)
            } else {
                let out = {}
                if (clientCreditItem.length == 0){
                    out.error = "No credit for this API"
                    cb(err, out)
                } else {
                    out.credit_available = clientCreditItem[0].credit
                    cb(err, out)
                }
            }
        })
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
                let query = `SELECT client.id, client.project_id, client.plan_id, client.email, client.name, pw.hashed_password, pw.type
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
                let query = `SELECT client.id, client.plan_id, client.project_id, client.email, client.name, pw.hashed_password, pw.type
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

    getAllProcessesOfPage(pageId, userId, cb){
        let query = `SELECT * FROM batch_process
        WHERE page_id = '${pageId}' AND client_id = '${userId}';`
        this.con.query(query, cb);
    }

    getBatchProcessDetail(processId, cb){
        let query = `SELECT 
        batch_process.id as process_id, 
        batch_config.api_id as api_id, 
        batch_config.page_id as page_id, 
        batch_config.check_credit_before_run as check_credit_before_run
            FROM batch_process
            INNER JOIN batch_config ON batch_config.page_id = batch_process.page_id
            WHERE batch_process.id = '${processId}';`
        this.con.query(query, (err, _batchConfig) => {
            if (err){
                cb(err, {})
            } else {
                const batchConfig = _batchConfig[0]
                let query = `SELECT *
                FROM batch_input
                WHERE batch_input.page_id = '${batchConfig.page_id}';`
                this.con.query(query, (err, batchInput) => {
                    batchConfig.input = batchInput
                    let query = `SELECT *
                    FROM batch_header
                    WHERE batch_header.page_id = '${batchConfig.page_id}';`
                    this.con.query(query, (err, batchHeader) => {
                        batchConfig.header = batchHeader
                        cb(err, batchConfig)
                    })
                })
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
            } else if (typeof(values[i]) == 'boolean'){
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
