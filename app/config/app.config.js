class AppConfig {

  /**
   * The primary color.
   * @type {String} primaryColor
   */
  primaryColor = '#0e1058';

  /**
   * The secondary color.
   * @type {String} secondaryColor
   */
  secondaryColor = '#b94800';

  /**
   * Configure the application header here.
   * @type {Object} header
   */
  header = {
    /**
     * The path to the logo image used for the application. Relative to the
     * resources img folder.
     * @type {String} logo
     */
    logo: 'logo_terrestris.png',
    /**
     * The title off the application. Displayed in the header.
     * @type {String} header
     */
    title: 'gondolin Client'
  };

  api = {
    development: 'http://localhost:3000',
    test: 'api',
    production: `${window.location.protocol}//${window.location.host}`
  };

  websocket = {
    development: 'ws://localhost:3000/websocket',
    test: 'api',
    production: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/websocket`
  };

  upload = {
    development: 'ws://localhost:3000/upload',
    test: 'api',
    production: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/upload`
  };
}

export const appConfig = new AppConfig();
