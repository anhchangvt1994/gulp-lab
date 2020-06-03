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

class HandlerErrorUtil {
  arrError: ArrErrorConstruct = {};

  constructor() {}

  //! ANCHOR - handlerError
  // NOTE - Dựng khung xử lý nạp error theo các cases cụ thể
  handlerError(
    err: any,
    extFileName: string,
    isFirstCompileAll?: boolean,
    isMultiCheck?: boolean,
  ) {
    const self = this;

    // NOTE - Nếu là lần đầu build thì nạp error vào arrError
    if(isFirstCompileAll) {
      self._addErrorList(
        err,
        extFileName
      );
    }

    // NOTE - ngược lại nếu arrError không rỗng thì nạp error vào arrError
    else if(!_isEmpty(self.arrError)) {
      self._addErrorList(
        err,
        extFileName
      );
    }

    // NOTE - Ngược lại nếu nhận được cờ isMultiCheck (trường hợp rebuid lại khi remove/copy paste files) thì nạp error vào arrError
    else if(isMultiCheck) {
      self._addErrorList(
        err,
        extFileName
      );
    }

    // NOTE - Ngược lại nếu không nằm ở những trường hợp trên thì in error ra luôn, không cần nạp
    else {
      if(!_isEmpty(err)) {
        let strFilePath = null;
        let strFileName = null;

        if(err.file) {
          strFilePath = err.file;
        } else if(err.fileName) {
          strFilePath = err.fileName;
        }

        strFilePath = strFilePath.replace(/\\/g,'/');
        strFileName = strFilePath.split('/').slice(-2)[1];

        if(
          strFileName === 'index.js' ||
          strFileName === 'index.njk'
        ) {
          strFileName = strFilePath.split('/').slice(-2)[0] + '.' + extFileName;
        }

        setTimeout(function() {
          self.reportError(self._generateCustomError(err, strFilePath, extFileName));
        }, 100);
      }
    }
  }; // handlerError()

  //! ANCHOR - checkClearError
  // NOTE - Dùng check file hiện tại còn error hay không? Nếu không còn thì set về null
  checkClearError(
    isError: boolean,
    fileName: string
  ) {
    const self = this;

    // NOTE - Nếu arrError rỗng hoặc cờ isError đã được bật thì không cần thực thi checkClearError
    if(
      _isEmpty(self.arrError) ||
      isError
    ) {
      return;
    }

    self.arrError[fileName] = null;
  } // checkClearError()

  //! ANCHOR - reportError
  // NOTE - Check điều kiện hiển thị error, có thể là arrError hoặc chỉ 1 dòng error
  reportError(customError?: string) {
    const self = this;

    if(customError) {
      console.log(customError);
      return;
    } else if(!_isEmpty(self.arrError)){
      _forIn(self.arrError, function(err) {
        if(err) {
          console.log(err);
        }
      })
    }
  } // reportError()

  //! ANCHOR - _addErrorList
  private _addErrorList(
    err: any,
    extFileName: string,
  ) {
    const self = this;

    if(!_isEmpty(err)) {
      let strFilePath = null;
      let strFileName = null;

      if(err.file) {
        strFilePath = err.file;
      } else if(err.fileName) {
        strFilePath = err.fileName;
      }

      strFilePath = strFilePath.replace(/\\/g,'/');
      strFileName = strFilePath.split('/').slice(-2)[1];

      if(
        strFileName === 'index.js' ||
        strFileName === 'index.njk'
      ) {
        strFileName = strFilePath.split('/').slice(-2)[0] + '.' + extFileName;
      }

      self.arrError[strFileName] = self._generateCustomError(err, strFilePath, extFileName);
    }
  } // _addErrorList()

  //! ANCHOR - _generateCustomError
  private _generateCustomError(
    err: any,
    strFilePath: string,
    extFileName: string
  ) : string {
    const self = this;

    let intLineNumber = null;

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

    report += _highlight('FILE:') + ' ' + _textColorRed(strFilePath);

    if(intLineNumber) {
      report += _textColorYellow(':' + intLineNumber) + '\n';
    }

    return report;
  }
}

export default HandlerErrorUtil;
