
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

export const isOwnCommunity = rule({ cache: 'contextual' })(async (_parent, args, ctx: Context, info) => {
  console.log('ctx:', JSON.stringify(ctx));
  console.log('args:', JSON.stringify(args));
  return (ctx.token?.communityId === args.communityId);
});