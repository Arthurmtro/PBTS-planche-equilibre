export interface ICylinderInfos {
  id: string;
  chanels: {
    open: number;
    closed: number;
  };
}

export interface Iprofile {
  label: string;
  actions: IAction[];
}

export interface IAction {
  cylinderId: string;
  commands: [
    {
      action: string;
      speed: number;
      time: number;
    }
  ];
}
