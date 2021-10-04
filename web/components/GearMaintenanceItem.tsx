import { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import styles from '@/styles/Home.module.css';
import useHover from '@/hooks/useHover';
import SaveButton from '@/components/buttons/SaveButton';

type Props = {
  gearId: string;
  property: string;
  label: string;
  lastMaintenanceAt: number;
  dueDistance: number;
  onDataChanged: () => void;
};

const GearMaintenanceItem = ({
  gearId,
  property,
  label,
  dueDistance,
  lastMaintenanceAt,
  onDataChanged,
}: Props) => {
  const dueDistanceInKm = Math.floor(dueDistance / 1000);
  const statusStyle =
    dueDistanceInKm > 500
      ? styles.ok
      : dueDistanceInKm > 0
      ? styles.warn
      : styles.overdue;

  const [isHovered, eventHandlers] = useHover();
  const [isEditing, setEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [fieldValue, setFieldValue] = useState(
    Math.floor(lastMaintenanceAt / 1000)
  );

  const onClick = () => {
    setEditing(true);
  };

  const onChange = (value: string) => {
    setFieldValue(parseInt(value));
  };

  const onSave = async () => {
    setSaving(true);
    const res = await axios.post('/api/save', {
      gearId,
      property,
      value: fieldValue * 1000,
    });
    setEditing(false);
    setSaving(false);

    if (res.status < 300) {
      onDataChanged();
    }
  };

  const textInput = (
    <input
      type="text"
      defaultValue={fieldValue}
      className={styles.field}
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
    <span className={isHovered ? styles.hover : undefined} onClick={onClick}>
      {dueDistanceInKm < 0
        ? `${label} was due for ${Math.abs(dueDistanceInKm)} km`
        : `${label} will be due in ${dueDistanceInKm} km`}
    </span>
  );

  return (
    <div
      className={classNames([styles.status, statusStyle])}
      {...eventHandlers}
    >
      {isEditing ? editing : listing}
    </div>
  );
};

export default GearMaintenanceItem;
