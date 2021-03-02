const mongoose = require('mongoose');
const connect = async () => {
    try {
        await mongoose.connect(
            'mongodb://127.0.0.1:27017/node-todo-jest',
            { useUnifiedTopology: true }
        ).then(() =>{
            console.log('Connected successfully')
        });

    } catch (error) {
        console.log(error);
        console.error("Error connecting to mongodb")
    }
}
module.exports = { connect };