/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as codeExecutions from "../codeExecutions.js";
import type * as corners from "../corners.js";
import type * as http from "../http.js";
import type * as lemonSqueezy from "../lemonSqueezy.js";
import type * as profiles from "../profiles.js";
import type * as snippets from "../snippets.js";
import type * as tracks from "../tracks.js";
import type * as userTimes from "../userTimes.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  codeExecutions: typeof codeExecutions;
  corners: typeof corners;
  http: typeof http;
  lemonSqueezy: typeof lemonSqueezy;
  profiles: typeof profiles;
  snippets: typeof snippets;
  tracks: typeof tracks;
  userTimes: typeof userTimes;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
