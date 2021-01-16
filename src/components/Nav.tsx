import { Auth } from 'aws-amplify'

export const Nav = ({ user }: { user: any }) => {
  const signout = async () => {
    await Auth.signOut()
  }

  return (
    <nav className="bg-gray-400 p-2 mt-0 fixed w-full z-10 top-0">
      <div className="container mx-auto flex flex-wrap items-center">
        <div className="flex w-full md:w-1/2 justify-center md:justify-start text-white font-extrabold">
          <span className="text-2xl pl-2">
            <i className="em em-grinning" /> Chat Room:{' '}
            {user && <span>{user.username}</span>}
          </span>
        </div>
        <div className="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end">
          <ul className="list-reset flex justify-between flex-1 md:flex-none items-center">
            {user && (
              <li className="mr-3">
                <button
                  className="bg-green-600 px-2 text-white rounded-sm"
                  onClick={signout}
                >
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
