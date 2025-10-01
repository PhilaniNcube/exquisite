import type { FieldHook } from "payload";

export const protectRoles: FieldHook = ({req, data}) => {

    const isAdmin = req.user?.roles?.includes('admin');

    if (!isAdmin) {
        return ['user'];
    }

    const userRoles = new Set(data?.roles || []);
    userRoles.add('user'); 
    return [...userRoles.values()]

}