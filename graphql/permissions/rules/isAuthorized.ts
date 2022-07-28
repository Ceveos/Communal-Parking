
import { Context } from 'graphql/context';
import { Role } from '@prisma/client';
import { rule } from 'graphql-shield';

export const isAdmin = rule({ cache: 'contextual' })(async (parent, args, ctx: Context, info) => {
  return ctx.token?.role as Role === 'ADMIN';
});

export const isModerator = rule({ cache: 'contextual' })(async (parent, args, ctx: Context, info) => {
  return ctx.token?.role as Role === 'MODERATOR';
});

export const isOwner = rule({ cache: 'contextual' })(async (parent, args, ctx: Context, info) => {
  return ctx.token?.id === parent.id;
});