import React, { useState, useEffect } from 'react'
import './App.css'
import { Auth } from 'aws-amplify'
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react'

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log('user:', user)
        setUser(user)
      })
      .catch((e) => console.log('error:', e))
  }, [])

  let isAdmin = false
  if (user) {
    const {
      signInUserSession: {
        idToken: { payload },
      },
    } = user
    console.log('payload:', payload)
    if (payload['cognito:groups'] && payload['cognito:groups'].includes('Admin')) {
      isAdmin = true
    }
  }

  return (
    <div className="App">
      <header>
        <h1>Howdy</h1>
        {isAdmin && <p>Welcome, Admin</p>}
      </header>
      <AmplifySignOut />
    </div>
  )
}

export default withAuthenticator(App)
