# HubSpot OperationsHub Custom Coded Action


The idea of this repo is to share Custom Coded Actions which work with HubSpot Operations Hub pro. 
It also provides a "framework" to work locally on your Custom Coded Action and execute it in the same context as HubSpot. 



## How to use

Prerequisites
- Install Node.js from https://nodejs.org/en/download/

### Clone repo locally
```
gh repo clone elliott30/hubspot-custom-code-action-workspace
```
### Create a .env file

Create a .env file at the root of the project to store your secrets.

If you're using HubSpot's APIs, you'll need to include a private app token from the HubSpot account you're accessing. Learn more about private app tokens here: https://developers.hubspot.com/docs/api/private-apps

Your .env file will look something like this:
```
privateAppToken = "abcde-fghijk-lmnopq-rstuv-wxyz"
googleApiKey = "1234567890"
```

### (Optional) Test an existing an custom code action

Run one of the existing projects using:

```
npm run cca <folder-name>
```
For example, to run the custom code action that gets a contact's name from your HubSpot account, run:
```
npm run cca get-contact
```


### Create a new custom code action 


Initialize a new custom code action by calling 

```
npm run init <nameOfYourAction>
```

Like :

```
npm run init my-new-custom-coded-action
```
A new folder will be created with three files
- cca.js
- event.js
- readme


#### cca.js is where you write your code

```JavaScript 
const axios = require('axios');

const axiosConfig = {
    headers: {
        authorization: `Bearer ${process.env.privateAppToken}`
    }
};

exports.main = async (event, callback) => {

    /**
     * @name getPortalInfo
     * @desc Grab the portal id and various other infos
     * @returns {promise}it returns an axios object
     */
    const getPortalInfo = async () => {
        const endpoint = `https://api.hubapi.com/integrations/v1/me`;

        return axios.get(endpoint, axiosConfig);
    }

    
    const domainName = event.inputFields.domainName;

    if (!domainName) throw new Error('domainName is not set, are you sure you put domainName in the "properties to include in code" ? ');


    const portalInfos = await getPortalInfo();

    if (!portalInfos.data) throw new Error(`We couldn't grab your portal infos`);

    const { portalId, timeZone, currency } = portalInfos.data;

    callback({
        outputFields: {
            portalId,
            timeZone,
            currency
        }
    });

}
```

#### event.js represents the properties you can include in code

In a HubSpot workflow, these properties can be included in the event object by using the settings within the workflow action editor.


```JavaScript
exports.events = {
    // object: {
    //     objectId: 3401
    // },
    inputFields: {
        domainName : "google.com"
    }
}
```

In this example to access companyName, you have to use : 

```JavaScript
 const domainName = event.inputFields.domainName;
```

### Run custom code action

Execute your code by calling : 

```bash
node run ccs <folder name> 
```

Like:

```bash
node run ccs get-contact 
```