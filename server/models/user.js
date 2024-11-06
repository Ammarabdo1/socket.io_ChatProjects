const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const ModelSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الاسم مطلوب'],
        minLength: [3, 'يجب أن يكون الاسم مكونًا من 3 أحرف على الأقل'],
        maxLength: [20, 'الحد الأقصى لطول الاسم هو 20 حرفًا'],
    },

    username: {
        type: String,
        required: [true, 'اسم المستخدم مطلوب'],
        unique: true,
        minLength: [3, 'يجب أن يكون اسم المستخدم بطول 3 أحرف على الأقل'],
        maxLength: [30, 'الحد الأقصى لطول اسم المستخدم هو 30 حرفًا'],
    },

    password: {
        type: String,
        required: [true, 'كلمة المرور مطلوبة'],
        minLength: [8, ],
    },

    about: {
        type: String,
        maxLength: [100, 'الحد الأقصى للطول هو 100 حرف'],
    },

    avatar: String
})

ModelSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

ModelSchema.set("toJSON", {virtual: true});

ModelSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) this.password = bcrypt.hashSync(this.password, 8);
})

ModelSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

ModelSchema.methods.getData = function() {
    return {
        id: this._id,
        name: this.name,
        username: this.username,
        about: this.about,
        avatar: this.avatar,
    }
}

ModelSchema.methods.signJWT = function() {
    let data = this.getData();
    data.token = jwt.sign(data, process.env.JWT_SECRET)
    return data;
}

const Model = mongoose.model('User' ,ModelSchema);

module.exports = Model