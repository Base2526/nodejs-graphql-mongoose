import { gql } from "apollo-server";

export default gql`
  scalar DATETIME
  scalar Long
  scalar Date
  
  type Room {
    _id: ID
    name: String
    summary: String
    description: String
    roomType: String
    maximum_nights: Int
    minimum_nights: Int
    beds: Int
    accommodates: Int
    price: Float
    cleaningFee: Float
  }

  type User {
    _id: ID!
    username: String!
    password: String
    email: String
    displayName: String!
    isActive: String
    roles: [String]!
    image: [File]
    lastAccess: DATETIME
  }

  input UserInput {
    username: String!
    password: String!
    email: String!
    displayName: String!
    isActive: String!
    roles: [String]!
    image: [FileInput]
  }

  type RoomPayLoad {
    status:Boolean
    data:Room
  }
  
  type RoomsPayLoad {
    status:Boolean
    data:[Room]
  }

  type UserPayLoad {
    status:Boolean
    messages:String
    executionTime:String
    data:User
  }

  type UsersPayLoad {
    status:Boolean
    executionTime:String
    data:[User]
  }

  # type Comment {
  #   text:String
  # }

  type File {
    _id: ID!
    base64: String
    fileName: String
    lastModified: DATETIME
    size: Int
    type: String
  }

  type PostBank {
    _id: ID!
    user_bank: Long
    banks: ID
  }
  
  type Post {
    _id: ID!
    title: String!
    nameSubname: String!
    idCard: Long
    number: Int
    dateTranfer: DATETIME
    body: String!
    banks: [PostBank]
    follows: [ID]
    files: [File]
    isPublish: Int
    owner_id: ID
    createdAt : DATETIME
    updatedAt: DATETIME
  }

  type Role {
    _id: ID!
    name: String!
    description: String
    isPublish: Int
  }

  type Bank {
    _id: ID!
    name: String!
    description: String
    isPublish: Int
  }

  type Mail {
    _id: ID!
    name: String!
    description: String
    isPublish: Int
  }

  type Socket {
    _id: ID!
    socketId: String!
    userId: String
  }

  type Comment{
    _id: ID!
    body: String!
    postId: ID!
    createdAt : DATETIME
    updatedAt: DATETIME
  }

  type PostPayLoad {
    status:Boolean
    executionTime:String
    data:Post
  }

  type PostsPayLoad {
    status:Boolean
    executionTime:String
    data:[Post]
  }

  type RolePayLoad {
    status:Boolean
    executionTime:String
    data:Role
  }

  type RolesPayLoad {
    status:Boolean
    executionTime:String
    data:[Role]
  }

  type BankPayLoad {
    status:Boolean
    executionTime:String
    data:Bank
  }

  type BanksPayLoad {
    status:Boolean
    executionTime:String
    data:[Bank]
  }

  type MailPayLoad {
    status:Boolean
    executionTime:String
    data:Mail
  }

  type MailsPayLoad {
    status:Boolean
    executionTime:String
    data:[Mail]
  }

  type SocketPayLoad {
    status:Boolean
    executionTime:String
    data:Socket
  }

  type SocketsPayLoad {
    status:Boolean
    executionTime:String
    data:[Socket]
  }

  type CommentPayLoad{
    status:Boolean
    executionTime:String
    data:Comment
  }

  type CommentsPayLoad{
    status:Boolean
    executionTime:String
    data:[Comment]
  }

  type Query {

    Login(username: String!, password: String!): UserPayLoad

    room(_id: ID!): RoomPayLoad
    rooms: RoomsPayLoad

    User(_id: ID!): UserPayLoad
    Users(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): UsersPayLoad
    getManyUsers(_ids: [ID!]!): UsersPayLoad
    FindUser(filter: PostFilter): UsersPayLoad

    Role(_id: ID!): RolePayLoad
    Roles(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): RolesPayLoad
    getManyRoles(_ids: [ID!]!): RolesPayLoad

    Bank(_id: ID!): BankPayLoad
    Banks(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): BanksPayLoad
    getManyBanks(_ids: [ID!]!): BanksPayLoad

    Mail(_id: ID!): MailPayLoad
    Mails(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): MailsPayLoad
    getManyMails(_ids: [ID!]!): MailsPayLoad

    Socket(_id: ID!): SocketPayLoad
    Sockets(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): SocketsPayLoad
    getManySockets(_ids: [ID!]!): SocketsPayLoad

    Post(_id: ID!): PostPayLoad
    allPosts(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): PostsPayLoad
    _allPostsMeta(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): ListMetadata
  
    
    Comment(_id: ID!): CommentPayLoad
    Comments(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): CommentsPayLoad
  }
  
  input RoomInput {
    name: String
    summary: String
    description: String
    room_type: String
    maximum_nights: Int
    minimum_nights: Int
    beds: Int
    accommodates: Int
    price: Float
    cleaningFee: Float
  }

  input PostInput {
    title: String!
    nameSubname: String!
    idCard: Long
    number: Int
    dateTranfer: DATETIME
    body: String!
    banks: [PostBankInput]
    follows: [ID]
    isPublish: Int
    owner_id: ID
    files: [FileInput]
  }

  input PostBankInput {
    user_bank: Long
    banks: ID
  }

  input RoleInput {
    name: String!
    description: String
    isPublish: Int
  }

  input BankInput {
    name: String!
    description: String
    isPublish: Int
  }

  input MailInput {
    name: String!
    description: String
    isPublish: Int
  }

  input FileInput {
    base64: String
    fileName: String
    lastModified: DATETIME
    size: Int
    type: String
  }

  input CommentInput {
    postId: ID!
    body: String!
  }

  type Mutation {
    createRoom(input: RoomInput): Room
    updateRoom(_id: ID!, input: RoomInput): Room
    deleteRoom(_id: ID!): Room

    createUser(input: UserInput): User
    updateUser(_id: ID!, input: UserInput): User
    deleteUser(_id: ID!): User


    createPost(input: PostInput): Post
    updatePost(_id: ID!, input: PostInput): Post
    deletePost(_id: ID!): Post
    deletePosts(_ids: [ID!]!): deleteType


    createRole(input: RoleInput): Role
    updateRole(_id: ID!, input: RoleInput): Role
    deleteRole(_id: ID!): Role
    deleteRoles(_ids: [ID!]!): deleteType


    createBank(input: BankInput): Bank
    updateBank(_id: ID!, input: BankInput): Bank
    deleteBank(_id: ID!): Bank
    deleteBanks(_ids: [ID!]!): deleteType

    createMail(input: MailInput): Mail
    updateMail(_id: ID!, input: MailInput): Mail
    deleteMail(_id: ID!): Mail
    deleteMails(_ids: [ID!]!): deleteType

    createComment(input: CommentInput): Comment
    updateComment(_id: ID!, input: CommentInput): Comment
    deleteComment(_id: ID!): Comment
    deleteComments(_ids: [ID!]!): deleteType
  }

  type deleteType {
    ok: Int
  }

  input PostFilter {
    q: String
  }

  type ListMetadata {
    count: Int!
  }

  
`;
