import styles from '@/styles/Home.module.css';
import stravaSettings from '@/services/strava/settings.json';

type Props = { isSaving: boolean; onSave: () => void };

const SaveButton = ({ isSaving, onSave }: Props) => {
  const envStravaSettings = stravaSettings[process.env.NODE_ENV];
  return (
    <button className={styles.save} onClick={onSave}>
      {isSaving ? 'SAVING...' : 'SAVE'}
    </button>
  );
};

export default SaveButton;
