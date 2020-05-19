import { isEmpty as _isEmpty, forIn as _forIn } from 'lodash';
import { ARR_FILE_NAME } from '@common/define/file-define';
import {
  highlight as _highlight,
  textColorRed as _textColorRed,
  textColorYellow as _textColorYellow,
} from '@common/define/highlight-define';

interface ArrErrorConstruct {
  [key:string]: string,
};

class HandlerReportUtil {
  arrError: ArrErrorConstruct = {};

  constructor() {}

  //! ANCHOR - handlerError
  handlerError(
    err:any,
    extFileName: string,
    isFirstCompileAll?: boolean
  ) {
    const self = this;

    let intLineNumber = null;
    let strFilePath = null;
    let strFileName = null;

    let report = '\n\n---------------- ' + ARR_FILE_NAME[extFileName] + ' ----------------\n\n';

    report += _highlight('TASK:') + _textColorRed(' [' + err.plugin + ']') + '\n';
    report += _highlight('PROB:') + ' ' + _textColorRed(err.message) + '\n';
    if(err.line) {
      report += _highlight('LINE:') + ' ' + _textColorYellow(err.line) + '\n';
      intLineNumber = err.line;
    } else if(err.lineNumber) {
      report += _highlight('LINE:') + ' ' + _textColorYellow(err.lineNumber) + '\n';
      intLineNumber = err.lineNumber;
    }

    if(err.file) {
      strFilePath = err.file;
    } else if(err.fileName) {
      strFilePath = err.fileName;
    }

    report += _highlight('FILE:') + ' ' + _textColorRed(strFilePath);

    if(intLineNumber) {
      report += _textColorYellow(':' + intLineNumber) + '\n';
    }

    if(
      !isFirstCompileAll &&
      _isEmpty(self.arrError)
    ) {
      console.log(report);
    } else if(
      !isFirstCompileAll &&
      !_isEmpty(self.arrError)
    ) {
      strFilePath = strFilePath.replace(/\\/g,'/');
      strFileName = strFilePath.split('/').slice(-2)[1];

      if(
        strFileName === 'index.js' ||
        strFileName === 'index.njk'
      ) {
        strFileName = strFilePath.split('/').slice(-2)[0] + '.' + extFileName;
      }

      self.arrError[strFileName] = report;

      _forIn(self.arrError, function(strError) {
        console.log(strError);
      })
    } else if(isFirstCompileAll) {
      strFilePath = strFilePath.replace(/\\/g,'/');
      strFileName = strFilePath.split('/').slice(-2)[1];

      if(
        strFileName === 'index.js' ||
        strFileName === 'index.njk'
      ) {
        strFileName = strFilePath.split('/').slice(-2)[0] + '.' + extFileName;
      }

      self.arrError[strFileName] = report;
    }
  }; // handlerError()
}

export default HandlerReportUtil;
