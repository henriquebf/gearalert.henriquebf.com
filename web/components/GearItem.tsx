import styles from '@/styles/Home.module.css';
import GearMaintenanceItem from '@/components/GearMaintenanceItem';
import { GearRecord } from '@/models/Gear';
import { populateMaintenanceItems } from '@/helpers/gearHelper';

type Props = { gear: GearRecord; onDataChanged: () => void };

const GearItem = ({ gear, onDataChanged }: Props) => {
  const distanceInKm = Math.floor(gear.distance / 1000);
  const maintenanceItems = populateMaintenanceItems(gear);

  return (
    <>
      <div className={styles.info}>
        <b>{gear.name}</b> {gear.primary ? '(primary)' : ''}
        <div className={styles.distance}>Total {distanceInKm} km</div>
      </div>

      <div>
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
      </div>
    </>
  );
};

export default GearItem;
