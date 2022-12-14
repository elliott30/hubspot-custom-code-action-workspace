exports.main = async (event, callback) => {

    /**
     * Input variables
     * When building in HubSpot, remember to include these properties in the action settings.
     */
    const dealId = event.object.objectId;
    const hs_mrr = event.inputFields.hs_mrr
    const amount = event.inputFields.amount
    const deal_currency_code = event.inputFields.deal_currency_code

    /**
     * The main currency code for your portal. 
     * If the current deal is in the main currency we do not convert the amount
     */
    const mainCurrencyCode = "USD";

    const exchangeRates = [{
        currency: "EUR",
        to: "USD",
        exchangeRate: 1.12
    },
    {
        currency: "GBP",
        to: "USD",
        exchangeRate: 1.34
    }
    ];

    let amountConverted = null;

    // checkif curency had to be formated  
    if (deal_currency_code !== mainCurrencyCode) {

        console.log(`The deal currency code is ${deal_currency_code} and will be formated`);

        // find the exchangeRate based on the current deal currency 
        const rate = exchangeRates.find(er => er.currency === deal_currency_code);

        if (!rate) throw new Error('No rate found for this currency');


        //convert the amount to mainCurrencyCode
        amountConverted = amount * rate.exchangeRate;

    }

    callback({
        outputFields: {
            amountConverted: amountConverted
        }
    });

}