import { FaGithub, FaLinkedin } from 'react-icons/fa'
import styles from './SocialLinks.module.css'

function SocialLinks() {
  return (
    <section className={styles.socials}>
      <a
        href="https://github.com/DinoZ-p"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label="GitHub"
      >
        <FaGithub />
        <span>GitHub</span>
      </a>
      <a
        href="https://www.linkedin.com/in/dinozhao/"
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
