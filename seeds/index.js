const mongoose = require('mongoose');
const Launch = require('../models/launch')
const { names, organizations, locations, datetimes } = require('./launch_names')


mongoose.connect('mongodb://localhost:27017/rocket-info', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Launch.deleteMany({});
    for(let i = 0; i < 30; i++) {
        const l = new Launch ({
            organization : `${organizations[i]}`,
            name : `${names[i]}`,
            location : `${locations[i]}`,
            datetime : `${datetimes[i]}`,
            image : {   url: 'https://res.cloudinary.com/dp1oyemr0/image/upload/v1695049961/RocketInfo/czg9s4aci8u1pnxlv2vg.jpg',
            filename: 'RocketInfo/czg9s4aci8u1pnxlv2vg' },
            description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //change before seeding
            //local-- author : '650589d78ae7bd2f9f6ad96e'
            author: '6508988deb4e49c1822fa776'
        })
        await l.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

