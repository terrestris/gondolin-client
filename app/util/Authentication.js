import { appConfig } from '../config/app.config';
const env = process.env.NODE_ENV;
const api = appConfig.api[env];

/**
 * Helper Class for the ol3 map.
 *
 * @class
 */
export class Authentication {

  /**
   * This logs in the user it sets the JWT in the localStorage and returns the
   * a Promise resolving with the JWT.
   *
   * It is marked with async so it can be used with await.
   *
   * @param {string} name
   * @param {string} password
   * @async
   * @returns {Promise<JWT>} A Promise resolving with the JWT.
   */
  static async login(name, password) {
    return new Promise((resolve, reject) => {
      fetch(`${api}/login`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({name, password})
      })
        .then(response => response.status === 200 ? response.json() : {message: 'Could not login.'})
        .then(data => {
          if (data.success) {
            localStorage.setItem('gondolin_jwt', data.token);
            resolve(data.token);
          } else {
            reject(Error(data.message));
          }
        });
    });
  }

  /**
   * This registers a new user.
   *
   * It is marked with async so it can be used with await.
   *
   * @param {string} name
   * @param {string} password
   * @async
   * @returns {Promise<JWT>} A Promise resolving with the JWT.
   */
  static async register(userdata) {
    return new Promise((resolve, reject) => {
      debugger;
      const details = Object.assign({}, userdata, { username: undefined, password: undefined });
      const payload = {
        username: userdata.username,
        password: userdata.password,
        details: details
      }

      fetch(`${api}/register`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            resolve(data.user);
          } else {
            reject(Error(data.message));
          }
        });
    });
  }

  /**
   * Deletes the JWT.
   */
  static logout() {
    localStorage.removeItem('gondolin_jwt');
  }

  /**
   * This get the user by a JWT it reurns a Promise resolving with the user.
   *
   * It is marked with async so it can be used with await.
   *
   * @param {JWT} token
   * @async
   * @returns {Promise<user>} A Promise resolving with the user.
   */
  static async getUserByToken(token) {
    return new Promise((resolve, reject) => {
      return fetch(`${api}/getUserByToken`, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.status === 200 ? response.json() : {})
        .then(data => {
          if (data.success) {
            resolve(data.user);
          } else {
            reject(Error(data.message));
          }
        });
    });
  }

}

export default Authentication;
