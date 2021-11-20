/**
 * Store the user hashed passwords
 */
 var userPwSchema = {
     user_id : "",
     type : "",
     hashed_password : ""
 }
 
 /**
  * Store developers data
  */
 var devSchema = {
     id : "",
     email : "",
     name : "",
     activated : 0,
     time_created: 0,
     last_sign_in: 0,
     plan: 0,
     credit: 0
 }
 
 /**
  * Store data of the client's of developers
  */
 var clientSchema = {
     id : "",
     email : "",
     name : "",
     project_id : "",
     plan_id : "",
     refresh_at : 0,
     time_created: 0,
     last_sign_in: 0
 }
 
 
 /**
  * Store the client's credit data which will refresh at client.refresh_at
  */
 var clientCreditSchema = {
     client_id : "",
     api_id : "",
     credit: 0
 }
 
 /**
  * Store logs, automatically store input and output as JSON files if exist
  */
 var logSchema = {
     id : "",
     client_id : "",
     api_id : "",
     dev_id : "",
     project_id : "",
     timestamp: 0,
     status : 0
 }
 
 /**
  * Store API data, API is stored in the dev level
  */
 var apiSchema = {
     id : "",
     name : "",
     endpoint : "",
     dev_id : "",
     method : "",
     output_type : ""
 }
 
 /**
  * Store project data
  */
 var projectSchema = {
     uid : "",
     dev_id : "",
     time_created: 0,
     name : "",
     description : "",
     icon : "",
     new_user_webhook  : ""
 }
 
 /**
  * Store data of possible plans in a project
  */
 var clientPlanSchema = {
    id : "",
    project_id : "",
    description : "",
    price: 0,
    label : ""
 }
 
 
 /**
  * Store data of each items in each possible plans in a project
  */
 var clientPlanItemSchema = {
    id : "",
    plan_id : "",
    description: "",
    api_id : "",
    credit : 0
}
 
 
 /**
  * Store data of all pages in a project, path will be derived from name
  */
 var pageSchema = {
     id : "",
     project_id : "",
     path: "",
     icon: "",
     name: "",
     time_created: 0,
     type: "",
     external_url : ""
 }
 
 /**
  * Store data of inputs in playground pages
  */
  var inputSchema = {
    page_id : "",
    name: "",
    label: "",
    type: ""
}

 
 /**
  * Store data of headers in playground pages
  */
  var headersSchema = {
    page_id : "",
    key_header: ""
}

/**
 * Store data of inputs in playground pages
 */
var playgroundSchema = {
    page_id : "",
    api_id : ""
}
 
 /**
  * Store data of items in dashboard pages
  */
 var dashboardItemSchema = {
     id : "",
     page_id : "",
     name: "",
     description: "",
     api_id : "",
     color: "",
     row_id : "",
     width_in_percentage : 0
 } 
 
 /**
  * Store data of input of items in dashboard pages
  */
  var itemInputSchema = {
    page_id : "",
    item_id : "",
    key_item : "",
    value : ""
 }

 /**
  * Store data of header of items in dashboard pages
  */
 var itemHeadersSchema = {
    page_id : "",
    item_id : "",
    key_item : "",
    value : ""
 }
 
 
 /**
  * Store location data of dashboard item from dashboard pages
  * x, y = 0, 0 means top left top right
  * y will increment by number
  * x will increment by percentage
  */
  var itemLocationSchema= {
    item_id : "",
    page_id : "",
    location_x : 0,
    location_y : 0
}



/**
 * Store data of the batch pages configuration
 */
 var batchConfigSchema = {
    id : "",
    page_id: "",
    api_id: "",
    layout : 0,
    heading: "",
    subheading: "",
    check_credit_before_run : false
}

/**
 * Store data of the client's batch processes
 */
 var batchProcessSchema = {
    id : "",
    page_id: "",
    client_id: "",
    time_created : 0,
    time_finished : 0,
    status : 0
}


 /**
  * Store data of the batch page
  */
  var batchInputSchema = {
     page_id: "",
     default_value: "",
     key_item: "",
     label : ""
}



 /**
  * Store data of the batch page
  */
  var batchHeaderSchema = {
    page_id: "",
    default_value: "",
    key_item: "",
    label : ""
}
/**
 * Store data of the batch page
 */
var planPriceStripeSchema = {
    plan_id: "",
    product_stripe_id: "",
    price_stripe_id: ""
}

/**
 * Store data of the checkout sessions of stripe
 */
 var checkoutStripeSchema = {
    time_created: 0,
    user_id: "",
    session_id: ""
}
/**
 * Store data of the batch page
 */
 var userSubscriptionStripeSchema = {
    user_id: "",
    subscription_id: ""
}


 module.exports= {
    userPwSchema,
    devSchema,
    clientSchema,
    clientCreditSchema,
    logSchema,
    apiSchema,
    projectSchema,
    clientPlanSchema,
    clientPlanItemSchema,
    pageSchema,
    inputSchema,
    headersSchema,
    playgroundSchema,
    dashboardItemSchema,
    itemInputSchema,
    itemHeadersSchema,
    itemLocationSchema,
    batchConfigSchema,
    batchProcessSchema,
    batchInputSchema,
    batchHeaderSchema,
    planPriceStripeSchema,
    checkoutStripeSchema,
    userSubscriptionStripeSchema
 }