import {Client} from 'ldapts';

// LDAP Connection Settings
const adSuffix = 'dc=example,dc=com';
const dn = `cn=read-only-admin,${adSuffix}`;
const pw = 'password';

async function main() {
  const client = new Client({
    url: 'ldap://ldap.forumsys.com'
  });
  await client.bind(dn, pw);
  const result = await client.search(adSuffix, {
    filter: `(mail=*@ldap.forumsys.com)`,
    scope: 'sub',
    attributes: ['dn', 'cn', 'givenName', 'sn', 'telephoneNumber', 'mail', 'manager', 'objectClass']
  });

  console.log('search result', result);
  await client.unbind();
}

main();

