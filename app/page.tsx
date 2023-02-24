import HeartIcon from '@/components/HeartIcon'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>I</h1>
      <HeartIcon className={styles.heart} />
      <h1>Julia</h1>
    </main>
  )
}
