/**
 * This file defines the permissions and roles for the application.
 * It uses the access control system provided by better-auth.
 * 
 * The `statement` object defines the actions that can be performed on different resources.
 * The `ac` object is created using these statements.
 * 
 * Roles such as `admin`, `user`, and `myRole` are then defined with specific permissions.
 * 
 * If organizations are used, refer documentation at https://www.better-auth.com/docs/plugins/organization
 */

import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc, userAc } from "better-auth/plugins/admin/access";


/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({ 
  ...adminAc.statements,
  project: ["create", "update"], 
}); 

export const user = ac.newRole({
  ...userAc.statements,
});

export const vendor = ac.newRole({
  ...userAc.statements,
});

export const customer = ac.newRole({
  ...userAc.statements,
})
