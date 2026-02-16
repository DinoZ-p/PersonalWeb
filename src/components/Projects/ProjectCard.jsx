import { FaExternalLinkAlt } from 'react-icons/fa'
import styles from './ProjectCard.module.css'

function ProjectCard({ project }) {
  return (
    <a
      href={project.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.footer}>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <FaExternalLinkAlt className={styles.icon} />
      </div>
    </a>
  )
}

export default ProjectCard
