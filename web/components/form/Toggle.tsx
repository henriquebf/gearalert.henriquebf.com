import styles from '@/styles/Toggle.module.css';
import { useState } from 'react';

type Props = { initialState: boolean; onChanged: () => void };

const Toggle = ({ initialState }: Props) => {
  const [isChecked, setChecked] = useState(initialState);

  const handleChange = () => {
    setChecked(!isChecked);
  };

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        value={String(isChecked)}
        onChange={handleChange}
      />
      <div className={styles.slider}></div>
    </label>
  );
};

export default Toggle;
