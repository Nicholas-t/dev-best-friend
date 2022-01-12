const firstDevVisit = (() => {
    return {
        steps : [
            {
                title: `Welcome!`,
                intro : `👋 Hi! Congratulations on creating your account.<br><br><strong>DBF</strong> is the first software to allow API developers 
                    to convert their API into a webapp in under 15 minutes!<br><br>Let me take you for a quick tour of the app 🚀`
            },
            {
                element: document.querySelector('#sidebar > ul > li:nth-child(1)'),
                title: `Dashboard`,
                intro : `The <strong>"Dashboard"</strong> section is where you will find the overview of the analytics of all your projects.
                    <br><br>
                    This includes:
                    <ul>
                        <li>Top users in each of your projects.</li>
                        <li>Chart of new users registered.</li>
                        <li>Chart of API usage.</li>
                        <li>Most recent log.</li>
                    </ul>`
            },
            {
                element: document.querySelector('#sidebar > ul > li:nth-child(2)'),
                title: `My Projects`,
                intro : `The <strong>"My Projects"</strong> section is where you can create new application.`
            },
            {
                element: document.querySelector('#sidebar > ul > li:nth-child(3)'),
                title: `My API`,
                intro : `The <strong>"My API"</strong> section is where you can <i>create</i>, <i>manage</i>, and <i>remove</i>.`
            },
            {
                element: document.querySelector('#sidebar > ul > li:nth-child(4)'),
                title: `My Users`,
                intro : `The <strong>"My Users"</strong> section is where you can view all users that signed up in your applications.
                    <br><br>
                    This includes:
                    <ul>
                        <li>Viewing your user's API usage.</li>
                        <li>Manually add credits for a user.</li>
                        <li>Chat directly with your users.</li>
                    </ul>`
            },
            {
                element: document.querySelector('#sidebar > ul > li:nth-child(5)'),
                title: `Logs`,
                intro : `The <strong>"Logs"</strong> section is where you can view all your API logs in your application.`
            },
            {
                title: `You're all set!`,
                intro : `Now you are ready to create your first application 🚀
                    <br><br>
                    As mentioned, the first step is to let us know about your API endpoint, <a href="/dev/api">this</a> will take you there.`
            }
        ]
    }
})

const firstDevApi = (() => {
    return {
        steps : [
            {
                title: `API Section`,
                intro : `Welcome to the API section 😀
                    <br><br>
                    Here you can see all the API you have defined.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div > div > div > div > p > a'),
                title: `Create`,
                intro : `You can create your first API by clicking here.`
            }
        ]
    }
})

const firstDevCreateApiSection = (() => {
    return {
        steps : [
            {
                title: `Define your API`,
                intro : `Let's create your first API.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(1) > div'),
                title: `Create API Form`,
                intro : `Here you see the form to define your API.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(1) > div > div > form > div:nth-child(1)'),
                title: `API Name`,
                intro : `Here you can define the name of your API.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(1) > div > div > form > div:nth-child(2)'),
                title: `API Endpoint`,
                intro : `Here you can define the endpoint of the API. The endpoint is the url of the API including the path. <strong>NOT</strong> including the path parameter.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(1) > div > div > form > div:nth-child(3)'),
                title: `API Method`,
                intro : `Here you can define the API method i.e. GET or POST.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(1) > div > div > form > div:nth-child(4)'),
                title: `Output Type`,
                intro : `Here you can define the API output type, which includes JSON, Chart, Table.`
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(2) > div'),
                title: `Testing API Form`,
                intro : `In here you can test your API before submitting your new API.`
            }
        ]
    }
})

const firstDevViewApiSection = (() => {
    return {
        steps : [
            {
                title: `API View`,
                intro : `In this section, you can view your API details.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div.row > div.col-7.grid-margin.stretch-card'),
                title: `API Details`,
                intro : `Here you can modify your API configurations.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div.row > div.col-5.grid-margin.stretch-card'),
                title: `API Log`,
                intro : `Here you can view the most recent API log.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(2) > div'),
                title: `API Default Parameter`,
                intro : `In here you can add your default parameters for this API which you can import when using your API in your projects.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(3) > div'),
                title: `API Testing Area`,
                intro : `In here you can test your API before submitting it.`
            }
        ]
    }
})

const firstDevProject = (() => {
    return {
        steps : [
            {
                title: `Project Section`,
                intro : `Welcome to the Project section 😀
                    <br><br>
                    Here you can see all the Project / Application you have defined.`
            }, 
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div > div > div > div > p > a'),
                title: `Create`,
                intro : `You can create your first Project by clicking here.`
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div > div > div > div > div > table > thead > tr > th:nth-child(1)'),
                title: `UID`,
                intro : `Once a project is created, an automatic login and register page is created which you can access through dev-bf.com/p/<strong>[UID]</strong>`
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div > div > div > div > div > table > thead > tr > th:nth-child(5)'),
                title: `Admin view`,
                intro : `You will also have admin access to the app which you can access in this column`
            }
        ]
    }
})

const firstDevAdminSection = (() => {
    return {
        steps : [
            {
                title: `Admin Section`,
                intro : `Welcome to the admin section of your project 😀
                    <br><br>
                    We will take you around the sections of your application that is available <u>only</u> for users that has <strong>admin</strong> access.`
            },
            {
                element: document.querySelector('#sidebar > li:nth-child(2)'),
                title: `Project Pages`,
                intro : `The <strong>"Manage Pages"</strong> section is where you can create, view, and manage all pages that are accessible by your user.
                <br><br>
                This includes:
                <ul>
                    <li>Creating a new page.</li>
                    <li>Manage existing pages.</li>
                    <li>Delete existing pages.</li>
                </ul>`
            },
            {
                element: document.querySelector('#sidebar > li:nth-child(3)'),
                title: `CRM`,
                intro : `The <strong>"CRM"</strong> section is where you can manage your users.
                <br><br>
                This includes:
                <ul>
                    <li>Searching your users.</li>
                    <li>Adding custom fields.</li>
                    <li>Visualization (Coming Soon).</li>
                </ul>`
            },
            {
                element: document.querySelector('#sidebar > li:nth-child(4)'),
                title: `Manage Project`,
                intro : `The <strong>"Manage Project"</strong> section is where you can manage your pages configuration.
                <br><br>
                This includes:
                <ul>
                    <li>The plans available for your users.</li>
                    <li>New users webhook.</li>
                    <li>Uploading custom logo.</li>
                    <li>Your API Key.</li>
                    <li>Delete the project.</li>
                </ul>`
            },
            {
                element: document.querySelector('#sidebar > li:nth-child(5) a'),
                intro : `You can also go back to your developer's dashboard by clicking here.`
            },
            {
                element: document.querySelector('#sidebar > li:nth-child(4)'),
                title: `First step`,
                intro : `The first step is to create the available plans for your project which you can do in here.`
            }
        ]
    }
})

const firstDevManageSection = (() => {
    return {
        steps : [
            {
                title: `Manage Section`,
                intro : `Welcome to the manage section of your project 😀
                    <br><br>
                    Here you can modify the configuration of your project.`
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(1) > div > div'),
                title: `Plan section`,
                intro : `Here you can see all the possible plans of your project. Remember, everything is customizable so you can have a custom name, description, price, etc.`,
                position : "left"
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(2) > div:nth-child(1) > div'),
                title: `New User Webhook`,
                intro : `Here you can set up a webhook, so everytime a new user signed up in this project, we will send a POST request with your user data.`,
                position : "right"
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(2) > div:nth-child(2) > div'),
                title: `Custom logo`,
                intro : `Here you can upload a custom logo for your application. We accept .png image file.`,
                position : "left"
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(3) > div:nth-child(1) > div'),
                title: `Delete project`,
                intro : `Mistakes happen! If you want to delete this project you can do it here.`,
                position : "right"
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(3) > div:nth-child(2) > div'),
                title: `Dev API Key`,
                intro : `You will need this API Key if you want to integrate your app using integromat. (Coming soon)`,
                position : "left"
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(1) > div > div > div > h4 > a'),
                title: `Create a plan`,
                intro : `As mentioned, let's create your first plan. You can do it here.`
            }
        ]
    }
})

const firstDevCrmSection = (() => {
    return {
        steps : [
            {
                title: `CRM Section`,
                intro : `Welcome to the CRM section of your project 😀
                    <br><br>
                    Here you can have an in-depth look at your user database.`
            },
            {
                element: document.querySelector('body > div > div > div > div > div:nth-child(1) > div'),
                title: `Your users`,
                intro : `Here, you can see the list of all your that is registered in this project and their corresponding plan`
            },
            {
                element: document.querySelector('body > div > div > div > div > div:nth-child(2) > div'),
                title: `Custom Field`,
                intro : `Here, you can see the custom fields you have defined for your CRM.`
            },
            {
                element: document.querySelector('body > div > div > div > div > div:nth-child(2) > div > div > div > div > a'),
                title: `Create a Custom Field`,
                intro : `Let's create a custom field!`
            }
        ]
    }
})



const firstDevModifyPlanSection = (() => {
    return {
        steps : [
            {
                title: `Manage your plans`,
                intro : `Congratulations on creating your first plan! 🚀 You are one step closer in monetizing your API.`
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(1) > div'),
                title: `Plan Configuration`,
                intro : `Here you can modify the plan configurations such as the name of the plan, price, description, etc.`,
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div.row > div > div'),
                title: `API Credits`,
                intro : `Here you can specify which API is included in the plan, and the limit for each API.`,
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div.row > div > div > form > div.btn.btn-success.mr-2'),
                title: `Add new item`,
                intro : `You can add new API in the plan by clicking here.`,
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div.row > div > div > form > button'),
                title: `Submit`,
                intro : `Once you are happy with the API in the plans, click here to save the plan.`,
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(3) > div > div'),
                title: `Delete the plan`,
                intro : `You can also click here to delete the plan.`,
            }            
        ]
    }
})

const firstDevModifyPageSection = (() => {
    return {
        steps : [
            {
                title: `Modify your page`,
                intro : `Congratulations on creating your first page! 🚀 In this page, you can modify your page configurations.`
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div:nth-child(1) > div > div'),
                title: `Page Configuration`,
                intro : `You can modify the page configuration here.`,
            },
            {
                element: document.querySelector('#modify-form'),
                title: `On Page Elements`,
                intro : `You can modify the on-page elements here.`,
            }          
        ]
    }
})

const firstDevCreatePageSection = (() => {
    return {
        steps : [
            {
                title: `Create your page`,
                intro : `Let's create your first page. In this page, you can modify your page configurations.`
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div > div > div > form > div:nth-child(2)'),
                title: `Page Name`,
                intro : `You can insert the name of the page here. 
                <br><br>
                Once you change this field, we will automatically fill in the <strong>Path</strong> parameters by a <i>url friendly</i> version of the page name.
                `
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div > div > div > form > div:nth-child(3)'),
                title: `Page Type (1/2)`,
                intro : `You can choose the type of the page here. 
                <br><br>
                You can choose among several types which are:
                <ul>
                    <li><strong>Playground</strong> : An API Playground is a form-style way to interact with your API.</li>
                    <li><strong>Batch</strong> : Allow your users to upload a csv file with each row as an API parameter and returns a downloadble csv.</li>
                </ul>
                `
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div > div > div > form > div:nth-child(3)'),
                title: `Page Type (2/2)`,
                intro : `
                <ul>
                    <li><strong>Dashboard</strong> : Using a pre-defined parameter, you can create a dashboard that helps your users visualize through your API data.</li>
                    <li><strong>External Link</strong> : Create a button in the sidebar that when clicked will redirect to a different link.</li>
                    <li><strong>Documents</strong> : Creeate a document style perfect for paragraphs, or documentations using markdown format.</li>
                </ul>
                `
            },
            {
                element: document.querySelector('body > div.container-scroller > div > div > div > div > div > div > form > div:nth-child(4)'),
                title: `Page Icon`,
                intro : `
                You can also personalize the icon of your page that will appear in the sidebar.
                `
            }
        ]
    }
})

const firstClientChoosePlanSection = (() => {
    return {
        steps : [
            {
                title: `Welcome!`,
                intro : `👋 Hi! Congratulations on creating your account.
                <br><br>
                Before we take you around, let's get you into a plan.`
            }
        ]
    }
})

const firstClientVisit = (() => {
    return {
        steps : [
            {
                title: `Congratulations!`,
                intro : `It seems like you have picked a plan! Let's take you around your dashboard`
            },
            {
                element: document.querySelector('#sidebar'),
                title: `The Project Page(s)`,
                intro : `Here you see all the pages that you can use in this app.`
            },
            {
                element: document.querySelector('#sidebar > li:nth-child(2) > a'),
                title: `Your Space`,
                intro : `You can always visit your user's space by clicking here.`
            },
            {
                element: document.querySelector('#sidebar > li:nth-child(3) > a'),
                title: `Account Settings`,
                intro : `You can modify or view your account settings here.`
            },
            {
                element: document.querySelector('#plan_name'),
                title: `Your plan`,
                intro : `In here, you can see the plan you are in.`
            },
            {
                element: document.querySelector('body > div > div > div > div > div > div:nth-child(1) > div > div > div.row > div:nth-child(2) > div:nth-child(1) > p > a'),
                title: `Change your plan`,
                intro : `In here, you can also change your plan.`
            },
            {
                element: document.querySelector('#api-list'),
                title: `Your credits`,
                intro : `In here, you can see all the usable credits you have left.`
            },
            {
                element: document.querySelector('body > div > div > div > div > div > div:nth-child(1) > div > div > div.row > div:nth-child(1)'),
                title: `API Usage`,
                intro : `In here, you can see your API usage.`
            },
            {
                element: document.querySelector('#api-key'),
                title: `Your API Key`,
                intro : `In here, you can see your API key.`
            },
            {
                element: document.querySelector('#chat'),
                title: `Chat with the developer`,
                intro : `You can chat directly with the developer here.`
            }
        ]
    }
})


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

const devTours = {
    first_dev_visit_tour : {
        options : firstDevVisit,
        url : /\/dev$/g
    },
    first_dev_api_tour : {
        options : firstDevApi,
        url: /\/dev\/api$/g
    },
    first_dev_view_api_tour : {
        options : firstDevViewApiSection,
        url: /\/dev\/api\/view\/(.*)$/g
    },
    first_dev_create_api_section_tour : {
        options : firstDevCreateApiSection,
        url: /\/dev\/api\/create$/g
    },
    first_dev_project_tour : {
        options : firstDevProject,
        url: /\/dev\/project$/g
    },
    first_dev_admin_section_tour : {
        options : firstDevAdminSection,
        url: /\/p\/(.*)\/admin$/g
    },
    first_dev_manage_section_tour : {
        options : firstDevManageSection,
        url: /\/p\/(.*)\/manage$/g
    },
    first_dev_crm_section_tour : {
        options : firstDevCrmSection,
        url: /\/p\/(.*)\/crm$/g
    },
    first_dev_modify_plan_section_tour : {
        options : firstDevModifyPlanSection,
        url: /\/p\/(.*)\/manage\/modify\/plan/g
    },
    first_dev_modify_page_section_tour : {
        options : firstDevModifyPageSection,
        url: /\/p\/(.*)\/admin\/modify\//g
    },
    first_dev_create_page_section_tour : {
        options : firstDevCreatePageSection,
        url: /\/p\/(.*)\/admin\/create$/g
    }
}

const clientTours = {
    first_client_visit_tour : {
        options : firstClientVisit,
        url : /\/p\/(.*)\/home$/g
    },
    first_client_choose_plan_section_tour : {
        options : firstClientChoosePlanSection,
        url : /\/p\/(.*)\/choose-plan$/g
    }
}
    

async function startTour(type){
    const tours = type === "dev"
        ? devTours
        : type === "client"
            ? clientTours
            : {}
    let keys = Object.keys(tours)
    var url = window.location.href;
    var domain = url.replace('http://','').replace('https://','').split("?")[0];
    let path = "/" + domain.split("/").slice(1).join("/")
    if (path.endsWith("/")){
        path = path.slice(0, path.length - 1)
    }
    for (let i = 0 ; i < keys.length ; i ++){
        if(localStorage.getItem(keys[i]) === null){
            if (path.match(tours[keys[i]].url)){
                await sleep(1000).then(async () => {
                    await introJs().setOptions(tours[keys[i]].options()).start();
                    localStorage.setItem(keys[i], "done")
                })
            }
        }
    }
}

async function manualRunTour(type){
    const tours = type === "dev"
        ? devTours
        : type === "client"
            ? clientTours
            : {}
    let keys = Object.keys(tours)
    var url = window.location.href;
    var domain = url.replace('http://','').replace('https://','').split("?")[0];
    let path = "/" + domain.split("/").slice(1).join("/")
    if (path.endsWith("/")){
        path = path.slice(0, path.length - 1)
    }
    for (let i = 0 ; i < keys.length ; i ++){
        if (path.match(tours[keys[i]].url)){
            await sleep(1000).then(async () => {
                await introJs().setOptions(tours[keys[i]].options()).start();
            })
        }
    }
}