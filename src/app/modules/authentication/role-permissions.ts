import { Constants } from "src/app/shared/constants";

export class RolePermissions {
    static Admin = new Array<string>(Constants.Authentication.EditorRoles.Administration, Constants.Authentication.EditorRoles.SuperAdministration);
}