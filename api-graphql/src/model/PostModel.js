import mongoose from 'mongoose';

const Schema = mongoose.Schema

var User = new Schema({
    username: { type: String },
})

var Comment = new Schema({
    text: { type: String },
})

var File = new Schema({
    base64: { type: String },
    fileName: { type: String },
    lastModified: { type: String },
    size: { type: Number },
    type: { type: String },
})

var PostBank  = new Schema({
    user_bank: { type: Number },
    banks: { type: String },
})

const postSchema = new Schema({
    title: { type: String },
    nameSubname: { type: String },
    idCard: { type: String },
    number: { type: Number },
    dateTranfer: { type: Date},
    body: { type: String },
    banks: [PostBank],
    follows: [{ type: String }],
    isPublish: { type: Number },
    owner_id: {type: String},
    files: [File],
},
{
    timestamps: true
})

/*

title: String!
    nameSubname: String!
    idCard: String
    number: Int
    dateTranfer: DATETIME
    body: String!

    banks: [PostBank]
    follows: [ID]
    isPublish: Int
    owner_id: ID
*/


const Post = mongoose.model('post', postSchema,'post')
export default Post