import { useEffect, useState } from "react"
import { useUser } from "../../hooks"
import { Card, Button, Input, Loading, Alert } from "@/components/common"
import styles from "./ProfilePage.module.css"

export const ProfilePage = () => {
  const { profile, loading, fetchProfile, updateProfile } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setMessage({ type: "success", text: "Profile updated successfully!" })
      setIsEditing(false)
    } catch (err) {
      setMessage({ type: "error", text: err.message })
    }
  }

  if (loading) {
    return <Loading fullScreen message="Loading profile..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
      </div>

      {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />}

      <Card className={styles.card}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{profile?.username?.[0]?.toUpperCase()}</div>
          <div className={styles.info}>
            <h2 className={styles.name}>{profile?.username}</h2>
            <p className={styles.email}>{profile?.email}</p>
          </div>
        </div>

        {isEditing ? (
          <div className={styles.form}>
            <Input label="Username" name="username" value={formData.username || ""} onChange={handleChange} />
            <Input label="Email" type="email" name="email" value={formData.email || ""} onChange={handleChange} />
            <div className={styles.actions}>
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.details}>
            <div className={styles.detail}>
              <span className={styles.label}>Username</span>
              <span className={styles.value}>{profile?.username}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{profile?.email}</span>
            </div>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </div>
        )}
      </Card>
    </div>
  )
}
