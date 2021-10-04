import styles from '@/styles/Home.module.css';
import MaintenanceItem from '@/components/GearMaintenanceItem';
import { GearRecord } from '@/models/Gear';
import { populateMaintenanceItems } from '@/helpers/gearHelper';

type Props = { gear: GearRecord };

const GearItem = ({ gear }: Props) => {
  const distanceInKm = Math.floor(gear.distance / 1000);
  const maintenanceItems = populateMaintenanceItems(gear);

  return (
    <>
      <b>{gear.name}</b> {gear.primary ? '(primary)' : ''}
      <br />
      <br />
      Total distance: {distanceInKm} km
      <br />
      <br />
      {maintenanceItems.map((m, i) => (
        <MaintenanceItem
          key={i}
          label={m.label}
          dueDistance={m.dueDistance}
          lastMaintenanceAt={m.lastMaintenanceAt}
        />
      ))}
    </>
  );
};

export default GearItem;
