import { FaFileAlt } from 'react-icons/fa'
import styles from './ResumeButton.module.css'

function ResumeButton() {
  return (
    <section className={styles.section}>
      <a
        href={`${import.meta.env.BASE_URL}resume.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
      >
        <FaFileAlt />
        <span>View Resume</span>
      </a>
    </section>
  )
}

export default ResumeButton
