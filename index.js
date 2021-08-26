const core = require('@actions/core');
const fetch = require('node-fetch');

const host = core.getInput('host');
const identityTag = core.getInput('identity-tag');
const name = core.getInput('name');
const group = core.getInput('group');
const version = core.getInput('version');
const username = core.getInput('username');
const password = core.getInput('password');
const user = process.env['GITHUB_ACTOR'];

const headers = { headers: { Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'binary').toString('base64')}` } };

let token;
let identities;

fetch(`https://${host}/v2/identities?removed=false&removing=false&tag=${identityTag}`)
  .then(response => response.json())
  .then(json => identities = json.identities.map(it => it.identity))
  .then(() => fetch(`https://${host}/access-token`, headers))
  .then(response => response.json())
  .then(json => token = json.token)
  .then(() => identities.map(identity => fetch(`https://${host}/identities/${identity}/services`, {
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
  })));