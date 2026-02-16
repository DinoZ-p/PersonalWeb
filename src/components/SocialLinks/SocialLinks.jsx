import { FaGithub, FaLinkedin } from 'react-icons/fa'
import styles from './SocialLinks.module.css'

function SocialLinks() {
  return (
    <section className={styles.socials}>
      <a
        href="https://github.com/YOUR_USERNAME"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label="GitHub"
      >
        <FaGithub />
        <span>GitHub</span>
      </a>
      <a
        href="https://linkedin.com/in/YOUR_USERNAME"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label="LinkedIn"
      >
        <FaLinkedin />
        <span>LinkedIn</span>
      </a>
    </section>
  )
}

export default SocialLinks
