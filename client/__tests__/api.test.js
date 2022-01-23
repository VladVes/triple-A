import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import Api from '../src/Api';

let client = {};
let mock = {};
let api = {};

describe('Api', () => {
  beforeEach(() => {
    client = axios.create();
    mock = new MockAdapter(client);
    api = new Api({ client });
  });
  test('Login captures token information', async () => {
    const LOGIN_REQUEST = {
      login: 'foo',
      password: 'foo',
    };
    const LOGIN_RESPONSE = {
      token: 'TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    };
    mock.onPost('/auth/login', LOGIN_REQUEST).reply(200, LOGIN_RESPONSE);
    mock.onGet('/users').reply(200, []);

    await api.login(LOGIN_REQUEST);
    await api.getUsers();

    expect(mock.history.get.length).toEqual(1);
    expect(mock.history.get[0].headers.Authorization).toEqual(
      `Bearer ${LOGIN_RESPONSE.token}`,
    );
  });
  test('Logout remove token information', async () => {
    const LOGIN_REQUEST = {
      login: 'foo',
      password: 'foo',
    };
    const LOGIN_RESPONSE = {
      token: 'TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    };
    mock.onPost('/auth/login', LOGIN_REQUEST).reply(200, LOGIN_RESPONSE);
    mock.onGet('/users').reply(200, []);

    await api.login(LOGIN_REQUEST);
    await api.logout();
    await api.getUsers();

    expect(mock.history.get.length).toEqual(1);
    expect(mock.history.get[0].headers.Authorization).toBeFalsy();
  });
  test('Correctly retries request when got 401 with new token', async () => {
    const LOGIN_REQUEST = {
      login: 'foo',
      password: 'foo',
    };
    const LOGIN_RESPONSE = {
      token: 'TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    };

    const REFRESH_REQUEST = {
      refreshToken: LOGIN_RESPONSE.refreshToken,
    };
    const REFRESH_RESPONSE = {
      token: 'TOKEN2',
      refreshToken: 'REFRESH_TOKEN2',
    };

    mock.onPost('/auth/login', LOGIN_REQUEST).reply(200, LOGIN_RESPONSE);
    mock
      .onPost('/auth/refresh', REFRESH_REQUEST)
      .replyOnce(200, REFRESH_RESPONSE);
    mock.onGet('/users').reply((config) => {
      const { Authorization: auth } = config.headers;
      if (auth === `Bearer ${LOGIN_RESPONSE.token}`) {
        return [401];
      }

      if (auth === `Bearer ${REFRESH_RESPONSE.token}`) {
        return [200, []];
      }
      return [404];
    });

    await api.login(LOGIN_REQUEST);
    await api.getUsers();

    expect(mock.history.get.length).toEqual(2);
    expect(mock.history.get[1].headers.Authorization).toEqual(
      `Bearer ${REFRESH_RESPONSE.token}`,
    );
  });
  test('Correctly fails request when got non-401 error', async () => {
    mock.onGet('/users').reply(404);

    expect(async () => {
      await api.getUsers('/users');
    }).rejects.toThrow();
  });
  test('Logout remove token information', async () => {
    const LOGIN_REQUEST = {
      login: 'foo',
      password: 'foo',
    };
    const LOGIN_RESPONSE = {
      token: 'TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    };
    mock.onPost('/auth/login', LOGIN_REQUEST).reply(200, LOGIN_RESPONSE);
    mock.onGet('/users').reply(200, []);

    await api.login(LOGIN_REQUEST);
    await api.logout();
    await api.getUsers();

    expect(mock.history.get.length).toEqual(1);
    expect(mock.history.get[0].headers.Authorization).toBeFalsy();
  });
  test('Does not consume token more than once', async () => {
    const LOGIN_REQUEST = {
      login: 'foo',
      password: 'foo',
    };
    const LOGIN_RESPONSE = {
      token: 'TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    };

    const REFRESH_REQUEST = {
      refreshToken: LOGIN_RESPONSE.refreshToken,
    };
    const REFRESH_RESPONSE = {
      token: 'TOKEN2',
      refreshToken: 'REFRESH_TOKEN2',
    };
    mock.onPost('/auth/login', LOGIN_REQUEST).reply(200, LOGIN_RESPONSE);
    mock
      .onPost('/auth/refresh', REFRESH_REQUEST)
      .replyOnce(200, REFRESH_RESPONSE);

    mock.onGet('/users').reply((config) => {
      const { Authorization: auth } = config.headers;
      if (auth === `Bearer ${LOGIN_RESPONSE.token}`) {
        return [401];
      }

      if (auth === `Bearer ${REFRESH_RESPONSE.token}`) {
        return [200, []];
      }
      return [404];
    });

    await api.login(LOGIN_REQUEST);
    await Promise.all([api.getUsers(), api.getUsers()]);
    expect(
      mock.history.post.filter(({ url }) => url === '/auth/refresh').length,
    ).toEqual(1);
  });
});
