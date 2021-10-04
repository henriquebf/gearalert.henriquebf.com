import { useState } from 'react';
import axios from 'axios';
import styles from '@/styles/Home.module.css';
import useHover from '@/hooks/useHover';

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
  const status =
    dueDistanceInKm > 500
      ? styles.statusOk
      : dueDistanceInKm > 0
      ? styles.statusWarn
      : styles.statusDue;

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

  return (
    <span className={status} {...eventHandlers}>
      {isEditing ? (
        <span>
          {label} changed at{' '}
          <input
            type="text"
            defaultValue={fieldValue}
            className={styles.field}
            onChange={(e) => onChange(e.target.value)}
          />{' '}
          km{' '}
          {isSaving ? (
            <span>
              <b>(saving...)</b>
            </span>
          ) : (
            <span onClick={onSave}>
              <b>(set)</b>
            </span>
          )}
        </span>
      ) : (
        <span
          className={isHovered ? styles.hover : undefined}
          onClick={onClick}
        >
          {label} {dueDistanceInKm < 0 ? 'was' : 'is'} due at {dueDistanceInKm}{' '}
          km
        </span>
      )}
      <br />
    </span>
  );
};

export default GearMaintenanceItem;
