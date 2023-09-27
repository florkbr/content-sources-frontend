// THIS IS A DIRECT IMPORT FROM insights-common-typescript/packages/insights-common-typescript/src/types/Rbac.ts
// The original package was not supported in React 18 so we have pulled the needed wrapper methods here.


import { AccessApi, AccessPagination } from '@redhat-cloud-services/rbac-client';
import axios from 'axios';

const BASE_PATH = '/api/rbac/v1';

type Verb = string;
type What = string;
type App = string;

type WhatPermissions = Array<Verb>;
type AppPermissions = Record<What, WhatPermissions>;
export type RbacPermission = Record<App, AppPermissions>

const anything: Verb | What = '*';

export class RbacPermissionsBuilder {
    readonly accessPagination: AccessPagination;

    constructor(accessPagination: AccessPagination) {
        this.accessPagination = accessPagination;
    }

    public build(): RbacPermission {
        if (!this.accessPagination?.data || this.accessPagination.data.length === 0) {
            return {};
        }

        const permissions: RbacPermission = {};

        for (const access of this.accessPagination.data) {
            const [ app, what, verb ] = access.permission.split(':');

            if (!permissions[app]) {
                permissions[app] = {};
            }

            if (!permissions[app][what]) {
                permissions[app][what] = [];
            }

            permissions[app][what].push(verb);
        }

        return permissions;
    }
}

export const fetchRBAC = (appQuery: string): Promise<Rbac> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = axios.create() as any;

    return new AccessApi(undefined, BASE_PATH, instance)
    .getPrincipalAccess(appQuery)
    .then(response => new RbacPermissionsBuilder(response.data))
    .then(builder => new Rbac(builder.build()));
};


export class Rbac {
    private permissions: RbacPermission = {};

    constructor(permissions: RbacPermission) {
        this.permissions = permissions;
    }

    public hasPermission(app: App, what: What, verb: Verb): boolean {
        const appPermission = this.permissions[app];
        if (!appPermission) {
            return false;
        }

        return this.hasAppPermission(appPermission, what, verb);
    }

    private hasWhatPermission(permissions: WhatPermissions, verb: Verb): boolean {
        return permissions.includes(verb) || permissions.includes(anything);
    }

    private hasAppPermission(permissions: AppPermissions, what: What, verb: Verb): boolean {
        const verbs = permissions[what];
        const specificPermission = verbs ? this.hasWhatPermission(verbs, verb) : undefined;

        if (specificPermission) {
            return specificPermission;
        } else if (what !== anything) {
            return this.hasAppPermission(permissions, anything, verb);
        }

        return false;
    }
}