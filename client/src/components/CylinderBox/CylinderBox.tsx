import { FC } from "react";

// Types
import { ICylinderInfos } from "../../types/Infos";

const CylinderBox: FC<{ cylinder: ICylinderInfos }> = ({ cylinder }) => {
  console.log(cylinder);
  return (
    <div>
      <h1>{cylinder.id}</h1>
      <span>chanel open: {cylinder.chanels.open}</span>
      <span>chanel closed: {cylinder.chanels.closed}</span>
    </div>
  );
};
export default CylinderBox;
