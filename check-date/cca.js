exports.main = async (event, callback) => {

    const todaysDate = new Date();
    let ship_date = new Date(event.inputFields['ship_date'] * 1 + 1);
    let isToday

    // Offset the date by 13 hours to NZT
    ship_date.setHours(ship_date.getHours() + 13)

    // Optional for debugging
    console.log("Today: ", todaysDate)
    console.log("Shipped on: ", ship_date)

    if (ship_date.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
        isToday = true
    } else {
        isToday = false
    }

    callback({
        outputFields: {
            isToday: isToday,
            startDate: ship_date,
            todaysDate: todaysDate

        }
    });
}