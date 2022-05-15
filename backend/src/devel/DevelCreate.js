/* eslint react/jsx-key: off */
import * as React from 'react';
import {
    Create,
    SimpleForm,
    TextField,
    TextInput,
    required,
    RadioButtonGroupInput,
    Button,
    Toolbar,
    useCreate,
    useGetList
} from 'react-admin';

import _ from 'lodash'
import randomstring from 'randomstring'

const { faker } = require('@faker-js/faker');

const PostCreateToolbar = props => {
    // const notify = useNotify();
    // const redirect = useRedirect();
    // const { reset } = useFormContext();

    const [create, { isLoading, error }] = useCreate();

    const { data, total, isLoading:isLoadingList, error: errorList } = useGetList(
        'banks',
        { 
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'createdAt', order: 'DESC' }
        }
    );
    
    const { data:dataUsers, total:totalUsers, isLoading:isLoadingUsers, error: errorUsers } = useGetList(
        'users',
        { 
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'createdAt', order: 'DESC' }
        }
    );

    const { data:dataPosts, total:totalPosts, isLoading:isLoadingPosts, error: errorPosts } = useGetList(
        'posts',
        { 
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'createdAt', order: 'DESC' }
        }
    );

    const { data:dataRoles, total:totalRoles, isLoading:isLoadingRoles, error: errorRoles } = useGetList(
        'roles',
        { 
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'createdAt', order: 'DESC' }
        }
    );

    const makeText = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    const makeNumber = (length)=> {
        var result           = '';
        var characters       = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    const makeFile = (length) =>{
        let files = []
        for ( var i = 0; i < length; i++ ) {
            files.push({
                            base64: faker.image.avatar(),
                            fileName: faker.name.firstName(),
                            lastModified: '1651919605486',
                            size: 45901,
                            type: 'image/png'
                        })
        }
        return files
    }

    const makeBank = (length) =>{
        let banks = []
        for ( var i = 0; i < length; i++ ) {

            const min = 0;
            const max = total;
            const rand = min + Math.random() * (max - min);

            let bank = data[Math.floor(rand)]

            banks.push({
                        user_bank: makeNumber(11),                  
                        banks: bank.id
                    })
        }
        return banks
    }

    const makeFollow = (length) =>{
        let follows = []
        for ( var i = 0; i < length; i++ ) {

            const minUser = 1;
            const maxUser = totalUsers;
            const randUser = minUser + Math.random() * (maxUser - minUser);

            let user = dataUsers[Math.floor(randUser)]

            follows.push(user.id)
        }


        return  Array.from(new Set(follows))
    }

    const makePostId = () =>{
        const minPost = 1;
        const maxPost = totalPosts;
        const randPost = minPost + Math.random() * (maxPost - minPost);

        let Post = dataPosts[Math.floor(randPost)]

        return Post.id
    }
    
    const makeRole = () =>{
        const min = 0;
        const max = totalRoles;
        const rand = min + Math.random() * (max - min);

        let roles = []
        for ( var i = 0; i < rand; i++ ) {

            const minRole = 1;
            const maxRole = totalRoles;
            const randRole = minRole + Math.random() * (maxRole - minRole);

            let rols = dataRoles[Math.floor(randRole)]

            roles.push(rols.id)
        }

        return  Array.from(new Set(roles))
    }

    return (
        <Toolbar>
            <Button label="POST [Auto Create]" variant="text" onClick={()=>{

                console.log("useGetList >>", data, total, isLoadingList, errorList )

                console.log("dataUsers >>", dataUsers )

                for (var i = 0; i < 100; i++) {

                    //////////// bank
                    const min = 0;
                    const max = total;
                    const rand = min + Math.random() * (max - min);

                    let bank = data[Math.floor(rand)]
                    //////////// bank

                    //////////// user
                    const minUser = 0;
                    const maxUser = totalUsers;
                    const randUser = minUser + Math.random() * (maxUser - minUser);

                    let user = dataUsers[Math.floor(randUser)]
                    //////////// user

                    // const randomPhoneNumber = faker.phone.phoneNumber();
                    // const im = faker.image.avatar()
                    // console.log("randomPhoneNumber :", randomPhoneNumber, im, randomstring.generate(7) )

                    create('posts', { data: {
                        title:faker.lorem.lines(1),
                        nameSubname:faker.name.firstName() +" "+ faker.name.firstName(),
                        idCard:makeNumber(6),
                        number:makeNumber(6),
                        dateTranfer: faker.date.past(),                    
                        body:faker.lorem.paragraph(),
                        banks:makeBank(rand),
                        follows:makeFollow( /*randUser*/ 5),
                        files:makeFile(rand),
                        isPublish:0,
                        owner_id: user.id,
                        // createdAt: faker.date.past(),     
                        } })
                        
                }
            }}/>

            <Button label="COMMENT [Auto Create]" variant="text" onClick={()=>{
                
                console.log("useGetList >>", data, total, isLoadingList, errorList )

                console.log("dataUsers >>", dataUsers )

                for (var i = 0; i < 200; i++) {
                    create('comments', { 
                            data: {                    
                                    body:faker.lorem.paragraph(),
                                    postId: makePostId()
                                } 
                          })
                        
                }
            }}/>

            <Button label="USER [Auto Create]" variant="text" onClick={()=>{
                
                // console.log("useGetList >>", data, total, isLoadingList, errorList )

                // console.log("dataUsers >>", dataUsers )

                for (var i = 0; i < 1000; i++) {
                    create('users', { 
                            data: {                    
                                    username: faker.name.firstName() ,
                                    password: makeText(10),
                                    email: faker.internet.email(),
                                    displayName: faker.name.firstName(),
                                    // lastAccess: faker.date.past(),
                                    image: {
                                        base64: faker.image.avatar(),
                                        fileName: faker.name.firstName(),
                                        lastModified: '1651919605486',
                                        size: 45901,
                                        type: 'image/png'
                                    },
                                    roles: makeRole(),
                                    isActive: 'Active'
                                } 
                          })
                        
                }
            }}/>
        </Toolbar>
    );
};

const DevelCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list" toolbar={<PostCreateToolbar />}>
            {/* <TextField source="id" />
            <TextInput source="name" validate={[required()]} />
            <RadioButtonGroupInput source="isPublish" defaultValue={0} choices={[
                { id: 0, name: 'Unpublish' },
                { id: 1, name: 'Publish' },
            ]} /> */}

            {/* <SaveButton label="post.action.save_and_edit" variant="text" /> */}
        </SimpleForm>
    </Create>
);

export default DevelCreate;
