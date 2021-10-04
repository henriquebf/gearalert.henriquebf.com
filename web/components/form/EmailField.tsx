import { useState } from 'react';
import classNames from 'classnames';
import styles from '@/styles/FormField.module.css';
import { validateEmailAddress } from '@/helpers/stringHelper';

type Props = { initialValue: string; onChange: (value: string) => void };

const EmailField = ({ initialValue, onChange }: Props) => {
  const [isValid, setValid] = useState(validateEmailAddress(initialValue));

  return (
    <input
      type="email"
      defaultValue={initialValue}
      className={classNames(
        isValid ? [styles.field] : [styles.field, styles.invalid]
      )}
      onChange={(e) => {
        setValid(validateEmailAddress(e.target.value));
        onChange(e.target.value);
      }}
    />
  );
};

export default EmailField;
