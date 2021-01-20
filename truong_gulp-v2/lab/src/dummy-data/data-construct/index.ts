interface LayoutHeaderInterface {
  title: string,
  keywords: string,
  desciption: string,
}; // LayoutHeaderInterface

interface LayoutBodyInterface {
  body_class_name: string,
}; // LayoutBodyInterface

interface ResponseInterface {
  success: boolean,
  error: Object,
  data: Object,
}; // ResponseDataInterface

abstract class DummyData {
  private _strFileName: string;
  protected strHostFileName: string;

  constructor(strFileName?: string) {
    if(!this._isValidFileName(strFileName)) {
      return null;
    }

    this._strFileName = strFileName;
  }

  private _isValidFileName(strFileName: string) {
    if(
      !strFileName ||
      !this.strHostFileName ||
      strFileName !== this.strHostFileName
    ) {
      return false;
    }

    return true;
  }; // _isValidFileName()

  abstract _setHostFileName() : void;

  abstract getData() : any; // getData()
}; // DummyData
