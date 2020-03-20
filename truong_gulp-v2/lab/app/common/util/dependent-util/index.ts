interface ArrRegexExecFileConstruct {
  'js'? : RegExp,
  'njk'? : RegExp,
}

interface arrExtensionFileConstruct {
  [key:string]: string,
}

interface ArrIndexFilePathConstruct {
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
  [ARR_EXTENSION_FILE.JS_EXTENSION]: /import(?:["'\s]*[\w*${}\n\r\t, ]+from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/mg,
  [ARR_EXTENSION_FILE.NJK_EXTENSION]: /{%(?:.*)[extends|include|import]["'\s]["'\s](.*[@\w_-]+)["'].*%}/mg,
};

class Dependents {
  private _strFileExtension: string;
  private _arrIndexFilePath: ArrIndexFilePathConstruct = {};
  private _arrMainFiles: ArrMainFileConstruct = {};
  private _arrDependentFiles: ArrDependentFileConstruct = {};
  private _regexExecFileContent: RegExp;

  constructor(strFileExtension: string) {
    this._strFileExtension = strFileExtension;
    this._regexExecFileContent = ARR_REGEX_EXEC_FILE[strFileExtension];
  }

  generate(arrFileInfo: ArrFileInfoConstruct) {
    if(this._strFileExtension === ARR_EXTENSION_FILE.JS_EXTENSION) {
      return this._generateJsDependent(arrFileInfo);
    } else if(this._strFileExtension === ARR_EXTENSION_FILE.NJK_EXTENSION) {
      return this._generateNjkDenpendent(arrFileInfo);
    }
  };

  private _generateJsDependent(arrJsFileInfo: ArrFileInfoConstruct) {
    const self = this;
    // NOTE Nếu là index file thì thay bằng tên folder của file index đó
    let strTmpFileName = null;

    if(arrJsFileInfo['file-name'] === 'index.js') {
      // NOTE Nếu file name là index thì thay bằng folder-name
      strTmpFileName = arrJsFileInfo['folder-name'] + '.' + ARR_EXTENSION_FILE.JS_EXTENSION;
    } else {
      // NOTE Nếu file name không phải là index thì giữ nguyên file name
      strTmpFileName = arrJsFileInfo['file-name'];
    }

    // NOTE Nếu có filepath kèm theo thì đó là những main file, nên kiểm tra là đã được nạp path hay chưa để nạp, nếu nạp rồi thì return ngay
    if(arrJsFileInfo.path) {
      if(!self._arrIndexFilePath[strTmpFileName]) {
        self._arrIndexFilePath[strTmpFileName] = arrJsFileInfo.path;
      }
    }

    let arrMatchResult = null;
    let arrTmpCurMainFile = [];

    arrJsFileInfo.content = arrJsFileInfo.content.toString().replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/mg, '');

    console.log('file name: ');
    console.log(strTmpFileName);
    console.log('-------------------------------');

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
      console.log(strDependentFileName);

      if(arrTmpCurMainFile.indexOf(strDependentFileName) === -1) {
        arrTmpCurMainFile.push(strDependentFileName);
      }

      if(!self._arrMainFiles[strTmpFileName]) {
        self._arrMainFiles[strTmpFileName] = [];
      }

      if(self._arrMainFiles[strTmpFileName].indexOf(strDependentFileName) === -1) {
        self._arrMainFiles[strTmpFileName].push(strDependentFileName);
      }

      if(!self._arrDependentFiles[strDependentFileName]) {
        self._arrDependentFiles[strDependentFileName] = [];
      }

      if(self._arrDependentFiles[strDependentFileName].indexOf(strTmpFileName) === -1) {
        self._arrDependentFiles[strDependentFileName].push(strTmpFileName);
      }
    }

    if(
      self._arrMainFiles[strTmpFileName] &&
      self._arrMainFiles[strTmpFileName].length > 0
    ) {
      const arrCompareFile = self._comparerArray(self._arrMainFiles[strTmpFileName], arrTmpCurMainFile);
      console.log('compare file:');
      console.log(arrCompareFile);

      if(arrCompareFile.length > 0) {
        // NOTE Update lại array gốc của main file hiện tại
        self._arrMainFiles[strTmpFileName] = arrTmpCurMainFile;

        arrCompareFile.forEach(function(strCompareFileName) {
          const arrDependentWithCompareFileName = self._arrDependentFiles[strCompareFileName];
          const indexOfMainFile = arrDependentWithCompareFileName.indexOf(strTmpFileName);

          console.log(strTmpFileName);
          console.log(indexOfMainFile);

          // NOTE Loại bỏ dependent file đã comment hoặc remove trong main file
          self._arrDependentFiles[strCompareFileName].splice(indexOfMainFile, 1);
        });
      }
    }

    console.log('~~~~~~~~~~~~~~~~~~~~');
    console.log(self._arrMainFiles);
    console.log('++++++++++++++++');
    console.log(self._arrDependentFiles);
    console.log('-------------------------');

    if(self._arrIndexFilePath[strTmpFileName]) {
      return [self._arrIndexFilePath[strTmpFileName]];
    } else if(self._arrDependentFiles[strTmpFileName]) {
      const arrMainFileChanged = self._generateMainFileList(self._arrDependentFiles[strTmpFileName]);

      return arrMainFileChanged;
    }

    return ;
  }

  private _generateNjkDenpendent(arrNjkFileInfo: ArrFileInfoConstruct) {
    const self = this;
    // NOTE Nếu là index file thì thay bằng tên folder của file index đó
    let strTmpFileName = null;

    if(arrNjkFileInfo['file-name'] === 'index.njk') {
      // NOTE Nếu file name là index thì thay bằng folder-name
      strTmpFileName = arrNjkFileInfo['folder-name'] + '.' + ARR_EXTENSION_FILE.NJK_EXTENSION;
    } else {
      // NOTE Nếu file name không phải là index thì giữ nguyên file name
      strTmpFileName = arrNjkFileInfo['file-name'];
    }

    // NOTE Nếu có filepath kèm theo thì đó là những main file, nên kiểm tra là đã được nạp path hay chưa để nạp, nếu nạp rồi thì return ngay
    if(arrNjkFileInfo.path) {
      if(!self._arrIndexFilePath[strTmpFileName]) {
        self._arrIndexFilePath[strTmpFileName] = arrNjkFileInfo.path;
      }
    }

    let arrMatchResult = null;
    let arrTmpCurMainFile = [];

    arrNjkFileInfo.content = arrNjkFileInfo.content.toString().replace(/{#[^>]*#}/mg, '');

    console.log('file name: ');
    console.log(strTmpFileName);
    console.log('-------------------------------');

    while((arrMatchResult = self._regexExecFileContent.exec(arrNjkFileInfo.content)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if(arrMatchResult.index === self._regexExecFileContent.lastIndex) {
        self._regexExecFileContent.lastIndex++;
      }

      const arrFilePathSplit = arrMatchResult[1].split('/');

      // NOTE Thường là những libraries hoặc plugins, nên sẽ không cần lưu lại, vì những libraries hoặc plugins sẽ ít khi thay đổi
      if(arrFilePathSplit.length <= 1) {
        continue;
      }

      const strDependentFileName = arrFilePathSplit.slice(-2)[1];
      console.log(strDependentFileName);

      if(arrTmpCurMainFile.indexOf(strDependentFileName) === -1) {
        arrTmpCurMainFile.push(strDependentFileName);
      }

      if(!self._arrMainFiles[strTmpFileName]) {
        self._arrMainFiles[strTmpFileName] = [];
      }

      if(self._arrMainFiles[strTmpFileName].indexOf(strDependentFileName) === -1) {
        self._arrMainFiles[strTmpFileName].push(strDependentFileName);
      }

      if(!self._arrDependentFiles[strDependentFileName]) {
        self._arrDependentFiles[strDependentFileName] = [];
      }

      if(self._arrDependentFiles[strDependentFileName].indexOf(strTmpFileName) === -1) {
        self._arrDependentFiles[strDependentFileName].push(strTmpFileName);
      }
    }

    if(
      self._arrMainFiles[strTmpFileName] &&
      self._arrMainFiles[strTmpFileName].length > 0
    ) {
      const arrCompareFile = self._comparerArray(self._arrMainFiles[strTmpFileName], arrTmpCurMainFile);
      console.log('compare file:');
      console.log(arrCompareFile);

      if(arrCompareFile.length > 0) {
        // NOTE Update lại array gốc của main file hiện tại
        self._arrMainFiles[strTmpFileName] = arrTmpCurMainFile;

        arrCompareFile.forEach(function(strCompareFileName) {
          const arrDependentWithCompareFileName = self._arrDependentFiles[strCompareFileName];
          const indexOfMainFile = arrDependentWithCompareFileName.indexOf(strTmpFileName);

          console.log(strTmpFileName);
          console.log(indexOfMainFile);

          // NOTE Loại bỏ dependent file đã comment hoặc remove trong main file
          self._arrDependentFiles[strCompareFileName].splice(indexOfMainFile, 1);
        });
      }
    }

    console.log('~~~~~~~~~~~~~~~~~~~~');
    console.log(self._arrMainFiles);
    console.log('++++++++++++++++');
    console.log(self._arrDependentFiles);
    console.log('-------------------------');

    if(self._arrIndexFilePath[strTmpFileName]) {
      return [self._arrIndexFilePath[strTmpFileName]];
    } else if(self._arrDependentFiles[strTmpFileName]) {
      const arrMainFileChanged = self._generateMainFileList(self._arrDependentFiles[strTmpFileName]);

      return arrMainFileChanged;
    }

    return ;
  }

  private _comparerArray(mainArray: Array<string>, otherArray: Array<string> = []) {
    if(
      !otherArray ||
      otherArray.length <= 0
    ) {
      return mainArray;
    }

    return mainArray.filter(function(value){
      return otherArray.indexOf(value) === -1;
    });
  }

  private _unionArray(arrDependentFiles: Array<string>) {
    const arrUnionFactory = arrDependentFiles.filter(function(strDependentFileItem, pos, self) {
      return self.indexOf(strDependentFileItem) == pos;
    });

    return arrUnionFactory;
  }

  private _generateMainFileList(
    arrDependentFileCurList: Array<string>,
    arrTmpMainPathResult: Array<string> = [],
    arrTmpDependentCollect: Array<string> = [],
  ) {
    const self = this;

    arrDependentFileCurList.forEach(function(strDepentFileItem) {
      if(
        self._arrIndexFilePath[strDepentFileItem] &&
        arrTmpMainPathResult.indexOf(self._arrIndexFilePath[strDepentFileItem]) === -1
      ) {
        arrTmpMainPathResult.push(self._arrIndexFilePath[strDepentFileItem]);
      } else if(self._arrDependentFiles[strDepentFileItem]) {
        if(arrTmpDependentCollect.length <= 0) {
          arrTmpDependentCollect = self._arrDependentFiles[strDepentFileItem];
        } else {
          arrTmpDependentCollect.concat(self._arrDependentFiles[strDepentFileItem]);
        }
      }
    });

    if(arrTmpDependentCollect.length <= 0) {
      return arrTmpMainPathResult ?? [];
    }

    arrTmpDependentCollect = self._unionArray(arrTmpDependentCollect);

    return self._generateMainFileList(
      arrTmpDependentCollect,
      arrTmpMainPathResult
    );
  }
}

export default Dependents;
