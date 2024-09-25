const mongoose = require("mongoose");

const ticketsSchema = mongoose.Schema({

   
    tickettitle: { type: String, require },
    category: { type: String, require },
    description: { type: String, require},
    email: { type: String, require},
    telephone: { type: String, require},
    reply: { type: String, require , default:"empty"},

    



}, {

    timestamps: true,

})

const TicketsModel = mongoose.model('tickets', ticketsSchema)

module.exports = TicketsModel