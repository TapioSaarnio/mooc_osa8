import React, { useState, useEffect } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'

const LoginForm = (props) => {

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const [ login, result ] = useMutation(LOGIN, {
           onError: (error) => {
               console.log(error.graphQLErrors[0])
            }
           })

    useEffect(() => {
        if(result.data) {
            const token = result.data.login.value
            props.setToken(token)
            localStorage.setItem('user-token', token)

        }
    }, [result.data]) // eslint-disable-line react-hooks/exhaustive-deps

    const submit = async (event) => {
        event.preventDefault()

        login({
            variables: { username, password }
        })

    }

   

    return(
        <div id='loginForm'>
            <form onSubmit={submit}>
                <div>
                username <input value={username} onChange={( {target}) => setUserName(target.value)}/>
                </div>
                <div>
                password <input value={password} onChange={({target}) => setPassword(target.value)}/>
                </div>
                <button id='login' type='submit'>login</button>
            </form>
        </div>
    )

}

export default LoginForm