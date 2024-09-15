export type GroupGetDTO = {
  id: number;
  name: string;
  totalCommission: number;
  dispensedCommission: number;
  createdAt: Date;
};

export type GroupInsertDTO = {
  name: string;
  totalCommission: number;
  dispensedCommission: number;
};
