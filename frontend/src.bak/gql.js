import { gql } from "@apollo/client";

// export function User() {
//     return gql`
//         query User{
//               User(_id: "6277293cc6551f01ee726df8"){
//               status
//               data{
//                   id: _id
//                   username
//                   password
//                   email
//                   displayName
//                   roles
//                   isActive
//                   image{
//                       _id
//                       size
//                       type
//                       lastModified
//                       base64
//                   }
//                   lastAccess
//               }
//           }
//       }
// `;
    
// }

export const EXCHANGE_RATES = gql`
  
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