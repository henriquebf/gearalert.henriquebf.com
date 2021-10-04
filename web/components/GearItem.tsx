import styles from '@/styles/Home.module.css';
import GearMaintenanceItem from '@/components/GearMaintenanceItem';
import { GearRecord } from '@/models/Gear';
import Toggle from '@/components/form/Toggle';
import { populateMaintenanceItems } from '@/helpers/gearHelper';

type Props = { gear: GearRecord; onDataChanged: () => void };

const GearItem = ({ gear, onDataChanged }: Props) => {
  const distanceInKm = Math.floor(gear.distance / 1000);
  const maintenanceItems = populateMaintenanceItems(gear);

  return (
    <>
      <div className={styles.info}>
        <b>{gear.name}</b> - {distanceInKm} km
        <div className={styles.distance}>
          <Toggle initialState={false} onChanged={() => {}} />
        </div>
      </div>

      {maintenanceItems.map((m, i) => (
        <GearMaintenanceItem
          key={i}
          gearId={m.gearId}
          property={m.property}
          label={m.label}
          dueDistance={m.dueDistance}
          lastMaintenanceAt={m.lastMaintenanceAt}
          onDataChanged={onDataChanged}
        />
      ))}
    </>
  );
};

export default GearItem;
