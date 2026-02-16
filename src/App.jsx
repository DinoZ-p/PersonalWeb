import styles from './App.module.css'
import AvatarSidebar from './components/AvatarSidebar/AvatarSidebar'
import Hero from './components/Hero/Hero'
import SocialLinks from './components/SocialLinks/SocialLinks'
import Projects from './components/Projects/Projects'
import ResumeButton from './components/ResumeButton/ResumeButton'

function App() {
  return (
    <div className={styles.layout}>
      <AvatarSidebar />
      <main className={styles.main}>
        <Hero />
        <SocialLinks />
        <Projects />
        <ResumeButton />
        <footer className={styles.footer}>
          <p>&copy; 2026 Tom Z. Built with React + Vite.</p>
        </footer>
      </main>
    </div>
  )
}

export default App
