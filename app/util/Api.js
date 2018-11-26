import { appConfig } from '../config/app.config';
import { FetchUtils } from './FetchUtils';
const env = process.env.NODE_ENV;
const api = appConfig.api[env];
import websocket from '../websocket.js';

/**
 * Helper Class for the ol3 map.
 *
 * @class
 */
export class Api {

  static async getModelDescription(modelName, params = {}) {
    const jwt = localStorage.getItem('gondolin_jwt');
    const url = FetchUtils.addParams(`${api}/${modelName}/describe`, params);
    return new Promise((resolve, reject) => {
      return fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(Error(`Error getting model description for ${modelName}.`));
          }
        });
    });
  }

  static async getIdMap(modelName, params = {}) {
    const jwt = localStorage.getItem('cropwatch_jwt');
    const url = FetchUtils.addParams(`${api}/${modelName}/idmap`, params);
    return new Promise((resolve, reject) => {
      return fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(Error(`Error creating IdMap for ${modelName}.`));
          }
        });
    });
  }

  static async getAllEntities(modelName, params = {include: 'all'}) {
    const jwt = localStorage.getItem('gondolin_jwt');
    const url = FetchUtils.addParams(`${api}/${modelName}/get`, params);
    return new Promise((resolve, reject) => {
      return fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(`Error getting all Entities of ${modelName}.`));
          }
        });
    });
  }

  static async getEntityById(modelName, id, params = {include: 'all'}) {
    const jwt = localStorage.getItem('gondolin_jwt');
    const url = FetchUtils.addParams(`${api}/${modelName}/get/${id}`, params);
    return new Promise((resolve, reject) => {
      return fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(`Error getting Entitiy with id ${id} of ${modelName}.`));
          }
        });
    });
  }

  /**
   * Creates the entities by first pushing the data in slices of 1000 to the backend
   * and then importing it into the DB.
   * @param  {string}  modelName the type of the entities to import
   * @param  {object[]} data the data to import
   * @return {Promise} a promise that resolves once the DB import has finished
   */
  static async createEntities(modelName, data) {
    const jwt = localStorage.getItem('gondolin_jwt');
    return new Promise((resolve, reject) => {
      websocket.addEventListener('message', event => {
        const json = JSON.parse(event.data);

        if (json.type === 'import') {
          if (json.success) {
            resolve(json.message, data);
          }
          if (json.error) {
            reject(new Error(`Error creating Entities of ${modelName}.`));
          }
        }
        // handles server message on finished import
      });
      websocket.send(JSON.stringify({
        jwt,
        message: 'startentityimport',
        modelName
      }));
      let cur = 0;
      while (cur < data.length) {
        const portion = data.slice(cur, cur + 1000);
        websocket.send(JSON.stringify({
          jwt,
          message: 'importdata',
          data: portion
        }));
        cur += 1000;
      }
      websocket.send(JSON.stringify({
        jwt,
        message: 'endentityimport'
      }));
    });
  }

  static async updateEntities(modelName, data, params={}) {
    const jwt = localStorage.getItem('gondolin_jwt');
    const url = FetchUtils.addParams(`${api}/${modelName}/update`, params);
    return new Promise((resolve, reject) => {
      return fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(`Error updating Entities of ${modelName}.`));
          }
        });
    });
  }

  static async deleteEntities(modelName, data, params={}) {
    const jwt = localStorage.getItem('gondolin_jwt');
    const url = FetchUtils.addParams(`${api}/${modelName}/delete`, params);
    return new Promise((resolve, reject) => {
      return fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(`Error deleting Entities of ${modelName}.`));
          }
        });
    });
  }

}

export default Api;
