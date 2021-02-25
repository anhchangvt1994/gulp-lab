interface ExtensionFileConstruct {
  CSS: string,
  HTML: string,
  JS: string,
  NJK: string,
  JSON: string,
};

// NOTE - Định nghĩa danh sách loại file
export const ARR_FILE_EXTENSION:ExtensionFileConstruct = {
  CSS: 'css',
  HTML: 'html',
  JS: 'js',
  NJK: 'njk',
  JSON: 'json',
};

// NOTE - Định nghĩa danh sách tên file
export const ARR_FILE_EXTENSION_FULL_NAME = {
  [ARR_FILE_EXTENSION.CSS]: 'CSS',
  [ARR_FILE_EXTENSION.HTML]: 'HTML',
  [ARR_FILE_EXTENSION.JS]: 'JavaScript',
  [ARR_FILE_EXTENSION.NJK]: 'Nunjucks',
  [ARR_FILE_EXTENSION.JSON]: 'JSON',
};
