const strRootDir = __dirname.split('\\app')[0];

//! ANCHOR    (generate path url method)
//-- generate path url
//? tạo path url dựa vào array path url truyền vào
export const generatePathUrl = function(filePath) {
  let strPathUrl = strRootDir + "\\" + filePath;
  console.log(strPathUrl.replace('src', ''));

  return String(strPathUrl);
};

//! ANCHOR    (generate full path with specifical directory)
//? tạo path đầy đủ cho folder cụ thể
export const generateDirFromRootPath = function(strDirName) {
  const strRootDir = __dirname.split('\\app')[0];

  return strRootDir + '\\' + strDirName.replace(/\//g,'\\');
};
