import styles from './AvatarSidebar.module.css'

function AvatarSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.avatarWrapper}>
        <img
          src={`${import.meta.env.BASE_URL}avatar.png`}
          alt="Avatar"
          className={styles.avatar}
        />
      </div>
    </aside>
  )
}

export default AvatarSidebar
