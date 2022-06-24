import { Role } from '@prisma/client';

export interface UserToken {
    userId: string
    email: string
    role: Role
    firstName: string
    lastName: string
}