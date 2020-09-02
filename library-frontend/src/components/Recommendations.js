import React from 'react'
import { useQuery } from '@apollo/client'
import { FAV_GENRE }  from '../queries'
import { ALL_BOOKS } from '../queries'


const Recommendations = (props) => {

    const favGenre = useQuery(FAV_GENRE)
    let genre
    if(favGenre.data){

        if(favGenre.data.me){
        genre = favGenre.data.me.favouriteGenre

    }
        
    }
    
    const booksResult = useQuery(ALL_BOOKS, {
        variables: {genre: genre,}
      })

    if(!props.show){
        return null
    }

    if(!favGenre.data){
        return(
            <div>
            <p>loading</p>    
            </div>
        )
    }

    return (
        <div>
            <h2>Recommended based on your favourite genre: </h2>
            <table>
                <tbody>
                    <tr>
                        <th>
                        </th>
                        <th>
                            author
                        </th>
                        <th>
                            published
                        </th>
                    </tr>
                    {booksResult.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations