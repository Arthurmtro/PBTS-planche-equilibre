import { FC } from "react";

interface ICylinderBox {
  infos: any;
}

const CylinderBox: FC<ICylinderBox> = ({ infos }) => {
  console.log(infos);
  return (
    <div>
      <h1>{infos.id}</h1>
      <span>chanel open: {infos.chanels.open}</span>
      <span>chanel closed: {infos.chanels.closed}</span>
    </div>
  );
};
export default CylinderBox;
