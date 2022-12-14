const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {

    const hubspotClient = new hubspot.Client({
        accessToken: process.env.privateAppToken
    });

    // GET ASSOCIATED COMPANY
    //Varibale to store company ID from API
    let companyId

    try {
        await hubspotClient.crm.contacts.associationsApi
            .getAll(event.object.objectId, 'company')
            .then(results => {
                if (results.body.results.length == 0) {
                    console.log("Contact doesn't have any associated companies");
                    return;
                }
                console.log(results.body.results[0].id);
                companyId = results.body.results[0].id
            })

    } catch (err) {
        console.log(err.message);
        throw err.message;
    }

    // GET COMPANY DETAILS

    // Configure
    const properties = ["name", "hubspot_owner_id"]
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;
    const idProperty = undefined;

    // Variable to store company name from API
    let companyName

    try {

        await hubspotClient.crm.companies.basicApi
            .getById(companyId, properties, propertiesWithHistory, associations, archived, idProperty)
            .then(results => {
                companyName = results.body.properties.name
                console.log(results.body.properties.name);
                console.log(results.body);
            })

    } catch (err) {
        console.log(err);
        throw err;
    }

    callback({
        outputFields: {
            companyId: companyId,
            companyName: companyName
        }
    });

};