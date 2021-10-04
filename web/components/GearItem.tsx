import styles from '@/styles/Home.module.css';

type Props = { gear: any };

const GearItem = ({ gear }: Props) => {
  return (
    <>
      <b>{gear.name}</b>
      <br />
      distance {gear.distance / 1000} km
    </>
  );
};

export default GearItem;
