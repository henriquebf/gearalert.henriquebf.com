import styles from '@/styles/Home.module.css';
import stravaSettings from '@/services/strava/settings.json';

type Props = {};

const ConnectWithStrava = ({}: Props) => {
  const envStravaSettings = stravaSettings[process.env.NODE_ENV];
  return (
    <div className={styles.card}>
      <a
        href={`http://www.strava.com/oauth/authorize?client_id=${envStravaSettings.clientId}&response_type=code&redirect_uri=${envStravaSettings.redirect_uri}&approval_prompt=force&scope=${envStravaSettings.scope}`}
      >
        Connect with strava
      </a>
    </div>
  );
};

export default ConnectWithStrava;
