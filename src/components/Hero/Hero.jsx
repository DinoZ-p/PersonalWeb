import styles from './Hero.module.css'

function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.name}>
        Hi, I'm <span className={styles.highlight}>Tom Z</span>
      </h1>
      <p className={styles.tagline}>
        Developer &bull; Builder &bull; Problem Solver
      </p>
      <p className={styles.intro}>
        I build things for the web and beyond. Welcome to my corner of the internet.
      </p>
    </section>
  )
}

export default Hero
