const strRootDir = __dirname.split('\\app')[0];

//! ANCHOR    (generate path url method)
//-- generate path url
//? tạo path url dựa vào array path url truyền vào
export const generatePathUrl = function(arrPathUrl) {
  let strPathUrl = '';

  arrPathUrl.forEach((strPartOfUrl,id) => {
    if(id > 0) {
      strPathUrl += strPartOfUrl;
    }
    if(id > 0 && id < arrPathUrl.length - 1) {
      strPathUrl += '\\';
    }
  });

  return strPathUrl;
};

//! ANCHOR    (generate full path with specifical directory)
//? tạo path đầy đủ cho folder cụ thể
export const generateDirFromRootPath = function(strDirName) {
  const strRootDir = __dirname.split('\\app')[0];

  return strRootDir + '\\' + strDirName.replace(/\//g,'\\');
};
