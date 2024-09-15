export type GroupLevelGetDTO = {
  id: number;
  groupId: number;
  levelIndex: number;
  commissionChunk: number;
};

export type GroupLevelInsertDTO = {
  groupId: number;
  levelIndex: number;
  commissionChunk: number;
};
