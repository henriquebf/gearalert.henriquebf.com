import { useState } from 'react';

type Props = { initialState: boolean; onChanged: (isChecked: boolean) => void };

const Toggle = ({ initialState, onChanged }: Props) => {
  const [isChecked, setChecked] = useState(initialState);

  const handleChange = () => {
    onChanged(!isChecked);
    setChecked(!isChecked);
  };

  return (
    <>
      <label className={'switch'}>
        <input
          type="checkbox"
          defaultChecked={isChecked}
          onChange={handleChange}
        />
        <div className={'slider'}></div>
      </label>

      <style jsx>{`
        /* Ref: https://codepen.io/voidale/pen/EWPGLb */

        .switch {
          position: relative;
          display: inline-block;
          width: 30px;
          height: 17px;
          outline: none;
        }

        .switch input {
          position: absolute;
          top: -99999px;
          left: -99999px;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: 0.4s;
          transition: 0.4s;
          border-radius: 17px;
        }

        .slider:before {
          position: absolute;
          content: '';
          height: 13px;
          width: 13px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          -webkit-transition: 0.4s;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #2196f3;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #2196f3;
        }

        input:checked + .slider:before {
          -webkit-transform: translateX(13px);
          -ms-transform: translateX(13px);
          transform: translateX(13px);
        }
      `}</style>
    </>
  );
};

export default Toggle;
