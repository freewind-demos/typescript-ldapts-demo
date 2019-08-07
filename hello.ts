import {createClient, SearchCallbackResponse, SearchEntryObject} from 'ldapjs';
import {ifError} from 'assert';

// LDAP Connection Settings
const adSuffix = 'dc=example,dc=com';
const dn = `cn=read-only-admin,${adSuffix}`;
const pw = 'password';

// createServer()
// Create client and bind to AD
export const client = createClient({
  url: 'ldap://ldap.forumsys.com'
});

client.bind(dn, pw, err => {
  ifError(err);
});

// Search users
export const searchOptions = {
  filter: `(mail=*@ldap.forumsys.com)`,
  scope: 'sub',
  attributes: ['dn', 'cn', 'givenName', 'sn', 'telephoneNumber', 'mail', 'manager', 'objectClass']
};

client.search(adSuffix, searchOptions, (err, res: SearchCallbackResponse) => {
  ifError(err);

  const searchResult: SearchEntryObject[] = [];

  res.on('searchEntry', entry => {
    searchResult.push(entry.object);
  });

  res.on('searchReference', referral => {
    console.log('searchReference: ', referral.uris.join());
  });

  res.on('error', err => {
    console.error('error: ', err.message);
    throw err;
  });

  res.on('end', result => {
    console.log('end status: ', result!.status);
    console.log('result', searchResult);
    client.unbind();
  });

});

// Wrap up
client.unbind(err => {
  ifError(err);
});

