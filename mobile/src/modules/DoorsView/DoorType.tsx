export interface Door {
  lockID: string;
  doorName: string;
  isOpen: boolean;
  isExpanded: boolean;
}

export interface ServerResponse {
  doorsList: Door[];
}
