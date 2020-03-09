interface ArrRegexExecFileConstruct {
  'js'? : RegExp,
  'njk'? : RegExp,
}

interface arrExtensionFileConstruct {
  [key:string]: string,
}

interface ArrDependentFileConstruct {
  [key:string]: Array<string>,
}

interface ArrMainFileConstruct {
  [key:string]: Array<string>,
}

interface ArrFileInfoConstruct {
  'folder-name': string,
  'path'?: string,
  'file-name': string,
  'content'?: any,
}

const ARR_EXTENSION_FILE: arrExtensionFileConstruct = {
  'JS_EXTENSION': 'js',
  'NJK_EXTENSION': 'njk',
};

const ARR_REGEX_EXEC_FILE : ArrRegexExecFileConstruct = {
  [ARR_EXTENSION_FILE.JS_EXTENSION] : /import(?:["'\s]*[\w*${}\n\r\t, ]+from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/mg,
};

class Dependents {
  private _strFileExtension: string;
  private _arrMainFiles: ArrMainFileConstruct = {};
  private _arrDependentFiles: ArrDependentFileConstruct = {};
  private _regexExecFileContent : RegExp;

  constructor(strFileExtension: string) {
    this._strFileExtension = strFileExtension;
    this._regexExecFileContent = ARR_REGEX_EXEC_FILE[strFileExtension];
  }

  generate(arrFileInfo: ArrFileInfoConstruct) {
    if(this._strFileExtension === ARR_EXTENSION_FILE.JS_EXTENSION) {
      return this._generateJsDependent(arrFileInfo);
    }
  };

  private _generateJsDependent(arrJsFileInfo: ArrFileInfoConstruct) {
    const self = this;
    // NOTE Nếu là index file thì thay bằng tên folder của file index đó
    let strMainFileName = null;

    if(
      arrJsFileInfo['file-name'] !== 'index.js' &&
      arrJsFileInfo['folder-name'] !== ARR_EXTENSION_FILE.JS_EXTENSION
    ) {
      if(
        !self._arrDependentFiles[arrJsFileInfo['file-name']] ||
        self._arrDependentFiles[arrJsFileInfo['file-name']].length <= 0
      ) {
        return null;
      }
      console.log(self._arrDependentFiles[arrJsFileInfo['file-name']]);
      return self._arrDependentFiles[arrJsFileInfo['file-name']];
    } else if(arrJsFileInfo['file-name'] === 'index.js') {
      // NOTE Nếu file name là index thì thay bằng folder-name
      strMainFileName = arrJsFileInfo['folder-name'];
    } else {
      // NOTE Nếu file name không phải là index và folder-name không phải 'js' thì giữ nguyên file name
      strMainFileName = arrJsFileInfo['file-name'];
    }

    let arrMatchResult = null;
    let arrTmpCurMainFile = [];

    arrJsFileInfo.content = arrJsFileInfo.content.toString().replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/mg, '');

    while((arrMatchResult = self._regexExecFileContent.exec(arrJsFileInfo.content)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if(arrMatchResult.index === self._regexExecFileContent.lastIndex) {
        self._regexExecFileContent.lastIndex++;
      }

      const arrFilePathSplit = arrMatchResult[1].split('/');

      // NOTE Thường là những libraries hoặc plugins, nên sẽ không cần lưu lại, vì những libraries hoặc plugins sẽ ít khi thay đổi
      if(arrFilePathSplit.length <= 1) {
        continue;
      }

      const strDependentFileName = arrFilePathSplit.slice(-2)[1] + '.' + ARR_EXTENSION_FILE.JS_EXTENSION;

      if(arrTmpCurMainFile.indexOf(strDependentFileName) === -1) {
        arrTmpCurMainFile.push(strDependentFileName);
      }

      if(!self._arrMainFiles[strMainFileName]) {
        self._arrMainFiles[strMainFileName] = [];
      }

      if(self._arrMainFiles[strMainFileName].indexOf(strDependentFileName) === -1) {
        self._arrMainFiles[strMainFileName].push(strDependentFileName);
      }

      if(!self._arrDependentFiles[strDependentFileName]) {
        self._arrDependentFiles[strDependentFileName] = [];
      }

      if(self._arrDependentFiles[strDependentFileName].indexOf(arrJsFileInfo.path) === -1) {
        self._arrDependentFiles[strDependentFileName].push(arrJsFileInfo.path);
      }
    }

    if(arrTmpCurMainFile.length > 0) {
      const arrCompareFile = self._comparerArray(self._arrMainFiles[strMainFileName], arrTmpCurMainFile);

      if(arrCompareFile.length > 0) {
        // NOTE Update lại array gốc của main file hiện tại
        self._arrMainFiles[strMainFileName] = arrTmpCurMainFile;

        arrCompareFile.forEach(function(strCompareFileName) {
          const arrDependentWithCompareFileName = self._arrDependentFiles[strCompareFileName];
          const indexOfMainFile = arrDependentWithCompareFileName.indexOf(arrJsFileInfo.path) - 1;

          // NOTE Loại bỏ dependent file đã comment hoặc remove trong main file
          self._arrDependentFiles[strCompareFileName] = arrDependentWithCompareFileName.splice(indexOfMainFile, 1);
        });
      }
    }
  }

  private _comparerArray(mainArray: Array<string>, otherArray: Array<string>){
    return mainArray.filter(function(value){
      return otherArray.indexOf(value) === -1;
    });
  }
}

export default Dependents;
