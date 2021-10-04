import { useState } from 'react';
import styles from '@/styles/Toggle.module.css';

type Props = { initialState: boolean; onChanged: (isChecked: boolean) => void };

const Toggle = ({ initialState, onChanged }: Props) => {
  const [isChecked, setChecked] = useState(initialState);

  const handleChange = () => {
    onChanged(!isChecked);
    setChecked(!isChecked);
  };

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        defaultChecked={isChecked}
        onChange={handleChange}
      />
      <div className={styles.slider}></div>
    </label>
  );
};

export default Toggle;
