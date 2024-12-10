const mongoose = require('mongoose');

const dbConnection = ()=>{

    mongoose.connect(process.env.db_url).then((conn)=>{
        console.log(`Database Conneted: ${conn.connection.host}`);
    })
    // .catch((err)=>{
    //     console.log(`Database Error : ${err}`);
    //     process.exit(1);
    // });

}

module.exports = dbConnection;