# HubSpot OperationsHub Custom Coded Action


The idea of this repo is to share Custom Coded Actions which work with HubSpot Operations Hub pro. 
It also provides a "framework" to work locally on your Custom Coded Action and execute it in the same context as HubSpot. 

## How to use


### Prerequisites
- Install Node.js from https://nodejs.org/en/download/

### Clone repo locally
```bash
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

```bash
npm run cca <folder-name>
```
For example, to run the custom code action that gets a contact's name from your HubSpot account, run:
```bash
npm run cca get-contact
```


### Create a new custom code action 


Initialize a new custom code action by calling 

```bash
npm run init <nameOfYourAction>
```

Like :

```bash
npm run init my-new-custom-coded-action
```
A new folder will be created with three files
- cca.js
- event.js
- readme


#### cca.js is where you write your code

```JavaScript 
const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {

  /*****
    How to use secrets
    Secrets are a way for you to save API keys or private apps and set them as a variable to use anywhere in your code
    Each secret needs to be defined like the example below
  *****/

  const hubspotClient = new hubspot.Client({
    accessToken: process.env.SECRET_NAME
  });

  let phone;
  try {
    const ApiResponse = await hubspotClient.crm.contacts.basicApi.getById(event.object.objectId, ["phone"]);
    phone = ApiResponse.body.properties.phone;
  } catch (err) {
    console.error(err);
    // We will automatically retry when the code fails because of a rate limiting error from the HubSpot API.
    throw err;
  }

  /*****
    How to use inputs
    Inputs are a way for you to take data from any actions in your workflow and use it in your code instead of having to call the HubSpot API to get that same data.
    Each input needs to be defined like the example below
  *****/

  const email = event.inputFields['email'];


  /*****
    How to use outputs
    Outputs are a way for you to take data from your code and use it in later workflows actions

    Use the callback function to return data that can be used in later actions.
    Data won't be returned until after the event loop is empty, so any code after this will still execute.
  *****/

  callback({
    outputFields: {
      email: email,
      phone: phone
    }
  });
}

/* A sample event may look like:
{
  "origin": {
    // Your portal ID
    "portalId": 1,

    // Your custom action definition ID
    "actionDefinitionId": 2,
  },
  "object": {
    // The type of CRM object that is enrolled in the workflow
    "objectType": "CONTACT",

    // The ID of the CRM object that is enrolled in the workflow
    "objectId": 4,
  },
  "inputFields": {
    // The property name for defined inputs
  },
  // A unique ID for this execution
  "callbackId": "ap-123-456-7-8"
}
*/
```

#### event.js represents the properties you can include in code

In a HubSpot workflow, these properties can be included in the event object by using the settings within the workflow action editor.


```JavaScript
exports.events = {
    object: {
         objectId: 1
    },
    inputFields: {
        email : "coolrobot@hubspot.com"
    }
}
```

In this example to access email, you have to use : 

```JavaScript
 const email = event.inputFields.email;
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