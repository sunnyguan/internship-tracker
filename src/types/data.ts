import { boardType } from "../types/board";

export const DATA: boardType = {
  facebook: {
    name: "Facebook",
    actions: [
      { stage: "applied", date: "2021-03-01T02:49:15.220Z" },
      { stage: "phone", date: "2021-03-10T02:49:15.220Z" },
    ],
  },
  microsoft: {
    name: "Microsoft",
    actions: [
      { stage: "applied", date: "2021-01-24T02:49:15.220Z" },
      { stage: "oa", date: "2021-01-27T02:49:15.220Z" },
      { stage: "phone", date: "2021-03-10T05:49:15.220Z" },
    ],
  },
  amazon: {
    name: "Amazon",
    actions: [
      { stage: "applied", date: "2021-01-24T02:49:15.220Z" },
      { stage: "phone", date: "2021-02-24T09:49:15.220Z" },
      { stage: "final", date: "2021-03-03T10:49:15.220Z" },
      { stage: "offer", date: "2021-03-20T10:49:15.220Z" },
    ],
  },
  google: {
    name: "Google",
    actions: [
      { stage: "applied", date: "2021-02-14T02:49:15.220Z" },
      { stage: "oa", date: "2021-03-03T10:49:15.220Z" },
      { stage: "phone", date: "2021-03-20T10:49:15.220Z" },
      { stage: "offer", date: "2021-03-22T10:49:15.220Z" },
    ],
  },
};
