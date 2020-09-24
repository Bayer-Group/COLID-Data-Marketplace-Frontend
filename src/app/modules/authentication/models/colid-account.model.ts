export class ColidAccount {
  name: string;
  email: string;
  accountIdentifier: string;
  roles: Array<string>;

  constructor(name: string, email: string, accountIdentifier: string, roles: string[]){
    this.name = name;
    this.email = email;
    this.accountIdentifier = accountIdentifier;
    this.roles = roles;
  }
}
