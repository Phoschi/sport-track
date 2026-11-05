import styles from './PagePlaceholder.module.css';

type PagePlaceholderProps = { title: string; plannedPhase: number };

export function PagePlaceholder({ title, plannedPhase }: PagePlaceholderProps) {
  return (
    <section>
      <h1>{title}</h1>
      <p className={styles.note}>Arrive en phase {plannedPhase}.</p>
    </section>
  );
}
