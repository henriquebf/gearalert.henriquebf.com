import styles from '@/styles/FormField.module.css';

type Props = { initialValue: string; onChange: (value: string) => void };

const EmailField = ({ initialValue, onChange }: Props) => {
  return (
    <input
      type="email"
      defaultValue={initialValue}
      className={styles.field}
      autoFocus
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default EmailField;
