import axios from 'axios';
import styles from '@/styles/Home.module.css';
import GearMaintenanceItem from '@/components/GearMaintenanceItem';
import { GearRecord } from '@/models/Gear';
import Toggle from '@/components/form/Toggle';
import { populateMaintenanceItems } from '@/helpers/gearHelper';

type Props = { gear: GearRecord; refreshData: () => void };

const GearItem = ({ gear, refreshData }: Props) => {
  const distanceInKm = Math.floor(gear.distance / 1000);
  const maintenanceItems = populateMaintenanceItems(gear);

  const onToggleChange = async (value: boolean) => {
    await axios.post('/api/toggle', {
      gearId: gear.id,
      value,
    });
  };

  return (
    <>
      <div className={styles.info}>
        <b>{gear.name}</b> - {distanceInKm} km
        <div className={styles.distance}>
          <Toggle
            initialState={gear.isNotificationEnabled === true}
            onChanged={onToggleChange}
          />
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
          refreshData={refreshData}
        />
      ))}
    </>
  );
};

export default GearItem;
