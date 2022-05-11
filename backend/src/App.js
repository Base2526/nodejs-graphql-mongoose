import logo from './logo.svg';
import './App.css';

import React, {useEffect} from "react"
import {Admin, Resource, ListGuesser, EditGuesser, CustomRoutes, useAuthenticated} from "react-admin"
import jsonServerProvider from "ra-data-json-server"

import PostIcon from '@mui/icons-material/Group';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
import AddCard from "@mui/icons-material/AddCard"
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CommentBankIcon from '@mui/icons-material/CommentBank';
import PowerIcon from '@mui/icons-material/Power';
import EmailIcon from '@mui/icons-material/Email';
import { gql, useMutation } from "@apollo/client";

import { Route } from 'react-router-dom';
// import { Route } from "react-router";

// import TreeMenu from '@bb-tech/ra-treemenu';



// import authProvider from './authProvider';
import Dashboard from './dashboard';
import { UserList } from "./user"
// import { PostList, PostCreate, PostEdit } from './posts';
// import { UsersList, UsersCreate, UsersEdit } from './users';
import { Profile } from './profile';
import MyLayout from "./MyLayout";
// import i18nProvider from './provider/i18nProvider';
import users from './users'
import roles from './roles'
import banks from './banks'
import posts from './posts'
import comments from './comments'
import sockets from './sockets'
import mails from './mails'


import {Login, Register, ForgotPassword, NotFound} from './settings'

// const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com")
// import dataProvider from './dataProvider';
// import Register from './set';
import {authProvider, dataProvider, i18nProvider} from './provider'

const { faker } = require('@faker-js/faker');

const App =()=> {
  // const { permissions } = usePermissions();

  useEffect(()=>{
    const randomPhoneNumber = faker.phone.phoneNumber();
    const im = faker.image.avatar()

    console.log("randomPhoneNumber :", randomPhoneNumber, im)

    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        id: "unique_idx",
        avatar : "unique_idx",
      })
    );
  }, [])
  
  return (
    <div className="App">
     <Admin 
        title="My Custom Admin"
        loginPage={Login}
        catchAll={NotFound}
        dashboard={Dashboard} 
        authProvider={authProvider} 
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        layout={MyLayout}
        // requireAuth
        >
        <Resource name="posts" icon={PostIcon} {...posts} />
        
        <Resource name="comments" icon={CommentBankIcon} {...comments} />
        <Resource name="users" icon={SupervisedUserCircle} {...users} />
        <Resource name="sockets" icon={PowerIcon} {...sockets} />
        <Resource name="mails" icon={EmailIcon} {...mails} />
        <Resource options={{ label:'Taxonomy : roles' }} name="roles"  icon={AddCard} {...roles} />
        <Resource options={{ label:'Taxonomy : banks' }} name="banks"  icon={AccountBalanceWalletIcon} {...banks} />
        <CustomRoutes>
            <Route path="/my-profile" element={<Profile />} />
        </CustomRoutes>

        <CustomRoutes noLayout>
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </CustomRoutes>
     </Admin>
    </div>
  );
}

export default App;
