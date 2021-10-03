import axios from 'axios';

type BikeData = {
  id: string;
  primary: boolean;
  name: string;
  distance: number;
  retired: boolean;
};

type ShoeData = {
  id: string;
  primary: boolean;
  name: string;
  distance: number;
  retired: boolean;
};

type AthleteData = {
  id: number;
  bikes: BikeData[];
  shoes: ShoeData[];
};

const getAthlete = async (accessToken: string): Promise<AthleteData> => {
  const res: any = await axios.get(`https://www.strava.com/api/v3/athlete`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res?.data || undefined;
};

export default getAthlete;
