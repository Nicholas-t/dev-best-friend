/**
 * Store the user hashed passwords
 */
var createUserPwTable = `
CREATE TABLE IF NOT EXISTS pw (
    user_id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    type  varchar(50) NOT NULL,
    hashed_password  varchar(100) NOT NULL
)`;

/**
 * Store developers data
 */
var createDevTable = `
CREATE TABLE IF NOT EXISTS dev (
    id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    email  varchar(50) NOT NULL UNIQUE,
    name  varchar(100) NOT NULL,
    activated  int(11) NOT NULL,
    time_created int(11) NOT NULL,
    last_sign_in int(11) NOT NULL,
    plan int(11) NOT NULL,
    credit int(11) NOT NULL
)`;

/**
 * Store data of the client's of developers
 */
var createClientTable = `
CREATE TABLE IF NOT EXISTS client (
    id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    email  varchar(50) NOT NULL,
    name  varchar(100) NOT NULL,
    project_id  varchar(100) NOT NULL,
    plan_id  varchar(100) NOT NULL,
    refresh_at  int(11) NOT NULL,
    time_created int(11) NOT NULL,
    last_sign_in int(11) NOT NULL
)`;


/**
 * Store the client's credit data which will refresh at client.refresh_at
 */
var createClientCreditTable = `
CREATE TABLE IF NOT EXISTS client_credit (
    client_id  varchar(100) NOT NULL,
    api_id  varchar(100) NOT NULL,
    credit int(11) NOT NULL
)`;

/**
 * Store logs, automatically store input and output as JSON files if exist
 */
var createLogTable = `
CREATE TABLE IF NOT EXISTS log (
    id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    client_id  varchar(100) NOT NULL,
    api_id  varchar(100) NOT NULL,
    dev_id  varchar(100) NOT NULL,
    project_id  varchar(100) NOT NULL,
    timestamp int(11) NOT NULL,
    status  int(5) NOT NULL
)`;

/**
 * Store API data, API is stored in the dev level
 */
var createApiTable = `
CREATE TABLE IF NOT EXISTS api (
    id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    name  varchar(100) NOT NULL,
    endpoint  varchar(100) NOT NULL,
    dev_id  varchar(100) NOT NULL,
    method  varchar(10) NOT NULL,
    output_type  varchar(10) NOT NULL
)`;

/**
 * Store project data
 */
var createProjectTable = `
CREATE TABLE IF NOT EXISTS project (
    uid  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    dev_id  varchar(100) NOT NULL,
    time_created int(11) NOT NULL,
    name  varchar(100) NOT NULL,
    description  varchar(100) NOT NULL,
    icon  varchar(100) NOT NULL,
    new_user_webhook  varchar(100)
)`;

/**
 * Store data of possible plans in a project
 */
var createClientPlanTable = `
CREATE TABLE IF NOT EXISTS client_plan (
    id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    project_id  varchar(100) NOT NULL,
    description  varchar(150) NOT NULL,
    price int(11) NOT NULL,
    label  varchar(100) NOT NULL
)`;


/**
 * Store data of each items in each possible plans in a project
 */
var createClientPlanItemTable = `
CREATE TABLE IF NOT EXISTS client_plan_item (
    id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    plan_id  varchar(100) NOT NULL,
    description varchar(100) NOT NULL,
    api_id  varchar(100),
    credit int(11)
)`;


/**
 * Store data of all pages in a project, path will be derived from name
 */
var createPageTable = `
CREATE TABLE IF NOT EXISTS page (
    id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    project_id  varchar(100) NOT NULL,
    path varchar(100) NOT NULL,
    icon varchar(100) NOT NULL,
    name varchar(100) NOT NULL,
    time_created int(11) NOT NULL,
    type varchar(100) NOT NULL,
    external_url varchar(100)
)`;


/**
 * Store data of the client's batch processes
 */
 var createBatchProcessTable = `
CREATE TABLE IF NOT EXISTS batch_process (
    id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    page_id  varchar(100) NOT NULL,
    client_id  varchar(100) NOT NULL,
    project_id  varchar(100) NOT NULL,
    max_row  int(11) NOT NULL,
    status  int(3) NOT NULL
)`;

 /**
  * Store data of the batch page
  */
  var createBatchInputTable = `
  CREATE TABLE IF NOT EXISTS batch_input (
     page_id  varchar(100) NOT NULL,
     in_file  int(3) NOT NULL,
     key  varchar(100) NOT NULL,
     label  varchar(100) NOT NULL
 )`;

 /**
  * Store data of the batch page
  */
 var createBatchHeaderTable = `
 CREATE TABLE IF NOT EXISTS batch_header (
    page_id  varchar(100) NOT NULL,
    in_file  int(3) NOT NULL,
    key  varchar(100) NOT NULL,
    label  varchar(100) NOT NULL
)`;

/**
 * Store data of inputs in playground pages
 */
 var createInputTable = `
 CREATE TABLE IF NOT EXISTS input (
    page_id  varchar(100) NOT NULL,
    name varchar(100) NOT NULL,
    label varchar(100) NOT NULL,
    type varchar(100) NOT NULL
 )`;

 /**
  * Store data of headers in playground pages
  */
  var createHeadersTable = `
  CREATE TABLE IF NOT EXISTS headers (
     page_id  varchar(100) NOT NULL,
     key_header varchar(100) NOT NULL
  )`;

 /**
  * Store data of inputs in playground pages
  */
 var createDashboardItemTable = `
 CREATE TABLE IF NOT EXISTS dashboard_item (
    id  varchar(100) NOT NULL PRIMARY KEY UNIQUE,
    page_id  varchar(100) NOT NULL,
    name varchar(100) NOT NULL,
    description varchar(100) NOT NULL,
    api_id varchar(100) NOT NULL,
    color varchar(100) NOT NULL,
    row_id int(5) NOT NULL,
    width_in_percentage int(5) NOT NULL
 )`;

 /**
  * Store location data of dashboard item from dashboard pages
  * x, y = 0, 0 means top left top right
  * y will increment by number
  * x will increment by percentage
  */
  var createItemLocationTable = `
  CREATE TABLE IF NOT EXISTS item_location (
      item_id  varchar(100) NOT NULL,
      page_id varchar(100) NOT NULL,
      location_x int(5) NOT NULL,
      location_y int(5) NOT NULL
  )`;


/**
 * Store data of playground API in playground pages
 */
 var createPlaygroundTable = `
 CREATE TABLE IF NOT EXISTS playground (
     page_id  varchar(100) NOT NULL,
     api_id varchar(100) NOT NULL
 )`;



/**
 * Store data of input of items in dashboard pages
 */
 var createItemInputTable = `
 CREATE TABLE IF NOT EXISTS item_input (
     item_id  varchar(100) NOT NULL,
     page_id  varchar(100) NOT NULL,
     key_item  varchar(100) NOT NULL,
     value  varchar(100) NOT NULL
 )`;

 /**
  * Store data of input of items in dashboard pages
  */
 var createItemHeadersTable = `
 CREATE TABLE IF NOT EXISTS item_headers (
     item_id  varchar(100) NOT NULL,
     page_id  varchar(100) NOT NULL,
     key_item  varchar(100) NOT NULL,
     value  varchar(100) NOT NULL
 )`;

module.exports = {
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
    createHeadersTable,
    createPlaygroundTable,
    createItemLocationTable,
    createDashboardItemTable,
    createItemInputTable,
    createItemHeadersTable
}