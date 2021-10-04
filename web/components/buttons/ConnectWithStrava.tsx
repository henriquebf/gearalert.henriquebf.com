import Image from 'next/image';
import stravaSettings from '@/services/strava/settings.json';

type Props = {};

const ConnectWithStrava = ({}: Props) => {
  const envStravaSettings = stravaSettings[process.env.NODE_ENV];
  return (
    <>
      <a
        href={`http://www.strava.com/oauth/authorize?client_id=${envStravaSettings.clientId}&response_type=code&redirect_uri=${envStravaSettings.redirect_uri}&approval_prompt=force&scope=${envStravaSettings.scope}`}
      >
        <Image
          src="/connect-with-strava.svg"
          alt="Strava Button"
          width={193}
          height={48}
        />
      </a>
    </>
  );
};

export default ConnectWithStrava;
