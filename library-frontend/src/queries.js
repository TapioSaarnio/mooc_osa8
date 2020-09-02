import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql `

      query {
          allAuthors {
              name
              born
              bookCount
              id
          }
      }

`

export const ALL_BOOKS = gql `

        query allBooksByGenreAndAuthor($genre:String, $author: String){
            allBooks (genre: $genre, author: $author){
                title
                author {
                    id
                    name
                    born 
                }
                published

                genres
                id
            }
        
    }

`

export const ALL_GENRES = gql `

    query{
      allGenres {
          genres
      }

    }


`

export const EDIT_AUTHOR = gql `


    mutation setBorn ($name: String!, $setBornTo: Int!){
        editAuthor(name: $name, setBornTo: $setBornTo){
            name
            born
         }

    }
    

`

export const CREATE_BOOK = gql`

     mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String]!){
         addBook(
             title: $title,
             author: $author,
             published: $published,
             genres: $genres
         ){
            title,
            author {
                name
                born
                id
            },
            published,
            id,
            genres,
            
         }
     }

`

export const FAV_GENRE = gql `


    query{
        me {
            favouriteGenre
        }
    }

  `

export const LOGIN = gql `

   mutation login($username: String!, $password: String!) {
       login(username: $username, password: $password) {
           value
       }
   }

`