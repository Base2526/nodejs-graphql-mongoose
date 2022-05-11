// in App.js
import React, {useState} from 'react';
import { Component } from 'react';
// import buildGraphQLProvider from 'ra-data-graphql-simple';

import buildApolloClient, {
    buildQuery as buildQueryFactory
  } from "ra-data-graphql-simple";
import { Admin, Resource } from 'react-admin';


import { gql } from "@apollo/client";
// import { PostCreate, PostEdit, PostList } from './posts';

import { client } from './ApolloClient';

const ExGraphql = () => {

    const [dataProvider, setDataProvider] = useState(null);

    React.useEffect(() => {
       
      client().query({
                      query: gql`
                      query allPosts{
                        allPosts(
                          page: 1
                          perPage: 1
                          sortField: "sortField"
                          sortOrder: "sortOrder"
                          filter: {
                            _id:"x9"
                            title:"xTitle"
                          }
                        ){
                          status
                          executionTime
                          data{
                            title
                            views
                            user_id
                          }
                        }
                      }`
                    }).then(result =>{
                      console.log(">> ", result)
                    });

    }, []);

    // if (!dataProvider) {
    //     return <div> Loading   </div>;
    // }

    return (
        <Admin >
            {/* <Resource name="Post" list = { PostList } edit = { PostEdit } create = { PostCreate } /> */}
        </Admin>
    );
}

export default ExGraphql;