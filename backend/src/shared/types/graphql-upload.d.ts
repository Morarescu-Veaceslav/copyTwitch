// graphql-upload.ts
import { RequestHandler } from 'express';
import { graphqlUploadExpress as originalGraphqlUploadExpress } from 'graphql-upload';

// export middleware-ul pentru Express
export const graphqlUploadExpress: (options?: { maxFileSize?: number; maxFiles?: number }) => RequestHandler =
  originalGraphqlUploadExpress;

// pentru decoratorul GraphQL, exportăm un tip
export type GraphQLUpload = any; // va fi folosit doar în @Args({ type: () => GraphQLUpload })
