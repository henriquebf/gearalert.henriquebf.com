import { useState } from 'react';
import { classNames } from '@/helpers/utilsHelper';
import { validateEmailAddress } from '@/helpers/stringHelper';

type Props = { initialValue: string; onChange: (value: string) => void };

const EmailField = ({ initialValue, onChange }: Props) => {
  const [isValid, setValid] = useState(validateEmailAddress(initialValue));

  return (
    <>
      <input
        type="email"
        defaultValue={initialValue}
        className={classNames(isValid ? ['field'] : ['field', 'invalid'])}
        onChange={(e) => {
          setValid(validateEmailAddress(e.target.value));
          onChange(e.target.value);
        }}
      />
      <style jsx>{`
        .field {
          width: 375px;
          border: 3px solid #2196f3;
          border-radius: 10px;
          background-color: #fff;
          font-size: 20px;
          text-align: center;
          text-decoration: none;
          padding: 4px;
          margin-top: 10px;
        }

        .invalid {
          border: 3px solid #d51111;
        }
      `}</style>
    </>
  );
};

export default EmailField;
