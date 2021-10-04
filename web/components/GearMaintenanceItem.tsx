import styles from '@/styles/Home.module.css';

type Props = {
  label: string;
  lastMaintenanceAt: number;
  dueDistance: number;
};

const MaintenanceItem = ({ label, dueDistance }: Props) => {
  const dueDistanceInKm = Math.floor(dueDistance / 1000);
  const status =
    dueDistanceInKm > 500
      ? styles.statusOk
      : dueDistanceInKm > 0
      ? styles.statusWarn
      : styles.statusDue;

  return (
    <span className={status}>
      {label}: {dueDistanceInKm} km
      <br />
    </span>
  );
};

export default MaintenanceItem;
