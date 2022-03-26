const mongoose = require('mongoose');
const User = require('../models/user-model');

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
module.exports = {
    Query: {
        getUser: async(_, args, { res }) => {
        console.log(args.email);
        const user = await User.findOne({username: "testing"});
        console.log(user);
        return user
        }
    },
    Mutation: {
        register: async(_, args, { res }) => {
            const{ email, username, password } = args;
            const alreadyRegistered = await User.findOne({email: email})
            if(alreadyRegistered) {
                console.log('User with that email already registered.');
                return(new User({
                    _id: '',
                    email:'',
                    username: 'already exists', 
                    password: ''
                    
                }));
            }
            const _id = new mongoose.Types.ObjectId();
            const user = new User({
                _id: _id,
                email: email,
                username: username,
                password: password
            })
            console.log(user)
            const saved = await user.save();
            return user;
        }
    }
};
