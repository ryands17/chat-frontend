import * as React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Auth, Hub } from 'aws-amplify'
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react'
import { Nav } from './components/Nav'
import { Rooms } from './components/Rooms'
import { Chat } from './components/Chat'

function App() {
  const [user, updateUser] = React.useState<any>(null)

  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(() => console.log('Unauthenticated'))

    Hub.listen('auth', auth => {
      switch (auth.payload.event) {
        case 'signIn':
          return updateUser(auth.payload.data)
        case 'signOut':
          return updateUser(null)
      }
    })
  }, [])

  if (user) {
    return (
      <Routes>
        <Nav user={user} />
      </Routes>
    )
  }
  return (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: 'username' },
          { type: 'password' },
          { type: 'email' },
        ]}
      />
    </AmplifyAuthenticator>
  )
}

const Routes: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
      <Switch>
        <Route exact path="/" component={Rooms} />
        <Route path="/chat/:id" component={Chat} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
