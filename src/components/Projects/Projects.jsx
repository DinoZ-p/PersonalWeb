import projects from '../../data/projects'
import ProjectCard from './ProjectCard'
import styles from './Projects.module.css'

function Projects() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Projects</h2>
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  )
}

export default Projects
