require('dotenv').config();

// if (!process.env.privateAppToken) throw new Error('The private APP token is missing ');

// takes the folder name from the CLI args
process.argv.splice(0, 2);
let [folderName = false] = process.argv
if (!folderName) throw new error('Missing folderName URL ! Provide the folderName as a first Command Line Interface argument');

// Get script filename from folder
let fileName = "./" + folderName.toString() + "/cca.js";

// Get event filename from frolder
const eventFile = fileName.replace('/cca.js', '/event.js');
let event = null;
try {
    event = require(eventFile).events;
} catch (error) {
    throw new Error(`Looks like the event file is missing, we failed to call ${eventFile}`);
}

// Check that event file includes input fields
if (!event.inputFields) throw new Error('event.inputFields Has to be defined');

const cca = require(fileName);

cca.main(event, output => {

    console.log(output);
});