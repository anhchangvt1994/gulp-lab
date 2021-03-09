interface arrRelativeTaskListInterface {
  'add'?: string,
  'remove'?: Function,
  'other'?: any,
};

interface arrWatchFilesConfigInterface {
  'sourcePathUrl': string | Array<string>,
  'relativeTaskList': arrRelativeTaskListInterface,
};
