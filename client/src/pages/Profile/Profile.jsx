import { useAuth } from '../../context/AuthContext.jsx'
import './Profile.css'

function Profile() {
  const { user } = useAuth()

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-card">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role || 'user'}</p>
      </div>
    </div>
  )
}

export default Profile
