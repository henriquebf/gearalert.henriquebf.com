type Props = { isSaving: boolean; onSave: () => void };

const SaveButton = ({ isSaving, onSave }: Props) => {
  return (
    <>
      <button className={'save'} onClick={onSave}>
        {isSaving ? 'SAVING...' : 'SAVE'}
      </button>

      <style jsx>{`
        .save {
          width: 75px;
          margin: 0 0 0 5px;
          cursor: pointer;
          background-color: #04aa6d;
          border: none;
          color: white;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 10px;
          border-radius: 5px;
          padding: 2px;
        }
      `}</style>
    </>
  );
};

export default SaveButton;
