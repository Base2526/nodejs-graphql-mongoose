import { gql } from "@apollo/client";

const EXCHANGE_RATES = gql`
  query User{
              User(_id: "6277293cc6551f01ee726df8"){
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
      }
`;


const POSTS = gql`
                query Posts{
                  Posts(
                    page: 1
                    perPage: 30
                    sortField: "id"
                    sortOrder: ""
                    filter: ${JSON.stringify({}).replace(/"(\w+)":/g, '$1:').replace(/"(\d+)"/g, '$1')}
                  ){
                    status
                    total
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

export{
    EXCHANGE_RATES,
    POSTS
}