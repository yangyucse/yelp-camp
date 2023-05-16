
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } }

const ImageSchema = new Schema(
    {
        url: String,
        filename: String
    }

)

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_scale,h_150,w_150')
})

const CampgroundSchema = new Schema({

    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true

        },
        coordinates: {
            type: [Number],
            requried: true

        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts)

CampgroundSchema.virtual('properties.popMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 80)}...</p>`
})

CampgroundSchema.post('findOneAndDelete', async function (campground) {
    //console.log(campground);
    if (campground.reviews.length) {
        await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
