import axios from 'axios';
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
      <div className={'info'}>
        <b>{gear.name}</b> - {distanceInKm} km
        <div className={'distance'}>
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

      <style jsx>{`
        .info {
          padding-bottom: 15px;
        }

        .distance {
          float: right;
        }
      `}</style>
    </>
  );
};

export default GearItem;
