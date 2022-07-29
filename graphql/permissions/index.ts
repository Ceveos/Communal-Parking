import { Context, userIdentifier } from 'graphql/context';
import { and, or, shield } from 'graphql-shield';
import { createRateLimitRule } from 'graphql-rate-limit';
import { isAdmin, isModerator, isOwnCommunity, isOwner } from './rules/isAuthorized';

const rateLimitRule = createRateLimitRule({ identifyContext: (ctx: Context) => userIdentifier(ctx) });

export const permissions = shield({
  Query: {
    '*': rateLimitRule({window: '1s', max: 5}),
    getTenants: and(or(isModerator, isAdmin, isOwner), rateLimitRule({window: '1s', max: 5}))
  },
  Mutation: {
    '*': rateLimitRule({window: '1s', max: 5}),
    addHouse: and(or(isModerator, isAdmin), isOwnCommunity, rateLimitRule({window: '1s', max: 5})),
    addTenant: and(or(isModerator, isAdmin), isOwnCommunity, rateLimitRule({window: '1s', max: 5})),
  },
  User: {
    email: or(isModerator, isAdmin, isOwner)
  },
},
{
  allowExternalErrors: true,
});