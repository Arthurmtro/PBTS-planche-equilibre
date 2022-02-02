export interface ICylinderInfos {
  id: string;
  chanels: {
    open: number;
    closed: number;
  };
}

export interface IProfile {
  label: string;
  category?: string;
  fileName?: string;
  actions?: IAction[];
  duration: number;
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
