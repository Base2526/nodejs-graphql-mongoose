import { fetchUtils , useCheckAuth} from 'react-admin';
import { stringify } from 'query-string';
import { gql } from "@apollo/client";
import restProvider from "ra-data-simple-rest";

import _ from "lodash";
import deepdash from "deepdash";

// import { cacheDataProviderProxy } from 'react-admin';

// // import fakeRestProvider from 'ra-data-fakerest';
// import { cacheDataProviderProxy } from 'react-admin';

// import data from './data';
import addUploadFeature from '../addUploadFeature';

import { client } from '../ApolloClient';

import authProvider from './authProvider';

// var _ = require('lodash');
//mixin all the methods into Lodash object

// add deepdash to lodash
deepdash(_);


const apiUrl = 'https://jsonplaceholder.typicode.com';
const httpClient = fetchUtils.fetchJson;


const rest  = {

    getList: async(resource, params) => {

        console.log("getList :", resource, params)

        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };

        switch(resource){
            case "posts":{
                let query = gql`
                query allPosts{
                  allPosts(
                    page: ${page}
                    perPage: ${perPage}
                    sortField: "${field}"
                    sortOrder: "${order}"
                    filter: ${JSON.stringify(params.filter).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')}
                  ){
                    status
                    executionTime
                    data{
                        id: _id
                        title
                        nameSubname
                        idCard
                        number
                        dateTranfer
                        body
                        banks{
                          user_bank
                          banks
                        }
                        follows
                        files{
                          base64
                          fileName
                          lastModified
                          size
                          type
                        }
                        isPublish
                        owner_id
                        createdAt
                        updatedAt
                    }
                  }
                }`;

                console.log("query :", query)

                let json1 = await client().query({ query });
                let data = json1.data.allPosts.data
                return {
                    data:  data,
                    total:  data.length
                }
            }
     
            case "users":{
                let query = gql`
                query Users{
                    Users(
                        page: ${page}
                        perPage: ${perPage}
                        sortField: "${field}"
                        sortOrder: "${order}"
                        filter: ${JSON.stringify(params.filter).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')}
                    ){
                        status 
                        executionTime
                        data{
                            id: _id
                            username 
                            password
                            email
                            displayName
                            roles
                            isActive
                            image{
                              _id
                              size
                              type
                              lastModified
                              base64
                            }
                            lastAccess
                        }
                    }
                    }`;

                console.log("json1 query >> ", query) 
                let json1 = await client().query({ query });

                console.log("json1 >> ", query, resource, json1) 
                let data = json1.data.Users.data
                return {
                    data:  data,
                    total:  data.length
                }
            }

            case "roles":{
                let query = gql`
                query Roles{
                    Roles(
                        page: ${page}
                        perPage: ${perPage}
                        sortField: "${field}"
                        sortOrder: "${order}"
                        filter: ${JSON.stringify(params.filter).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')}
                    ){
                        status
                        executionTime
                        data{
                            id: _id
                            name
                            description
                            isPublish
                        }
                    }
                    }`;

                let json1 = await client().query({ query });

                console.log("json1 >> ", query, resource, json1) 
                let data = json1.data.Roles.data
                return {
                    data:  data,
                    total:  data.length
                }
            }

            case "banks":{
                let query = gql`
                query Banks{
                    Banks(
                        page: ${page}
                        perPage: ${perPage}
                        sortField: "${field}"
                        sortOrder: "${order}"
                        filter: ${JSON.stringify(params.filter).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')}
                    ){
                        status
                        executionTime
                        data{
                            id: _id
                            name
                            description
                            isPublish
                        }
                    }
                    }`;

                let json1 = await client().query({ query });

                console.log("json1 >> ", query, resource, json1) 
                let data = json1.data.Banks.data
                return {
                    data:  data,
                    total:  data.length
                }
            }

            case "comments":{

                let query = gql`
                query Comments{
                    Comments(
                        page: ${page}
                        perPage: ${perPage}
                        sortField: "${field}"
                        sortOrder: "${order}"
                        filter: ${JSON.stringify(params.filter).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')}
                    ){
                        status
                        executionTime
                        data{
                            id: _id
                            body
                            postId
                            createdAt
                            updatedAt
                        }
                    }
                    }`;

                let json1 = await client().query({ query });

                console.log("json1 >> ", query, resource, json1) 
                let data = json1.data.Comments.data
                return {
                    data:  data,
                    total:  data.length
                }
            }

            case "sockets":{

                return {
                    data: [],
                    total: 0,
                }
            }

            case "mails":{
                let query = gql`
                query Mails{
                    Mails(
                        page: ${page}
                        perPage: ${perPage}
                        sortField: "${field}"
                        sortOrder: "${order}"
                        filter: ${JSON.stringify(params.filter).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')}
                    ){
                        status
                        executionTime
                        data{
                            id: _id
                            name
                            description
                            isPublish
                        }
                    }
                    }`;

                let json1 = await client().query({ query });

                console.log("json1 >> ", query, resource, json1) 
                let data = json1.data.Mails.data
                return {
                    data:  data,
                    total:  data.length
                }

            }
        }

        return null;

        /*
        return httpClient(url).then(({ headers, json }) => 
            {

                console.log("httpClient getList >> ", json)
                return {
                    data: json,
                    total: json.length//parseInt(headers.get('content-range').split('/').pop(), 10),
                }
            }
        );
        */
    },
    getOne: async (resource, params) =>{
        console.log("getOne :", resource, params)
        // return httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
        //     data: json,
        // }));

        switch(resource){
            case "posts":{
                let query = gql`
                            query Post{
                                Post(_id: "${params.id}"){
                                status
                                data{
                                    id: _id
                                    title
                                    nameSubname
                                    idCard
                                    number
                                    dateTranfer
                                    body
                                    banks{
                                        user_bank
                                        banks
                                    }
                                    follows
                                    files{
                                        base64
                                        fileName
                                        lastModified
                                        size
                                        type
                                    }
                                    isPublish
                                    owner_id
                                    createdAt
                                    updatedAt
                                }
                            }
                        }`;
        
                console.log("gql :", query )
                let json1 = await client().query({ query });
                // let data = json1.data.allPosts.data
        
                console.log("getOne :", resource, params, json1.data.Post.data)
               
               return {
                data: json1.data.Post.data,
               }
            }
            case "users" :{
                let query = gql`
                            query User{
                                User(_id: "${params.id}"){
                                status
                                data{
                                    id: _id
                                    username
                                    password
                                    email
                                    displayName
                                    roles
                                    isActive
                                    image{
                                        _id
                                        size
                                        type
                                        lastModified
                                        base64
                                    }
                                    lastAccess
                                }
                            }
                        }`;

                console.log("gql :", query )
                let json1 = await client().query({ query });
                // let data = json1.data.allPosts.data
        
                console.log("getOne :", resource, params, json1)
               
                return {
                    data: json1.data.User.data,
                }
            }
            case "roles" :{
                let query = gql`
                            query Role{
                                Role(_id: "${params.id}"){
                                status
                                data{
                                    id: _id
                                    name
                                    description
                                    isPublish
                                }
                            }
                        }`;
        
                // console.log("gql :", query )
                let json1 = await client().query({ query });
                // let data = json1.data.allPosts.data
        
                console.log("getOne :", resource, params, json1)
               
               return {
                data: json1.data.Role.data,
               }
            }
            case "banks" :{
                let query = gql`
                            query Bank{
                                Bank(_id: "${params.id}"){
                                status
                                data{
                                    id: _id
                                    name
                                    description
                                    isPublish
                                }
                            }
                        }`;
        
                // console.log("gql :", query )
                let json1 = await client().query({ query });
                // let data = json1.data.allPosts.data
        
                console.log("getOne :", resource, params, json1)
               
               return {
                data: json1.data.Bank.data,
               }
            }

            case "comments":{
                let query = gql`
                            query Comment{
                                Comment(_id: "${params.id}"){
                                status
                                data{
                                    id: _id
                                    body
                                    postId
                                    createdAt
                                    updatedAt
                                }
                            }
                        }`;

                // console.log("gql :", query )
                let json1 = await client().query({ query });
                // let data = json1.data.allPosts.data

                console.log("getOne :", resource, params, json1)
                
                return {
                    data: json1.data.Comment.data,
                }
            }

            case "sockets": {
                return {
                    data: []
                }

            }

            case "mails": {
                let query = gql`
                    query Mail{
                        Mail(_id: "${params.id}"){
                        status
                        data{
                            id: _id
                            name
                            description
                            isPublish
                        }
                    }
                }`;

                // console.log("gql :", query )
                let json1 = await client().query({ query });
                // let data = json1.data.allPosts.data

                console.log("getOne :", resource, params, json1)
                
                return {
                    data: json1.data.Mail.data,
                }

            }
        }
       
    },
    getMany: async(resource, params) => {

        console.log("getMany :", resource, params)

        switch(resource){
            case "users":{
                let _ids = JSON.stringify(params.ids)

                console.log("gql :" , _ids)
                let query = gql`
                query getManyUsers{
                    getManyUsers(_ids: ${_ids}){
                        status
                        data{
                            id: _id
                            username
                            password
                            email
                            displayName
                            image{
                                fileName
                                base64
                                type
                                size
                                lastModified
                              }
                            lastAccess
                        }
                    }
                }`;

                console.log("gql :", query , _ids)
                let json1 = await client().query({ query });
                // // let data = json1.data.allPosts.data

                console.log("getMany :", resource, params, json1)
            
                return {
                    data: json1.data.getManyUsers.data,
                }
                
            }
            case "roles":{
                let _ids = JSON.stringify(params.ids)

                console.log("gql :" , _ids)
                let query = gql`
                query getManyRoles{
                    getManyRoles(_ids: ${_ids}){
                        status
                        data{
                            id: _id
                            name
                        }
                    }
                }`;

                console.log("gql :", query , _ids)
                let json1 = await client().query({ query });
                // // let data = json1.data.allPosts.data

                console.log("getMany :", resource, params, json1)
            
                return {
                    data: json1.data.getManyRoles.data,
                }
                
            }

            case "banks":{
                let _ids = JSON.stringify(params.ids)

                console.log("gql :" , _ids)
                let query = gql`
                query getManyBanks{
                    getManyBanks(_ids: ${_ids}){
                        status
                        data{
                            id: _id
                            name
                            description
                            isPublish
                        }
                    }
                }`;

                console.log("gql :", query , _ids)
                let json1 = await client().query({ query });
                // // let data = json1.data.allPosts.data

                console.log("getMany :", resource, params, json1)
            
                return {
                    data: json1.data.getManyBanks.data,
                }
                
            }
        }

        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        // console.log("getMany :", resource, params, url)
        return httpClient(url).then(({ json }) => ({ data: json }));
    },
    getManyReference: (resource, params) => {
        console.log("getManyReference :", resource, params )
        // const { page, perPage } = params.pagination;
        // const { field, order } = params.sort;
        // const query = {
        //     sort: JSON.stringify([field, order]),
        //     range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        //     filter: JSON.stringify({
        //         ...params.filter,
        //         [params.target]: params.id,
        //     }),
        // };
        // const url = `${apiUrl}/${resource}?${stringify(query)}`;

        // console.log("getManyReference :", resource, params, url)
        // return httpClient(url).then(({ headers, json }) => ({
        //     data: json,
        //     total: parseInt(headers.get('content-range').split('/').pop(), 10),
        // }));

        switch(resource){
            case "comments":{
                return {
                    data:[{id:1222, body: "xxx", created_at: '2022-05-04T09:43:46.263Z'}],
                    total: 1
                }

            }
        }

       
    },
    update: async(resource, params) =>{
        
        console.log("update :", resource, params )

        switch(resource){
            case "posts":{
                let json = JSON.stringify(_.omitDeep(params.data, ['id', '__typename', 'createdAt', 'updatedAt'])).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')
                

                let mutation = gql`mutation updatePost{
                                                        updatePost(_id:"${params.id}", input:${json}){
                                                            id: _id
                                                            title
                                                        }
                                                    }`;

                console.log("mutation", mutation)

                let data =  await client().mutate({ mutation });
                return { data: data.data.updatePost }
            }

            case "users":{
                let json = JSON.stringify(_.omitDeep(params.data, ['id', '__typename', '_id', 'lastAccess', 'files'])).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')
            
                let mutation = gql`mutation updateUser{
                                                        updateUser(_id:"${params.id}", input:${json}){
                                                            id: _id
                                                        }
                                                    }`;

                console.log("mutation", mutation)

                let data =  await client().mutate({ mutation });
                console.log("data : ", data)
                return { data: data.data.updateUser }
            }

            case "roles":{                

                let json = JSON.stringify(_.omitDeep(params.data, ['id', '__typename'])).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')
                
                let mutation = gql`mutation updateRole{
                                                        updateRole(_id:"${params.id}", input:${json}){
                                                            id: _id
                                                        }
                                                    }`;

                console.log("mutation", mutation)

                let data =  await client().mutate({ mutation });
                return { data: data.data.updateRole }
            }

            case "banks":{
                let json = JSON.stringify(_.omitDeep(params.data, ['id', '__typename'])).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')
                
                let mutation = gql`mutation updateBank{
                                                        updateBank(_id:"${params.id}", input:${json}){
                                                            id: _id
                                                        }
                                                    }`;

                console.log("mutation", mutation)

                let data =  await client().mutate({ mutation });
                return { data: data.data.updateBank }
            }

            case "comments":{
                let json = JSON.stringify(_.omitDeep(params.data, ['id', '__typename', 'createdAt', 'updatedAt'])).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')
                
                let mutation = gql`mutation updateComment{
                                                        updateComment(_id:"${params.id}", input:${json}){
                                                            id: _id
                                                        }
                                                    }`;

                console.log("mutation", mutation)

                let data =  await client().mutate({ mutation });
                return { data: data.data.updateComment }
            }

            case "mails":{
                let json = JSON.stringify(_.omitDeep(params.data, ['id', '__typename'])).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')
                
                let mutation = gql`mutation updateMail{
                                                        updateMail(_id:"${params.id}", input:${json}){
                                                            id: _id
                                                        }
                                                    }`;

                console.log("mutation", mutation)

                let data =  await client().mutate({ mutation });
                return { data: data.data.updateMail }
            }

        }
        // return    httpClient(`${apiUrl}/${resource}/${params.id}`, {
        //     method: 'PUT',
        //     body: JSON.stringify(params.data),
        // }).then(({ json }) => ({ data: json }))
    },
    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };

        console.log("updateMany :", resource, params)
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },
    create: async(resource, params) =>{
        console.log("create :", resource, params )
        switch(resource){
            case "posts":{

                let auth = await authProvider.checkAuth();
                // console.log("create auth :", auth)


                let json = JSON.stringify({...params.data, owner_id:auth.id}).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')

                let mutation = gql`mutation createPost{
                                                createPost(input:${json}){
                                                    id: _id
                                                    title
                                                }
                                            }`;
                
                console.log("mutation : ", mutation)
                
                let data =  await client().mutate({ mutation });
                console.log("data : ", data)
                
                return { data: data.data.createPost, id: data.data.createPost.id }
            }

            case "users":{
                delete params.data.confirm_password; 
                delete params.data.files

                // displayName
                params.data = {...params.data, displayName: params.data.username, image: params.data.image ? [params.data.image] : []}

                let json = JSON.stringify(params.data).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')

                let mutation = gql`mutation createUser{
                                            createUser(input:${json}){
                                                    id: _id
                                                    username
                                                    password
                                                    email
                                                    displayName
                                                    roles
                                                   
                                                    lastAccess
                                                }
                                            }`;
                
                console.log("mutation : ", mutation)
                
                let data =  await client().mutate({ mutation });
                console.log("data : ", data)
                
                return { data: data.data.createUser, id: data.data.createUser.id }
            }

            case "roles":{

                let json = JSON.stringify(params.data).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')

                let mutation = gql`mutation createRole{
                                            createRole(input:${json}){
                                                    id: _id
                                                    name
                                                }
                                            }`;
                
                console.log("mutation : ", mutation)
                
                let data =  await client().mutate({ mutation });
                console.log("data : ", data)
                
                return { data: data.data.createRole, id: data.data.createRole.id }

            }

            case "banks":{

                let json = JSON.stringify(params.data).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')

                let mutation = gql`mutation createBank{
                                                createBank(input:${json}){
                                                    id: _id
                                                    name
                                                }
                                            }`;
                
                console.log("mutation : ", mutation)
                
                let data =  await client().mutate({ mutation });
                console.log("data : ", data)
                
                return { data: data.data.createBank, id: data.data.createBank.id }

            }

            case "comments":{
                let json = JSON.stringify(params.data).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')

                let mutation = gql`mutation createComment{
                                                createComment(input:${json}){
                                                    id: _id
                                                    body
                                                }
                                            }`;
                
                console.log("mutation : ", mutation)
                
                let data =  await client().mutate({ mutation });
                console.log("data : ", data)
                
                return { data: data.data.createComment, id: data.data.createComment.id }
            }

            case "mails":{

                let json = JSON.stringify(params.data).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')

                let mutation = gql`mutation createMail{
                                                createMail(input:${json}){
                                                    id: _id
                                                    name
                                                }
                                            }`;
                
                console.log("mutation : ", mutation)
                
                let data =  await client().mutate({ mutation });
                console.log("data : ", data)
                
                return { data: data.data.createMail, id: data.data.createMail.id }

            }
        }


        // return httpClient(`${apiUrl}/${resource}`, {
        //     method: 'POST',
        //     body: JSON.stringify(params.data),
        // }).then(({ json }) => ({
        //     data: { ...params.data, id: json.id },
        // }))
    },
    delete: async(resource, params) =>{
        console.log("delete :", resource, params)

        switch(resource){
            case "posts":{
                let mutation = gql`mutation deletePost{
                                                deletePost(_id:"${params.id}"){
                                                            id: _id
                                                        }
                                                    }`;
                let data =  await client().mutate({ mutation });
                return { data: data.data.deletePost }
            }

            case "users":{
                let mutation = gql`mutation deleteUser{
                                                        deleteUser(_id:"${params.id}"){
                                                            id: _id
                                                        }
                                                    }`;
                let data =  await client().mutate({ mutation });
                return { data: data.data.deleteUser }
            }

            case "roles":{
                let mutation = gql`mutation deleteRole{
                                                        deleteRole(_id:"${params.id}"){
                                                            id: _id
                                                        }
                                                    }`;
                let data =  await client().mutate({ mutation });
                return { data: data.data.deleteRole }
            }

            case "comments": {
                let mutation = gql`mutation deleteComment{
                                                        deleteComment(_id:"${params.id}"){
                                                            id: _id
                                                        }
                                                    }`;
                let data =  await client().mutate({ mutation });
                return { data: data.data.deleteComment }
            }

            case "mails":{
                let mutation = gql`mutation deleteMail{
                                                        deleteMail(_id:"${params.id}"){
                                                            id: _id
                                                        }
                                                    }`;
                let data =  await client().mutate({ mutation });
                return { data: data.data.deleteMail }
            }

        }

        // return httpClient(`${apiUrl}/${resource}/${params.id}`, {
        //     method: 'DELETE',
        // }).then(({ json }) => ({ data: json }))
    },
    deleteMany: async(resource, params) => {
        console.log("deleteMany :", resource, params, JSON.stringify(params.ids)) // ids

        switch(resource){
            case "posts":{
                let _ids = JSON.stringify(params.ids)
                console.log(_ids) // ids
                let mutation = gql`mutation deletePosts{
                                            deletePosts(_ids:${_ids}){ ok }
                                  }`;

                
                let data =  await client().mutate({ mutation });
                return { data: [{"ok" : data.data.deletePosts}] }
            }
        }
        // const query = {
        //     filter: JSON.stringify({ id: params.ids}),
        // };
        // return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
        //     method: 'DELETE',
        // }).then(({ json }) => ({ data: json }));
    },
    find: async(resource, params) =>{
        // const { page, perPage } = params.pagination;
        // const { field, order } = params.sort;
        // const query = {
        //     sort: JSON.stringify([field, order]),
        //     range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        //     filter: JSON.stringify(params.filter),
        // };

        console.log("find params : ", params)

        switch(resource){
            case "users":{
                let query = gql`
                    query FindUser{
                        FindUser(
                            filter: {q: ${params.filter.q}}
                        ){
                            status
                            executionTime
                            data{
                                id: _id
                                username
                                password
                                email
                                displayName
                                roles
                                lastAccess
                            }
                        }
                    }`;

                console.log("json1 query >> ", query) 
                let json1 = await client().query({ query });

                console.log("json1 >> ", query, resource, json1) 
                let data = json1.data.FindUser.data
                return {
                    data:  data,
                    total:  data.length
                }
            }

            // case "roles":{
            //     let query = gql`
            //     query Roles{
            //         Roles(
            //             page: ${page}
            //             perPage: ${perPage}
            //             sortField: "${field}"
            //             sortOrder: "${order}"
            //             filter: ${JSON.stringify(params.filter).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')}
            //         ){
            //             status
            //             executionTime
            //             data{
            //                 id: _id
            //                 name
            //                 description
            //                 isPublish
            //             }
            //         }
            //         }`;

            //     let json1 = await client().query({ query });

            //     console.log("json1 >> ", query, resource, json1) 
            //     let data = json1.data.Roles.data
            //     return {
            //         data:  data,
            //         total:  data.length
            //     }
            // }

            // case "banks":{
            //     let query = gql`
            //     query Banks{
            //         Banks(
            //             page: ${page}
            //             perPage: ${perPage}
            //             sortField: "${field}"
            //             sortOrder: "${order}"
            //             filter: ${JSON.stringify(params.filter).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')}
            //         ){
            //             status
            //             executionTime
            //             data{
            //                 id: _id
            //                 name
            //                 description
            //                 isPublish
            //             }
            //         }
            //         }`;

            //     let json1 = await client().query({ query });

            //     console.log("json1 >> ", query, resource, json1) 
            //     let data = json1.data.Banks.data
            //     return {
            //         data:  data,
            //         total:  data.length
            //     }
            // }
        }

    }
};


// export default rest

// // import fakeRestProvider from 'ra-data-fakerest';
// import { cacheDataProviderProxy } from 'react-admin';

// // import data from './data';
// import addUploadFeature from './addUploadFeature';

// const dataProvider = fakeRestProvider(data, true);
const uploadCapableDataProvider = addUploadFeature(rest);
const sometimesFailsDataProvider = new Proxy(uploadCapableDataProvider, {
    get: (target, name) => (resource, params) => {
        // add rejection by type or resource here for tests, e.g.
        // if (name === 'delete' && resource === 'posts') {
        //     return Promise.reject(new Error('deletion error'));
        // }
        // if (
        //     resource === 'posts' &&
        //     params.data &&
        //     params.data.title === 'f00bar'
        // ) {
        //     return Promise.reject(new Error('this title cannot be used'));
        // }
        return uploadCapableDataProvider[name](resource, params);
    },
});
const delayedDataProvider = new Proxy(sometimesFailsDataProvider, {
    get: (target, name) => (resource, params) =>
        new Promise(resolve =>
            setTimeout(
                () =>
                    resolve(sometimesFailsDataProvider[name](resource, params)),
                300
            )
        ),
});

export default delayedDataProvider;