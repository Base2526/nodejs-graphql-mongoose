import {Bank, Post, Role, Room, User, Comment} from './model'
import {emailValidate} from './utils'

const _ = require("lodash");

export default {
  Query: {

    // Login & Logout
    async Login(root, {
      username, 
      password
    }) {
      let start = Date.now()

     

      // let user = null;
      // if(emailValidate().test(username)){
      //   user = await User.findOne({email: username})
      // }else{
      //   user = await User.findOne({username})
      // }

      let user = emailValidate().test(username) ?  await User.findOne({email: username}) : await User.findOne({username})

      if(user === null){
        return {
          status: false,
          messages: "xxx", 
          data:{
            _id: "",
            username: "",
            password: "",
            email: "",
            displayName: "",
            roles:[]
          },
          executionTime: `Time to execute = ${
            (Date.now() - start) / 1000
          } seconds`
        }
      }

      // update lastAccess
      await User.findOneAndUpdate({
        _id: user._doc._id
      }, {
        lastAccess: Date.now()
      }, {
        new: true
      })

      user = emailValidate().test(username) ?  await User.findOne({email: username}) : await User.findOne({username})

      let roles = await Promise.all(_.map(user.roles, async(_id)=>{
        let role = await Role.findById(_id)
        console.log("_id", _id, role)
        return role.name
      }))
      user = {...user._doc,  roles}

      console.log("Login vvv", user )

      return {
        status: true,
        messages: "", 
        data: user,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // Login & Logout

    // room
    async room(root, {
      _id
    }) {
      console.log("room")

      let data = await Room.findById(_id)

      return {
        status:true,
        data
      }
    },
    async rooms() {
      console.log("rooms")

      let data = await Room.find()
      return {
        status:true,
        data
      }
    },
    // room
    // user
    async User(root, {
      _id
    }) {
      let room = await Room.find()
      console.log("user :", room)

      let data = await User.findById(_id);
      return {
        status:true,
        data
      }
    },
    // async users() {
    //   let room = await Room.find()

    //   console.log("users >>> :", room)
    //   let data = await User.find();
    //   return {
    //     status:true,
    //     data
    //   }
    // },

    async Users(root, {
      page,
      perPage, 
      sortField,
      sortOrder, 
      filter
    }) {

      let start = Date.now()

      console.log("users: page : ", page,
                  ", perPage : ", perPage, 
                  ", sortField : ", sortField,
                  ", sortOrder : ", sortOrder, 
                  ", filter : ", JSON.parse(JSON.stringify(filter)),
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      let data = await User.find();

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    // 
    async getManyUsers(root, {
      _ids
    }) {
      console.log("getManyUsers :", _ids)

      let start = Date.now()

      let data =  await User.find({_id: {
        $in: _ids,
      }})

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async FindUser(root, {
      filter
    }) {

      let start = Date.now()

      console.log("FindUser filter : ", JSON.parse(JSON.stringify(filter.q)),
                  `Time to execute = ${ (Date.now() - start) / 1000 } seconds` )

      let q = filter.q.split("=")


      let data = await User.find({[q[0]]:q[1]});

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // user

    // post
    
    async Post(root, {
      _id
    }) {

      
      let data = await Post.findById(_id);

      console.log("Post: ", data)
      return {
        status:true,
        data
      }
    },
    // allPosts(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): [Post]

    async allPosts(root, {
      page,
      perPage, 
      sortField,
      sortOrder, 
      filter
    }) {

      let start = Date.now()

      console.log("allPosts: page : ", page,
                  ", perPage : ", perPage, 
                  ", sortField : ", sortField,
                  ", sortOrder : ", sortOrder, 
                  ", filter : ", JSON.parse(JSON.stringify(filter)),
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      let data = await Post.find();

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // post

    // Role
    async Role(root, {
      _id
    }) {

      let data = await Role.findById(_id);
      return {
        status:true,
        data
      }
    },
    async Roles(root, {
      page,
      perPage, 
      sortField,
      sortOrder, 
      filter
    }) {

      let start = Date.now()

      console.log("allPosts: page : ", page,
                  ", perPage : ", perPage, 
                  ", sortField : ", sortField,
                  ", sortOrder : ", sortOrder, 
                  ", filter : ", JSON.parse(JSON.stringify(filter)),
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      let data = await Role.find();

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async getManyRoles(root, {
      _ids
    }) {
      console.log("getManyRoles :", _ids)

      let start = Date.now()


      let data =  await Role.find({_id: {
        $in: _ids,
      }})

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
  
    // Role

    // Bank
    async Bank(root, {
      _id
    }) {

      let data = await Bank.findById(_id);
      return {
        status:true,
        data
      }
    },
    async Banks(root, {
      page,
      perPage, 
      sortField,
      sortOrder, 
      filter
    }) {

      let start = Date.now()

      console.log("allPosts: page : ", page,
                  ", perPage : ", perPage, 
                  ", sortField : ", sortField,
                  ", sortOrder : ", sortOrder, 
                  ", filter : ", JSON.parse(JSON.stringify(filter)),
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      let data = await Bank.find();

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async getManyBanks(root, {
      _ids
    }) {
      console.log("getManyBanks :", _ids)

      let start = Date.now()


      let data =  await Bank.find({_id: {
        $in: _ids,
      }})

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // Bank

    // Comment 
    async Comment(root, {
      _id
    }) {

      let data = await Comment.findById(_id);
      return {
        status:true,
        data
      }
    },
    async Comments(root, {
      page,
      perPage, 
      sortField,
      sortOrder, 
      filter
    }) {

      let start = Date.now()

      console.log("allPosts: page : ", page,
                  ", perPage : ", perPage, 
                  ", sortField : ", sortField,
                  ", sortOrder : ", sortOrder, 
                  ", filter : ", JSON.parse(JSON.stringify(filter)),
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      let data = await Comment.find();

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    
    // Comment
  },
  Mutation: {
    // room
    async createRoom(root, {
      input
    }) {
      console.log("createRoom :", input)
      return await Room.create(input);
    },
    async updateRoom(root, {
      _id,
      input
    }) {
      console.log("updateRoom :", _id, input)
      return await Room.findOneAndUpdate({
        _id
      }, input, {
        new: true
      })
    },
    async deleteRoom(root, {
      _id
    }) {
      console.log("deleteRoom :", _id)
      return await Room.findByIdAndRemove(_id)
    },
    // room

    // user
    async createUser(root, {
      input
    }) {
      console.log("createUser :", input)
      return await User.create(input);
    },
    async updateUser(root, {
      _id,
      input
    }) {
      console.log("updateUser :", _id, input)
      return await User.findOneAndUpdate({
        _id
      }, input, {
        new: true
      })
    },
    async deleteUser(root, {
      _id
    }) {
      console.log("deleteUser :", _id)
      return await User.findByIdAndRemove(_id)
    },
    // user

    // post
    
    async createPost(root, {
      input
    }) {
      console.log("createPost :", input)
      return await Post.create(JSON.parse(JSON.stringify(input)));
    },

    async updatePost(root, {
      _id,
      input
    }) {
      console.log("updatePost :", JSON.parse(JSON.stringify(input)))
      return await Post.findOneAndUpdate({
        _id
      }, input, {
        new: true
      })
    },

    async deletePost(root, {
      _id
    }) {
      console.log("deletePost :", _id)
      return await Post.findByIdAndRemove({_id})
    },

    // deletePosts
    async deletePosts(root, {
      _ids
    }) {
      
      console.log("deletePosts :",JSON.parse(JSON.stringify(_ids)))

      let deleteMany =  await Post.deleteMany({_id: {
        $in: _ids,
      }})
      return deleteMany;
    },

    // post

    // role     
    async createRole(root, {
      input
    }) {
      console.log("createRole :",JSON.parse(JSON.stringify(input)))

      return await Role.create(JSON.parse(JSON.stringify(input)));
    },
    async updateRole(root, {
      _id,
      input
    }) {
      console.log("updateRole :", _id, JSON.parse(JSON.stringify(input)))
      
      return await Role.findOneAndUpdate({
        _id
      }, input, {
        new: true
      })
    },
    async deleteRole(root, {
      _id
    }) {
      console.log("deleteRole :", _id)

      return await Role.findByIdAndRemove({_id})
    },
    async deleteRoles(root, {
      _ids
    }) {
      console.log("deleteRole :", _ids)

      let deleteMany =  await Role.deleteMany({_id: {
        $in: _ids,
      }})
      return deleteMany;
    },
    // role

    // bank
    async createBank(root, {
      input
    }) {
      console.log("createBank :",JSON.parse(JSON.stringify(input)))

      return await Bank.create(JSON.parse(JSON.stringify(input)));
    },
    async updateBank(root, {
      _id,
      input
    }) {
      console.log("updateBank :", _id, JSON.parse(JSON.stringify(input)))
      
      return await Bank.findOneAndUpdate({
        _id
      }, input, {
        new: true
      })
    },
    async deleteBank(root, {
      _id
    }) {
      console.log("deleteBank :", _id)

      return await Bank.findByIdAndRemove({_id})
    },
    async deleteBanks(root, {
      _ids
    }) {
      console.log("deleteBanks :", _ids)

      let deleteMany =  await Bank.deleteMany({_id: {
        $in: _ids,
      }})
      return deleteMany;
    },
    // bank

    // comment
    async createComment(root, {
      input
    }) {
      console.log("createComment :",JSON.parse(JSON.stringify(input)))

      return await Comment.create(JSON.parse(JSON.stringify(input)));
    },

    async updateComment(root, {
      _id,
      input
    }) {
      console.log("updateComment :", _id, JSON.parse(JSON.stringify(input)))
      
      return await Comment.findOneAndUpdate({
        _id
      }, input, {
        new: true
      })
    },

    async deleteComment(root, {
      _id
    }) {
      console.log("deleteComment :", _id)

      return await Comment.findByIdAndRemove({_id})
    },
    async deleteComment(root, {
      _ids
    }) {
      console.log("deleteComment :", _ids)

      let deleteMany =  await Comment.deleteMany({_id: {
        $in: _ids,
      }})
      return deleteMany;
    },
    // comment
  }
};