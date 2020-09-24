import { ColidAccount } from '../models/colid-account.model';

export interface IdentityProvider {
  getAccount(): ColidAccount;
  loginInProgress(): boolean;
  isLoggedIn: boolean;
  login(): void;
  logout(): void;
}

