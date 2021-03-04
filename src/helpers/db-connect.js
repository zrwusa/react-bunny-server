import mongoose  from 'mongoose'

// const connectDB = async function () {
// mongodb+srv://expo_react_bunny:<password>@cluster0.xsvie.mongodb.net/<dbname>?retryWrites=true&w=majority
// mongodb://localhost/my_database
// return await
export const db = mongoose.connect('mongodb+srv://expo_react_bunny:Zrw_6524789@cluster0.xsvie.mongodb.net/expo_react_bunny?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
// }


// connectDB()
//     .then((db) => {
//         console.log('---dbRes', db)

