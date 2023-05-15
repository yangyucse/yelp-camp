const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('err', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: "62cddbcf4a98129beebb91f9",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dtzveo5z1/image/upload/v1658071836/YelpCamp/mzo2nu3wkagza8oxblck.jpg',
                    filename: 'YelpCamp/mzo2nu3wkagza8oxblck',


                },
                {
                    url: 'https://res.cloudinary.com/dtzveo5z1/image/upload/v1658066550/YelpCamp/d3hsmuwbke71tay2hsz7.jpg',
                    filename: 'YelpCamp/nmledcsmubfhvzwoy50a',

                }


            ],
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude,
                cities[random1000].latitude]
            },

            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum incidunt error laudantium, quaerat obcaecati ratione itaque atque totam fugiat excepturi possimus natus vitae ullam cum quia deleniti numquam sint! Obcaecati?',
            price: 30
        })
        await camp.save();
    }
}




seedDB().then(() =>
    mongoose.connection.close());
