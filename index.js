const core = require('@actions/core');
const fetch = require('node-fetch');

const host = core.getInput('host');
const identity = core.getInput('identity');
const name = core.getInput('name');
const group = core.getInput('group');
const version = core.getInput('version');
const username = core.getInput('username');
const password = core.getInput('password');
const user = process.env['GITHUB_ACTOR'];

const headers = { headers: { Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'binary').toString('base64')}` } };

fetch(`http://${host}/access-token`, headers)
  .then(response => response.json())
  .then(json => json.token)
  .then(token => fetch(`http://${host}/identities/${identity}/services`, {
    body: JSON.stringify({
      changes: [
        {
          operation: 'upsert',
          artifact: {
            groupId: group,
            artifactId: name,
            version: version
          }
        }
      ]
    }),
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'user': user
    },
    method: 'PATCH'
  }))
  .then(response => response.json())
  .then(json => core.info(json));