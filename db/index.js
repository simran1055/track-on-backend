import mongoose from 'mongoose';

const databaseUrl = `mongodb://localhost:27017/olcademy`;

mongoose.connect(databaseUrl, {
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected! ');
});
