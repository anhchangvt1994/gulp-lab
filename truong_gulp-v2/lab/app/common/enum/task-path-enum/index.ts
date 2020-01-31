//! ANCHOR    (generate path url method)
//-- generate path url
//? tạo path url dựa vào array path url truyền vào
const generatePathUrl = function(arrPathUrl) {
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

export default generatePathUrl;
