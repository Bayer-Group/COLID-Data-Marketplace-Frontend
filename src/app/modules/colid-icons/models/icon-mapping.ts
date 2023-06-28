import { Constants } from "src/app/shared/constants";

export const IconMapping = {
  [Constants.Resource.LifeCycleStatus.Draft]: {
    icon: "pencil-alt",
    tooltip: "Draft",
  },
  [Constants.Resource.LifeCycleStatus.Published]: {
    icon: "cloud-upload-alt",
    tooltip: "Published",
  },
  [Constants.Resource.LifeCycleStatus.MarkedDeletion]: {
    icon: "trash-alt",
    tooltip: "Marked For Deletion",
  },
};
