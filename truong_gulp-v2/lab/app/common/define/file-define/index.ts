interface FileConstruct {
  css: string,
  html: string,
  js: string,
  njk: string,
};

// NOTE - Định nghĩa danh sách loại file
export const ARR_FILE_EXTENSION:FileConstruct = {
  css: 'css',
  html: 'html',
  js: 'js',
  njk: 'njk',
};

// NOTE - Định nghĩa danh sách tên file
export const ARR_FILE_NAME:FileConstruct = {
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  njk: 'Nunjucks',
};
