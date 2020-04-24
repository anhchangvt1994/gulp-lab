interface TmpDirItemConstruct {
  'file-name': string,
  'file-path': string,
}

interface TmpDirConstruct {
  'css': {[key:string]: TmpDirItemConstruct},
  'js': {[key:string]: TmpDirItemConstruct},
  'html': {[key:string]: TmpDirItemConstruct},
}

export const ARR_TMP_CONSTRUCT: TmpDirConstruct = {
  'css': {},
  'js': {},
  'html': {},
}

export const generateTmpDirItemConstruct = (arrTmpDirItemConstruct: TmpDirItemConstruct) => {
  return arrTmpDirItemConstruct;
};
