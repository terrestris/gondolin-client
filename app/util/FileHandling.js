import Papa from 'papaparse';

/**
 * Helper Class for file handling.
 *
 * @class
 */
export class FileHandling {

  static async parseCsv(file, config) {
    const parserConfig = {
      // dynamicTyping: true,
      header: true,
      trimHeaders: true,
      skipEmptyLines: true,
      ...config
    };

    return new Promise((resolve, reject) => {
      parserConfig.complete = (results, file) => {
        resolve(results, file);
      };
      parserConfig.error = (error, file) => {
        reject(error, file);
      };
      Papa.parse(file, parserConfig);
    });
  }

}

export default FileHandling;
