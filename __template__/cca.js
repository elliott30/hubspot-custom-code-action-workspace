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
