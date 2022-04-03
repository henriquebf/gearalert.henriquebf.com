import { useState } from 'react';
import axios from 'axios';
import useHover from '@/hooks/useHover';
import { classNames } from '@/helpers/utilsHelper';
import SaveButton from '@/components/buttons/SaveButton';

type Props = {
  gearId: string;
  property: string;
  label: string;
  lastMaintenanceAt: number;
  dueDistance: number;
  refreshData: () => void;
};

const GearMaintenanceItem = ({
  gearId,
  property,
  label,
  dueDistance,
  lastMaintenanceAt,
  refreshData,
}: Props) => {
  const [isHovered, eventHandlers] = useHover();
  const [isEditing, setEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [fieldValue, setFieldValue] = useState(
    Math.floor(lastMaintenanceAt / 1000)
  );

  const dueDistanceInKm = Math.floor(dueDistance / 1000);
  const statusStyle =
    dueDistanceInKm > 500 ? 'ok' : dueDistanceInKm > 0 ? 'warn' : 'overdue';

  const onClick = () => {
    setEditing(true);
  };

  const onChange = (value: string) => {
    setFieldValue(parseInt(value));
  };

  const onSave = async () => {
    setSaving(true);
    await axios.post('/api/save', {
      gearId,
      property,
      value: fieldValue * 1000,
    });
    setEditing(false);
    setSaving(false);

    refreshData();
  };

  const textInput = (
    <input
      type="text"
      defaultValue={fieldValue}
      className={'field'}
      autoFocus
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSave();
      }}
    />
  );

  const editing = (
    <span>
      {label} was replaced at km {textInput}
      <SaveButton isSaving={isSaving} onSave={onSave} />
    </span>
  );

  const listing = (
    <span className={isHovered ? 'hover' : undefined} onClick={onClick}>
      {dueDistanceInKm < 0
        ? `${label} was due for ${Math.abs(dueDistanceInKm)} km`
        : `${label} will be due in ${dueDistanceInKm} km`}
    </span>
  );

  return (
    <>
      <div className={classNames(['status', statusStyle])} {...eventHandlers}>
        {isEditing ? editing : listing}
      </div>

      <style jsx>{`
        .ok {
          cursor: pointer;
          color: #074d07;
        }

        .warn {
          cursor: pointer;
          color: #b67607;
        }

        .overdue {
          cursor: pointer;
          color: #d51111;
        }

        .field {
          width: 75px;
          border: none;
          border-radius: 5px;
          background-color: #eaeaea;
          font-size: 10px;
          text-align: center;
          text-decoration: none;
          padding: 2px;
        }

        .hover {
          text-decoration: underline;
        }

        .status {
          width: 100%;
          line-height: 1.6;
        }
      `}</style>
    </>
  );
};

export default GearMaintenanceItem;
