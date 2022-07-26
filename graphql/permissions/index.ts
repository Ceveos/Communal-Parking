import { Context, userIdentifier } from 'graphql/context';
import { createRateLimitRule } from 'graphql-rate-limit';
import { shield } from 'graphql-shield';

const rateLimitRule = createRateLimitRule({ identifyContext: (ctx: Context) => userIdentifier(ctx) });

export const permissions = shield({
  Query: {
    '*': rateLimitRule({window: '1s', max: 5})
  },
  Mutation: {
    '*': rateLimitRule({window: '1s', max: 5})
  }
},
{
  allowExternalErrors: true
});