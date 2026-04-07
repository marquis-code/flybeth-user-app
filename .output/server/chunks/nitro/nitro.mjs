import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$2, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { toValue } from 'vue';
import { createConsola } from 'consola';
import { createRouterMatcher } from 'vue-router';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}
function withHttps(input) {
  return withProtocol(input, "https://");
}
function withProtocol(input, protocol) {
  let match = input.match(PROTOCOL_REGEX);
  if (!match) {
    match = input.match(/^\/{2,}/);
  }
  if (!match) {
    return protocol + input;
  }
  return protocol + input.slice(match[0].length);
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$1(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o$1(n){throw new Error(`${n} is not implemented yet!`)}let i$2 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o$1("Readable.asyncIterator")}iterator(e){throw o$1("Readable.iterator")}map(e,t){throw o$1("Readable.map")}filter(e,t){throw o$1("Readable.filter")}forEach(e,t){throw o$1("Readable.forEach")}reduce(e,t,r){throw o$1("Readable.reduce")}find(e,t){throw o$1("Readable.find")}findIndex(e,t){throw o$1("Readable.findIndex")}some(e,t){throw o$1("Readable.some")}toArray(e){throw o$1("Readable.toArray")}every(e,t){throw o$1("Readable.every")}flatMap(e,t){throw o$1("Readable.flatMap")}drop(e,t){throw o$1("Readable.drop")}take(e,t){throw o$1("Readable.take")}asIndexedPairs(e){throw o$1("Readable.asIndexedPairs")}};let l$2 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$2,t=new l$2){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _$1(){return Object.assign(c$1.prototype,i$2.prototype),Object.assign(c$1.prototype,l$2.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_$1();let A$1 = class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};class y extends i$2{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$1;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$2{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R$1(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S$1=new Set([101,204,205,304]);async function b$1(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R$1(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S$1.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C$1(n,e,t={}){try{const r=await b$1(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$1(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i$1=globalThis.AbortController,l$1=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l$1;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l$1(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController$1 = globalThis.AbortController || i$1;
createFetch({ fetch, Headers: Headers$1, AbortController: AbortController$1 });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive$1(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive$1(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$2(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$2(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$2(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage$1 = createStorage({});

storage$1.mount('/assets', assets$1);

storage$1.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage$1, base) : storage$1;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r$1="sha256",s="base64url";function digest(t){if(e)return e(r$1,t,s);const o=createHash(r$1).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "fd5a72ed-f4f1-4d16-9cd4-436913f307a8",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/__sitemap__/style.xsl": {
        "headers": {
          "Content-Type": "application/xslt+xml"
        }
      },
      "/sitemap.xml": {},
      "/_nuxt": {
        "robots": "noindex",
        "headers": {
          "X-Robots-Tag": "noindex"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable",
          "X-Robots-Tag": "noindex"
        },
        "robots": "noindex"
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "apiBase": "http://localhost:3000",
    "googleClientId": "",
    "paystackPublicKey": "",
    "stripePublishableKey": "pk_test_51SlIe6FOWpTToNxe7GNqR7K9UbWopqhPgQ3rrJBuG3iqQdEhP7nf3VJ2JDxHaL2g9YMiLpqo9TiXsW6AiyDfNXQ00i1AqxHyG",
    "googleMapsApiKey": "",
    "nuxt-schema-org": {
      "reactive": true,
      "minify": true,
      "scriptAttributes": {
        "data-nuxt-schema-org": true
      },
      "identity": "",
      "version": "5.0.10"
    },
    "seo-utils": {
      "canonicalQueryWhitelist": [
        "page",
        "sort",
        "filter",
        "search",
        "q",
        "category",
        "tag"
      ],
      "canonicalLowercase": true
    },
    "nuxt-robots": {
      "version": "5.7.0",
      "isNuxtContentV2": false,
      "debug": false,
      "credits": true,
      "groups": [
        {
          "comment": [],
          "disallow": [
            ""
          ],
          "allow": [],
          "userAgent": [
            "*"
          ],
          "contentUsage": [],
          "contentSignal": [],
          "_indexable": true,
          "_rules": [],
          "_normalized": true
        }
      ],
      "sitemap": [
        "/sitemap.xml"
      ],
      "header": true,
      "robotsEnabledValue": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      "robotsDisabledValue": "noindex, nofollow",
      "cacheControl": "max-age=14400, must-revalidate",
      "botDetection": true,
      "pageMetaRobots": {}
    },
    "i18n": {
      "baseUrl": "",
      "defaultLocale": "en",
      "rootRedirect": "",
      "redirectStatusCode": 302,
      "skipSettingLocaleOnNavigate": false,
      "locales": [
        {
          "code": "en",
          "iso": "en-US",
          "name": "English",
          "language": "en-US"
        },
        {
          "code": "es",
          "iso": "es-ES",
          "name": "Español",
          "language": "es-ES"
        },
        {
          "code": "fr",
          "iso": "fr-FR",
          "name": "Français",
          "language": "fr-FR"
        },
        {
          "code": "de",
          "iso": "de-DE",
          "name": "Deutsch",
          "language": "de-DE"
        },
        {
          "code": "ar",
          "iso": "ar-SA",
          "name": "العربية",
          "dir": "rtl",
          "language": "ar-SA"
        },
        {
          "code": "zh",
          "iso": "zh-CN",
          "name": "中文",
          "language": "zh-CN"
        },
        {
          "code": "ja",
          "iso": "ja-JP",
          "name": "日本語",
          "language": "ja-JP"
        },
        {
          "code": "pt",
          "iso": "pt-BR",
          "name": "Português",
          "language": "pt-BR"
        },
        {
          "code": "it",
          "iso": "it-IT",
          "name": "Italiano",
          "language": "it-IT"
        },
        {
          "code": "ko",
          "iso": "ko-KR",
          "name": "한국어",
          "language": "ko-KR"
        },
        {
          "code": "tr",
          "iso": "tr-TR",
          "name": "Türkçe",
          "language": "tr-TR"
        },
        {
          "code": "hi",
          "iso": "hi-IN",
          "name": "हिन्दी",
          "language": "hi-IN"
        }
      ],
      "detectBrowserLanguage": {
        "alwaysRedirect": true,
        "cookieCrossOrigin": false,
        "cookieDomain": "",
        "cookieKey": "i18n_redirected",
        "cookieSecure": false,
        "fallbackLocale": "",
        "redirectOn": "root",
        "useCookie": true
      },
      "experimental": {
        "localeDetector": "",
        "typedPages": true,
        "typedOptionsAndMessages": false,
        "alternateLinkCanonicalQueries": true,
        "devCache": false,
        "cacheLifetime": "",
        "stripMessagesPayload": false,
        "preload": false,
        "strictSeo": false,
        "nitroContextDetection": true,
        "httpCacheDuration": 10
      },
      "domainLocales": {
        "en": {
          "domain": ""
        },
        "es": {
          "domain": ""
        },
        "fr": {
          "domain": ""
        },
        "de": {
          "domain": ""
        },
        "ar": {
          "domain": ""
        },
        "zh": {
          "domain": ""
        },
        "ja": {
          "domain": ""
        },
        "pt": {
          "domain": ""
        },
        "it": {
          "domain": ""
        },
        "ko": {
          "domain": ""
        },
        "tr": {
          "domain": ""
        },
        "hi": {
          "domain": ""
        }
      }
    }
  },
  "sitemap": {
    "isI18nMapped": false,
    "sitemapName": "sitemap.xml",
    "isMultiSitemap": false,
    "excludeAppSources": [],
    "cacheMaxAgeSeconds": 600,
    "autoLastmod": false,
    "defaultSitemapsChunkSize": 1000,
    "minify": false,
    "sortEntries": true,
    "debug": false,
    "discoverImages": true,
    "discoverVideos": true,
    "sitemapsPathPrefix": "/__sitemap__/",
    "isNuxtContentDocumentDriven": false,
    "xsl": "/__sitemap__/style.xsl",
    "xslTips": true,
    "xslColumns": [
      {
        "label": "URL",
        "width": "50%"
      },
      {
        "label": "Images",
        "width": "25%",
        "select": "count(image:image)"
      },
      {
        "label": "Last Updated",
        "width": "25%",
        "select": "concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"
      }
    ],
    "credits": true,
    "version": "7.6.0",
    "sitemaps": {
      "sitemap.xml": {
        "sitemapName": "sitemap.xml",
        "route": "sitemap.xml",
        "defaults": {},
        "include": [],
        "exclude": [
          "/_**",
          "/_nuxt/**"
        ],
        "includeAppSources": true
      }
    }
  },
  "nuxt-schema-org": {
    "reactive": true,
    "minify": true,
    "scriptAttributes": {
      "data-nuxt-schema-org": true
    },
    "identity": "",
    "version": "5.0.10"
  },
  "nuxt-site-config": {
    "stack": [
      {
        "_context": "system",
        "_priority": -15,
        "name": "user",
        "env": "production"
      },
      {
        "_context": "package.json",
        "_priority": -10,
        "name": "frontend"
      },
      {
        "_priority": -3,
        "_context": "nuxt-site-config:config",
        "url": "https://flybeth.com",
        "name": "Flybeth"
      },
      {
        "_context": "@nuxtjs/i18n",
        "defaultLocale": "en-US"
      }
    ],
    "version": "3.2.19",
    "debug": false,
    "multiTenancy": []
  },
  "nuxt-robots": {
    "version": "5.7.0",
    "isNuxtContentV2": false,
    "debug": false,
    "credits": true,
    "groups": [
      {
        "comment": [],
        "disallow": [
          ""
        ],
        "allow": [],
        "userAgent": [
          "*"
        ],
        "contentUsage": [],
        "contentSignal": [],
        "_indexable": true,
        "_rules": [],
        "_normalized": true
      }
    ],
    "sitemap": [
      "/sitemap.xml"
    ],
    "header": true,
    "robotsEnabledValue": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "robotsDisabledValue": "noindex, nofollow",
    "cacheControl": "max-age=14400, must-revalidate",
    "botDetection": true,
    "pageMetaRobots": {}
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

/**
* Nitro internal functions extracted from https://github.com/nitrojs/nitro/blob/v2/src/runtime/internal/utils.ts
*/
function isJsonRequest(event) {
	// If the client specifically requests HTML, then avoid classifying as JSON.
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		// let Nitro handle JSON errors
		return;
	}
	// invoke default Nitro error handler (which will log appropriately if required)
	const defaultRes = await defaultHandler(error, event, { json: true });
	// let Nitro handle redirect if appropriate
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	const errorObject = defaultRes.body;
	// remove proto/hostname/port from URL
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	// add default server message (keep sanitized for unhandled errors)
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	// we will be rendering this error internally so we can pass along the error.data safely
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	// Access request headers
	const reqHeaders = getRequestHeaders(event);
	// Detect to avoid recursion in SSR rendering of errors
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
	// HTML response (via SSR)
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	// Fallback to static rendered error page
	if (!res) {
		const { template } = await import('../_/error-500.mjs');
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
const unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
const reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
const escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
const objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  const counts = /* @__PURE__ */ new Map();
  let logNum = 0;
  function log(message) {
    if (logNum < 100) {
      console.warn(message);
      logNum += 1;
    }
  }
  function walk(thing) {
    if (typeof thing === "function") {
      log(`Cannot stringify a function ${thing.name}`);
      return;
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      const type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          const proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            if (typeof thing.toJSON !== "function") {
              log(`Cannot stringify arbitrary non-POJOs ${thing.constructor.name}`);
            }
          } else if (Object.getOwnPropertySymbols(thing).length > 0) {
            log(`Cannot stringify POJOs with symbolic keys ${Object.getOwnPropertySymbols(thing).map((symbol) => symbol.toString())}`);
          } else {
            Object.keys(thing).forEach((key) => walk(thing[key]));
          }
      }
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    const type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify(thing.valueOf())})`;
      case "RegExp":
        return thing.toString();
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "Array":
        const members = thing.map((v, i) => i in thing ? stringify(v) : "");
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return `[${members.join(",")}${tail}]`;
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify).join(",")}])`;
      default:
        if (thing.toJSON) {
          let json = thing.toJSON();
          if (getType(json) === "String") {
            try {
              json = JSON.parse(json);
            } catch (e) {
            }
          }
          return stringify(json);
        }
        if (Object.getPrototypeOf(thing) === null) {
          if (Object.keys(thing).length === 0) {
            return "Object.create(null)";
          }
          return `Object.create(null,{${Object.keys(thing).map((key) => `${safeKey(key)}:{writable:true,enumerable:true,value:${stringify(thing[key])}}`).join(",")}})`;
        }
        return `{${Object.keys(thing).map((key) => `${safeKey(key)}:${stringify(thing[key])}`).join(",")}}`;
    }
  }
  const str = stringify(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (isPrimitive(thing)) {
        values.push(stringifyPrimitive(thing));
        return;
      }
      const type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i) => {
            statements.push(`${name}[${i}]=${stringify(v)}`);
          });
          break;
        case "Set":
          values.push("new Set");
          statements.push(`${name}.${Array.from(thing).map((v) => `add(${stringify(v)})`).join(".")}`);
          break;
        case "Map":
          values.push("new Map");
          statements.push(`${name}.${Array.from(thing).map(([k, v]) => `set(${stringify(k)}, ${stringify(v)})`).join(".")}`);
          break;
        default:
          values.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach((key) => {
            statements.push(`${name}${safeProp(key)}=${stringify(thing[key])}`);
          });
      }
    });
    statements.push(`return ${str}`);
    return `(function(${params.join(",")}){${statements.join(";")}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
function getName(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string") {
    return stringifyString(thing);
  }
  if (thing === void 0) {
    return "void 0";
  }
  if (thing === 0 && 1 / thing < 0) {
    return "-0";
  }
  const str = String(thing);
  if (typeof thing === "number") {
    return str.replace(/^(-)?0\./, "$1.");
  }
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? `.${key}` : `[${escapeUnsafeChars(JSON.stringify(key))}]`;
}
function stringifyString(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}

function normalizeSiteConfig(config) {
  if (typeof config.indexable !== "undefined")
    config.indexable = String(config.indexable) !== "false";
  if (typeof config.trailingSlash !== "undefined" && !config.trailingSlash)
    config.trailingSlash = String(config.trailingSlash) !== "false";
  if (config.url && !hasProtocol(String(config.url), { acceptRelative: true, strict: false }))
    config.url = withHttps(String(config.url));
  const keys = Object.keys(config).sort((a, b) => a.localeCompare(b));
  const newConfig = {};
  for (const k of keys)
    newConfig[k] = config[k];
  return newConfig;
}
function createSiteConfigStack(options) {
  const debug = options?.debug || false;
  const stack = [];
  function push(input) {
    if (!input || typeof input !== "object" || Object.keys(input).length === 0) {
      return () => {
      };
    }
    if (!input._context && debug) {
      let lastFunctionName = new Error("tmp").stack?.split("\n")[2]?.split(" ")[5];
      if (lastFunctionName?.includes("/"))
        lastFunctionName = "anonymous";
      input._context = lastFunctionName;
    }
    const entry = {};
    for (const k in input) {
      const val = input[k];
      if (typeof val !== "undefined" && val !== "")
        entry[k] = val;
    }
    if (Object.keys(entry).filter((k) => !k.startsWith("_")).length === 0) {
      return () => {
      };
    }
    stack.push(entry);
    return () => {
      const idx = stack.indexOf(entry);
      if (idx !== -1)
        stack.splice(idx, 1);
    };
  }
  function get(options2) {
    const siteConfig = {};
    if (options2?.debug)
      siteConfig._context = {};
    siteConfig._priority = {};
    for (const o in stack.sort((a, b) => (a._priority || 0) - (b._priority || 0))) {
      for (const k in stack[o]) {
        const key = k;
        const val = options2?.resolveRefs ? toValue(stack[o][k]) : stack[o][k];
        if (!k.startsWith("_") && typeof val !== "undefined" && val !== "") {
          siteConfig[k] = val;
          if (typeof stack[o]._priority !== "undefined" && stack[o]._priority !== -1) {
            siteConfig._priority[key] = stack[o]._priority;
          }
          if (options2?.debug)
            siteConfig._context[key] = stack[o]._context?.[key] || stack[o]._context || "anonymous";
        }
      }
    }
    return options2?.skipNormalize ? siteConfig : normalizeSiteConfig(siteConfig);
  }
  return {
    stack,
    push,
    get
  };
}

function envSiteConfig(env = {}) {
  return Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith("NUXT_SITE_") || k.startsWith("NUXT_PUBLIC_SITE_")).map(([k, v]) => [
    k.replace(/^NUXT_(PUBLIC_)?SITE_/, "").split("_").map((s, i) => i === 0 ? s.toLowerCase() : s[0]?.toUpperCase() + s.slice(1).toLowerCase()).join(""),
    v
  ]));
}

function getSiteConfig(e, _options) {
  e.context.siteConfig = e.context.siteConfig || createSiteConfigStack();
  const options = defu(_options, useRuntimeConfig(e)["nuxt-site-config"], { debug: false });
  return e.context.siteConfig.get(options);
}

const _En4IBoy9b4vZKQWQ1fIR0UMA5JDHMe9dnvgFHOaukSA = defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook("render:html", async (ctx, { event }) => {
    const routeOptions = getRouteRules(event);
    const isIsland = process.env.NUXT_COMPONENT_ISLANDS && event.path.startsWith("/__nuxt_island");
    event.path;
    const noSSR = !!process.env.NUXT_NO_SSR || event.context.nuxt?.noSSR || routeOptions.ssr === false && !isIsland || (false);
    if (noSSR) {
      const siteConfig = Object.fromEntries(
        Object.entries(getSiteConfig(event)).map(([k, v]) => [k, toValue(v)])
      );
      ctx.body.push(`<script>window.__NUXT_SITE_CONFIG__=${devalue(siteConfig)}<\/script>`);
    }
  });
});

const KNOWN_SEARCH_BOTS = [
  {
    pattern: "googlebot",
    name: "googlebot",
    secondaryPatterns: ["google.com/bot.html"]
  },
  {
    pattern: "bingbot",
    name: "bingbot",
    secondaryPatterns: ["msnbot"]
  },
  {
    pattern: "yandexbot",
    name: "yandexbot"
  },
  {
    pattern: "baiduspider",
    name: "baiduspider",
    secondaryPatterns: ["baidu.com"]
  },
  {
    pattern: "duckduckbot",
    name: "duckduckbot",
    secondaryPatterns: ["duckduckgo.com"]
  },
  {
    pattern: "slurp",
    name: "yahoo"
  },
  {
    pattern: "applebot",
    name: "applebot",
    secondaryPatterns: ["apple.com/go/applebot"]
  }
];
const SOCIAL_BOTS = [
  {
    pattern: "twitterbot",
    name: "twitter",
    secondaryPatterns: ["twitter"]
  },
  {
    pattern: "facebookexternalhit",
    name: "facebook",
    secondaryPatterns: ["facebook.com"]
  },
  {
    pattern: "linkedinbot",
    name: "linkedin",
    secondaryPatterns: ["linkedin"]
  },
  {
    pattern: "pinterestbot",
    name: "pinterest",
    secondaryPatterns: ["pinterest"]
  },
  {
    pattern: "discordbot",
    name: "discord",
    secondaryPatterns: ["discordapp"]
  }
];
const SEO_BOTS = [
  {
    pattern: "mj12bot",
    name: "majestic12",
    secondaryPatterns: ["majestic12.co.uk/bot"]
  },
  {
    pattern: "ahrefsbot",
    name: "ahrefs",
    secondaryPatterns: ["ahrefs.com"]
  },
  {
    pattern: "semrushbot",
    name: "semrush",
    secondaryPatterns: ["semrush.com/bot"]
  },
  {
    pattern: "screaming frog",
    name: "screaming-frog",
    secondaryPatterns: ["screamingfrog.co.uk"]
  },
  {
    pattern: "rogerbot",
    name: "moz"
  }
];
const AI_BOTS = [
  {
    pattern: "anthropic",
    name: "anthropic"
  },
  {
    pattern: "claude",
    name: "claude"
  },
  {
    pattern: "gptbot",
    name: "gpt",
    secondaryPatterns: ["openai.com"]
  },
  {
    pattern: "google-extended",
    name: "google-extended"
  },
  {
    pattern: "applebot-extended",
    name: "applebot-extended"
  },
  {
    pattern: "bytespider",
    name: "bytespider"
  },
  {
    pattern: "diffbot",
    name: "diffbot"
  },
  {
    pattern: "googlebot-news",
    name: "google-news"
  },
  {
    pattern: "cohere",
    name: "cohere",
    secondaryPatterns: ["cohere.com"]
  },
  {
    pattern: "ccbot",
    name: "commoncrawl",
    secondaryPatterns: ["commoncrawl.org"]
  },
  {
    pattern: "perplexitybot",
    name: "perplexity",
    secondaryPatterns: ["perplexity.ai"]
  }
];
const HTTP_TOOL_BOTS = [
  {
    pattern: "python-requests",
    name: "requests",
    secondaryPatterns: ["python"]
  },
  {
    pattern: "wget",
    name: "wget"
  },
  {
    pattern: "curl",
    name: "curl",
    secondaryPatterns: ["curl"]
  }
];
const SECURITY_SCANNING_BOTS = [
  {
    pattern: "zgrab",
    name: "zgrab"
  },
  {
    pattern: "masscan",
    name: "masscan"
  },
  {
    pattern: "nmap",
    name: "nmap",
    secondaryPatterns: ["insecure.org"]
  },
  {
    pattern: "nikto",
    name: "nikto"
  },
  {
    pattern: "wpscan",
    name: "wpscan"
  }
];
const SCRAPING_BOTS = [
  {
    pattern: "scrapy",
    name: "scrapy",
    secondaryPatterns: ["scrapy.org"]
  }
];
const AUTOMATION_BOTS = [
  {
    pattern: "phantomjs",
    name: "phantomjs"
  },
  {
    pattern: "headless",
    name: "headless-browser"
  },
  {
    pattern: "playwright",
    name: "playwright"
  },
  {
    pattern: "selenium",
    name: "selenium",
    secondaryPatterns: ["webdriver"]
  },
  {
    pattern: "puppeteer",
    name: "puppeteer",
    secondaryPatterns: ["headless"]
  }
];
const GENERIC_BOTS = [
  {
    pattern: "bot",
    name: "generic-bot"
  },
  {
    pattern: "spider",
    name: "generic-spider"
  },
  {
    pattern: "crawler",
    name: "generic-crawler"
  },
  {
    pattern: "scraper",
    name: "generic-scraper"
  }
];
const BOT_MAP = [
  {
    type: "search-engine",
    bots: KNOWN_SEARCH_BOTS,
    trusted: true
  },
  {
    type: "social",
    bots: SOCIAL_BOTS,
    trusted: true
  },
  {
    type: "seo",
    bots: SEO_BOTS,
    trusted: true
  },
  {
    type: "ai",
    bots: AI_BOTS,
    trusted: true
  },
  {
    type: "generic",
    bots: GENERIC_BOTS,
    trusted: false
  },
  {
    type: "automation",
    bots: AUTOMATION_BOTS,
    trusted: false
  },
  {
    type: "http-tool",
    bots: HTTP_TOOL_BOTS,
    trusted: false
  },
  {
    type: "security-scanner",
    bots: SECURITY_SCANNING_BOTS,
    trusted: false
  },
  {
    type: "scraping",
    bots: SCRAPING_BOTS,
    trusted: false
  }
];

const ROBOT_DIRECTIVE_VALUES = {
  // Standard directives
  enabled: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  disabled: "noindex, nofollow",
  index: "index",
  noindex: "noindex",
  follow: "follow",
  nofollow: "nofollow",
  none: "none",
  all: "all",
  // Non-standard directives (not part of official robots spec)
  noai: "noai",
  noimageai: "noimageai"
};
function formatMaxImagePreview(value) {
  return `max-image-preview:${value}`;
}
function formatMaxSnippet(value) {
  return `max-snippet:${value}`;
}
function formatMaxVideoPreview(value) {
  return `max-video-preview:${value}`;
}
function matches(pattern, path) {
  const pathLength = path.length;
  const patternLength = pattern.length;
  const matchingLengths = Array.from({ length: pathLength + 1 }).fill(0);
  let numMatchingLengths = 1;
  let p = 0;
  while (p < patternLength) {
    if (pattern[p] === "$" && p + 1 === patternLength) {
      return matchingLengths[numMatchingLengths - 1] === pathLength;
    }
    if (pattern[p] === "*") {
      numMatchingLengths = pathLength - matchingLengths[0] + 1;
      for (let i = 1; i < numMatchingLengths; i++) {
        matchingLengths[i] = matchingLengths[i - 1] + 1;
      }
    } else {
      let numMatches = 0;
      for (let i = 0; i < numMatchingLengths; i++) {
        const matchLength = matchingLengths[i];
        if (matchLength < pathLength && path[matchLength] === pattern[p]) {
          matchingLengths[numMatches++] = matchLength + 1;
        }
      }
      if (numMatches === 0) {
        return false;
      }
      numMatchingLengths = numMatches;
    }
    p++;
  }
  return true;
}
function matchPathToRule(path, _rules) {
  let matchedRule = null;
  const rules = _rules.filter(Boolean);
  const rulesLength = rules.length;
  let i = 0;
  while (i < rulesLength) {
    const rule = rules[i];
    if (!rule || !matches(rule.pattern, path)) {
      i++;
      continue;
    }
    if (!matchedRule || rule.pattern.length > matchedRule.pattern.length) {
      matchedRule = rule;
    } else if (rule.pattern.length === matchedRule.pattern.length && rule.allow && !matchedRule.allow) {
      matchedRule = rule;
    }
    i++;
  }
  return matchedRule;
}
function asArray(v) {
  return typeof v === "undefined" ? [] : Array.isArray(v) ? v : [v];
}
function contentUsageToString(prefs) {
  return Object.entries(prefs).filter(([_, value]) => value !== void 0).map(([key, value]) => `${key}=${value}`).join(", ");
}
function normalizeContentPreferences(value) {
  if (!value)
    return [];
  if (Array.isArray(value))
    return value.filter((rule) => Boolean(rule));
  if (typeof value === "object" && !Array.isArray(value)) {
    const str = contentUsageToString(value);
    return str ? [str] : [];
  }
  if (typeof value === "string")
    return value ? [value] : [];
  return [];
}
function normalizeGroup(group) {
  if (group._normalized) {
    const resolvedGroup = group;
    const disallow2 = asArray(resolvedGroup.disallow);
    resolvedGroup._indexable = !disallow2.includes("/");
    resolvedGroup._rules = [
      ...resolvedGroup.disallow.filter(Boolean).map((r) => ({ pattern: r, allow: false })),
      ...resolvedGroup.allow.map((r) => ({ pattern: r, allow: true }))
    ];
    return resolvedGroup;
  }
  const disallow = asArray(group.disallow);
  const allow = asArray(group.allow).filter((rule) => Boolean(rule));
  const contentUsage = normalizeContentPreferences(group.contentUsage);
  const contentSignal = normalizeContentPreferences(group.contentSignal);
  return {
    ...group,
    userAgent: group.userAgent ? asArray(group.userAgent) : ["*"],
    disallow,
    allow,
    contentUsage,
    contentSignal,
    _indexable: !disallow.includes("/"),
    _rules: [
      ...disallow.filter(Boolean).map((r) => ({ pattern: r, allow: false })),
      ...allow.map((r) => ({ pattern: r, allow: true }))
    ],
    _normalized: true
  };
}
function generateRobotsTxt({ groups, sitemaps }) {
  const lines = [];
  for (const group of groups) {
    for (const comment of group.comment || [])
      lines.push(`# ${comment}`);
    for (const userAgent of group.userAgent || ["*"])
      lines.push(`User-agent: ${userAgent}`);
    for (const allow of group.allow || [])
      lines.push(`Allow: ${allow}`);
    for (const disallow of group.disallow || [])
      lines.push(`Disallow: ${disallow}`);
    for (const cleanParam of group.cleanParam || [])
      lines.push(`Clean-param: ${cleanParam}`);
    for (const contentUsage of group.contentUsage || [])
      lines.push(`Content-Usage: ${contentUsage}`);
    for (const contentSignal of group.contentSignal || [])
      lines.push(`Content-Signal: ${contentSignal}`);
    lines.push("");
  }
  for (const sitemap of sitemaps)
    lines.push(`Sitemap: ${sitemap}`);
  return lines.join("\n");
}
function createPatternMap() {
  const patternMap = /* @__PURE__ */ new Map();
  for (const def of BOT_MAP) {
    for (const bot of def.bots) {
      const patterns = [bot.pattern, ...bot.secondaryPatterns || []];
      for (const pattern of patterns) {
        patternMap.set(pattern.toLowerCase(), {
          botName: bot.name,
          botCategory: def.type,
          trusted: def.trusted
        });
      }
    }
  }
  return patternMap;
}
function normaliseRobotsRouteRule(config) {
  let allow;
  if (typeof config.robots === "boolean")
    allow = config.robots;
  else if (typeof config.robots === "object" && "indexable" in config.robots && typeof config.robots.indexable !== "undefined")
    allow = config.robots.indexable;
  let rule;
  if (typeof config.robots === "object" && config.robots !== null) {
    if ("rule" in config.robots && typeof config.robots.rule !== "undefined") {
      rule = config.robots.rule;
    } else if (!("indexable" in config.robots)) {
      const directives = [];
      for (const [key, value] of Object.entries(config.robots)) {
        if (value === false || value === null || value === void 0)
          continue;
        if (key in ROBOT_DIRECTIVE_VALUES && typeof value === "boolean" && value) {
          directives.push(ROBOT_DIRECTIVE_VALUES[key]);
        } else if (key === "max-image-preview" && typeof value === "string") {
          directives.push(formatMaxImagePreview(value));
        } else if (key === "max-snippet" && typeof value === "number") {
          directives.push(formatMaxSnippet(value));
        } else if (key === "max-video-preview" && typeof value === "number") {
          directives.push(formatMaxVideoPreview(value));
        }
      }
      if (directives.length > 0) {
        rule = directives.join(", ");
      }
    }
  } else if (typeof config.robots === "string") {
    rule = config.robots;
  }
  if (rule && typeof allow === "undefined") {
    const disallowIndicators = ["none", "noindex", "noai", "noimageai"];
    allow = !disallowIndicators.some(
      (indicator) => rule === indicator || rule.split(",").some((part) => part.trim() === indicator)
    );
  }
  if (typeof allow === "undefined" && typeof rule === "undefined")
    return;
  return {
    allow,
    rule
  };
}

function useRuntimeConfigNuxtRobots(event) {
  return useRuntimeConfig(event)["nuxt-robots"];
}

const logger$1 = createConsola({
  defaults: { tag: "@nuxtjs/robots" }
});

async function resolveRobotsTxtContext(e, nitro = useNitroApp()) {
  const { groups, sitemap: sitemaps } = useRuntimeConfigNuxtRobots(e);
  const generateRobotsTxtCtx = {
    event: e,
    context: e ? "robots.txt" : "init",
    ...JSON.parse(JSON.stringify({ groups, sitemaps }))
  };
  await nitro.hooks.callHook("robots:config", generateRobotsTxtCtx);
  generateRobotsTxtCtx.groups = generateRobotsTxtCtx.groups.map(normalizeGroup);
  nitro._robots.ctx = generateRobotsTxtCtx;
  return generateRobotsTxtCtx;
}

const _KWmNDhuPCGApZ_cRRtZU5E1oPXKds5MHlj_FNJBUk = defineNitroPlugin(async (nitroApp) => {
  const { isNuxtContentV2, robotsDisabledValue, botDetection } = useRuntimeConfigNuxtRobots();
  if (botDetection !== false) {
    nitroApp._robotsPatternMap = createPatternMap();
  }
  nitroApp._robots = {};
  await resolveRobotsTxtContext(void 0, nitroApp);
  const nuxtContentUrls = /* @__PURE__ */ new Set();
  if (isNuxtContentV2) {
    let urls;
    try {
      urls = await (await nitroApp.localFetch("/__robots__/nuxt-content.json", {})).json();
    } catch (e) {
      logger$1.error("Failed to read robot rules from content files.", e);
    }
    if (urls && Array.isArray(urls) && urls.length) {
      urls.forEach((url) => nuxtContentUrls.add(withoutTrailingSlash(url)));
    }
  }
  if (nuxtContentUrls.size) {
    nitroApp._robots.nuxtContentUrls = nuxtContentUrls;
  }
});

/*!
  * shared v11.2.8
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
const _create = Object.create;
const create = (obj = null) => _create(obj);
/* eslint-enable */
/**
 * Useful Utilities By Evan you
 * Modified by kazuya kawaguchi
 * MIT License
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/index.ts
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/codeframe.ts
 */
const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (val) => val !== null && typeof val === 'object';
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);

const isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepCopy(src, des) {
    // src and des should both be objects, and none of them can be a array
    if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
        throw new Error('Invalid value');
    }
    const stack = [{ src, des }];
    while (stack.length) {
        const { src, des } = stack.pop();
        // using `Object.keys` which skips prototype properties
        Object.keys(src).forEach(key => {
            if (key === '__proto__') {
                return;
            }
            // if src[key] is an object/array, set des[key]
            // to empty object/array to prevent setting by reference
            if (isObject(src[key]) && !isObject(des[key])) {
                des[key] = Array.isArray(src[key]) ? [] : create();
            }
            if (isNotObjectOrIsArray(des[key]) || isNotObjectOrIsArray(src[key])) {
                // replace with src[key] when:
                // src[key] or des[key] is not an object, or
                // src[key] or des[key] is an array
                des[key] = src[key];
            }
            else {
                // src[key] and des[key] are both objects, merge them
                stack.push({ src: src[key], des: des[key] });
            }
        });
    }
}

const __nuxtMock = { runWithContext: async (fn) => await fn() };
const merger$1 = createDefu((obj, key, value) => {
  if (key === "messages" || key === "datetimeFormats" || key === "numberFormats") {
    obj[key] ??= create(null);
    deepCopy(value, obj[key]);
    return true;
  }
});
async function loadVueI18nOptions(vueI18nConfigs) {
  const nuxtApp = __nuxtMock;
  let vueI18nOptions = { messages: create(null) };
  for (const configFile of vueI18nConfigs) {
    const resolver = await configFile().then((x) => isModule(x) ? x.default : x);
    const resolved = isFunction(resolver) ? await nuxtApp.runWithContext(() => resolver()) : resolver;
    vueI18nOptions = merger$1(create(null), resolved, vueI18nOptions);
  }
  vueI18nOptions.fallbackLocale ??= false;
  return vueI18nOptions;
}
const isModule = (val) => toTypeString(val) === "[object Module]";
async function getLocaleMessages(locale, loader) {
  const nuxtApp = __nuxtMock;
  try {
    const getter = await nuxtApp.runWithContext(loader.load).then((x) => isModule(x) ? x.default : x);
    return isFunction(getter) ? await nuxtApp.runWithContext(() => getter(locale)) : getter;
  } catch (e) {
    throw new Error(`Failed loading locale (${locale}): ` + e.message);
  }
}
async function getLocaleMessagesMerged(locale, loaders = []) {
  const nuxtApp = __nuxtMock;
  const messages = await Promise.all(
    loaders.map((loader) => nuxtApp.runWithContext(() => getLocaleMessages(locale, loader)))
  );
  const merged = {};
  for (const message of messages) {
    deepCopy(message, merged);
  }
  return merged;
}

var hero$b = {
	title1: "Book cheap flights on over",
	title2: "500 airlines!",
	award: "Awarded by Global Travel",
	since: "Since 2024"
};
var nav$b = {
	stays: "Stays",
	flights: "Flights",
	cars: "Cars",
	packages: "Packages",
	cruises: "Cruises",
	signIn: "Sign In",
	explorer: "Explorer",
	logout: {
		title: "Leaving so soon?",
		message: "You're about to sign out of your Flybeth account. Any unsaved changes will be lost. We'll be here when you get back! ✈️",
		confirm: "Sign Out",
		cancel: "Stay"
	},
	exit: {
		title: "Wait, don't go!",
		message: "You have an active session. Are you sure you want to leave Flybeth? Any unsaved searches or bookings in progress may be lost.",
		confirm: "Leave",
		cancel: "Stay Here"
	}
};
var search$b = {
	tabs: {
		flights: "Flights",
		holidays: "Holidays",
		hotels: "Hotels",
		transfers: "Transfers",
		activities: "Activities",
		cruises: "Cruises",
		cars: "Cars"
	},
	labels: {
		from: "Flying from",
		to: "Flying to",
		where: "Where are you going?",
		departure: "Departure Date",
		"return": "Return Date",
		departure_return: "Departure — Return",
		departure_date: "Departure Date",
		passengers: "Passengers",
		cabin: "Cabin Class",
		letsgo: "LET'S GO",
		singleHotel: "Single Hotel",
		multiHotel: "Multi Hotel",
		checkInCheckOut: "Check-in - Check-out",
		travelersRooms: "Travelers & Rooms",
		bundleSave: "Bundle + Save",
		addFlight: "Add a flight",
		addCar: "Add a car",
		addHotel: "Add Hotel",
		directFlightsOnly: "Direct Flights Only",
		rentalCars: "Rental cars",
		airportRides: "Airport rides",
		pickUp: "Pick-up",
		whereFrom: "Where from",
		whereTo: "Where to",
		cityOrAirport: "City or airport",
		addressOrHotel: "Address or hotel",
		dropOffLocation: "Drop-off location",
		rentalDates: "Rental Dates",
		pickUpDate: "Pick-up date",
		pickUpTime: "Pick-up Time",
		differentDropOff: "Different drop-off location",
		bundle: "Bundle",
		hotel: "Hotel",
		flight: "Flight",
		whereFromQuestion: "Where from?",
		whereToQuestion: "Where to?",
		stayDates: "Stay Dates",
		travelDates: "Travel Dates",
		partialHotelStay: "Partial hotel stay",
		differentCarDropOff: "Different car drop-off",
		saveBundleMsg: "Save up to $625 by bundling your trip!",
		rooms: "Rooms",
		adults: "Adults",
		children: "Children",
		apply: "Apply",
		multiRoomNote: "Optimization: Multi-room packages are currently limited to 8 travelers total.",
		search: "Search",
		updateSearch: "Update Search"
	},
	placeholders: {
		origin: "City or Airport",
		destination: "Destination, City, or Hotel"
	},
	packages: {
		hotel_flight: "Hotel + Flight",
		hotel_flight_car: "Hotel + Flight + Car",
		flight_car: "Flight + Car",
		hotel_car: "Hotel + Car"
	},
	cruises: {
		title: "Set Sail on Luxury.",
		expertAdvice: "Expert Advice: 1-866-403-9848",
		goingTo: "Going to",
		destinationAny: "Destination (Any)",
		departingBetween: "Departing between",
		selectMonth: "Select Month",
		cruiseLine: "Cruise Line",
		anyCruiseLine: "Any Cruise Line",
		viewLuxurySuites: "View Luxury Suites",
		familyDeals: "Family Deals"
	},
	flightModes: {
		roundtrip: "Round Trip",
		oneway: "One Way",
		multicity: "Multi-City"
	}
};
var marketing$b = {
	helpTitle: "Need help finding deals?",
	helpSub: "Book now - Call us anytime 24/7",
	benefits: {
		deals: "Phone only deals available",
		assist: "Personalized travel assistance",
		cancel: "24 hour cancellation",
		rewards: "2X ClubMiles reward points"
	},
	speakExperts: "Speak with our expert travel advisors"
};
var offers$b = {
	trending: "Trending Holiday Offers",
	smarter: "Smarter Fares. Softer Landings.",
	smarterSub: "Travel that values your time more.",
	majestic: "Every Mile Feels Majestic!",
	majesticSub: "Fly Emirates. Elegance in motion.",
	learn: "Learn More",
	book: "Book Now"
};
var promo$b = {
	matchday: "Turn matchday into a getaway — score summer savings.",
	findDeals: "Find deals"
};
var destinations$b = {
	globalExploration: "Global Exploration",
	mostLoved: "Most Loved",
	destinations: "Destinations",
	description: "Book flights, hotels, and experiences hand-picked by our curators for the most unforgettable journeys across the globe.",
	startingFrom: "Starting from {price}",
	parisDesc: "The city of lights awaits with its iconic landmarks and world-class cuisine.",
	dubaiDesc: "Experience luxury shopping, ultramodern architecture, and a lively nightlife scene.",
	maldivesDesc: "Crystal-clear waters and pristine beaches in a tropical paradise."
};
var inspiration$b = {
	lifestyleTravel: "Lifestyle Travel",
	title: "Travel Your Way",
	experiences: "{count} Experiences"
};
var categories$b = {
	adventure: "Adventure",
	relaxation: "Relaxation",
	cityLife: "City Life",
	nature: "Nature"
};
var newsletter$b = {
	title: "Never Miss a Deal",
	subtitle: "Subscribe to get exclusive flight deals, hotel discounts, and travel inspiration delivered to your inbox.",
	placeholder: "Enter your email address",
	subscribeButton: "Subscribe",
	tagline: "Join 50,000+ savvy travelers"
};
var stats$b = {
	globalDestinations: "Global Destinations",
	flightsFilteredDaily: "Flights Filtered Daily",
	secureBookings: "Secure Bookings"
};
var footer$b = {
	about: "About",
	blog: "Blog",
	jobs: "Jobs",
	press: "Press",
	accessibility: "Accessibility",
	partners: "Partners",
	rights: "© 2024 Flybeth, Inc. All rights reserved."
};
var settings$b = {
	language: "Language",
	currency: "Currency",
	applyChanges: "Apply Changes"
};
var flightCard$b = {
	perTraveler: "per traveler",
	selectFlight: "Select Flight",
	nonstop: "Nonstop",
	stops: "{n} stop(s)",
	flight: "Flight"
};
var stayCard$b = {
	nightlyAvg: "Nightly avg.",
	viewDeal: "View Deal",
	unnamedProperty: "Unnamed Property",
	includesTaxes: "Total ${total} includes taxes & fees",
	off: "{percent}% OFF"
};
var carCard$b = {
	orSimilar: "or similar {category}",
	reviews: "{n} reviews",
	passengers: "Passengers",
	bags: "Bags",
	freeCancellation: "Free Cancellation",
	totalPrice: "Total Price",
	viewDeal: "View Deal"
};
var emptyState$b = {
	defaultTitle: "Nothing here yet",
	defaultMessage: "Try adjusting your search filters or explore our popular recommendations below."
};
var flightsPage$b = {
	fromWhere: "From where?",
	toWhere: "To where?",
	dates: "Dates",
	travelers: "Travelers",
	travelerPlaceholder: "1 traveler",
	flightsFound: "{n} flights found",
	filterBy: "Filter by",
	stops: "Stops",
	nonstop: "Nonstop",
	oneStop: "1 Stop",
	twoPlusStops: "2+ Stops",
	airlines: "Airlines",
	noFlightsTitle: "No flights found",
	noFlightsMessage: "We couldn't find flights matching your search. Try different airports or dates to discover amazing routes.",
	explorePopular: "Explore Popular Routes"
};
var staysPage$b = {
	whereTo: "Where to?",
	checkIn: "Check-in",
	guests: "Guests",
	guestsPlaceholder: "2 travelers",
	propertiesFound: "{n} properties found",
	filterBy: "Filter by",
	pricePerNight: "Price per night",
	lessThan100: "Less than $100",
	range100to200: "$100 - $200",
	range200to300: "$200 - $300",
	propertyType: "Property Type",
	hotelType: "Hotel",
	resortType: "Resort",
	apartmentType: "Apartment",
	noPropertiesTitle: "No properties found",
	noPropertiesMessage: "We couldn't find stays matching your criteria. Try a different location or adjust your dates.",
	searchDubai: "Search Dubai"
};
var carsPage$b = {
	pickUpLocation: "Pick-up location",
	pickUpDate: "Pick-up Date",
	carsFound: "{n} cars found",
	filterBy: "Filter by",
	carType: "Car Type",
	economy: "Economy",
	suv: "SUV",
	luxury: "Luxury",
	transmission: "Transmission",
	automatic: "Automatic",
	manual: "Manual",
	noCarsTitle: "No cars available",
	noCarsMessage: "We couldn't find rental cars at this location. Try a different pick-up point or date.",
	searchDubaiAirport: "Search Dubai Airport"
};
var checkout$b = {
	secureCheckout: "Secure Checkout",
	travelerDetails: "Traveler Details",
	firstName: "First Name",
	lastName: "Last Name",
	emailAddress: "Email Address",
	phoneNumber: "Phone Number",
	paymentInfo: "Payment Information",
	cardholderName: "Cardholder Name",
	cardNumber: "Card Number",
	expirationDate: "Expiration Date",
	cvv: "CVV",
	completeBooking: "Complete Booking",
	processing: "Processing...",
	termsAgreement: "By checking out you agree to our Terms and Conditions.",
	orderSummary: "Order Summary",
	basePrice: "Base Price",
	taxesFees: "Taxes & Fees",
	total: "Total",
	freeCancellation: "Free cancellation within 24 hours!"
};
var confirmation$b = {
	bookingConfirmed: "Booking Confirmed!",
	referenceText: "Your booking reference is",
	emailSent: "We've sent a confirmation email to your inbox.",
	backToHome: "Back to Home"
};
var auth$b = {
	authentication: "Authentication",
	welcomeBack: "Welcome Back",
	noAccount: "Don't have an account?",
	registerHere: "Register here",
	emailAddress: "Email Address",
	password: "Password",
	forgotPassword: "Forgot your password?",
	signingIn: "Signing in...",
	signIn: "Sign In",
	orContinueWith: "Or continue with",
	signInGoogle: "Sign in with Google",
	getStarted: "Get Started",
	createAccount: "Create Account",
	alreadyHaveAccount: "Already have an account?",
	loginHere: "Login here",
	firstNameLabel: "First Name",
	lastNameLabel: "Last Name",
	phoneNumberLabel: "Phone Number",
	creatingAccount: "Creating account...",
	orJoinWith: "Or join with",
	signUpGoogle: "Sign up with Google",
	accountRecovery: "Account Recovery",
	forgotPasswordTitle: "Forgot Password",
	rememberedPassword: "Remembered your password?",
	sending: "Sending...",
	sendResetLink: "Send Reset Link"
};
var authLayout$b = {
	journeyStarts: "Your Journey Starts Here",
	discover: "Discover the",
	worldsMost: "world's most",
	breathtaking: "breathtaking",
	layoutDestinations: "destinations.",
	socialProof: "Join 50,000+ travelers finding exclusive deals and hidden gems with Flybeth's intelligent travel platform.",
	trustedWorldwide: "Trusted worldwide",
	averageRating: "4.9 ★ Average Rating",
	travelIntelligence: "Travel Intelligence"
};
var bookingConfirmed$b = "Booking Confirmed!";
var common$b = {
	search: "Search",
	cancel: "Cancel",
	confirm: "Confirm",
	close: "Close",
	loading: "Loading...",
	error: "Error",
	success: "Success"
};
const locale_en_46json_6179587c = {
	hero: hero$b,
	nav: nav$b,
	search: search$b,
	marketing: marketing$b,
	offers: offers$b,
	promo: promo$b,
	destinations: destinations$b,
	inspiration: inspiration$b,
	categories: categories$b,
	newsletter: newsletter$b,
	stats: stats$b,
	footer: footer$b,
	settings: settings$b,
	flightCard: flightCard$b,
	stayCard: stayCard$b,
	carCard: carCard$b,
	emptyState: emptyState$b,
	flightsPage: flightsPage$b,
	staysPage: staysPage$b,
	carsPage: carsPage$b,
	checkout: checkout$b,
	confirmation: confirmation$b,
	auth: auth$b,
	authLayout: authLayout$b,
	bookingConfirmed: bookingConfirmed$b,
	common: common$b
};

var hero$a = {
	title1: "Reserve vuelos baratos en más de",
	title2: "¡500 aerolíneas!",
	award: "Premiado por Global Travel",
	since: "Desde 2024"
};
var nav$a = {
	stays: "Estancias",
	flights: "Vuelos",
	cars: "Autos",
	packages: "Paquetes",
	cruises: "Cruceros",
	signIn: "Iniciar Sesión",
	explorer: "Explorador",
	logout: {
		title: "¿Te vas tan pronto?",
		message: "Estás a punto de cerrar sesión en tu cuenta de Flybeth. Se perderán todos los cambios no guardados. ¡Estaremos aquí cuando regreses! ✈️",
		confirm: "Cerrar Sesión",
		cancel: "Quedarse"
	},
	exit: {
		title: "¡Espera, no te vayas!",
		message: "Tienes una sesión activa. ¿Estás seguro de que quieres dejar Flybeth? Se pueden perder todas las búsquedas o reservas en curso no guardadas.",
		confirm: "Salir",
		cancel: "Quedarse Aquí"
	}
};
var search$a = {
	tabs: {
		flights: "Vuelos",
		holidays: "Vacaciones",
		hotels: "Hoteles",
		transfers: "Traslados",
		activities: "Actividades",
		cruises: "Cruceros",
		cars: "Coches"
	},
	labels: {
		from: "Saliendo de",
		to: "Volando a",
		where: "¿A dónde vas?",
		departure: "Fecha de Salida",
		"return": "Fecha de Regreso",
		departure_return: "Salida — Regreso",
		departure_date: "Fecha de Salida",
		passengers: "Pasajeros",
		cabin: "Clase",
		letsgo: "¡VAMOS!",
		singleHotel: "Hotel Individual",
		multiHotel: "Múltiples Hoteles",
		checkInCheckOut: "Llegada - Salida",
		travelersRooms: "Viajeros y Habitaciones",
		bundleSave: "Combina y Ahorra",
		addFlight: "Añadir un vuelo",
		addCar: "Añadir un auto",
		addHotel: "Añadir Hotel",
		directFlightsOnly: "Solo Vuelos Directos",
		rentalCars: "Alquiler de autos",
		airportRides: "Traslados al aeropuerto",
		pickUp: "Recogida",
		whereFrom: "¿De dónde?",
		whereTo: "¿A dónde?",
		cityOrAirport: "Ciudad o aeropuerto",
		addressOrHotel: "Dirección u hotel",
		dropOffLocation: "Lugar de devolución",
		rentalDates: "Fechas de Alquiler",
		pickUpDate: "Fecha de recogida",
		pickUpTime: "Hora de recogida",
		differentDropOff: "Lugar de devolución diferente",
		bundle: "Paquete",
		hotel: "Hotel",
		flight: "Vuelo",
		whereFromQuestion: "¿De dónde?",
		whereToQuestion: "¿A dónde?",
		stayDates: "Fechas de Estancia",
		travelDates: "Fechas de Viaje",
		partialHotelStay: "Estancia parcial en hotel",
		differentCarDropOff: "Devolución de auto diferente",
		saveBundleMsg: "¡Ahorra hasta $625 combinando tu viaje!",
		rooms: "Habitaciones",
		adults: "Adultos",
		children: "Niños",
		apply: "Aplicar",
		multiRoomNote: "Optimización: Los paquetes multisala están limitados a 8 viajeros en total.",
		search: "Buscar",
		updateSearch: "Actualizar Búsqueda"
	},
	placeholders: {
		origin: "Ciudad o Aeropuerto",
		destination: "Destino, Ciudad u Hotel"
	},
	packages: {
		hotel_flight: "Hotel + Vuelo",
		hotel_flight_car: "Hotel + Vuelo + Auto",
		flight_car: "Vuelo + Auto",
		hotel_car: "Hotel + Auto"
	},
	cruises: {
		title: "Navegue en el lujo.",
		expertAdvice: "Asesoría Experta: 1-866-403-9848",
		goingTo: "Destino",
		destinationAny: "Destino (Todos)",
		departingBetween: "Salida entre",
		selectMonth: "Seleccionar Mes",
		cruiseLine: "Línea de Cruceros",
		anyCruiseLine: "Cualquier Línea",
		viewLuxurySuites: "Ver Suites de Lujo",
		familyDeals: "Ofertas Familiares"
	},
	flightModes: {
		roundtrip: "Ida y Vuelta",
		oneway: "Solo Ida",
		multicity: "Multi-Ciudad"
	}
};
var marketing$a = {
	helpTitle: "¿Necesita ayuda para encontrar ofertas?",
	helpSub: "Reserve ahora - Llámenos 24/7",
	benefits: {
		deals: "Ofertas exclusivas por teléfono",
		assist: "Asistencia de viaje personalizada",
		cancel: "Cancelación en 24 horas",
		rewards: "Doble de puntos ClubMiles"
	},
	speakExperts: "Hable con nuestros asesores de viaje expertos"
};
var offers$a = {
	trending: "Ofertas de Vacaciones Tendencia",
	smarter: "Tarifas más inteligentes. Viajes más suaves.",
	smarterSub: "Viajes que valoran más su tiempo.",
	majestic: "¡Cada milla se siente majestuosa!",
	majesticSub: "Vuele con Emirates. Elegancia en movimiento.",
	learn: "Más información",
	book: "Reservar ahora"
};
var promo$a = {
	matchday: "Convierte el día de partido en una escapada — ahorra en verano.",
	findDeals: "Ver ofertas"
};
var destinations$a = {
	globalExploration: "Exploración Global",
	mostLoved: "Más Queridos",
	destinations: "Destinos",
	description: "Reserve vuelos, hoteles y experiencias seleccionadas por nuestros curadores para los viajes más inolvidables del mundo.",
	startingFrom: "Desde {price}",
	parisDesc: "La ciudad de la luz te espera con sus monumentos icónicos y su cocina de clase mundial.",
	dubaiDesc: "Experimente compras de lujo, arquitectura ultramoderna y una vibrante vida nocturna.",
	maldivesDesc: "Aguas cristalinas y playas prístinas en un paraíso tropical."
};
var inspiration$a = {
	lifestyleTravel: "Viaje con Estilo",
	title: "Viaja a tu manera",
	experiences: "{count} Experiencias"
};
var categories$a = {
	adventure: "Aventura",
	relaxation: "Relajación",
	cityLife: "Vida Urbana",
	nature: "Naturaleza"
};
var newsletter$a = {
	title: "No te pierdas una oferta",
	subtitle: "Suscríbete para recibir ofertas exclusivas de vuelos, descuentos en hoteles e inspiración de viaje.",
	placeholder: "Ingresa tu correo electrónico",
	subscribeButton: "Suscribirse",
	tagline: "Únete a más de 50,000 viajeros inteligentes"
};
var stats$a = {
	globalDestinations: "Destinos Globales",
	flightsFilteredDaily: "Vuelos Filtrados Diariamente",
	secureBookings: "Reservas Seguras"
};
var footer$a = {
	about: "Acerca de",
	blog: "Blog",
	jobs: "Empleos",
	press: "Prensa",
	accessibility: "Accesibilidad",
	partners: "Socios",
	rights: "© 2024 Flybeth, Inc. Todos los derechos reservados."
};
var settings$a = {
	language: "Idioma",
	currency: "Moneda",
	applyChanges: "Aplicar Cambios"
};
var flightCard$a = {
	perTraveler: "por viajero",
	selectFlight: "Seleccionar Vuelo",
	nonstop: "Sin escalas",
	stops: "{n} escala(s)",
	flight: "Vuelo"
};
var stayCard$a = {
	nightlyAvg: "Promedio por noche",
	viewDeal: "Ver Oferta",
	unnamedProperty: "Propiedad sin nombre",
	includesTaxes: "Total ${total} incluye impuestos y tasas",
	off: "{percent}% DCTO"
};
var carCard$a = {
	orSimilar: "o similar {category}",
	reviews: "{n} reseñas",
	passengers: "Pasajeros",
	bags: "Equipaje",
	freeCancellation: "Cancelación Gratuita",
	totalPrice: "Precio Total",
	viewDeal: "Ver Oferta"
};
var emptyState$a = {
	defaultTitle: "Nada aquí aún",
	defaultMessage: "Intenta ajustar tus filtros de búsqueda o explora nuestras recomendaciones populares."
};
var flightsPage$a = {
	fromWhere: "¿De dónde?",
	toWhere: "¿A dónde?",
	dates: "Fechas",
	travelers: "Viajeros",
	travelerPlaceholder: "1 viajero",
	flightsFound: "{n} vuelos encontrados",
	filterBy: "Filtrar por",
	stops: "Escalas",
	nonstop: "Sin escalas",
	oneStop: "1 Escala",
	twoPlusStops: "2+ Escalas",
	airlines: "Aerolíneas",
	noFlightsTitle: "No se encontraron vuelos",
	noFlightsMessage: "No pudimos encontrar vuelos que coincidan con tu búsqueda. Prueba diferentes aeropuertos o fechas.",
	explorePopular: "Explorar Rutas Populares"
};
var staysPage$a = {
	whereTo: "¿A dónde?",
	checkIn: "Llegada",
	guests: "Huéspedes",
	guestsPlaceholder: "2 viajeros",
	propertiesFound: "{n} propiedades encontradas",
	filterBy: "Filtrar por",
	pricePerNight: "Precio por noche",
	lessThan100: "Menos de $100",
	range100to200: "$100 - $200",
	range200to300: "$200 - $300",
	propertyType: "Tipo de Propiedad",
	hotelType: "Hotel",
	resortType: "Resort",
	apartmentType: "Apartamento",
	noPropertiesTitle: "No se encontraron propiedades",
	noPropertiesMessage: "No pudimos encontrar estancias que coincidan con tus criterios. Prueba una ubicación diferente o ajusta tus fechas.",
	searchDubai: "Buscar en Dubái"
};
var carsPage$a = {
	pickUpLocation: "Lugar de recogida",
	pickUpDate: "Fecha de Recogida",
	carsFound: "{n} autos encontrados",
	filterBy: "Filtrar por",
	carType: "Tipo de Auto",
	economy: "Económico",
	suv: "SUV",
	luxury: "Lujo",
	transmission: "Transmisión",
	automatic: "Automático",
	manual: "Manual",
	noCarsTitle: "No hay autos disponibles",
	noCarsMessage: "No pudimos encontrar autos de alquiler en esta ubicación. Prueba un punto de recogida o fecha diferente.",
	searchDubaiAirport: "Buscar Aeropuerto de Dubái"
};
var checkout$a = {
	secureCheckout: "Pago Seguro",
	travelerDetails: "Datos del Viajero",
	firstName: "Nombre",
	lastName: "Apellido",
	emailAddress: "Correo Electrónico",
	phoneNumber: "Teléfono",
	paymentInfo: "Información de Pago",
	cardholderName: "Nombre del Titular",
	cardNumber: "Número de Tarjeta",
	expirationDate: "Fecha de Vencimiento",
	cvv: "CVV",
	completeBooking: "Completar Reserva",
	processing: "Procesando...",
	termsAgreement: "Al pagar aceptas nuestros Términos y Condiciones.",
	orderSummary: "Resumen del Pedido",
	basePrice: "Precio Base",
	taxesFees: "Impuestos y Tasas",
	total: "Total",
	freeCancellation: "¡Cancelación gratuita dentro de 24 horas!"
};
var confirmation$a = {
	bookingConfirmed: "¡Reserva Confirmada!",
	referenceText: "Tu referencia de reserva es",
	emailSent: "Hemos enviado un correo de confirmación a tu bandeja de entrada.",
	backToHome: "Volver al Inicio"
};
var auth$a = {
	authentication: "Autenticación",
	welcomeBack: "Bienvenido de Nuevo",
	noAccount: "¿No tienes una cuenta?",
	registerHere: "Regístrate aquí",
	emailAddress: "Correo Electrónico",
	password: "Contraseña",
	forgotPassword: "¿Olvidaste tu contraseña?",
	signingIn: "Iniciando sesión...",
	signIn: "Iniciar Sesión",
	orContinueWith: "O continúa con",
	signInGoogle: "Iniciar sesión con Google",
	getStarted: "Comenzar",
	createAccount: "Crear Cuenta",
	alreadyHaveAccount: "¿Ya tienes una cuenta?",
	loginHere: "Inicia sesión aquí",
	firstNameLabel: "Nombre",
	lastNameLabel: "Apellido",
	phoneNumberLabel: "Teléfono",
	creatingAccount: "Creando cuenta...",
	orJoinWith: "O únete con",
	signUpGoogle: "Registrarse con Google",
	accountRecovery: "Recuperación de Cuenta",
	forgotPasswordTitle: "Contraseña Olvidada",
	rememberedPassword: "¿Recordaste tu contraseña?",
	sending: "Enviando...",
	sendResetLink: "Enviar Enlace de Restablecimiento"
};
var authLayout$a = {
	journeyStarts: "Tu Viaje Comienza Aquí",
	discover: "Descubre los",
	worldsMost: "más increíbles",
	breathtaking: "destinos",
	layoutDestinations: "del mundo.",
	socialProof: "Únete a más de 50,000 viajeros que encuentran ofertas exclusivas y joyas ocultas con la plataforma inteligente de Flybeth.",
	trustedWorldwide: "Confianza mundial",
	averageRating: "4.9 ★ Calificación Promedio",
	travelIntelligence: "Inteligencia de Viaje"
};
var bookingConfirmed$a = "¡Reserva Confirmada!";
var common$a = {
	search: "Buscar",
	cancel: "Cancelar",
	confirm: "Confirmar",
	close: "Cerrar",
	loading: "Cargando...",
	error: "Error",
	success: "Éxito"
};
const locale_es_46json_73ad6bef = {
	hero: hero$a,
	nav: nav$a,
	search: search$a,
	marketing: marketing$a,
	offers: offers$a,
	promo: promo$a,
	destinations: destinations$a,
	inspiration: inspiration$a,
	categories: categories$a,
	newsletter: newsletter$a,
	stats: stats$a,
	footer: footer$a,
	settings: settings$a,
	flightCard: flightCard$a,
	stayCard: stayCard$a,
	carCard: carCard$a,
	emptyState: emptyState$a,
	flightsPage: flightsPage$a,
	staysPage: staysPage$a,
	carsPage: carsPage$a,
	checkout: checkout$a,
	confirmation: confirmation$a,
	auth: auth$a,
	authLayout: authLayout$a,
	bookingConfirmed: bookingConfirmed$a,
	common: common$a
};

var hero$9 = {
	title1: "Réservez des vols pas chers sur plus de",
	title2: "500 compagnies aériennes !",
	award: "Récompensé par Global Travel",
	since: "Depuis 2024"
};
var nav$9 = {
	stays: "Séjours",
	flights: "Vols",
	cars: "Voitures",
	packages: "Forfaits",
	cruises: "Croisières",
	signIn: "Connexion",
	explorer: "Explorateur",
	logout: {
		title: "Vous partez déjà ?",
		message: "Vous êtes sur le point de vous déconnecter de votre compte Flybeth. Les modifications non enregistrées seront perdues. Nous serons là à votre retour ! ✈️",
		confirm: "Se déconnecter",
		cancel: "Rester"
	},
	exit: {
		title: "Attendez, ne partez pas !",
		message: "Vous avez une session active. Êtes-vous sûr de vouloir quitter Flybeth ? Les recherches ou réservations en cours non enregistrées pourraient être perdues.",
		confirm: "Quitter",
		cancel: "Rester ici"
	}
};
var search$9 = {
	tabs: {
		flights: "Vols",
		holidays: "Vacances",
		hotels: "Hôtels",
		cruises: "Croisières",
		cars: "Voitures"
	},
	labels: {
		from: "Au départ de",
		to: "À destination de",
		where: "Où allez-vous ?",
		departure: "Date de départ",
		"return": "Date de retour",
		departure_return: "Départ — Retour",
		departure_date: "Date de départ",
		passengers: "Passagers",
		cabin: "Classe",
		letsgo: "C'EST PARTI !",
		singleHotel: "Hôtel unique",
		multiHotel: "Multi-hôtels",
		checkInCheckOut: "Arrivée - Départ",
		travelersRooms: "Voyageurs et chambres",
		bundleSave: "Combinez et économisez",
		addFlight: "Ajouter un vol",
		addCar: "Ajouter une voiture",
		addHotel: "Ajouter un hôtel",
		directFlightsOnly: "Vols directs uniquement",
		rentalCars: "Voitures de location",
		airportRides: "Transferts aéroport",
		pickUp: "Prise en charge",
		whereFrom: "D'où ?",
		whereTo: "Où ?",
		cityOrAirport: "Ville ou aéroport",
		addressOrHotel: "Adresse ou hôtel",
		dropOffLocation: "Lieu de restitution",
		rentalDates: "Dates de location",
		pickUpDate: "Date de prise en charge",
		pickUpTime: "Heure de prise en charge",
		differentDropOff: "Lieu de restitution différent",
		bundle: "Forfait",
		hotel: "Hôtel",
		flight: "Vol",
		whereFromQuestion: "D'où ?",
		whereToQuestion: "Où ?",
		stayDates: "Dates de séjour",
		travelDates: "Dates de voyage",
		partialHotelStay: "Séjour partiel à l'hôtel",
		differentCarDropOff: "Restitution voiture différente",
		saveBundleMsg: "Économisez jusqu'à 625 $ en combinant votre voyage !",
		rooms: "Chambres",
		adults: "Adultes",
		children: "Enfants",
		apply: "Appliquer",
		multiRoomNote: "Les forfaits multi-chambres sont limités à 8 voyageurs au total.",
		search: "Rechercher",
		updateSearch: "Mettre à jour"
	},
	placeholders: {
		origin: "Ville ou aéroport",
		destination: "Destination, ville ou hôtel"
	},
	packages: {
		hotel_flight: "Hôtel + Vol",
		hotel_flight_car: "Hôtel + Vol + Voiture",
		flight_car: "Vol + Voiture",
		hotel_car: "Hôtel + Voiture"
	},
	cruises: {
		title: "Naviguez dans le luxe.",
		expertAdvice: "Conseil expert : 1-866-403-9848",
		goingTo: "Destination",
		destinationAny: "Destination (Toutes)",
		departingBetween: "Départ entre",
		selectMonth: "Sélectionner le mois",
		cruiseLine: "Compagnie de croisière",
		anyCruiseLine: "Toute compagnie",
		viewLuxurySuites: "Voir les suites de luxe",
		familyDeals: "Offres familiales"
	},
	flightModes: {
		roundtrip: "Aller-retour",
		oneway: "Aller simple",
		multicity: "Multi-villes"
	}
};
var marketing$9 = {
	helpTitle: "Besoin d'aide pour trouver des offres ?",
	helpSub: "Réservez maintenant - Appelez-nous 24h/24",
	benefits: {
		deals: "Offres exclusives par téléphone",
		assist: "Assistance voyage personnalisée",
		cancel: "Annulation sous 24 heures",
		rewards: "Double de points ClubMiles"
	},
	speakExperts: "Parlez à nos conseillers voyage experts"
};
var offers$9 = {
	trending: "Offres vacances tendance",
	smarter: "Tarifs intelligents. Atterrissages en douceur.",
	smarterSub: "Des voyages qui valorisent votre temps.",
	majestic: "Chaque mile est majestueux !",
	majesticSub: "Volez Emirates. L'élégance en mouvement.",
	learn: "En savoir plus",
	book: "Réserver"
};
var promo$9 = {
	matchday: "Transformez le jour de match en escapade — profitez des économies d'été.",
	findDeals: "Voir les offres"
};
var destinations$9 = {
	globalExploration: "Exploration Mondiale",
	mostLoved: "Les Plus Aimées",
	destinations: "Destinations",
	description: "Réservez des vols, hôtels et expériences sélectionnés par nos experts pour les voyages les plus inoubliables.",
	startingFrom: "À partir de {price}",
	parisDesc: "La ville lumière vous attend avec ses monuments emblématiques et sa cuisine de renommée mondiale.",
	dubaiDesc: "Découvrez le shopping de luxe, l'architecture ultra-moderne et une vie nocturne animée.",
	maldivesDesc: "Eaux cristallines et plages immaculées dans un paradis tropical."
};
var inspiration$9 = {
	lifestyleTravel: "Voyage lifestyle",
	title: "Voyagez à votre façon",
	experiences: "{count} Expériences"
};
var categories$9 = {
	adventure: "Aventure",
	relaxation: "Détente",
	cityLife: "Vie urbaine",
	nature: "Nature"
};
var newsletter$9 = {
	title: "Ne manquez aucune offre",
	subtitle: "Abonnez-vous pour recevoir des offres exclusives de vols, réductions d'hôtels et inspiration voyage.",
	placeholder: "Entrez votre adresse e-mail",
	subscribeButton: "S'abonner",
	tagline: "Rejoignez plus de 50 000 voyageurs avisés"
};
var stats$9 = {
	globalDestinations: "Destinations mondiales",
	flightsFilteredDaily: "Vols filtrés quotidiennement",
	secureBookings: "Réservations sécurisées"
};
var footer$9 = {
	about: "À propos",
	blog: "Blog",
	jobs: "Emplois",
	press: "Presse",
	accessibility: "Accessibilité",
	partners: "Partenaires",
	rights: "© 2024 Flybeth, Inc. Tous droits réservés."
};
var settings$9 = {
	language: "Langue",
	currency: "Devise",
	applyChanges: "Appliquer les modifications"
};
var flightCard$9 = {
	perTraveler: "par voyageur",
	selectFlight: "Sélectionner le vol",
	nonstop: "Sans escale",
	stops: "{n} escale(s)",
	flight: "Vol"
};
var stayCard$9 = {
	nightlyAvg: "Moy. par nuit",
	viewDeal: "Voir l'offre",
	unnamedProperty: "Propriété sans nom",
	includesTaxes: "Total {total} $ taxes et frais inclus",
	off: "{percent}% DE RÉDUCTION"
};
var carCard$9 = {
	orSimilar: "ou similaire {category}",
	reviews: "{n} avis",
	passengers: "Passagers",
	bags: "Bagages",
	freeCancellation: "Annulation gratuite",
	totalPrice: "Prix total",
	viewDeal: "Voir l'offre"
};
var emptyState$9 = {
	defaultTitle: "Rien ici pour le moment",
	defaultMessage: "Essayez d'ajuster vos filtres de recherche ou explorez nos recommandations populaires."
};
var flightsPage$9 = {
	fromWhere: "D'où ?",
	toWhere: "Vers où ?",
	dates: "Dates",
	travelers: "Voyageurs",
	travelerPlaceholder: "1 voyageur",
	flightsFound: "{n} vols trouvés",
	filterBy: "Filtrer par",
	stops: "Escales",
	nonstop: "Sans escale",
	oneStop: "1 Escale",
	twoPlusStops: "2+ Escales",
	airlines: "Compagnies aériennes",
	noFlightsTitle: "Aucun vol trouvé",
	noFlightsMessage: "Nous n'avons trouvé aucun vol correspondant. Essayez d'autres aéroports ou dates.",
	explorePopular: "Explorer les routes populaires"
};
var staysPage$9 = {
	whereTo: "Où ?",
	checkIn: "Arrivée",
	guests: "Voyageurs",
	guestsPlaceholder: "2 voyageurs",
	propertiesFound: "{n} propriétés trouvées",
	filterBy: "Filtrer par",
	pricePerNight: "Prix par nuit",
	lessThan100: "Moins de 100 $",
	range100to200: "100 $ - 200 $",
	range200to300: "200 $ - 300 $",
	propertyType: "Type de propriété",
	hotelType: "Hôtel",
	resortType: "Resort",
	apartmentType: "Appartement",
	noPropertiesTitle: "Aucune propriété trouvée",
	noPropertiesMessage: "Nous n'avons trouvé aucun hébergement correspondant. Essayez un autre lieu ou ajustez vos dates.",
	searchDubai: "Rechercher Dubai"
};
var carsPage$9 = {
	pickUpLocation: "Lieu de prise en charge",
	pickUpDate: "Date de prise en charge",
	carsFound: "{n} voitures trouvées",
	filterBy: "Filtrer par",
	carType: "Type de voiture",
	economy: "Économique",
	suv: "SUV",
	luxury: "Luxe",
	transmission: "Transmission",
	automatic: "Automatique",
	manual: "Manuelle",
	noCarsTitle: "Aucune voiture disponible",
	noCarsMessage: "Aucune voiture de location trouvée à cet endroit. Essayez un autre point de prise en charge.",
	searchDubaiAirport: "Rechercher Aéroport de Dubai"
};
var checkout$9 = {
	secureCheckout: "Paiement sécurisé",
	travelerDetails: "Détails du voyageur",
	firstName: "Prénom",
	lastName: "Nom",
	emailAddress: "Adresse e-mail",
	phoneNumber: "Téléphone",
	paymentInfo: "Informations de paiement",
	cardholderName: "Nom du titulaire",
	cardNumber: "Numéro de carte",
	expirationDate: "Date d'expiration",
	cvv: "CVV",
	completeBooking: "Finaliser la réservation",
	processing: "Traitement...",
	termsAgreement: "En payant, vous acceptez nos conditions générales.",
	orderSummary: "Récapitulatif de commande",
	basePrice: "Prix de base",
	taxesFees: "Taxes et frais",
	total: "Total",
	freeCancellation: "Annulation gratuite sous 24 heures !"
};
var confirmation$9 = {
	bookingConfirmed: "Réservation confirmée !",
	referenceText: "Votre référence de réservation est",
	emailSent: "Un e-mail de confirmation a été envoyé.",
	backToHome: "Retour à l'accueil"
};
var auth$9 = {
	authentication: "Authentification",
	welcomeBack: "Bon retour",
	noAccount: "Pas encore de compte ?",
	registerHere: "Inscrivez-vous ici",
	emailAddress: "Adresse e-mail",
	password: "Mot de passe",
	forgotPassword: "Mot de passe oublié ?",
	signingIn: "Connexion en cours...",
	signIn: "Se connecter",
	orContinueWith: "Ou continuez avec",
	signInGoogle: "Se connecter avec Google",
	getStarted: "Commencer",
	createAccount: "Créer un compte",
	alreadyHaveAccount: "Vous avez déjà un compte ?",
	loginHere: "Connectez-vous ici",
	firstNameLabel: "Prénom",
	lastNameLabel: "Nom",
	phoneNumberLabel: "Téléphone",
	creatingAccount: "Création du compte...",
	orJoinWith: "Ou rejoignez avec",
	signUpGoogle: "S'inscrire avec Google",
	accountRecovery: "Récupération de compte",
	forgotPasswordTitle: "Mot de passe oublié",
	rememberedPassword: "Vous vous souvenez de votre mot de passe ?",
	sending: "Envoi...",
	sendResetLink: "Envoyer le lien de réinitialisation"
};
var authLayout$9 = {
	journeyStarts: "Votre voyage commence ici",
	discover: "Découvrez les",
	worldsMost: "plus belles",
	breathtaking: "destinations",
	layoutDestinations: "du monde.",
	socialProof: "Rejoignez plus de 50 000 voyageurs qui trouvent des offres exclusives avec Flybeth.",
	trustedWorldwide: "Confiance mondiale",
	averageRating: "4.9 ★ Note moyenne",
	travelIntelligence: "Intelligence de voyage"
};
var bookingConfirmed$9 = "Réservation confirmée !";
var common$9 = {
	search: "Rechercher",
	cancel: "Annuler",
	confirm: "Confirmer",
	close: "Fermer",
	loading: "Chargement...",
	error: "Erreur",
	success: "Succès"
};
const locale_fr_46json_88a412bc = {
	hero: hero$9,
	nav: nav$9,
	search: search$9,
	marketing: marketing$9,
	offers: offers$9,
	promo: promo$9,
	destinations: destinations$9,
	inspiration: inspiration$9,
	categories: categories$9,
	newsletter: newsletter$9,
	stats: stats$9,
	footer: footer$9,
	settings: settings$9,
	flightCard: flightCard$9,
	stayCard: stayCard$9,
	carCard: carCard$9,
	emptyState: emptyState$9,
	flightsPage: flightsPage$9,
	staysPage: staysPage$9,
	carsPage: carsPage$9,
	checkout: checkout$9,
	confirmation: confirmation$9,
	auth: auth$9,
	authLayout: authLayout$9,
	bookingConfirmed: bookingConfirmed$9,
	common: common$9
};

var hero$8 = {
	title1: "Buchen Sie günstige Flüge bei über",
	title2: "500 Fluggesellschaften!",
	award: "Ausgezeichnet von Global Travel",
	since: "Seit 2024"
};
var nav$8 = {
	stays: "Unterkünfte",
	flights: "Flüge",
	cars: "Mietwagen",
	packages: "Pakete",
	cruises: "Kreuzfahrten",
	signIn: "Anmelden",
	explorer: "Entdecker",
	logout: {
		title: "Schon gehen?",
		message: "Sie sind dabei, sich von Ihrem Flybeth-Konto abzumelden. Nicht gespeicherte Änderungen gehen verloren. Wir sind da, wenn Sie zurückkommen! ✈️",
		confirm: "Abmelden",
		cancel: "Bleiben"
	},
	exit: {
		title: "Warten Sie, gehen Sie nicht!",
		message: "Sie haben eine aktive Sitzung. Sind Sie sicher, dass Sie Flybeth verlassen möchten?",
		confirm: "Verlassen",
		cancel: "Hier bleiben"
	}
};
var search$8 = {
	tabs: {
		flights: "Flüge",
		holidays: "Urlaub",
		hotels: "Hotels",
		cruises: "Kreuzfahrten",
		cars: "Mietwagen"
	},
	labels: {
		from: "Abflug von",
		to: "Flug nach",
		where: "Wohin möchten Sie?",
		departure: "Abflugdatum",
		"return": "Rückkehrdatum",
		departure_return: "Hin — Rück",
		departure_date: "Abflugdatum",
		passengers: "Passagiere",
		cabin: "Kabinenklasse",
		letsgo: "LOS GEHT'S!",
		singleHotel: "Einzelhotel",
		multiHotel: "Mehrere Hotels",
		checkInCheckOut: "Ein- / Auschecken",
		travelersRooms: "Reisende & Zimmer",
		bundleSave: "Bündeln & Sparen",
		addFlight: "Flug hinzufügen",
		addCar: "Auto hinzufügen",
		addHotel: "Hotel hinzufügen",
		directFlightsOnly: "Nur Direktflüge",
		rentalCars: "Mietwagen",
		airportRides: "Flughafentransfer",
		pickUp: "Abholung",
		whereFrom: "Woher?",
		whereTo: "Wohin?",
		cityOrAirport: "Stadt oder Flughafen",
		addressOrHotel: "Adresse oder Hotel",
		dropOffLocation: "Rückgabeort",
		rentalDates: "Mietdaten",
		pickUpDate: "Abholdatum",
		pickUpTime: "Abholzeit",
		differentDropOff: "Anderer Rückgabeort",
		bundle: "Paket",
		hotel: "Hotel",
		flight: "Flug",
		whereFromQuestion: "Woher?",
		whereToQuestion: "Wohin?",
		stayDates: "Aufenthaltsdaten",
		travelDates: "Reisedaten",
		partialHotelStay: "Teilweiser Hotelaufenthalt",
		differentCarDropOff: "Andere Autorückgabe",
		saveBundleMsg: "Sparen Sie bis zu 625 $ durch Bündelung!",
		rooms: "Zimmer",
		adults: "Erwachsene",
		children: "Kinder",
		apply: "Anwenden",
		multiRoomNote: "Multi-Zimmer-Pakete sind auf 8 Reisende begrenzt.",
		search: "Suchen",
		updateSearch: "Suche aktualisieren"
	},
	placeholders: {
		origin: "Stadt oder Flughafen",
		destination: "Ziel, Stadt oder Hotel"
	},
	packages: {
		hotel_flight: "Hotel + Flug",
		hotel_flight_car: "Hotel + Flug + Auto",
		flight_car: "Flug + Auto",
		hotel_car: "Hotel + Auto"
	},
	cruises: {
		title: "Segeln Sie im Luxus.",
		expertAdvice: "Expertenberatung: 1-866-403-9848",
		goingTo: "Reiseziel",
		destinationAny: "Ziel (Alle)",
		departingBetween: "Abfahrt zwischen",
		selectMonth: "Monat wählen",
		cruiseLine: "Kreuzfahrtlinie",
		anyCruiseLine: "Alle Linien",
		viewLuxurySuites: "Luxus-Suiten ansehen",
		familyDeals: "Familienangebote"
	},
	flightModes: {
		roundtrip: "Hin und zurück",
		oneway: "Nur Hinflug",
		multicity: "Mehrere Städte"
	}
};
var marketing$8 = {
	helpTitle: "Hilfe bei der Suche nach Angeboten?",
	helpSub: "Jetzt buchen - Rufen Sie uns jederzeit an",
	benefits: {
		deals: "Exklusive Telefonangebote",
		assist: "Persönliche Reiseberatung",
		cancel: "24-Stunden-Stornierung",
		rewards: "Doppelte ClubMiles-Punkte"
	},
	speakExperts: "Sprechen Sie mit unseren Reiseexperten"
};
var offers$8 = {
	trending: "Angesagte Urlaubsangebote",
	smarter: "Klügere Tarife. Sanftere Landungen.",
	smarterSub: "Reisen, die Ihre Zeit wertschätzen.",
	majestic: "Jede Meile fühlt sich majestätisch an!",
	majesticSub: "Fliegen Sie Emirates. Eleganz in Bewegung.",
	learn: "Mehr erfahren",
	book: "Jetzt buchen"
};
var promo$8 = {
	matchday: "Aus dem Spieltag einen Kurzurlaub machen — Sommerangebote sichern.",
	findDeals: "Angebote finden"
};
var destinations$8 = {
	globalExploration: "Globale Erkundung",
	mostLoved: "Beliebteste",
	destinations: "Reiseziele",
	description: "Buchen Sie Flüge, Hotels und Erlebnisse, ausgewählt von unseren Kuratoren für unvergessliche Reisen.",
	startingFrom: "Ab {price}",
	parisDesc: "Die Stadt der Lichter erwartet Sie mit ikonischen Wahrzeichen und Weltklasse-Küche.",
	dubaiDesc: "Erleben Sie Luxusshopping, ultramoderne Architektur und ein lebhaftes Nachtleben.",
	maldivesDesc: "Kristallklares Wasser und unberührte Strände im tropischen Paradies."
};
var inspiration$8 = {
	lifestyleTravel: "Lifestyle-Reisen",
	title: "Reisen Sie auf Ihre Art",
	experiences: "{count} Erlebnisse"
};
var categories$8 = {
	adventure: "Abenteuer",
	relaxation: "Entspannung",
	cityLife: "Stadtleben",
	nature: "Natur"
};
var newsletter$8 = {
	title: "Kein Angebot verpassen",
	subtitle: "Abonnieren Sie exklusive Flugangebote, Hotelrabatte und Reiseinspiration.",
	placeholder: "E-Mail-Adresse eingeben",
	subscribeButton: "Abonnieren",
	tagline: "Schließen Sie sich 50.000+ klugen Reisenden an"
};
var stats$8 = {
	globalDestinations: "Globale Reiseziele",
	flightsFilteredDaily: "Täglich gefilterte Flüge",
	secureBookings: "Sichere Buchungen"
};
var footer$8 = {
	about: "Über uns",
	blog: "Blog",
	jobs: "Karriere",
	press: "Presse",
	accessibility: "Barrierefreiheit",
	partners: "Partner",
	rights: "© 2024 Flybeth, Inc. Alle Rechte vorbehalten."
};
var settings$8 = {
	language: "Sprache",
	currency: "Währung",
	applyChanges: "Änderungen übernehmen"
};
var flightCard$8 = {
	perTraveler: "pro Reisender",
	selectFlight: "Flug auswählen",
	nonstop: "Nonstop",
	stops: "{n} Zwischenstopp(s)",
	flight: "Flug"
};
var stayCard$8 = {
	nightlyAvg: "Durchschn. pro Nacht",
	viewDeal: "Angebot ansehen",
	unnamedProperty: "Unbenannte Unterkunft",
	includesTaxes: "Gesamt {total} $ inkl. Steuern & Gebühren",
	off: "{percent}% RABATT"
};
var carCard$8 = {
	orSimilar: "oder ähnlich {category}",
	reviews: "{n} Bewertungen",
	passengers: "Passagiere",
	bags: "Gepäck",
	freeCancellation: "Kostenlose Stornierung",
	totalPrice: "Gesamtpreis",
	viewDeal: "Angebot ansehen"
};
var emptyState$8 = {
	defaultTitle: "Noch nichts hier",
	defaultMessage: "Passen Sie Ihre Suchfilter an oder erkunden Sie unsere beliebten Empfehlungen."
};
var flightsPage$8 = {
	fromWhere: "Woher?",
	toWhere: "Wohin?",
	dates: "Daten",
	travelers: "Reisende",
	travelerPlaceholder: "1 Reisender",
	flightsFound: "{n} Flüge gefunden",
	filterBy: "Filtern nach",
	stops: "Zwischenstopps",
	nonstop: "Nonstop",
	oneStop: "1 Stopp",
	twoPlusStops: "2+ Stopps",
	airlines: "Fluggesellschaften",
	noFlightsTitle: "Keine Flüge gefunden",
	noFlightsMessage: "Keine passenden Flüge gefunden. Versuchen Sie andere Flughäfen oder Daten.",
	explorePopular: "Beliebte Routen erkunden"
};
var staysPage$8 = {
	whereTo: "Wohin?",
	checkIn: "Einchecken",
	guests: "Gäste",
	guestsPlaceholder: "2 Reisende",
	propertiesFound: "{n} Unterkünfte gefunden",
	filterBy: "Filtern nach",
	pricePerNight: "Preis pro Nacht",
	lessThan100: "Unter 100 $",
	range100to200: "100 $ - 200 $",
	range200to300: "200 $ - 300 $",
	propertyType: "Unterkunftstyp",
	hotelType: "Hotel",
	resortType: "Resort",
	apartmentType: "Apartment",
	noPropertiesTitle: "Keine Unterkünfte gefunden",
	noPropertiesMessage: "Keine passenden Unterkünfte gefunden. Versuchen Sie einen anderen Ort oder andere Daten.",
	searchDubai: "Dubai suchen"
};
var carsPage$8 = {
	pickUpLocation: "Abholort",
	pickUpDate: "Abholdatum",
	carsFound: "{n} Autos gefunden",
	filterBy: "Filtern nach",
	carType: "Fahrzeugtyp",
	economy: "Economy",
	suv: "SUV",
	luxury: "Luxus",
	transmission: "Getriebe",
	automatic: "Automatik",
	manual: "Manuell",
	noCarsTitle: "Keine Autos verfügbar",
	noCarsMessage: "Keine Mietwagen an diesem Standort gefunden. Versuchen Sie einen anderen Ort.",
	searchDubaiAirport: "Dubai Flughafen suchen"
};
var checkout$8 = {
	secureCheckout: "Sichere Bezahlung",
	travelerDetails: "Reisendedaten",
	firstName: "Vorname",
	lastName: "Nachname",
	emailAddress: "E-Mail-Adresse",
	phoneNumber: "Telefon",
	paymentInfo: "Zahlungsinformationen",
	cardholderName: "Karteninhaber",
	cardNumber: "Kartennummer",
	expirationDate: "Ablaufdatum",
	cvv: "CVV",
	completeBooking: "Buchung abschließen",
	processing: "Wird verarbeitet...",
	termsAgreement: "Mit der Bezahlung akzeptieren Sie unsere AGB.",
	orderSummary: "Bestellübersicht",
	basePrice: "Grundpreis",
	taxesFees: "Steuern & Gebühren",
	total: "Gesamt",
	freeCancellation: "Kostenlose Stornierung innerhalb von 24 Stunden!"
};
var confirmation$8 = {
	bookingConfirmed: "Buchung bestätigt!",
	referenceText: "Ihre Buchungsreferenz lautet",
	emailSent: "Eine Bestätigungs-E-Mail wurde gesendet.",
	backToHome: "Zurück zur Startseite"
};
var auth$8 = {
	authentication: "Authentifizierung",
	welcomeBack: "Willkommen zurück",
	noAccount: "Noch kein Konto?",
	registerHere: "Hier registrieren",
	emailAddress: "E-Mail-Adresse",
	password: "Passwort",
	forgotPassword: "Passwort vergessen?",
	signingIn: "Anmeldung...",
	signIn: "Anmelden",
	orContinueWith: "Oder fortfahren mit",
	signInGoogle: "Mit Google anmelden",
	getStarted: "Loslegen",
	createAccount: "Konto erstellen",
	alreadyHaveAccount: "Bereits ein Konto?",
	loginHere: "Hier anmelden",
	firstNameLabel: "Vorname",
	lastNameLabel: "Nachname",
	phoneNumberLabel: "Telefon",
	creatingAccount: "Konto wird erstellt...",
	orJoinWith: "Oder beitreten mit",
	signUpGoogle: "Mit Google registrieren",
	accountRecovery: "Kontowiederherstellung",
	forgotPasswordTitle: "Passwort vergessen",
	rememberedPassword: "Passwort wieder eingefallen?",
	sending: "Wird gesendet...",
	sendResetLink: "Link senden"
};
var authLayout$8 = {
	journeyStarts: "Ihre Reise beginnt hier",
	discover: "Entdecken Sie die",
	worldsMost: "atemberaubendsten",
	breathtaking: "Reiseziele",
	layoutDestinations: "der Welt.",
	socialProof: "Schließen Sie sich 50.000+ Reisenden an, die exklusive Angebote mit Flybeth finden.",
	trustedWorldwide: "Weltweit vertraut",
	averageRating: "4,9 ★ Durchschnittsbewertung",
	travelIntelligence: "Reise-Intelligenz"
};
var bookingConfirmed$8 = "Buchung bestätigt!";
var common$8 = {
	search: "Suchen",
	cancel: "Abbrechen",
	confirm: "Bestätigen",
	close: "Schließen",
	loading: "Laden...",
	error: "Fehler",
	success: "Erfolg"
};
const locale_de_46json_269f3f54 = {
	hero: hero$8,
	nav: nav$8,
	search: search$8,
	marketing: marketing$8,
	offers: offers$8,
	promo: promo$8,
	destinations: destinations$8,
	inspiration: inspiration$8,
	categories: categories$8,
	newsletter: newsletter$8,
	stats: stats$8,
	footer: footer$8,
	settings: settings$8,
	flightCard: flightCard$8,
	stayCard: stayCard$8,
	carCard: carCard$8,
	emptyState: emptyState$8,
	flightsPage: flightsPage$8,
	staysPage: staysPage$8,
	carsPage: carsPage$8,
	checkout: checkout$8,
	confirmation: confirmation$8,
	auth: auth$8,
	authLayout: authLayout$8,
	bookingConfirmed: bookingConfirmed$8,
	common: common$8
};

var hero$7 = {
	title1: "احجز رحلات طيران رخيصة على أكثر من",
	title2: "500 شركة طيران!",
	award: "حاصل على جائزة Global Travel",
	since: "منذ 2024"
};
var nav$7 = {
	stays: "الإقامة",
	flights: "الرحلات",
	cars: "السيارات",
	packages: "الباقات",
	cruises: "الرحلات البحرية",
	signIn: "تسجيل الدخول",
	explorer: "المستكشف",
	logout: {
		title: "هل ستغادر قريباً؟",
		message: "أنت على وشك تسجيل الخروج من حسابك في Flybeth. ستفقد أي تغييرات غير محفوظة. سنكون هنا عند عودتك! ✈️",
		confirm: "تسجيل الخروج",
		cancel: "البقاء"
	},
	exit: {
		title: "انتظر، لا تذهب!",
		message: "لديك جلسة نشطة. هل أنت متأكد أنك تريد مغادرة Flybeth؟",
		confirm: "مغادرة",
		cancel: "البقاء هنا"
	}
};
var search$7 = {
	tabs: {
		flights: "الرحلات",
		holidays: "العطلات",
		hotels: "الفنادق",
		cruises: "رحلات بحرية",
		cars: "السيارات"
	},
	labels: {
		from: "المغادرة من",
		to: "السفر إلى",
		where: "إلى أين تذهب؟",
		departure: "تاريخ المغادرة",
		"return": "تاريخ العودة",
		departure_return: "المغادرة — العودة",
		departure_date: "تاريخ المغادرة",
		passengers: "المسافرون",
		cabin: "درجة المقصورة",
		letsgo: "هيا بنا!",
		singleHotel: "فندق واحد",
		multiHotel: "فنادق متعددة",
		checkInCheckOut: "تسجيل الوصول - المغادرة",
		travelersRooms: "المسافرون والغرف",
		bundleSave: "اجمع ووفر",
		addFlight: "أضف رحلة",
		addCar: "أضف سيارة",
		addHotel: "أضف فندق",
		directFlightsOnly: "رحلات مباشرة فقط",
		rentalCars: "سيارات للإيجار",
		airportRides: "نقل المطار",
		pickUp: "الاستلام",
		whereFrom: "من أين؟",
		whereTo: "إلى أين؟",
		cityOrAirport: "مدينة أو مطار",
		addressOrHotel: "عنوان أو فندق",
		dropOffLocation: "موقع التسليم",
		rentalDates: "تواريخ الإيجار",
		pickUpDate: "تاريخ الاستلام",
		pickUpTime: "وقت الاستلام",
		differentDropOff: "موقع تسليم مختلف",
		bundle: "باقة",
		hotel: "فندق",
		flight: "رحلة",
		whereFromQuestion: "من أين؟",
		whereToQuestion: "إلى أين؟",
		stayDates: "تواريخ الإقامة",
		travelDates: "تواريخ السفر",
		partialHotelStay: "إقامة فندقية جزئية",
		differentCarDropOff: "تسليم سيارة مختلف",
		saveBundleMsg: "وفر حتى 625$ عند تجميع رحلتك!",
		rooms: "غرف",
		adults: "بالغون",
		children: "أطفال",
		apply: "تطبيق",
		multiRoomNote: "الباقات متعددة الغرف محدودة بـ 8 مسافرين.",
		search: "بحث",
		updateSearch: "تحديث البحث"
	},
	placeholders: {
		origin: "مدينة أو مطار",
		destination: "الوجهة، المدينة أو الفندق"
	},
	packages: {
		hotel_flight: "فندق + رحلة",
		hotel_flight_car: "فندق + رحلة + سيارة",
		flight_car: "رحلة + سيارة",
		hotel_car: "فندق + سيارة"
	},
	cruises: {
		title: "أبحر في الفخامة.",
		expertAdvice: "استشارة خبير: 1-866-403-9848",
		goingTo: "الوجهة",
		destinationAny: "الوجهة (الكل)",
		departingBetween: "المغادرة بين",
		selectMonth: "اختر الشهر",
		cruiseLine: "خط الرحلات البحرية",
		anyCruiseLine: "أي خط",
		viewLuxurySuites: "عرض الأجنحة الفاخرة",
		familyDeals: "عروض عائلية"
	},
	flightModes: {
		roundtrip: "ذهاب وعودة",
		oneway: "ذهاب فقط",
		multicity: "مدن متعددة"
	}
};
var marketing$7 = {
	helpTitle: "هل تحتاج مساعدة في إيجاد العروض؟",
	helpSub: "احجز الآن - اتصل بنا على مدار الساعة",
	benefits: {
		deals: "عروض حصرية عبر الهاتف",
		assist: "مساعدة سفر شخصية",
		cancel: "إلغاء خلال 24 ساعة",
		rewards: "نقاط ClubMiles مضاعفة"
	},
	speakExperts: "تحدث مع مستشاري السفر الخبراء"
};
var offers$7 = {
	trending: "عروض العطلات الرائجة",
	smarter: "أسعار أذكى. هبوط أنعم.",
	smarterSub: "سفر يقدّر وقتك أكثر.",
	majestic: "كل ميل يبدو مهيباً!",
	majesticSub: "طر مع طيران الإمارات. أناقة في حركة.",
	learn: "اعرف المزيد",
	book: "احجز الآن"
};
var promo$7 = {
	matchday: "حوّل يوم المباراة إلى رحلة — استمتع بخصومات الصيف.",
	findDeals: "اعثر على العروض"
};
var destinations$7 = {
	globalExploration: "استكشاف عالمي",
	mostLoved: "الأكثر إعجاباً",
	destinations: "الوجهات",
	description: "احجز رحلات وفنادق وتجارب مختارة بعناية لأكثر الرحلات التي لا تُنسى حول العالم.",
	startingFrom: "ابتداءً من {price}",
	parisDesc: "مدينة الأنوار تنتظرك بمعالمها الأيقونية ومطبخها العالمي.",
	dubaiDesc: "اختبر التسوق الفاخر والعمارة الحديثة والحياة الليلية النابضة.",
	maldivesDesc: "مياه صافية كالكريستال وشواطئ بكر في جنة استوائية."
};
var inspiration$7 = {
	lifestyleTravel: "سفر بأسلوب حياة",
	title: "سافر على طريقتك",
	experiences: "{count} تجربة"
};
var categories$7 = {
	adventure: "مغامرة",
	relaxation: "استرخاء",
	cityLife: "حياة المدينة",
	nature: "طبيعة"
};
var newsletter$7 = {
	title: "لا تفوّت أي عرض",
	subtitle: "اشترك للحصول على عروض حصرية للرحلات والفنادق وإلهام السفر.",
	placeholder: "أدخل بريدك الإلكتروني",
	subscribeButton: "اشترك",
	tagline: "انضم إلى أكثر من 50,000 مسافر ذكي"
};
var stats$7 = {
	globalDestinations: "وجهات عالمية",
	flightsFilteredDaily: "رحلات مُصفاة يومياً",
	secureBookings: "حجوزات آمنة"
};
var footer$7 = {
	about: "عن الشركة",
	blog: "المدونة",
	jobs: "الوظائف",
	press: "الصحافة",
	accessibility: "إمكانية الوصول",
	partners: "الشركاء",
	rights: "© 2024 Flybeth, Inc. جميع الحقوق محفوظة."
};
var settings$7 = {
	language: "اللغة",
	currency: "العملة",
	applyChanges: "تطبيق التغييرات"
};
var flightCard$7 = {
	perTraveler: "لكل مسافر",
	selectFlight: "اختر الرحلة",
	nonstop: "مباشر",
	stops: "{n} توقف(ات)",
	flight: "رحلة"
};
var stayCard$7 = {
	nightlyAvg: "متوسط الليلة",
	viewDeal: "عرض الصفقة",
	unnamedProperty: "عقار بدون اسم",
	includesTaxes: "المجموع {total}$ شامل الضرائب والرسوم",
	off: "خصم {percent}%"
};
var carCard$7 = {
	orSimilar: "أو مشابه {category}",
	reviews: "{n} تقييمات",
	passengers: "ركاب",
	bags: "حقائب",
	freeCancellation: "إلغاء مجاني",
	totalPrice: "السعر الإجمالي",
	viewDeal: "عرض الصفقة"
};
var emptyState$7 = {
	defaultTitle: "لا شيء هنا بعد",
	defaultMessage: "حاول تعديل فلاتر البحث أو استكشف توصياتنا الشائعة."
};
var flightsPage$7 = {
	fromWhere: "من أين؟",
	toWhere: "إلى أين؟",
	dates: "التواريخ",
	travelers: "المسافرون",
	travelerPlaceholder: "مسافر واحد",
	flightsFound: "تم العثور على {n} رحلة",
	filterBy: "تصفية حسب",
	stops: "التوقفات",
	nonstop: "مباشر",
	oneStop: "توقف واحد",
	twoPlusStops: "2+ توقفات",
	airlines: "شركات الطيران",
	noFlightsTitle: "لم يتم العثور على رحلات",
	noFlightsMessage: "لم نتمكن من إيجاد رحلات مطابقة. جرب مطارات أو تواريخ مختلفة.",
	explorePopular: "استكشف المسارات الشائعة"
};
var staysPage$7 = {
	whereTo: "إلى أين؟",
	checkIn: "تسجيل الوصول",
	guests: "الضيوف",
	guestsPlaceholder: "مسافران",
	propertiesFound: "تم العثور على {n} عقار",
	filterBy: "تصفية حسب",
	pricePerNight: "السعر لكل ليلة",
	lessThan100: "أقل من 100$",
	range100to200: "100$ - 200$",
	range200to300: "200$ - 300$",
	propertyType: "نوع العقار",
	hotelType: "فندق",
	resortType: "منتجع",
	apartmentType: "شقة",
	noPropertiesTitle: "لم يتم العثور على عقارات",
	noPropertiesMessage: "لم نتمكن من إيجاد إقامات مطابقة. جرب موقعاً مختلفاً أو عدل تواريخك.",
	searchDubai: "بحث في دبي"
};
var carsPage$7 = {
	pickUpLocation: "موقع الاستلام",
	pickUpDate: "تاريخ الاستلام",
	carsFound: "تم العثور على {n} سيارة",
	filterBy: "تصفية حسب",
	carType: "نوع السيارة",
	economy: "اقتصادية",
	suv: "SUV",
	luxury: "فاخرة",
	transmission: "ناقل الحركة",
	automatic: "أوتوماتيك",
	manual: "يدوي",
	noCarsTitle: "لا توجد سيارات متاحة",
	noCarsMessage: "لم نتمكن من إيجاد سيارات إيجار في هذا الموقع. جرب نقطة استلام مختلفة.",
	searchDubaiAirport: "بحث مطار دبي"
};
var checkout$7 = {
	secureCheckout: "الدفع الآمن",
	travelerDetails: "بيانات المسافر",
	firstName: "الاسم الأول",
	lastName: "اسم العائلة",
	emailAddress: "البريد الإلكتروني",
	phoneNumber: "رقم الهاتف",
	paymentInfo: "معلومات الدفع",
	cardholderName: "اسم حامل البطاقة",
	cardNumber: "رقم البطاقة",
	expirationDate: "تاريخ الانتهاء",
	cvv: "CVV",
	completeBooking: "إتمام الحجز",
	processing: "جارٍ المعالجة...",
	termsAgreement: "بالدفع، أنت توافق على الشروط والأحكام.",
	orderSummary: "ملخص الطلب",
	basePrice: "السعر الأساسي",
	taxesFees: "الضرائب والرسوم",
	total: "المجموع",
	freeCancellation: "إلغاء مجاني خلال 24 ساعة!"
};
var confirmation$7 = {
	bookingConfirmed: "تم تأكيد الحجز!",
	referenceText: "مرجع حجزك هو",
	emailSent: "لقد أرسلنا بريد تأكيد إلى صندوق الوارد.",
	backToHome: "العودة للرئيسية"
};
var auth$7 = {
	authentication: "المصادقة",
	welcomeBack: "أهلاً بعودتك",
	noAccount: "ليس لديك حساب؟",
	registerHere: "سجل هنا",
	emailAddress: "البريد الإلكتروني",
	password: "كلمة المرور",
	forgotPassword: "نسيت كلمة المرور؟",
	signingIn: "جارٍ تسجيل الدخول...",
	signIn: "تسجيل الدخول",
	orContinueWith: "أو تابع باستخدام",
	signInGoogle: "تسجيل الدخول بـ Google",
	getStarted: "ابدأ الآن",
	createAccount: "إنشاء حساب",
	alreadyHaveAccount: "لديك حساب بالفعل؟",
	loginHere: "سجل الدخول هنا",
	firstNameLabel: "الاسم الأول",
	lastNameLabel: "اسم العائلة",
	phoneNumberLabel: "رقم الهاتف",
	creatingAccount: "جارٍ إنشاء الحساب...",
	orJoinWith: "أو انضم باستخدام",
	signUpGoogle: "التسجيل بـ Google",
	accountRecovery: "استرداد الحساب",
	forgotPasswordTitle: "نسيت كلمة المرور",
	rememberedPassword: "تذكرت كلمة المرور؟",
	sending: "جارٍ الإرسال...",
	sendResetLink: "إرسال رابط إعادة التعيين"
};
var authLayout$7 = {
	journeyStarts: "رحلتك تبدأ هنا",
	discover: "اكتشف أجمل",
	worldsMost: "الوجهات الأكثر",
	breathtaking: "روعة",
	layoutDestinations: "في العالم.",
	socialProof: "انضم إلى أكثر من 50,000 مسافر يجدون عروضاً حصرية مع Flybeth.",
	trustedWorldwide: "موثوق عالمياً",
	averageRating: "4.9 ★ متوسط التقييم",
	travelIntelligence: "ذكاء السفر"
};
var bookingConfirmed$7 = "تم تأكيد الحجز!";
var common$7 = {
	search: "بحث",
	cancel: "إلغاء",
	confirm: "تأكيد",
	close: "إغلاق",
	loading: "جارٍ التحميل...",
	error: "خطأ",
	success: "نجاح"
};
const locale_ar_46json_e319d7cc = {
	hero: hero$7,
	nav: nav$7,
	search: search$7,
	marketing: marketing$7,
	offers: offers$7,
	promo: promo$7,
	destinations: destinations$7,
	inspiration: inspiration$7,
	categories: categories$7,
	newsletter: newsletter$7,
	stats: stats$7,
	footer: footer$7,
	settings: settings$7,
	flightCard: flightCard$7,
	stayCard: stayCard$7,
	carCard: carCard$7,
	emptyState: emptyState$7,
	flightsPage: flightsPage$7,
	staysPage: staysPage$7,
	carsPage: carsPage$7,
	checkout: checkout$7,
	confirmation: confirmation$7,
	auth: auth$7,
	authLayout: authLayout$7,
	bookingConfirmed: bookingConfirmed$7,
	common: common$7
};

var hero$6 = {
	title1: "预订超过",
	title2: "500家航空公司的廉价机票！",
	award: "荣获Global Travel大奖",
	since: "始于2024"
};
var nav$6 = {
	stays: "住宿",
	flights: "航班",
	cars: "租车",
	packages: "套餐",
	cruises: "邮轮",
	signIn: "登录",
	explorer: "探索者",
	logout: {
		title: "这么快就走？",
		message: "您即将退出Flybeth账户。未保存的更改将丢失。我们会在您回来时等着您！✈️",
		confirm: "退出登录",
		cancel: "留下"
	},
	exit: {
		title: "等等，别走！",
		message: "您有一个活跃的会话。确定要离开Flybeth吗？",
		confirm: "离开",
		cancel: "留在这里"
	}
};
var search$6 = {
	tabs: {
		flights: "航班",
		holidays: "度假",
		hotels: "酒店",
		cruises: "邮轮",
		cars: "租车"
	},
	labels: {
		from: "出发地",
		to: "目的地",
		where: "您要去哪里？",
		departure: "出发日期",
		"return": "返回日期",
		departure_return: "出发 — 返回",
		departure_date: "出发日期",
		passengers: "乘客",
		cabin: "舱位等级",
		letsgo: "出发！",
		singleHotel: "单一酒店",
		multiHotel: "多家酒店",
		checkInCheckOut: "入住 - 退房",
		travelersRooms: "旅客和房间",
		bundleSave: "组合优惠",
		addFlight: "添加航班",
		addCar: "添加租车",
		addHotel: "添加酒店",
		directFlightsOnly: "仅直飞航班",
		rentalCars: "租赁车辆",
		airportRides: "机场接送",
		pickUp: "取车",
		whereFrom: "从哪里？",
		whereTo: "到哪里？",
		cityOrAirport: "城市或机场",
		addressOrHotel: "地址或酒店",
		dropOffLocation: "还车地点",
		rentalDates: "租赁日期",
		pickUpDate: "取车日期",
		pickUpTime: "取车时间",
		differentDropOff: "不同的还车地点",
		bundle: "套餐",
		hotel: "酒店",
		flight: "航班",
		whereFromQuestion: "从哪里？",
		whereToQuestion: "到哪里？",
		stayDates: "住宿日期",
		travelDates: "旅行日期",
		partialHotelStay: "部分酒店住宿",
		differentCarDropOff: "不同的还车点",
		saveBundleMsg: "组合预订最多可节省625美元！",
		rooms: "房间",
		adults: "成人",
		children: "儿童",
		apply: "应用",
		multiRoomNote: "多房间套餐限制为8位旅客。",
		search: "搜索",
		updateSearch: "更新搜索"
	},
	placeholders: {
		origin: "城市或机场",
		destination: "目的地、城市或酒店"
	},
	packages: {
		hotel_flight: "酒店 + 航班",
		hotel_flight_car: "酒店 + 航班 + 租车",
		flight_car: "航班 + 租车",
		hotel_car: "酒店 + 租车"
	},
	cruises: {
		title: "奢华启航。",
		expertAdvice: "专家咨询：1-866-403-9848",
		goingTo: "目的地",
		destinationAny: "目的地（所有）",
		departingBetween: "出发时间",
		selectMonth: "选择月份",
		cruiseLine: "邮轮公司",
		anyCruiseLine: "所有邮轮",
		viewLuxurySuites: "查看豪华套房",
		familyDeals: "家庭优惠"
	},
	flightModes: {
		roundtrip: "往返",
		oneway: "单程",
		multicity: "多城市"
	}
};
var marketing$6 = {
	helpTitle: "需要帮助寻找优惠？",
	helpSub: "立即预订 - 24/7全天候服务",
	benefits: {
		deals: "电话专属优惠",
		assist: "个性化旅行协助",
		cancel: "24小时取消",
		rewards: "双倍ClubMiles积分"
	},
	speakExperts: "与我们的旅行专家交谈"
};
var offers$6 = {
	trending: "热门度假优惠",
	smarter: "更智能的票价。更柔和的着陆。",
	smarterSub: "更珍惜您时间的旅行。",
	majestic: "每一英里都感觉壮丽！",
	majesticSub: "飞阿联酋航空。优雅在运动中。",
	learn: "了解更多",
	book: "立即预订"
};
var promo$6 = {
	matchday: "把比赛日变成度假——享受夏日优惠。",
	findDeals: "查找优惠"
};
var destinations$6 = {
	globalExploration: "全球探索",
	mostLoved: "最受欢迎的",
	destinations: "目的地",
	description: "预订由我们的策展人精心挑选的航班、酒店和体验，享受最难忘的旅程。",
	startingFrom: "起价 {price}",
	parisDesc: "光之城等待着您，拥有标志性地标和世界级美食。",
	dubaiDesc: "体验奢华购物、超现代建筑和充满活力的夜生活。",
	maldivesDesc: "热带天堂中清澈的海水和原始海滩。"
};
var inspiration$6 = {
	lifestyleTravel: "生活方式旅行",
	title: "按您的方式旅行",
	experiences: "{count} 种体验"
};
var categories$6 = {
	adventure: "冒险",
	relaxation: "放松",
	cityLife: "城市生活",
	nature: "自然"
};
var newsletter$6 = {
	title: "不错过任何优惠",
	subtitle: "订阅获取独家航班优惠、酒店折扣和旅行灵感。",
	placeholder: "输入您的邮箱地址",
	subscribeButton: "订阅",
	tagline: "加入50,000+聪明旅行者"
};
var stats$6 = {
	globalDestinations: "全球目的地",
	flightsFilteredDaily: "每日筛选航班",
	secureBookings: "安全预订"
};
var footer$6 = {
	about: "关于我们",
	blog: "博客",
	jobs: "招聘",
	press: "新闻",
	accessibility: "无障碍",
	partners: "合作伙伴",
	rights: "© 2024 Flybeth, Inc. 保留所有权利。"
};
var settings$6 = {
	language: "语言",
	currency: "货币",
	applyChanges: "应用更改"
};
var flightCard$6 = {
	perTraveler: "每位旅客",
	selectFlight: "选择航班",
	nonstop: "直飞",
	stops: "{n} 次中转",
	flight: "航班"
};
var stayCard$6 = {
	nightlyAvg: "每晚均价",
	viewDeal: "查看优惠",
	unnamedProperty: "未命名住宿",
	includesTaxes: "总计 ${total} 含税费",
	off: "优惠 {percent}%"
};
var carCard$6 = {
	orSimilar: "或类似 {category}",
	reviews: "{n} 条评论",
	passengers: "乘客",
	bags: "行李",
	freeCancellation: "免费取消",
	totalPrice: "总价",
	viewDeal: "查看优惠"
};
var emptyState$6 = {
	defaultTitle: "这里还没有内容",
	defaultMessage: "尝试调整搜索筛选条件或浏览我们的热门推荐。"
};
var flightsPage$6 = {
	fromWhere: "从哪里？",
	toWhere: "到哪里？",
	dates: "日期",
	travelers: "旅客",
	travelerPlaceholder: "1位旅客",
	flightsFound: "找到 {n} 个航班",
	filterBy: "筛选",
	stops: "中转",
	nonstop: "直飞",
	oneStop: "1次中转",
	twoPlusStops: "2+次中转",
	airlines: "航空公司",
	noFlightsTitle: "未找到航班",
	noFlightsMessage: "未找到匹配的航班。请尝试不同的机场或日期。",
	explorePopular: "探索热门航线"
};
var staysPage$6 = {
	whereTo: "到哪里？",
	checkIn: "入住",
	guests: "客人",
	guestsPlaceholder: "2位旅客",
	propertiesFound: "找到 {n} 处住宿",
	filterBy: "筛选",
	pricePerNight: "每晚价格",
	lessThan100: "低于$100",
	range100to200: "$100 - $200",
	range200to300: "$200 - $300",
	propertyType: "住宿类型",
	hotelType: "酒店",
	resortType: "度假村",
	apartmentType: "公寓",
	noPropertiesTitle: "未找到住宿",
	noPropertiesMessage: "未找到匹配的住宿。请尝试不同的地点或日期。",
	searchDubai: "搜索迪拜"
};
var carsPage$6 = {
	pickUpLocation: "取车地点",
	pickUpDate: "取车日期",
	carsFound: "找到 {n} 辆车",
	filterBy: "筛选",
	carType: "车型",
	economy: "经济型",
	suv: "SUV",
	luxury: "豪华型",
	transmission: "变速箱",
	automatic: "自动",
	manual: "手动",
	noCarsTitle: "无可用车辆",
	noCarsMessage: "在此地点未找到租车。请尝试其他取车点。",
	searchDubaiAirport: "搜索迪拜机场"
};
var checkout$6 = {
	secureCheckout: "安全结账",
	travelerDetails: "旅客信息",
	firstName: "名",
	lastName: "姓",
	emailAddress: "邮箱地址",
	phoneNumber: "电话号码",
	paymentInfo: "支付信息",
	cardholderName: "持卡人姓名",
	cardNumber: "卡号",
	expirationDate: "有效期",
	cvv: "CVV",
	completeBooking: "完成预订",
	processing: "处理中...",
	termsAgreement: "结账即表示您同意我们的条款和条件。",
	orderSummary: "订单摘要",
	basePrice: "基础价格",
	taxesFees: "税费",
	total: "总计",
	freeCancellation: "24小时内免费取消！"
};
var confirmation$6 = {
	bookingConfirmed: "预订已确认！",
	referenceText: "您的预订参考号为",
	emailSent: "我们已发送确认邮件至您的邮箱。",
	backToHome: "返回首页"
};
var auth$6 = {
	authentication: "身份验证",
	welcomeBack: "欢迎回来",
	noAccount: "还没有账户？",
	registerHere: "在此注册",
	emailAddress: "邮箱地址",
	password: "密码",
	forgotPassword: "忘记密码？",
	signingIn: "登录中...",
	signIn: "登录",
	orContinueWith: "或通过以下方式继续",
	signInGoogle: "使用Google登录",
	getStarted: "开始使用",
	createAccount: "创建账户",
	alreadyHaveAccount: "已有账户？",
	loginHere: "在此登录",
	firstNameLabel: "名",
	lastNameLabel: "姓",
	phoneNumberLabel: "电话号码",
	creatingAccount: "创建账户中...",
	orJoinWith: "或通过以下方式加入",
	signUpGoogle: "使用Google注册",
	accountRecovery: "账户恢复",
	forgotPasswordTitle: "忘记密码",
	rememberedPassword: "想起密码了？",
	sending: "发送中...",
	sendResetLink: "发送重置链接"
};
var authLayout$6 = {
	journeyStarts: "您的旅程从这里开始",
	discover: "发现世界上",
	worldsMost: "最令人",
	breathtaking: "叹为观止的",
	layoutDestinations: "目的地。",
	socialProof: "加入50,000+旅行者，通过Flybeth发现独家优惠和隐藏宝石。",
	trustedWorldwide: "全球信赖",
	averageRating: "4.9 ★ 平均评分",
	travelIntelligence: "旅行智能"
};
var bookingConfirmed$6 = "预订已确认！";
var common$6 = {
	search: "搜索",
	cancel: "取消",
	confirm: "确认",
	close: "关闭",
	loading: "加载中...",
	error: "错误",
	success: "成功"
};
const locale_zh_46json_3de7943d = {
	hero: hero$6,
	nav: nav$6,
	search: search$6,
	marketing: marketing$6,
	offers: offers$6,
	promo: promo$6,
	destinations: destinations$6,
	inspiration: inspiration$6,
	categories: categories$6,
	newsletter: newsletter$6,
	stats: stats$6,
	footer: footer$6,
	settings: settings$6,
	flightCard: flightCard$6,
	stayCard: stayCard$6,
	carCard: carCard$6,
	emptyState: emptyState$6,
	flightsPage: flightsPage$6,
	staysPage: staysPage$6,
	carsPage: carsPage$6,
	checkout: checkout$6,
	confirmation: confirmation$6,
	auth: auth$6,
	authLayout: authLayout$6,
	bookingConfirmed: bookingConfirmed$6,
	common: common$6
};

var hero$5 = {
	title1: "500以上の航空会社で格安航空券を予約！",
	title2: "500社以上の航空会社！",
	award: "Global Travel受賞",
	since: "2024年から"
};
var nav$5 = {
	stays: "宿泊",
	flights: "フライト",
	cars: "レンタカー",
	packages: "パッケージ",
	cruises: "クルーズ",
	signIn: "ログイン",
	explorer: "エクスプローラー",
	logout: {
		title: "もうお帰りですか？",
		message: "Flybethアカウントからログアウトしようとしています。保存されていない変更は失われます。お戻りをお待ちしています！✈️",
		confirm: "ログアウト",
		cancel: "残る"
	},
	exit: {
		title: "待って、行かないで！",
		message: "アクティブなセッションがあります。Flybethを離れてもよろしいですか？",
		confirm: "離れる",
		cancel: "ここに残る"
	}
};
var search$5 = {
	tabs: {
		flights: "フライト",
		holidays: "ホリデー",
		hotels: "ホテル",
		cruises: "クルーズ",
		cars: "レンタカー"
	},
	labels: {
		from: "出発地",
		to: "到着地",
		where: "どこに行きますか？",
		departure: "出発日",
		"return": "帰着日",
		departure_return: "出発 — 帰着",
		departure_date: "出発日",
		passengers: "乗客",
		cabin: "客室クラス",
		letsgo: "出発！",
		singleHotel: "シングルホテル",
		multiHotel: "マルチホテル",
		checkInCheckOut: "チェックイン - チェックアウト",
		travelersRooms: "旅行者と部屋",
		bundleSave: "まとめて割引",
		addFlight: "フライトを追加",
		addCar: "レンタカーを追加",
		addHotel: "ホテルを追加",
		directFlightsOnly: "直行便のみ",
		rentalCars: "レンタカー",
		airportRides: "空港送迎",
		pickUp: "ピックアップ",
		whereFrom: "どこから？",
		whereTo: "どこへ？",
		cityOrAirport: "都市または空港",
		addressOrHotel: "住所またはホテル",
		dropOffLocation: "返却場所",
		rentalDates: "レンタル期間",
		pickUpDate: "受取日",
		pickUpTime: "受取時間",
		differentDropOff: "異なる返却場所",
		bundle: "パッケージ",
		hotel: "ホテル",
		flight: "フライト",
		whereFromQuestion: "どこから？",
		whereToQuestion: "どこへ？",
		stayDates: "宿泊日程",
		travelDates: "旅行日程",
		partialHotelStay: "部分的ホテル滞在",
		differentCarDropOff: "異なる車両返却",
		saveBundleMsg: "まとめて予約で最大$625お得！",
		rooms: "部屋",
		adults: "大人",
		children: "子供",
		apply: "適用",
		multiRoomNote: "マルチルームパッケージは合計8名様までです。",
		search: "検索",
		updateSearch: "検索を更新"
	},
	placeholders: {
		origin: "都市または空港",
		destination: "目的地、都市またはホテル"
	},
	packages: {
		hotel_flight: "ホテル + フライト",
		hotel_flight_car: "ホテル + フライト + レンタカー",
		flight_car: "フライト + レンタカー",
		hotel_car: "ホテル + レンタカー"
	},
	cruises: {
		title: "ラグジュアリーに出航。",
		expertAdvice: "専門家相談：1-866-403-9848",
		goingTo: "目的地",
		destinationAny: "目的地（すべて）",
		departingBetween: "出発期間",
		selectMonth: "月を選択",
		cruiseLine: "クルーズライン",
		anyCruiseLine: "すべてのライン",
		viewLuxurySuites: "ラグジュアリースイートを見る",
		familyDeals: "ファミリーディール"
	},
	flightModes: {
		roundtrip: "往復",
		oneway: "片道",
		multicity: "周遊"
	}
};
var marketing$5 = {
	helpTitle: "お得な情報をお探しですか？",
	helpSub: "今すぐ予約 - 24時間いつでもお電話ください",
	benefits: {
		deals: "電話限定のお得な情報",
		assist: "パーソナライズされた旅行支援",
		cancel: "24時間キャンセル",
		rewards: "ClubMilesポイント2倍"
	},
	speakExperts: "旅行の専門家にご相談ください"
};
var offers$5 = {
	trending: "人気のホリデーオファー",
	smarter: "よりスマートな運賃。より快適な着陸。",
	smarterSub: "あなたの時間を大切にする旅。",
	majestic: "すべてのマイルが壮大！",
	majesticSub: "エミレーツで飛ぶ。動きの中の優雅さ。",
	learn: "詳細を見る",
	book: "今すぐ予約"
};
var promo$5 = {
	matchday: "試合の日を旅行に — 夏のお得情報をゲット。",
	findDeals: "お得情報を探す"
};
var destinations$5 = {
	globalExploration: "世界探検",
	mostLoved: "最も愛される",
	destinations: "目的地",
	description: "キュレーターが厳選したフライト、ホテル、体験を予約して、最も忘れられない旅を。",
	startingFrom: "{price}から",
	parisDesc: "象徴的なランドマークと世界クラスの料理で待つ光の都市。",
	dubaiDesc: "ラグジュアリーショッピング、超近代的建築、活気あるナイトライフを体験。",
	maldivesDesc: "トロピカルパラダイスの透き通った海と手つかずのビーチ。"
};
var inspiration$5 = {
	lifestyleTravel: "ライフスタイルトラベル",
	title: "あなたらしく旅する",
	experiences: "{count} の体験"
};
var categories$5 = {
	adventure: "アドベンチャー",
	relaxation: "リラクゼーション",
	cityLife: "シティライフ",
	nature: "自然"
};
var newsletter$5 = {
	title: "お得情報を見逃さない",
	subtitle: "限定フライトディール、ホテル割引、旅のインスピレーションをお届けします。",
	placeholder: "メールアドレスを入力",
	subscribeButton: "登録",
	tagline: "50,000人以上の賢い旅行者に参加"
};
var stats$5 = {
	globalDestinations: "世界の目的地",
	flightsFilteredDaily: "毎日フィルタリングされるフライト",
	secureBookings: "安全な予約"
};
var footer$5 = {
	about: "会社概要",
	blog: "ブログ",
	jobs: "採用情報",
	press: "プレス",
	accessibility: "アクセシビリティ",
	partners: "パートナー",
	rights: "© 2024 Flybeth, Inc. All rights reserved."
};
var settings$5 = {
	language: "言語",
	currency: "通貨",
	applyChanges: "変更を適用"
};
var flightCard$5 = {
	perTraveler: "1名あたり",
	selectFlight: "フライトを選択",
	nonstop: "直行便",
	stops: "{n} 回乗り継ぎ",
	flight: "フライト"
};
var stayCard$5 = {
	nightlyAvg: "1泊平均",
	viewDeal: "詳細を見る",
	unnamedProperty: "名前なし宿泊施設",
	includesTaxes: "合計 ${total} 税込",
	off: "{percent}% OFF"
};
var carCard$5 = {
	orSimilar: "または類似 {category}",
	reviews: "{n} 件のレビュー",
	passengers: "乗客",
	bags: "荷物",
	freeCancellation: "無料キャンセル",
	totalPrice: "総額",
	viewDeal: "詳細を見る"
};
var emptyState$5 = {
	defaultTitle: "まだ何もありません",
	defaultMessage: "検索フィルターを調整するか、人気のおすすめをご覧ください。"
};
var flightsPage$5 = {
	fromWhere: "どこから？",
	toWhere: "どこへ？",
	dates: "日付",
	travelers: "旅行者",
	travelerPlaceholder: "1名",
	flightsFound: "{n} 件のフライトが見つかりました",
	filterBy: "絞り込み",
	stops: "乗り継ぎ",
	nonstop: "直行便",
	oneStop: "1回乗り継ぎ",
	twoPlusStops: "2回以上乗り継ぎ",
	airlines: "航空会社",
	noFlightsTitle: "フライトが見つかりません",
	noFlightsMessage: "条件に合うフライトが見つかりませんでした。別の空港や日付をお試しください。",
	explorePopular: "人気のルートを探す"
};
var staysPage$5 = {
	whereTo: "どこへ？",
	checkIn: "チェックイン",
	guests: "ゲスト",
	guestsPlaceholder: "2名",
	propertiesFound: "{n} 件の宿泊施設が見つかりました",
	filterBy: "絞り込み",
	pricePerNight: "1泊あたりの料金",
	lessThan100: "$100未満",
	range100to200: "$100 - $200",
	range200to300: "$200 - $300",
	propertyType: "施設タイプ",
	hotelType: "ホテル",
	resortType: "リゾート",
	apartmentType: "アパートメント",
	noPropertiesTitle: "宿泊施設が見つかりません",
	noPropertiesMessage: "条件に合う宿泊施設が見つかりませんでした。別の場所や日付をお試しください。",
	searchDubai: "ドバイを検索"
};
var carsPage$5 = {
	pickUpLocation: "ピックアップ場所",
	pickUpDate: "受取日",
	carsFound: "{n} 台の車が見つかりました",
	filterBy: "絞り込み",
	carType: "車種",
	economy: "エコノミー",
	suv: "SUV",
	luxury: "ラグジュアリー",
	transmission: "トランスミッション",
	automatic: "オートマチック",
	manual: "マニュアル",
	noCarsTitle: "利用可能な車がありません",
	noCarsMessage: "この場所でレンタカーが見つかりませんでした。別の場所をお試しください。",
	searchDubaiAirport: "ドバイ空港を検索"
};
var checkout$5 = {
	secureCheckout: "安全なお支払い",
	travelerDetails: "旅行者情報",
	firstName: "名",
	lastName: "姓",
	emailAddress: "メールアドレス",
	phoneNumber: "電話番号",
	paymentInfo: "お支払い情報",
	cardholderName: "カード名義",
	cardNumber: "カード番号",
	expirationDate: "有効期限",
	cvv: "CVV",
	completeBooking: "予約を完了",
	processing: "処理中...",
	termsAgreement: "お支払いにより、利用規約に同意したものとみなされます。",
	orderSummary: "注文概要",
	basePrice: "基本料金",
	taxesFees: "税金・手数料",
	total: "合計",
	freeCancellation: "24時間以内の無料キャンセル！"
};
var confirmation$5 = {
	bookingConfirmed: "予約確認済み！",
	referenceText: "ご予約の参照番号は",
	emailSent: "確認メールを送信しました。",
	backToHome: "ホームに戻る"
};
var auth$5 = {
	authentication: "認証",
	welcomeBack: "おかえりなさい",
	noAccount: "アカウントをお持ちでないですか？",
	registerHere: "こちらで登録",
	emailAddress: "メールアドレス",
	password: "パスワード",
	forgotPassword: "パスワードをお忘れですか？",
	signingIn: "ログイン中...",
	signIn: "ログイン",
	orContinueWith: "または次で続行",
	signInGoogle: "Googleでログイン",
	getStarted: "はじめる",
	createAccount: "アカウント作成",
	alreadyHaveAccount: "既にアカウントをお持ちですか？",
	loginHere: "こちらでログイン",
	firstNameLabel: "名",
	lastNameLabel: "姓",
	phoneNumberLabel: "電話番号",
	creatingAccount: "アカウント作成中...",
	orJoinWith: "または次で参加",
	signUpGoogle: "Googleで登録",
	accountRecovery: "アカウント復旧",
	forgotPasswordTitle: "パスワードを忘れた",
	rememberedPassword: "パスワードを思い出しましたか？",
	sending: "送信中...",
	sendResetLink: "リセットリンクを送信"
};
var authLayout$5 = {
	journeyStarts: "旅はここから始まります",
	discover: "世界で最も",
	worldsMost: "息をのむほど美しい",
	breathtaking: "目的地を",
	layoutDestinations: "発見しよう。",
	socialProof: "50,000人以上の旅行者がFlybethで限定ディールを見つけています。",
	trustedWorldwide: "世界中で信頼",
	averageRating: "4.9 ★ 平均評価",
	travelIntelligence: "トラベルインテリジェンス"
};
var bookingConfirmed$5 = "予約確認済み！";
var common$5 = {
	search: "検索",
	cancel: "キャンセル",
	confirm: "確認",
	close: "閉じる",
	loading: "読み込み中...",
	error: "エラー",
	success: "成功"
};
const locale_ja_46json_15d23fe3 = {
	hero: hero$5,
	nav: nav$5,
	search: search$5,
	marketing: marketing$5,
	offers: offers$5,
	promo: promo$5,
	destinations: destinations$5,
	inspiration: inspiration$5,
	categories: categories$5,
	newsletter: newsletter$5,
	stats: stats$5,
	footer: footer$5,
	settings: settings$5,
	flightCard: flightCard$5,
	stayCard: stayCard$5,
	carCard: carCard$5,
	emptyState: emptyState$5,
	flightsPage: flightsPage$5,
	staysPage: staysPage$5,
	carsPage: carsPage$5,
	checkout: checkout$5,
	confirmation: confirmation$5,
	auth: auth$5,
	authLayout: authLayout$5,
	bookingConfirmed: bookingConfirmed$5,
	common: common$5
};

var hero$4 = {
	title1: "Reserve voos baratos em mais de",
	title2: "500 companhias aéreas!",
	award: "Premiado pelo Global Travel",
	since: "Desde 2024"
};
var nav$4 = {
	stays: "Hospedagens",
	flights: "Voos",
	cars: "Carros",
	packages: "Pacotes",
	cruises: "Cruzeiros",
	signIn: "Entrar",
	explorer: "Explorador",
	logout: {
		title: "Já vai embora?",
		message: "Você está prestes a sair da sua conta Flybeth. Alterações não salvas serão perdidas. Estaremos aqui quando voltar! ✈️",
		confirm: "Sair",
		cancel: "Ficar"
	},
	exit: {
		title: "Espere, não vá!",
		message: "Você tem uma sessão ativa. Tem certeza de que deseja sair do Flybeth?",
		confirm: "Sair",
		cancel: "Ficar aqui"
	}
};
var search$4 = {
	tabs: {
		flights: "Voos",
		holidays: "Férias",
		hotels: "Hotéis",
		cruises: "Cruzeiros",
		cars: "Carros"
	},
	labels: {
		from: "Saindo de",
		to: "Indo para",
		where: "Para onde você vai?",
		departure: "Data de Partida",
		"return": "Data de Retorno",
		departure_return: "Ida — Volta",
		departure_date: "Data de Partida",
		passengers: "Passageiros",
		cabin: "Classe",
		letsgo: "VAMOS!",
		singleHotel: "Hotel Único",
		multiHotel: "Múltiplos Hotéis",
		checkInCheckOut: "Check-in - Check-out",
		travelersRooms: "Viajantes e Quartos",
		bundleSave: "Combine e Economize",
		addFlight: "Adicionar voo",
		addCar: "Adicionar carro",
		addHotel: "Adicionar Hotel",
		directFlightsOnly: "Somente Voos Diretos",
		rentalCars: "Carros de aluguel",
		airportRides: "Traslado aeroporto",
		pickUp: "Retirada",
		whereFrom: "De onde?",
		whereTo: "Para onde?",
		cityOrAirport: "Cidade ou aeroporto",
		addressOrHotel: "Endereço ou hotel",
		dropOffLocation: "Local de devolução",
		rentalDates: "Datas de Aluguel",
		pickUpDate: "Data de retirada",
		pickUpTime: "Horário de retirada",
		differentDropOff: "Local de devolução diferente",
		bundle: "Pacote",
		hotel: "Hotel",
		flight: "Voo",
		whereFromQuestion: "De onde?",
		whereToQuestion: "Para onde?",
		stayDates: "Datas de Estadia",
		travelDates: "Datas de Viagem",
		partialHotelStay: "Estadia parcial no hotel",
		differentCarDropOff: "Devolução de carro diferente",
		saveBundleMsg: "Economize até $625 combinando sua viagem!",
		rooms: "Quartos",
		adults: "Adultos",
		children: "Crianças",
		apply: "Aplicar",
		multiRoomNote: "Pacotes multi-quartos são limitados a 8 viajantes.",
		search: "Buscar",
		updateSearch: "Atualizar Busca"
	},
	placeholders: {
		origin: "Cidade ou Aeroporto",
		destination: "Destino, Cidade ou Hotel"
	},
	packages: {
		hotel_flight: "Hotel + Voo",
		hotel_flight_car: "Hotel + Voo + Carro",
		flight_car: "Voo + Carro",
		hotel_car: "Hotel + Carro"
	},
	cruises: {
		title: "Navegue no Luxo.",
		expertAdvice: "Consultoria Especializada: 1-866-403-9848",
		goingTo: "Destino",
		destinationAny: "Destino (Todos)",
		departingBetween: "Partindo entre",
		selectMonth: "Selecionar Mês",
		cruiseLine: "Linha de Cruzeiro",
		anyCruiseLine: "Qualquer Linha",
		viewLuxurySuites: "Ver Suítes de Luxo",
		familyDeals: "Ofertas Familiares"
	},
	flightModes: {
		roundtrip: "Ida e Volta",
		oneway: "Somente Ida",
		multicity: "Múltiplas Cidades"
	}
};
var marketing$4 = {
	helpTitle: "Precisa de ajuda para encontrar ofertas?",
	helpSub: "Reserve agora - Ligue a qualquer hora",
	benefits: {
		deals: "Ofertas exclusivas por telefone",
		assist: "Assistência de viagem personalizada",
		cancel: "Cancelamento em 24 horas",
		rewards: "Pontos ClubMiles em dobro"
	},
	speakExperts: "Fale com nossos consultores de viagem"
};
var offers$4 = {
	trending: "Ofertas de Férias em Alta",
	smarter: "Tarifas mais inteligentes. Pousos mais suaves.",
	smarterSub: "Viagens que valorizam seu tempo.",
	majestic: "Cada milha é majestosa!",
	majesticSub: "Voe Emirates. Elegância em movimento.",
	learn: "Saiba mais",
	book: "Reserve agora"
};
var promo$4 = {
	matchday: "Transforme o dia do jogo em uma viagem — aproveite as ofertas de verão.",
	findDeals: "Ver ofertas"
};
var destinations$4 = {
	globalExploration: "Exploração Global",
	mostLoved: "Mais Amados",
	destinations: "Destinos",
	description: "Reserve voos, hotéis e experiências selecionados para as viagens mais inesquecíveis.",
	startingFrom: "A partir de {price}",
	parisDesc: "A cidade luz espera com seus marcos icônicos e culinária de classe mundial.",
	dubaiDesc: "Experimente compras de luxo, arquitetura ultramoderna e vida noturna vibrante.",
	maldivesDesc: "Águas cristalinas e praias intocadas em um paraíso tropical."
};
var inspiration$4 = {
	lifestyleTravel: "Viagem Lifestyle",
	title: "Viaje do Seu Jeito",
	experiences: "{count} Experiências"
};
var categories$4 = {
	adventure: "Aventura",
	relaxation: "Relaxamento",
	cityLife: "Vida Urbana",
	nature: "Natureza"
};
var newsletter$4 = {
	title: "Não Perca Nenhuma Oferta",
	subtitle: "Inscreva-se para receber ofertas exclusivas de voos, descontos em hotéis e inspiração de viagem.",
	placeholder: "Digite seu e-mail",
	subscribeButton: "Inscrever-se",
	tagline: "Junte-se a mais de 50.000 viajantes inteligentes"
};
var stats$4 = {
	globalDestinations: "Destinos Globais",
	flightsFilteredDaily: "Voos Filtrados Diariamente",
	secureBookings: "Reservas Seguras"
};
var footer$4 = {
	about: "Sobre",
	blog: "Blog",
	jobs: "Carreiras",
	press: "Imprensa",
	accessibility: "Acessibilidade",
	partners: "Parceiros",
	rights: "© 2024 Flybeth, Inc. Todos os direitos reservados."
};
var settings$4 = {
	language: "Idioma",
	currency: "Moeda",
	applyChanges: "Aplicar Alterações"
};
var flightCard$4 = {
	perTraveler: "por viajante",
	selectFlight: "Selecionar Voo",
	nonstop: "Direto",
	stops: "{n} escala(s)",
	flight: "Voo"
};
var stayCard$4 = {
	nightlyAvg: "Média por noite",
	viewDeal: "Ver Oferta",
	unnamedProperty: "Propriedade sem nome",
	includesTaxes: "Total ${total} inclui taxas",
	off: "{percent}% OFF"
};
var carCard$4 = {
	orSimilar: "ou similar {category}",
	reviews: "{n} avaliações",
	passengers: "Passageiros",
	bags: "Bagagem",
	freeCancellation: "Cancelamento Gratuito",
	totalPrice: "Preço Total",
	viewDeal: "Ver Oferta"
};
var emptyState$4 = {
	defaultTitle: "Nada aqui ainda",
	defaultMessage: "Tente ajustar seus filtros de busca ou explore nossas recomendações populares."
};
var flightsPage$4 = {
	fromWhere: "De onde?",
	toWhere: "Para onde?",
	dates: "Datas",
	travelers: "Viajantes",
	travelerPlaceholder: "1 viajante",
	flightsFound: "{n} voos encontrados",
	filterBy: "Filtrar por",
	stops: "Escalas",
	nonstop: "Direto",
	oneStop: "1 Escala",
	twoPlusStops: "2+ Escalas",
	airlines: "Companhias Aéreas",
	noFlightsTitle: "Nenhum voo encontrado",
	noFlightsMessage: "Não encontramos voos correspondentes. Tente aeroportos ou datas diferentes.",
	explorePopular: "Explorar Rotas Populares"
};
var staysPage$4 = {
	whereTo: "Para onde?",
	checkIn: "Check-in",
	guests: "Hóspedes",
	guestsPlaceholder: "2 viajantes",
	propertiesFound: "{n} propriedades encontradas",
	filterBy: "Filtrar por",
	pricePerNight: "Preço por noite",
	lessThan100: "Menos de $100",
	range100to200: "$100 - $200",
	range200to300: "$200 - $300",
	propertyType: "Tipo de Propriedade",
	hotelType: "Hotel",
	resortType: "Resort",
	apartmentType: "Apartamento",
	noPropertiesTitle: "Nenhuma propriedade encontrada",
	noPropertiesMessage: "Não encontramos hospedagens correspondentes. Tente outro local ou ajuste suas datas.",
	searchDubai: "Buscar Dubai"
};
var carsPage$4 = {
	pickUpLocation: "Local de retirada",
	pickUpDate: "Data de Retirada",
	carsFound: "{n} carros encontrados",
	filterBy: "Filtrar por",
	carType: "Tipo de Carro",
	economy: "Econômico",
	suv: "SUV",
	luxury: "Luxo",
	transmission: "Câmbio",
	automatic: "Automático",
	manual: "Manual",
	noCarsTitle: "Nenhum carro disponível",
	noCarsMessage: "Não encontramos carros de aluguel neste local. Tente outro ponto de retirada.",
	searchDubaiAirport: "Buscar Aeroporto de Dubai"
};
var checkout$4 = {
	secureCheckout: "Pagamento Seguro",
	travelerDetails: "Dados do Viajante",
	firstName: "Nome",
	lastName: "Sobrenome",
	emailAddress: "E-mail",
	phoneNumber: "Telefone",
	paymentInfo: "Informações de Pagamento",
	cardholderName: "Nome no Cartão",
	cardNumber: "Número do Cartão",
	expirationDate: "Data de Validade",
	cvv: "CVV",
	completeBooking: "Concluir Reserva",
	processing: "Processando...",
	termsAgreement: "Ao pagar, você concorda com nossos Termos e Condições.",
	orderSummary: "Resumo do Pedido",
	basePrice: "Preço Base",
	taxesFees: "Taxas e Impostos",
	total: "Total",
	freeCancellation: "Cancelamento grátis em 24 horas!"
};
var confirmation$4 = {
	bookingConfirmed: "Reserva Confirmada!",
	referenceText: "Sua referência de reserva é",
	emailSent: "Enviamos um e-mail de confirmação.",
	backToHome: "Voltar ao Início"
};
var auth$4 = {
	authentication: "Autenticação",
	welcomeBack: "Bem-vindo de Volta",
	noAccount: "Não tem uma conta?",
	registerHere: "Registre-se aqui",
	emailAddress: "E-mail",
	password: "Senha",
	forgotPassword: "Esqueceu a senha?",
	signingIn: "Entrando...",
	signIn: "Entrar",
	orContinueWith: "Ou continue com",
	signInGoogle: "Entrar com Google",
	getStarted: "Começar",
	createAccount: "Criar Conta",
	alreadyHaveAccount: "Já tem uma conta?",
	loginHere: "Entre aqui",
	firstNameLabel: "Nome",
	lastNameLabel: "Sobrenome",
	phoneNumberLabel: "Telefone",
	creatingAccount: "Criando conta...",
	orJoinWith: "Ou junte-se com",
	signUpGoogle: "Registrar com Google",
	accountRecovery: "Recuperação de Conta",
	forgotPasswordTitle: "Esqueci a Senha",
	rememberedPassword: "Lembrou da senha?",
	sending: "Enviando...",
	sendResetLink: "Enviar Link de Redefinição"
};
var authLayout$4 = {
	journeyStarts: "Sua Jornada Começa Aqui",
	discover: "Descubra os",
	worldsMost: "destinos mais",
	breathtaking: "deslumbrantes",
	layoutDestinations: "do mundo.",
	socialProof: "Junte-se a mais de 50.000 viajantes encontrando ofertas exclusivas com o Flybeth.",
	trustedWorldwide: "Confiança mundial",
	averageRating: "4.9 ★ Avaliação Média",
	travelIntelligence: "Inteligência de Viagem"
};
var bookingConfirmed$4 = "Reserva Confirmada!";
var common$4 = {
	search: "Buscar",
	cancel: "Cancelar",
	confirm: "Confirmar",
	close: "Fechar",
	loading: "Carregando...",
	error: "Erro",
	success: "Sucesso"
};
const locale_pt_46json_47d3ea2b = {
	hero: hero$4,
	nav: nav$4,
	search: search$4,
	marketing: marketing$4,
	offers: offers$4,
	promo: promo$4,
	destinations: destinations$4,
	inspiration: inspiration$4,
	categories: categories$4,
	newsletter: newsletter$4,
	stats: stats$4,
	footer: footer$4,
	settings: settings$4,
	flightCard: flightCard$4,
	stayCard: stayCard$4,
	carCard: carCard$4,
	emptyState: emptyState$4,
	flightsPage: flightsPage$4,
	staysPage: staysPage$4,
	carsPage: carsPage$4,
	checkout: checkout$4,
	confirmation: confirmation$4,
	auth: auth$4,
	authLayout: authLayout$4,
	bookingConfirmed: bookingConfirmed$4,
	common: common$4
};

var hero$3 = {
	title1: "Prenota voli economici su oltre",
	title2: "500 compagnie aeree!",
	award: "Premiato da Global Travel",
	since: "Dal 2024"
};
var nav$3 = {
	stays: "Soggiorni",
	flights: "Voli",
	cars: "Auto",
	packages: "Pacchetti",
	cruises: "Crociere",
	signIn: "Accedi",
	explorer: "Esploratore",
	logout: {
		title: "Te ne vai già?",
		message: "Stai per disconnetterti dal tuo account Flybeth. Le modifiche non salvate andranno perse. Ti aspettiamo al tuo ritorno! ✈️",
		confirm: "Esci",
		cancel: "Resta"
	},
	exit: {
		title: "Aspetta, non andare!",
		message: "Hai una sessione attiva. Sei sicuro di voler lasciare Flybeth?",
		confirm: "Lascia",
		cancel: "Resta qui"
	}
};
var search$3 = {
	tabs: {
		flights: "Voli",
		holidays: "Vacanze",
		hotels: "Hotel",
		cruises: "Crociere",
		cars: "Auto"
	},
	labels: {
		from: "Partenza da",
		to: "Destinazione",
		where: "Dove stai andando?",
		departure: "Data di Partenza",
		"return": "Data di Ritorno",
		departure_return: "Andata — Ritorno",
		departure_date: "Data di Partenza",
		passengers: "Passeggeri",
		cabin: "Classe",
		letsgo: "PARTIAMO!",
		singleHotel: "Hotel Singolo",
		multiHotel: "Multi Hotel",
		checkInCheckOut: "Check-in - Check-out",
		travelersRooms: "Viaggiatori e Camere",
		bundleSave: "Combina e Risparmia",
		addFlight: "Aggiungi un volo",
		addCar: "Aggiungi un'auto",
		addHotel: "Aggiungi Hotel",
		directFlightsOnly: "Solo Voli Diretti",
		rentalCars: "Auto a noleggio",
		airportRides: "Transfer aeroporto",
		pickUp: "Ritiro",
		whereFrom: "Da dove?",
		whereTo: "Dove?",
		cityOrAirport: "Città o aeroporto",
		addressOrHotel: "Indirizzo o hotel",
		dropOffLocation: "Luogo di riconsegna",
		rentalDates: "Date Noleggio",
		pickUpDate: "Data di ritiro",
		pickUpTime: "Ora di ritiro",
		differentDropOff: "Luogo di riconsegna diverso",
		bundle: "Pacchetto",
		hotel: "Hotel",
		flight: "Volo",
		whereFromQuestion: "Da dove?",
		whereToQuestion: "Dove?",
		stayDates: "Date Soggiorno",
		travelDates: "Date Viaggio",
		partialHotelStay: "Soggiorno parziale in hotel",
		differentCarDropOff: "Riconsegna auto diversa",
		saveBundleMsg: "Risparmia fino a $625 combinando il tuo viaggio!",
		rooms: "Camere",
		adults: "Adulti",
		children: "Bambini",
		apply: "Applica",
		multiRoomNote: "I pacchetti multi-camera sono limitati a 8 viaggiatori.",
		search: "Cerca",
		updateSearch: "Aggiorna Ricerca"
	},
	placeholders: {
		origin: "Città o Aeroporto",
		destination: "Destinazione, Città o Hotel"
	},
	packages: {
		hotel_flight: "Hotel + Volo",
		hotel_flight_car: "Hotel + Volo + Auto",
		flight_car: "Volo + Auto",
		hotel_car: "Hotel + Auto"
	},
	cruises: {
		title: "Salpa nel Lusso.",
		expertAdvice: "Consulenza Esperta: 1-866-403-9848",
		goingTo: "Destinazione",
		destinationAny: "Destinazione (Tutte)",
		departingBetween: "Partenza tra",
		selectMonth: "Seleziona Mese",
		cruiseLine: "Compagnia Crociera",
		anyCruiseLine: "Qualsiasi Compagnia",
		viewLuxurySuites: "Vedi Suite di Lusso",
		familyDeals: "Offerte Famiglia"
	},
	flightModes: {
		roundtrip: "Andata e Ritorno",
		oneway: "Solo Andata",
		multicity: "Multi-Città"
	}
};
var marketing$3 = {
	helpTitle: "Serve aiuto per trovare offerte?",
	helpSub: "Prenota ora - Chiamaci in qualsiasi momento",
	benefits: {
		deals: "Offerte esclusive telefoniche",
		assist: "Assistenza viaggio personalizzata",
		cancel: "Cancellazione entro 24 ore",
		rewards: "Punti ClubMiles doppi"
	},
	speakExperts: "Parla con i nostri esperti di viaggio"
};
var offers$3 = {
	trending: "Offerte Vacanze di Tendenza",
	smarter: "Tariffe più intelligenti. Atterraggi più morbidi.",
	smarterSub: "Viaggi che valorizzano il tuo tempo.",
	majestic: "Ogni miglio è maestoso!",
	majesticSub: "Vola Emirates. Eleganza in movimento.",
	learn: "Scopri di più",
	book: "Prenota ora"
};
var promo$3 = {
	matchday: "Trasforma la giornata sportiva in una vacanza — risparmia d'estate.",
	findDeals: "Trova offerte"
};
var destinations$3 = {
	globalExploration: "Esplorazione Globale",
	mostLoved: "Più Amate",
	destinations: "Destinazioni",
	description: "Prenota voli, hotel ed esperienze selezionate per i viaggi più indimenticabili.",
	startingFrom: "A partire da {price}",
	parisDesc: "La città delle luci vi aspetta con i suoi monumenti iconici e la cucina mondiale.",
	dubaiDesc: "Scopri lo shopping di lusso, l'architettura ultramoderna e una vivace vita notturna.",
	maldivesDesc: "Acque cristalline e spiagge incontaminate in un paradiso tropicale."
};
var inspiration$3 = {
	lifestyleTravel: "Viaggio Lifestyle",
	title: "Viaggia a Modo Tuo",
	experiences: "{count} Esperienze"
};
var categories$3 = {
	adventure: "Avventura",
	relaxation: "Relax",
	cityLife: "Vita Cittadina",
	nature: "Natura"
};
var newsletter$3 = {
	title: "Non Perdere Nessuna Offerta",
	subtitle: "Iscriviti per ricevere offerte esclusive su voli, sconti hotel e ispirazione di viaggio.",
	placeholder: "Inserisci la tua e-mail",
	subscribeButton: "Iscriviti",
	tagline: "Unisciti a oltre 50.000 viaggiatori intelligenti"
};
var stats$3 = {
	globalDestinations: "Destinazioni Globali",
	flightsFilteredDaily: "Voli Filtrati Quotidianamente",
	secureBookings: "Prenotazioni Sicure"
};
var footer$3 = {
	about: "Chi Siamo",
	blog: "Blog",
	jobs: "Lavora con Noi",
	press: "Stampa",
	accessibility: "Accessibilità",
	partners: "Partner",
	rights: "© 2024 Flybeth, Inc. Tutti i diritti riservati."
};
var settings$3 = {
	language: "Lingua",
	currency: "Valuta",
	applyChanges: "Applica Modifiche"
};
var flightCard$3 = {
	perTraveler: "per viaggiatore",
	selectFlight: "Seleziona Volo",
	nonstop: "Diretto",
	stops: "{n} scalo/i",
	flight: "Volo"
};
var stayCard$3 = {
	nightlyAvg: "Media a notte",
	viewDeal: "Vedi Offerta",
	unnamedProperty: "Struttura senza nome",
	includesTaxes: "Totale ${total} tasse incluse",
	off: "{percent}% SCONTO"
};
var carCard$3 = {
	orSimilar: "o simile {category}",
	reviews: "{n} recensioni",
	passengers: "Passeggeri",
	bags: "Bagagli",
	freeCancellation: "Cancellazione Gratuita",
	totalPrice: "Prezzo Totale",
	viewDeal: "Vedi Offerta"
};
var emptyState$3 = {
	defaultTitle: "Niente qui ancora",
	defaultMessage: "Prova a modificare i filtri di ricerca o esplora le nostre raccomandazioni."
};
var flightsPage$3 = {
	fromWhere: "Da dove?",
	toWhere: "Dove?",
	dates: "Date",
	travelers: "Viaggiatori",
	travelerPlaceholder: "1 viaggiatore",
	flightsFound: "{n} voli trovati",
	filterBy: "Filtra per",
	stops: "Scali",
	nonstop: "Diretto",
	oneStop: "1 Scalo",
	twoPlusStops: "2+ Scali",
	airlines: "Compagnie Aeree",
	noFlightsTitle: "Nessun volo trovato",
	noFlightsMessage: "Non abbiamo trovato voli corrispondenti. Prova aeroporti o date diverse.",
	explorePopular: "Esplora Rotte Popolari"
};
var staysPage$3 = {
	whereTo: "Dove?",
	checkIn: "Check-in",
	guests: "Ospiti",
	guestsPlaceholder: "2 viaggiatori",
	propertiesFound: "{n} strutture trovate",
	filterBy: "Filtra per",
	pricePerNight: "Prezzo per notte",
	lessThan100: "Meno di $100",
	range100to200: "$100 - $200",
	range200to300: "$200 - $300",
	propertyType: "Tipo Struttura",
	hotelType: "Hotel",
	resortType: "Resort",
	apartmentType: "Appartamento",
	noPropertiesTitle: "Nessuna struttura trovata",
	noPropertiesMessage: "Non abbiamo trovato strutture corrispondenti. Prova un'altra località o modifica le date.",
	searchDubai: "Cerca Dubai"
};
var carsPage$3 = {
	pickUpLocation: "Luogo di ritiro",
	pickUpDate: "Data di Ritiro",
	carsFound: "{n} auto trovate",
	filterBy: "Filtra per",
	carType: "Tipo Auto",
	economy: "Economy",
	suv: "SUV",
	luxury: "Lusso",
	transmission: "Cambio",
	automatic: "Automatico",
	manual: "Manuale",
	noCarsTitle: "Nessuna auto disponibile",
	noCarsMessage: "Non abbiamo trovato auto a noleggio. Prova un altro luogo di ritiro.",
	searchDubaiAirport: "Cerca Aeroporto Dubai"
};
var checkout$3 = {
	secureCheckout: "Pagamento Sicuro",
	travelerDetails: "Dati Viaggiatore",
	firstName: "Nome",
	lastName: "Cognome",
	emailAddress: "E-mail",
	phoneNumber: "Telefono",
	paymentInfo: "Informazioni di Pagamento",
	cardholderName: "Nome Titolare",
	cardNumber: "Numero Carta",
	expirationDate: "Scadenza",
	cvv: "CVV",
	completeBooking: "Completa Prenotazione",
	processing: "Elaborazione...",
	termsAgreement: "Pagando accetti i nostri Termini e Condizioni.",
	orderSummary: "Riepilogo Ordine",
	basePrice: "Prezzo Base",
	taxesFees: "Tasse e Commissioni",
	total: "Totale",
	freeCancellation: "Cancellazione gratuita entro 24 ore!"
};
var confirmation$3 = {
	bookingConfirmed: "Prenotazione Confermata!",
	referenceText: "Il tuo riferimento è",
	emailSent: "Abbiamo inviato un'e-mail di conferma.",
	backToHome: "Torna alla Home"
};
var auth$3 = {
	authentication: "Autenticazione",
	welcomeBack: "Bentornato",
	noAccount: "Non hai un account?",
	registerHere: "Registrati qui",
	emailAddress: "E-mail",
	password: "Password",
	forgotPassword: "Password dimenticata?",
	signingIn: "Accesso in corso...",
	signIn: "Accedi",
	orContinueWith: "Oppure continua con",
	signInGoogle: "Accedi con Google",
	getStarted: "Inizia",
	createAccount: "Crea Account",
	alreadyHaveAccount: "Hai già un account?",
	loginHere: "Accedi qui",
	firstNameLabel: "Nome",
	lastNameLabel: "Cognome",
	phoneNumberLabel: "Telefono",
	creatingAccount: "Creazione account...",
	orJoinWith: "Oppure unisciti con",
	signUpGoogle: "Registrati con Google",
	accountRecovery: "Recupero Account",
	forgotPasswordTitle: "Password Dimenticata",
	rememberedPassword: "Ricordi la password?",
	sending: "Invio...",
	sendResetLink: "Invia Link di Reset"
};
var authLayout$3 = {
	journeyStarts: "Il Tuo Viaggio Inizia Qui",
	discover: "Scopri le",
	worldsMost: "destinazioni più",
	breathtaking: "mozzafiato",
	layoutDestinations: "del mondo.",
	socialProof: "Unisciti a oltre 50.000 viaggiatori che trovano offerte esclusive con Flybeth.",
	trustedWorldwide: "Fiducia mondiale",
	averageRating: "4.9 ★ Valutazione Media",
	travelIntelligence: "Intelligenza di Viaggio"
};
var bookingConfirmed$3 = "Prenotazione Confermata!";
var common$3 = {
	search: "Cerca",
	cancel: "Annulla",
	confirm: "Conferma",
	close: "Chiudi",
	loading: "Caricamento...",
	error: "Errore",
	success: "Successo"
};
const locale_it_46json_2c899dd9 = {
	hero: hero$3,
	nav: nav$3,
	search: search$3,
	marketing: marketing$3,
	offers: offers$3,
	promo: promo$3,
	destinations: destinations$3,
	inspiration: inspiration$3,
	categories: categories$3,
	newsletter: newsletter$3,
	stats: stats$3,
	footer: footer$3,
	settings: settings$3,
	flightCard: flightCard$3,
	stayCard: stayCard$3,
	carCard: carCard$3,
	emptyState: emptyState$3,
	flightsPage: flightsPage$3,
	staysPage: staysPage$3,
	carsPage: carsPage$3,
	checkout: checkout$3,
	confirmation: confirmation$3,
	auth: auth$3,
	authLayout: authLayout$3,
	bookingConfirmed: bookingConfirmed$3,
	common: common$3
};

var hero$2 = {
	title1: "500개 이상의 항공사에서 저렴한 항공편 예약!",
	title2: "500개 이상의 항공사!",
	award: "Global Travel 수상",
	since: "2024년부터"
};
var nav$2 = {
	stays: "숙소",
	flights: "항공편",
	cars: "렌터카",
	packages: "패키지",
	cruises: "크루즈",
	signIn: "로그인",
	explorer: "탐험가",
	logout: {
		title: "벌써 가시나요?",
		message: "Flybeth 계정에서 로그아웃합니다. 저장되지 않은 변경사항이 손실됩니다. ✈️",
		confirm: "로그아웃",
		cancel: "머물기"
	},
	exit: {
		title: "잠깐, 가지 마세요!",
		message: "활성 세션이 있습니다. Flybeth를 떠나시겠습니까?",
		confirm: "떠나기",
		cancel: "여기 있기"
	}
};
var search$2 = {
	tabs: {
		flights: "항공편",
		holidays: "휴가",
		hotels: "호텔",
		cruises: "크루즈",
		cars: "렌터카"
	},
	labels: {
		from: "출발지",
		to: "도착지",
		where: "어디로 가시나요?",
		departure: "출발일",
		"return": "귀국일",
		departure_return: "출발 — 귀국",
		departure_date: "출발일",
		passengers: "승객",
		cabin: "좌석 등급",
		letsgo: "출발!",
		singleHotel: "단일 호텔",
		multiHotel: "다중 호텔",
		checkInCheckOut: "체크인 - 체크아웃",
		travelersRooms: "여행자 & 객실",
		bundleSave: "결합 할인",
		addFlight: "항공편 추가",
		addCar: "렌터카 추가",
		addHotel: "호텔 추가",
		directFlightsOnly: "직항편만",
		rentalCars: "렌터카",
		airportRides: "공항 이동",
		pickUp: "픽업",
		whereFrom: "어디서?",
		whereTo: "어디로?",
		cityOrAirport: "도시 또는 공항",
		addressOrHotel: "주소 또는 호텔",
		dropOffLocation: "반납 장소",
		rentalDates: "대여 기간",
		pickUpDate: "픽업 날짜",
		pickUpTime: "픽업 시간",
		differentDropOff: "다른 반납 장소",
		bundle: "패키지",
		hotel: "호텔",
		flight: "항공편",
		whereFromQuestion: "어디서?",
		whereToQuestion: "어디로?",
		stayDates: "숙박 날짜",
		travelDates: "여행 날짜",
		partialHotelStay: "부분 호텔 숙박",
		differentCarDropOff: "다른 차량 반납",
		saveBundleMsg: "결합 예약으로 최대 $625 절약!",
		rooms: "객실",
		adults: "성인",
		children: "어린이",
		apply: "적용",
		multiRoomNote: "다중 객실 패키지는 총 8명으로 제한됩니다.",
		search: "검색",
		updateSearch: "검색 업데이트"
	},
	placeholders: {
		origin: "도시 또는 공항",
		destination: "목적지, 도시 또는 호텔"
	},
	packages: {
		hotel_flight: "호텔 + 항공편",
		hotel_flight_car: "호텔 + 항공편 + 렌터카",
		flight_car: "항공편 + 렌터카",
		hotel_car: "호텔 + 렌터카"
	},
	cruises: {
		title: "럭셔리 항해.",
		expertAdvice: "전문가 상담: 1-866-403-9848",
		goingTo: "목적지",
		destinationAny: "목적지 (전체)",
		departingBetween: "출항 기간",
		selectMonth: "월 선택",
		cruiseLine: "크루즈 라인",
		anyCruiseLine: "모든 라인",
		viewLuxurySuites: "럭셔리 스위트 보기",
		familyDeals: "가족 특가"
	},
	flightModes: {
		roundtrip: "왕복",
		oneway: "편도",
		multicity: "다구간"
	}
};
var marketing$2 = {
	helpTitle: "특가 찾는데 도움이 필요하신가요?",
	helpSub: "지금 예약 - 24시간 전화 상담",
	benefits: {
		deals: "전화 전용 특가",
		assist: "맞춤형 여행 지원",
		cancel: "24시간 취소 가능",
		rewards: "ClubMiles 포인트 2배"
	},
	speakExperts: "여행 전문가와 상담하세요"
};
var offers$2 = {
	trending: "인기 휴가 특가",
	smarter: "더 스마트한 요금.",
	smarterSub: "시간을 소중히 하는 여행.",
	majestic: "모든 마일이 장엄하게!",
	majesticSub: "에미레이트 항공.",
	learn: "자세히 보기",
	book: "지금 예약"
};
var promo$2 = {
	matchday: "경기일을 여행으로 — 여름 할인.",
	findDeals: "특가 찾기"
};
var destinations$2 = {
	globalExploration: "글로벌 탐험",
	mostLoved: "가장 사랑받는",
	destinations: "목적지",
	description: "큐레이터가 엄선한 항공편, 호텔, 체험을 예약하세요.",
	startingFrom: "{price}부터",
	parisDesc: "상징적인 랜드마크와 세계적인 요리의 빛의 도시.",
	dubaiDesc: "럭셔리 쇼핑과 초현대식 건축을 경험하세요.",
	maldivesDesc: "열대 낙원의 수정같은 바다와 해변."
};
var inspiration$2 = {
	lifestyleTravel: "라이프스타일 여행",
	title: "당신만의 여행",
	experiences: "{count}개 체험"
};
var categories$2 = {
	adventure: "모험",
	relaxation: "힐링",
	cityLife: "도시 생활",
	nature: "자연"
};
var newsletter$2 = {
	title: "특가를 놓치지 마세요",
	subtitle: "독점 항공권 특가, 호텔 할인을 받아보세요.",
	placeholder: "이메일 입력",
	subscribeButton: "구독",
	tagline: "50,000명 이상의 여행자와 함께"
};
var stats$2 = {
	globalDestinations: "글로벌 목적지",
	flightsFilteredDaily: "매일 필터링 항공편",
	secureBookings: "안전한 예약"
};
var footer$2 = {
	about: "소개",
	blog: "블로그",
	jobs: "채용",
	press: "언론",
	accessibility: "접근성",
	partners: "파트너",
	rights: "© 2024 Flybeth, Inc. All rights reserved."
};
var settings$2 = {
	language: "언어",
	currency: "통화",
	applyChanges: "변경사항 적용"
};
var flightCard$2 = {
	perTraveler: "1인당",
	selectFlight: "항공편 선택",
	nonstop: "직항",
	stops: "{n}회 경유",
	flight: "항공편"
};
var stayCard$2 = {
	nightlyAvg: "1박 평균",
	viewDeal: "상세보기",
	unnamedProperty: "이름없는 숙소",
	includesTaxes: "총 ${total} 세금 포함",
	off: "{percent}% 할인"
};
var carCard$2 = {
	orSimilar: "또는 유사 {category}",
	reviews: "{n}개 리뷰",
	passengers: "승객",
	bags: "짐",
	freeCancellation: "무료 취소",
	totalPrice: "총 가격",
	viewDeal: "상세보기"
};
var emptyState$2 = {
	defaultTitle: "아직 아무것도 없습니다",
	defaultMessage: "검색 필터를 조정하거나 인기 추천을 살펴보세요."
};
var flightsPage$2 = {
	fromWhere: "어디서?",
	toWhere: "어디로?",
	dates: "날짜",
	travelers: "여행자",
	travelerPlaceholder: "1명",
	flightsFound: "{n}개 항공편",
	filterBy: "필터",
	stops: "경유",
	nonstop: "직항",
	oneStop: "1회 경유",
	twoPlusStops: "2회+ 경유",
	airlines: "항공사",
	noFlightsTitle: "항공편 없음",
	noFlightsMessage: "일치하는 항공편이 없습니다. 다른 공항이나 날짜를 시도해보세요.",
	explorePopular: "인기 노선 탐색"
};
var staysPage$2 = {
	whereTo: "어디로?",
	checkIn: "체크인",
	guests: "게스트",
	guestsPlaceholder: "2명",
	propertiesFound: "{n}개 숙소",
	filterBy: "필터",
	pricePerNight: "1박 가격",
	lessThan100: "$100 미만",
	range100to200: "$100 - $200",
	range200to300: "$200 - $300",
	propertyType: "숙소 유형",
	hotelType: "호텔",
	resortType: "리조트",
	apartmentType: "아파트",
	noPropertiesTitle: "숙소 없음",
	noPropertiesMessage: "일치하는 숙소가 없습니다.",
	searchDubai: "두바이 검색"
};
var carsPage$2 = {
	pickUpLocation: "픽업 장소",
	pickUpDate: "픽업 날짜",
	carsFound: "{n}대 차량",
	filterBy: "필터",
	carType: "차량 유형",
	economy: "이코노미",
	suv: "SUV",
	luxury: "럭셔리",
	transmission: "변속기",
	automatic: "자동",
	manual: "수동",
	noCarsTitle: "이용 가능한 차량 없음",
	noCarsMessage: "이 위치에서 렌터카를 찾지 못했습니다.",
	searchDubaiAirport: "두바이 공항 검색"
};
var checkout$2 = {
	secureCheckout: "안전한 결제",
	travelerDetails: "여행자 정보",
	firstName: "이름",
	lastName: "성",
	emailAddress: "이메일",
	phoneNumber: "전화번호",
	paymentInfo: "결제 정보",
	cardholderName: "카드 소유자",
	cardNumber: "카드 번호",
	expirationDate: "만료일",
	cvv: "CVV",
	completeBooking: "예약 완료",
	processing: "처리 중...",
	termsAgreement: "결제 시 이용약관에 동의합니다.",
	orderSummary: "주문 요약",
	basePrice: "기본 가격",
	taxesFees: "세금 및 수수료",
	total: "합계",
	freeCancellation: "24시간 이내 무료 취소!"
};
var confirmation$2 = {
	bookingConfirmed: "예약 확인!",
	referenceText: "예약 참조 번호:",
	emailSent: "확인 이메일을 보냈습니다.",
	backToHome: "홈으로"
};
var auth$2 = {
	authentication: "인증",
	welcomeBack: "다시 오셨군요",
	noAccount: "계정이 없으신가요?",
	registerHere: "여기서 가입",
	emailAddress: "이메일",
	password: "비밀번호",
	forgotPassword: "비밀번호를 잊으셨나요?",
	signingIn: "로그인 중...",
	signIn: "로그인",
	orContinueWith: "또는",
	signInGoogle: "Google로 로그인",
	getStarted: "시작하기",
	createAccount: "계정 만들기",
	alreadyHaveAccount: "이미 계정이 있으신가요?",
	loginHere: "여기서 로그인",
	firstNameLabel: "이름",
	lastNameLabel: "성",
	phoneNumberLabel: "전화번호",
	creatingAccount: "계정 생성 중...",
	orJoinWith: "또는",
	signUpGoogle: "Google로 가입",
	accountRecovery: "계정 복구",
	forgotPasswordTitle: "비밀번호 찾기",
	rememberedPassword: "비밀번호가 기억나셨나요?",
	sending: "전송 중...",
	sendResetLink: "재설정 링크 보내기"
};
var authLayout$2 = {
	journeyStarts: "여행이 시작됩니다",
	discover: "세상에서 가장",
	worldsMost: "숨 막히는",
	breathtaking: "여행지를",
	layoutDestinations: "발견하세요.",
	socialProof: "50,000명 이상의 여행자와 함께하세요.",
	trustedWorldwide: "전 세계 신뢰",
	averageRating: "4.9 ★ 평균 평점",
	travelIntelligence: "여행 인텔리전스"
};
var bookingConfirmed$2 = "예약 확인!";
var common$2 = {
	search: "검색",
	cancel: "취소",
	confirm: "확인",
	close: "닫기",
	loading: "로딩 중...",
	error: "오류",
	success: "성공"
};
const locale_ko_46json_9fd96b3b = {
	hero: hero$2,
	nav: nav$2,
	search: search$2,
	marketing: marketing$2,
	offers: offers$2,
	promo: promo$2,
	destinations: destinations$2,
	inspiration: inspiration$2,
	categories: categories$2,
	newsletter: newsletter$2,
	stats: stats$2,
	footer: footer$2,
	settings: settings$2,
	flightCard: flightCard$2,
	stayCard: stayCard$2,
	carCard: carCard$2,
	emptyState: emptyState$2,
	flightsPage: flightsPage$2,
	staysPage: staysPage$2,
	carsPage: carsPage$2,
	checkout: checkout$2,
	confirmation: confirmation$2,
	auth: auth$2,
	authLayout: authLayout$2,
	bookingConfirmed: bookingConfirmed$2,
	common: common$2
};

var hero$1 = {
	title1: "500'den fazla havayolunda ucuz uçuş rezervasyonu!",
	title2: "500+ havayolu!",
	award: "Global Travel ödüllü",
	since: "2024'ten beri"
};
var nav$1 = {
	stays: "Konaklama",
	flights: "Uçuşlar",
	cars: "Araçlar",
	packages: "Paketler",
	cruises: "Kruvaziyer",
	signIn: "Giriş Yap",
	explorer: "Kaşif",
	logout: {
		title: "Şimdiden mi gidiyorsunuz?",
		message: "Flybeth hesabınızdan çıkış yapacaksınız. Kaydedilmemiş değişiklikler kaybolacak. ✈️",
		confirm: "Çıkış Yap",
		cancel: "Kal"
	},
	exit: {
		title: "Bekle, gitme!",
		message: "Aktif bir oturumunuz var. Flybeth'ten ayrılmak istediğinize emin misiniz?",
		confirm: "Ayrıl",
		cancel: "Burada Kal"
	}
};
var search$1 = {
	tabs: {
		flights: "Uçuşlar",
		holidays: "Tatiller",
		hotels: "Oteller",
		cruises: "Kruvaziyer",
		cars: "Araçlar"
	},
	labels: {
		from: "Kalkış",
		to: "Varış",
		where: "Nereye gidiyorsunuz?",
		departure: "Kalkış Tarihi",
		"return": "Dönüş Tarihi",
		departure_return: "Gidiş — Dönüş",
		departure_date: "Kalkış Tarihi",
		passengers: "Yolcular",
		cabin: "Kabin Sınıfı",
		letsgo: "HAYDI!",
		singleHotel: "Tek Otel",
		multiHotel: "Çoklu Otel",
		checkInCheckOut: "Giriş - Çıkış",
		travelersRooms: "Yolcular ve Odalar",
		bundleSave: "Birleştir ve Tasarruf Et",
		addFlight: "Uçuş ekle",
		addCar: "Araç ekle",
		addHotel: "Otel Ekle",
		directFlightsOnly: "Sadece Direkt Uçuşlar",
		rentalCars: "Kiralık araçlar",
		airportRides: "Havaalanı transferi",
		pickUp: "Alış",
		whereFrom: "Nereden?",
		whereTo: "Nereye?",
		cityOrAirport: "Şehir veya havaalanı",
		addressOrHotel: "Adres veya otel",
		dropOffLocation: "Bırakma noktası",
		rentalDates: "Kiralama Tarihleri",
		pickUpDate: "Alış tarihi",
		pickUpTime: "Alış saati",
		differentDropOff: "Farklı bırakma noktası",
		bundle: "Paket",
		hotel: "Otel",
		flight: "Uçuş",
		whereFromQuestion: "Nereden?",
		whereToQuestion: "Nereye?",
		stayDates: "Konaklama Tarihleri",
		travelDates: "Seyahat Tarihleri",
		partialHotelStay: "Kısmi otel konaklaması",
		differentCarDropOff: "Farklı araç bırakma",
		saveBundleMsg: "Seyahatinizi birleştirerek $625'a kadar tasarruf edin!",
		rooms: "Odalar",
		adults: "Yetişkinler",
		children: "Çocuklar",
		apply: "Uygula",
		multiRoomNote: "Çoklu oda paketleri toplam 8 yolcuyla sınırlıdır.",
		search: "Ara",
		updateSearch: "Aramayı Güncelle"
	},
	placeholders: {
		origin: "Şehir veya Havaalanı",
		destination: "Hedef, Şehir veya Otel"
	},
	packages: {
		hotel_flight: "Otel + Uçuş",
		hotel_flight_car: "Otel + Uçuş + Araç",
		flight_car: "Uçuş + Araç",
		hotel_car: "Otel + Araç"
	},
	cruises: {
		title: "Lüks Denizcilik.",
		expertAdvice: "Uzman Danışmanlık: 1-866-403-9848",
		goingTo: "Hedef",
		destinationAny: "Hedef (Tümü)",
		departingBetween: "Kalkış aralığı",
		selectMonth: "Ay Seçin",
		cruiseLine: "Kruvaziyer Hattı",
		anyCruiseLine: "Tüm Hatlar",
		viewLuxurySuites: "Lüks Süitleri Gör",
		familyDeals: "Aile Fırsatları"
	},
	flightModes: {
		roundtrip: "Gidiş-Dönüş",
		oneway: "Tek Yön",
		multicity: "Çok Şehirli"
	}
};
var marketing$1 = {
	helpTitle: "Fırsat bulmakta yardım mı lazım?",
	helpSub: "Şimdi rezervasyon yapın - 7/24 arayın",
	benefits: {
		deals: "Telefona özel fırsatlar",
		assist: "Kişisel seyahat desteği",
		cancel: "24 saat iptal",
		rewards: "2X ClubMiles puan"
	},
	speakExperts: "Uzman seyahat danışmanlarımızla konuşun"
};
var offers$1 = {
	trending: "Popüler Tatil Fırsatları",
	smarter: "Daha akıllı fiyatlar.",
	smarterSub: "Zamanınıza değer veren seyahat.",
	majestic: "Her mil görkemli!",
	majesticSub: "Emirates ile uçun.",
	learn: "Daha Fazla",
	book: "Şimdi Rezerve Et"
};
var promo$1 = {
	matchday: "Maç gününü tatile çevirin — yaz fırsatları.",
	findDeals: "Fırsatları bul"
};
var destinations$1 = {
	globalExploration: "Küresel Keşif",
	mostLoved: "En Sevilen",
	destinations: "Destinasyonlar",
	description: "Küratörlerimizin seçtiği uçuşlar, oteller ve deneyimler.",
	startingFrom: "{price}'den başlayan",
	parisDesc: "Işıklar şehri ikonik simgeleri ve dünya mutfağıyla sizi bekliyor.",
	dubaiDesc: "Lüks alışveriş ve ultra modern mimariyi deneyimleyin.",
	maldivesDesc: "Tropik cennetin berrak suları ve bozulmamış plajları."
};
var inspiration$1 = {
	lifestyleTravel: "Yaşam Tarzı Seyahati",
	title: "Kendi Yolunuzda Seyahat Edin",
	experiences: "{count} Deneyim"
};
var categories$1 = {
	adventure: "Macera",
	relaxation: "Dinlenme",
	cityLife: "Şehir Hayatı",
	nature: "Doğa"
};
var newsletter$1 = {
	title: "Hiçbir Fırsatı Kaçırmayın",
	subtitle: "Özel uçuş fırsatları ve otel indirimleri alın.",
	placeholder: "E-posta adresinizi girin",
	subscribeButton: "Abone Ol",
	tagline: "50.000+ akıllı gezgine katılın"
};
var stats$1 = {
	globalDestinations: "Küresel Destinasyonlar",
	flightsFilteredDaily: "Günlük Filtrelenen Uçuşlar",
	secureBookings: "Güvenli Rezervasyonlar"
};
var footer$1 = {
	about: "Hakkında",
	blog: "Blog",
	jobs: "Kariyer",
	press: "Basın",
	accessibility: "Erişilebilirlik",
	partners: "Ortaklar",
	rights: "© 2024 Flybeth, Inc. Tüm hakları saklıdır."
};
var settings$1 = {
	language: "Dil",
	currency: "Para Birimi",
	applyChanges: "Değişiklikleri Uygula"
};
var flightCard$1 = {
	perTraveler: "kişi başı",
	selectFlight: "Uçuş Seç",
	nonstop: "Aktarmasız",
	stops: "{n} aktarma",
	flight: "Uçuş"
};
var stayCard$1 = {
	nightlyAvg: "Gece ort.",
	viewDeal: "Fırsatı Gör",
	unnamedProperty: "İsimsiz Tesis",
	includesTaxes: "Toplam ${total} vergiler dahil",
	off: "%{percent} İNDİRİM"
};
var carCard$1 = {
	orSimilar: "veya benzer {category}",
	reviews: "{n} değerlendirme",
	passengers: "Yolcular",
	bags: "Bavul",
	freeCancellation: "Ücretsiz İptal",
	totalPrice: "Toplam Fiyat",
	viewDeal: "Fırsatı Gör"
};
var emptyState$1 = {
	defaultTitle: "Henüz bir şey yok",
	defaultMessage: "Arama filtrelerinizi ayarlayın veya popüler önerilerimize göz atın."
};
var flightsPage$1 = {
	fromWhere: "Nereden?",
	toWhere: "Nereye?",
	dates: "Tarihler",
	travelers: "Yolcular",
	travelerPlaceholder: "1 yolcu",
	flightsFound: "{n} uçuş bulundu",
	filterBy: "Filtrele",
	stops: "Aktarmalar",
	nonstop: "Aktarmasız",
	oneStop: "1 Aktarma",
	twoPlusStops: "2+ Aktarma",
	airlines: "Havayolları",
	noFlightsTitle: "Uçuş bulunamadı",
	noFlightsMessage: "Eşleşen uçuş bulunamadı. Farklı havaalanları veya tarihler deneyin.",
	explorePopular: "Popüler Rotaları Keşfet"
};
var staysPage$1 = {
	whereTo: "Nereye?",
	checkIn: "Giriş",
	guests: "Misafirler",
	guestsPlaceholder: "2 yolcu",
	propertiesFound: "{n} tesis bulundu",
	filterBy: "Filtrele",
	pricePerNight: "Gece başı fiyat",
	lessThan100: "$100'den az",
	range100to200: "$100 - $200",
	range200to300: "$200 - $300",
	propertyType: "Tesis Türü",
	hotelType: "Otel",
	resortType: "Tatil Köyü",
	apartmentType: "Apart",
	noPropertiesTitle: "Tesis bulunamadı",
	noPropertiesMessage: "Eşleşen konaklama bulunamadı.",
	searchDubai: "Dubai Ara"
};
var carsPage$1 = {
	pickUpLocation: "Alış noktası",
	pickUpDate: "Alış Tarihi",
	carsFound: "{n} araç bulundu",
	filterBy: "Filtrele",
	carType: "Araç Tipi",
	economy: "Ekonomi",
	suv: "SUV",
	luxury: "Lüks",
	transmission: "Vites",
	automatic: "Otomatik",
	manual: "Manuel",
	noCarsTitle: "Araç yok",
	noCarsMessage: "Bu konumda kiralık araç bulunamadı.",
	searchDubaiAirport: "Dubai Havaalanı Ara"
};
var checkout$1 = {
	secureCheckout: "Güvenli Ödeme",
	travelerDetails: "Yolcu Bilgileri",
	firstName: "Ad",
	lastName: "Soyad",
	emailAddress: "E-posta",
	phoneNumber: "Telefon",
	paymentInfo: "Ödeme Bilgileri",
	cardholderName: "Kart Sahibi",
	cardNumber: "Kart Numarası",
	expirationDate: "Son Kullanma",
	cvv: "CVV",
	completeBooking: "Rezervasyonu Tamamla",
	processing: "İşleniyor...",
	termsAgreement: "Ödeme yaparak Şartları kabul edersiniz.",
	orderSummary: "Sipariş Özeti",
	basePrice: "Temel Fiyat",
	taxesFees: "Vergiler",
	total: "Toplam",
	freeCancellation: "24 saat içinde ücretsiz iptal!"
};
var confirmation$1 = {
	bookingConfirmed: "Rezervasyon Onaylandı!",
	referenceText: "Rezervasyon referansınız:",
	emailSent: "Onay e-postası gönderdik.",
	backToHome: "Ana Sayfaya Dön"
};
var auth$1 = {
	authentication: "Kimlik Doğrulama",
	welcomeBack: "Tekrar Hoş Geldiniz",
	noAccount: "Hesabınız yok mu?",
	registerHere: "Buradan kaydolun",
	emailAddress: "E-posta",
	password: "Şifre",
	forgotPassword: "Şifrenizi mi unuttunuz?",
	signingIn: "Giriş yapılıyor...",
	signIn: "Giriş Yap",
	orContinueWith: "Veya ile devam et",
	signInGoogle: "Google ile giriş yap",
	getStarted: "Başla",
	createAccount: "Hesap Oluştur",
	alreadyHaveAccount: "Zaten hesabınız var mı?",
	loginHere: "Buradan giriş yapın",
	firstNameLabel: "Ad",
	lastNameLabel: "Soyad",
	phoneNumberLabel: "Telefon",
	creatingAccount: "Hesap oluşturuluyor...",
	orJoinWith: "Veya ile katıl",
	signUpGoogle: "Google ile kaydol",
	accountRecovery: "Hesap Kurtarma",
	forgotPasswordTitle: "Şifremi Unuttum",
	rememberedPassword: "Şifrenizi hatırladınız mı?",
	sending: "Gönderiliyor...",
	sendResetLink: "Sıfırlama Bağlantısı Gönder"
};
var authLayout$1 = {
	journeyStarts: "Yolculuğunuz Burada Başlıyor",
	discover: "Dünyanın en",
	worldsMost: "nefes kesici",
	breathtaking: "destinasyonlarını",
	layoutDestinations: "keşfedin.",
	socialProof: "50.000+ gezginle birlikte Flybeth'te özel fırsatlar bulun.",
	trustedWorldwide: "Dünya çapında güvenilir",
	averageRating: "4.9 ★ Ortalama Puan",
	travelIntelligence: "Seyahat Zekası"
};
var bookingConfirmed$1 = "Rezervasyon Onaylandı!";
var common$1 = {
	search: "Ara",
	cancel: "İptal",
	confirm: "Onayla",
	close: "Kapat",
	loading: "Yükleniyor...",
	error: "Hata",
	success: "Başarılı"
};
const locale_tr_46json_6b18d500 = {
	hero: hero$1,
	nav: nav$1,
	search: search$1,
	marketing: marketing$1,
	offers: offers$1,
	promo: promo$1,
	destinations: destinations$1,
	inspiration: inspiration$1,
	categories: categories$1,
	newsletter: newsletter$1,
	stats: stats$1,
	footer: footer$1,
	settings: settings$1,
	flightCard: flightCard$1,
	stayCard: stayCard$1,
	carCard: carCard$1,
	emptyState: emptyState$1,
	flightsPage: flightsPage$1,
	staysPage: staysPage$1,
	carsPage: carsPage$1,
	checkout: checkout$1,
	confirmation: confirmation$1,
	auth: auth$1,
	authLayout: authLayout$1,
	bookingConfirmed: bookingConfirmed$1,
	common: common$1
};

var hero = {
	title1: "500 से अधिक एयरलाइनों पर सस्ती उड़ानें बुक करें!",
	title2: "500+ एयरलाइंस!",
	award: "Global Travel पुरस्कार विजेता",
	since: "2024 से"
};
var nav = {
	stays: "ठहरना",
	flights: "उड़ानें",
	cars: "कारें",
	packages: "पैकेज",
	cruises: "क्रूज़",
	signIn: "साइन इन",
	explorer: "एक्सप्लोरर",
	logout: {
		title: "इतनी जल्दी जा रहे हैं?",
		message: "आप अपने Flybeth खाते से लॉग आउट होने वाले हैं। बिना सहेजे परिवर्तन खो जाएंगे। ✈️",
		confirm: "लॉग आउट",
		cancel: "रुकें"
	},
	exit: {
		title: "रुकिए, मत जाइए!",
		message: "आपका एक सक्रिय सत्र है। क्या आप Flybeth छोड़ना चाहते हैं?",
		confirm: "छोड़ें",
		cancel: "यहीं रहें"
	}
};
var search = {
	tabs: {
		flights: "उड़ानें",
		holidays: "छुट्टियाँ",
		hotels: "होटल",
		cruises: "क्रूज़",
		cars: "कारें"
	},
	labels: {
		from: "कहाँ से",
		to: "कहाँ तक",
		where: "आप कहाँ जा रहे हैं?",
		departure: "प्रस्थान तिथि",
		"return": "वापसी तिथि",
		departure_return: "प्रस्थान — वापसी",
		departure_date: "प्रस्थान तिथि",
		passengers: "यात्री",
		cabin: "केबिन क्लास",
		letsgo: "चलें!",
		singleHotel: "एकल होटल",
		multiHotel: "मल्टी होटल",
		checkInCheckOut: "चेक-इन - चेक-आउट",
		travelersRooms: "यात्री और कमरे",
		bundleSave: "बंडल और बचत",
		addFlight: "उड़ान जोड़ें",
		addCar: "कार जोड़ें",
		addHotel: "होटल जोड़ें",
		directFlightsOnly: "केवल सीधी उड़ानें",
		rentalCars: "किराये की कारें",
		airportRides: "एयरपोर्ट राइड",
		pickUp: "पिक-अप",
		whereFrom: "कहाँ से?",
		whereTo: "कहाँ तक?",
		cityOrAirport: "शहर या हवाई अड्डा",
		addressOrHotel: "पता या होटल",
		dropOffLocation: "वापसी स्थान",
		rentalDates: "किराये की तिथियाँ",
		pickUpDate: "पिक-अप तिथि",
		pickUpTime: "पिक-अप समय",
		differentDropOff: "अलग वापसी स्थान",
		bundle: "बंडल",
		hotel: "होटल",
		flight: "उड़ान",
		whereFromQuestion: "कहाँ से?",
		whereToQuestion: "कहाँ तक?",
		stayDates: "ठहरने की तिथियाँ",
		travelDates: "यात्रा तिथियाँ",
		partialHotelStay: "आंशिक होटल ठहराव",
		differentCarDropOff: "अलग कार वापसी",
		saveBundleMsg: "बंडल करके $625 तक बचत करें!",
		rooms: "कमरे",
		adults: "वयस्क",
		children: "बच्चे",
		apply: "लागू करें",
		multiRoomNote: "मल्टी-रूम पैकेज कुल 8 यात्रियों तक सीमित हैं।",
		search: "खोजें",
		updateSearch: "खोज अपडेट करें"
	},
	placeholders: {
		origin: "शहर या हवाई अड्डा",
		destination: "गंतव्य, शहर या होटल"
	},
	packages: {
		hotel_flight: "होटल + उड़ान",
		hotel_flight_car: "होटल + उड़ान + कार",
		flight_car: "उड़ान + कार",
		hotel_car: "होटल + कार"
	},
	cruises: {
		title: "शानदार समुद्री यात्रा",
		expertAdvice: "विशेषज्ञ सलाह: 1-866-403-9848",
		goingTo: "गंतव्य",
		destinationAny: "गंतव्य (सभी)",
		departingBetween: "प्रस्थान अवधि",
		selectMonth: "महीना चुनें",
		cruiseLine: "क्रूज़ लाइन",
		anyCruiseLine: "कोई भी लाइन",
		viewLuxurySuites: "लक्ज़री सुइट देखें",
		familyDeals: "पारिवारिक ऑफर"
	},
	flightModes: {
		roundtrip: "आना-जाना",
		oneway: "एक तरफ",
		multicity: "मल्टी-सिटी"
	}
};
var marketing = {
	helpTitle: "ऑफर खोजने में मदद चाहिए?",
	helpSub: "अभी बुक करें - 24/7 कॉल करें",
	benefits: {
		deals: "फोन-केवल ऑफर",
		assist: "व्यक्तिगत यात्रा सहायता",
		cancel: "24 घंटे रद्दीकरण",
		rewards: "2X ClubMiles पॉइंट"
	},
	speakExperts: "हमारे विशेषज्ञ यात्रा सलाहकारों से बात करें"
};
var offers = {
	trending: "ट्रेंडिंग हॉलिडे ऑफर",
	smarter: "स्मार्ट किराये।",
	smarterSub: "आपके समय को महत्व देने वाली यात्रा।",
	majestic: "हर मील शानदार!",
	majesticSub: "एमिरेट्स के साथ उड़ें।",
	learn: "और जानें",
	book: "अभी बुक करें"
};
var promo = {
	matchday: "मैच डे को छुट्टी में बदलें — गर्मी की बचत पाएं।",
	findDeals: "ऑफर खोजें"
};
var destinations = {
	globalExploration: "वैश्विक अन्वेषण",
	mostLoved: "सबसे लोकप्रिय",
	destinations: "गंतव्य",
	description: "हमारे क्यूरेटर्स द्वारा चुनी गई उड़ानें, होटल और अनुभव बुक करें।",
	startingFrom: "{price} से शुरू",
	parisDesc: "रोशनी का शहर अपने प्रतिष्ठित स्थलों और विश्व स्तरीय व्यंजनों के साथ।",
	dubaiDesc: "लक्ज़री शॉपिंग और अत्याधुनिक वास्तुकला का अनुभव करें।",
	maldivesDesc: "उष्णकटिबंधीय स्वर्ग में स्वच्छ पानी और प्राचीन समुद्र तट।"
};
var inspiration = {
	lifestyleTravel: "लाइफस्टाइल ट्रैवल",
	title: "अपने तरीके से यात्रा करें",
	experiences: "{count} अनुभव"
};
var categories = {
	adventure: "साहसिक",
	relaxation: "विश्राम",
	cityLife: "शहरी जीवन",
	nature: "प्रकृति"
};
var newsletter = {
	title: "कोई ऑफर न चूकें",
	subtitle: "विशेष उड़ान ऑफर और होटल छूट प्राप्त करें।",
	placeholder: "अपना ईमेल दर्ज करें",
	subscribeButton: "सदस्यता लें",
	tagline: "50,000+ स्मार्ट यात्रियों से जुड़ें"
};
var stats = {
	globalDestinations: "वैश्विक गंतव्य",
	flightsFilteredDaily: "दैनिक फ़िल्टर उड़ानें",
	secureBookings: "सुरक्षित बुकिंग"
};
var footer = {
	about: "हमारे बारे में",
	blog: "ब्लॉग",
	jobs: "नौकरियाँ",
	press: "प्रेस",
	accessibility: "अभिगम्यता",
	partners: "साझेदार",
	rights: "© 2024 Flybeth, Inc. सर्वाधिकार सुरक्षित।"
};
var settings = {
	language: "भाषा",
	currency: "मुद्रा",
	applyChanges: "परिवर्तन लागू करें"
};
var flightCard = {
	perTraveler: "प्रति यात्री",
	selectFlight: "उड़ान चुनें",
	nonstop: "नॉनस्टॉप",
	stops: "{n} स्टॉप",
	flight: "उड़ान"
};
var stayCard = {
	nightlyAvg: "प्रति रात औसत",
	viewDeal: "ऑफर देखें",
	unnamedProperty: "अनाम संपत्ति",
	includesTaxes: "कुल ${total} कर सहित",
	off: "{percent}% छूट"
};
var carCard = {
	orSimilar: "या समान {category}",
	reviews: "{n} समीक्षाएँ",
	passengers: "यात्री",
	bags: "बैग",
	freeCancellation: "मुफ्त रद्दीकरण",
	totalPrice: "कुल कीमत",
	viewDeal: "ऑफर देखें"
};
var emptyState = {
	defaultTitle: "अभी कुछ नहीं है",
	defaultMessage: "अपने खोज फ़िल्टर समायोजित करें या हमारी लोकप्रिय सिफारिशें देखें।"
};
var flightsPage = {
	fromWhere: "कहाँ से?",
	toWhere: "कहाँ तक?",
	dates: "तिथियाँ",
	travelers: "यात्री",
	travelerPlaceholder: "1 यात्री",
	flightsFound: "{n} उड़ानें मिलीं",
	filterBy: "फ़िल्टर",
	stops: "स्टॉप",
	nonstop: "नॉनस्टॉप",
	oneStop: "1 स्टॉप",
	twoPlusStops: "2+ स्टॉप",
	airlines: "एयरलाइंस",
	noFlightsTitle: "कोई उड़ान नहीं मिली",
	noFlightsMessage: "मेल खाने वाली उड़ानें नहीं मिलीं। अलग हवाई अड्डे या तिथियाँ आज़माएं।",
	explorePopular: "लोकप्रिय रूट देखें"
};
var staysPage = {
	whereTo: "कहाँ?",
	checkIn: "चेक-इन",
	guests: "मेहमान",
	guestsPlaceholder: "2 यात्री",
	propertiesFound: "{n} प्रॉपर्टी मिलीं",
	filterBy: "फ़िल्टर",
	pricePerNight: "प्रति रात मूल्य",
	lessThan100: "$100 से कम",
	range100to200: "$100 - $200",
	range200to300: "$200 - $300",
	propertyType: "प्रॉपर्टी प्रकार",
	hotelType: "होटल",
	resortType: "रिसॉर्ट",
	apartmentType: "अपार्टमेंट",
	noPropertiesTitle: "कोई प्रॉपर्टी नहीं मिली",
	noPropertiesMessage: "मेल खाने वाली प्रॉपर्टी नहीं मिली।",
	searchDubai: "दुबई खोजें"
};
var carsPage = {
	pickUpLocation: "पिक-अप स्थान",
	pickUpDate: "पिक-अप तिथि",
	carsFound: "{n} कारें मिलीं",
	filterBy: "फ़िल्टर",
	carType: "कार प्रकार",
	economy: "इकोनॉमी",
	suv: "SUV",
	luxury: "लक्ज़री",
	transmission: "ट्रांसमिशन",
	automatic: "ऑटोमैटिक",
	manual: "मैनुअल",
	noCarsTitle: "कोई कार उपलब्ध नहीं",
	noCarsMessage: "इस स्थान पर किराये की कार नहीं मिली।",
	searchDubaiAirport: "दुबई हवाई अड्डा खोजें"
};
var checkout = {
	secureCheckout: "सुरक्षित चेकआउट",
	travelerDetails: "यात्री विवरण",
	firstName: "पहला नाम",
	lastName: "उपनाम",
	emailAddress: "ईमेल",
	phoneNumber: "फोन नंबर",
	paymentInfo: "भुगतान जानकारी",
	cardholderName: "कार्डधारक का नाम",
	cardNumber: "कार्ड नंबर",
	expirationDate: "समाप्ति तिथि",
	cvv: "CVV",
	completeBooking: "बुकिंग पूरी करें",
	processing: "प्रक्रिया हो रही है...",
	termsAgreement: "भुगतान करके आप हमारे नियम और शर्तें स्वीकार करते हैं।",
	orderSummary: "ऑर्डर सारांश",
	basePrice: "बेस मूल्य",
	taxesFees: "कर और शुल्क",
	total: "कुल",
	freeCancellation: "24 घंटे के भीतर मुफ्त रद्दीकरण!"
};
var confirmation = {
	bookingConfirmed: "बुकिंग पुष्टि!",
	referenceText: "आपका बुकिंग संदर्भ है",
	emailSent: "हमने पुष्टि ईमेल भेजा है।",
	backToHome: "होम पर वापस"
};
var auth = {
	authentication: "प्रमाणीकरण",
	welcomeBack: "वापस स्वागत है",
	noAccount: "खाता नहीं है?",
	registerHere: "यहाँ रजिस्टर करें",
	emailAddress: "ईमेल",
	password: "पासवर्ड",
	forgotPassword: "पासवर्ड भूल गए?",
	signingIn: "साइन इन हो रहा है...",
	signIn: "साइन इन",
	orContinueWith: "या इसके साथ जारी रखें",
	signInGoogle: "Google से साइन इन",
	getStarted: "शुरू करें",
	createAccount: "खाता बनाएं",
	alreadyHaveAccount: "पहले से खाता है?",
	loginHere: "यहाँ लॉगिन करें",
	firstNameLabel: "पहला नाम",
	lastNameLabel: "उपनाम",
	phoneNumberLabel: "फोन नंबर",
	creatingAccount: "खाता बन रहा है...",
	orJoinWith: "या इसके साथ जुड़ें",
	signUpGoogle: "Google से साइन अप",
	accountRecovery: "खाता पुनर्प्राप्ति",
	forgotPasswordTitle: "पासवर्ड भूल गए",
	rememberedPassword: "पासवर्ड याद आ गया?",
	sending: "भेजा जा रहा है...",
	sendResetLink: "रीसेट लिंक भेजें"
};
var authLayout = {
	journeyStarts: "आपकी यात्रा यहाँ शुरू होती है",
	discover: "दुनिया के सबसे",
	worldsMost: "अद्भुत",
	breathtaking: "गंतव्यों",
	layoutDestinations: "की खोज करें।",
	socialProof: "50,000+ यात्रियों से जुड़ें जो Flybeth पर विशेष ऑफर पाते हैं।",
	trustedWorldwide: "विश्वव्यापी विश्वसनीय",
	averageRating: "4.9 ★ औसत रेटिंग",
	travelIntelligence: "ट्रैवल इंटेलिजेंस"
};
var bookingConfirmed = "बुकिंग पुष्टि!";
var common = {
	search: "खोजें",
	cancel: "रद्द करें",
	confirm: "पुष्टि करें",
	close: "बंद करें",
	loading: "लोड हो रहा है...",
	error: "त्रुटि",
	success: "सफलता"
};
const locale_hi_46json_415b42a2 = {
	hero: hero,
	nav: nav,
	search: search,
	marketing: marketing,
	offers: offers,
	promo: promo,
	destinations: destinations,
	inspiration: inspiration,
	categories: categories,
	newsletter: newsletter,
	stats: stats,
	footer: footer,
	settings: settings,
	flightCard: flightCard,
	stayCard: stayCard,
	carCard: carCard,
	emptyState: emptyState,
	flightsPage: flightsPage,
	staysPage: staysPage,
	carsPage: carsPage,
	checkout: checkout,
	confirmation: confirmation,
	auth: auth,
	authLayout: authLayout,
	bookingConfirmed: bookingConfirmed,
	common: common
};

// @ts-nocheck
const localeCodes =  [
  "en",
  "es",
  "fr",
  "de",
  "ar",
  "zh",
  "ja",
  "pt",
  "it",
  "ko",
  "tr",
  "hi"
];
const localeLoaders = {
  en: [
    {
      key: "locale_en_46json_6179587c",
      load: () => Promise.resolve(locale_en_46json_6179587c),
      cache: true
    }
  ],
  es: [
    {
      key: "locale_es_46json_73ad6bef",
      load: () => Promise.resolve(locale_es_46json_73ad6bef),
      cache: true
    }
  ],
  fr: [
    {
      key: "locale_fr_46json_88a412bc",
      load: () => Promise.resolve(locale_fr_46json_88a412bc),
      cache: true
    }
  ],
  de: [
    {
      key: "locale_de_46json_269f3f54",
      load: () => Promise.resolve(locale_de_46json_269f3f54),
      cache: true
    }
  ],
  ar: [
    {
      key: "locale_ar_46json_e319d7cc",
      load: () => Promise.resolve(locale_ar_46json_e319d7cc),
      cache: true
    }
  ],
  zh: [
    {
      key: "locale_zh_46json_3de7943d",
      load: () => Promise.resolve(locale_zh_46json_3de7943d),
      cache: true
    }
  ],
  ja: [
    {
      key: "locale_ja_46json_15d23fe3",
      load: () => Promise.resolve(locale_ja_46json_15d23fe3),
      cache: true
    }
  ],
  pt: [
    {
      key: "locale_pt_46json_47d3ea2b",
      load: () => Promise.resolve(locale_pt_46json_47d3ea2b),
      cache: true
    }
  ],
  it: [
    {
      key: "locale_it_46json_2c899dd9",
      load: () => Promise.resolve(locale_it_46json_2c899dd9),
      cache: true
    }
  ],
  ko: [
    {
      key: "locale_ko_46json_9fd96b3b",
      load: () => Promise.resolve(locale_ko_46json_9fd96b3b),
      cache: true
    }
  ],
  tr: [
    {
      key: "locale_tr_46json_6b18d500",
      load: () => Promise.resolve(locale_tr_46json_6b18d500),
      cache: true
    }
  ],
  hi: [
    {
      key: "locale_hi_46json_415b42a2",
      load: () => Promise.resolve(locale_hi_46json_415b42a2),
      cache: true
    }
  ]
};
const vueI18nConfigs = [];
const normalizedLocales = [
  {
    code: "en",
    iso: "en-US",
    name: "English",
    language: "en-US"
  },
  {
    code: "es",
    iso: "es-ES",
    name: "Español",
    language: "es-ES"
  },
  {
    code: "fr",
    iso: "fr-FR",
    name: "Français",
    language: "fr-FR"
  },
  {
    code: "de",
    iso: "de-DE",
    name: "Deutsch",
    language: "de-DE"
  },
  {
    code: "ar",
    iso: "ar-SA",
    name: "العربية",
    dir: "rtl",
    language: "ar-SA"
  },
  {
    code: "zh",
    iso: "zh-CN",
    name: "中文",
    language: "zh-CN"
  },
  {
    code: "ja",
    iso: "ja-JP",
    name: "日本語",
    language: "ja-JP"
  },
  {
    code: "pt",
    iso: "pt-BR",
    name: "Português",
    language: "pt-BR"
  },
  {
    code: "it",
    iso: "it-IT",
    name: "Italiano",
    language: "it-IT"
  },
  {
    code: "ko",
    iso: "ko-KR",
    name: "한국어",
    language: "ko-KR"
  },
  {
    code: "tr",
    iso: "tr-TR",
    name: "Türkçe",
    language: "tr-TR"
  },
  {
    code: "hi",
    iso: "hi-IN",
    name: "हिन्दी",
    language: "hi-IN"
  }
];

const setupVueI18nOptions = async (defaultLocale) => {
  const options = await loadVueI18nOptions(vueI18nConfigs);
  options.locale = defaultLocale || options.locale || "en-US";
  options.defaultLocale = defaultLocale;
  options.fallbackLocale ??= false;
  options.messages ??= {};
  for (const locale of localeCodes) {
    options.messages[locale] ??= {};
  }
  return options;
};

function defineNitroPlugin(def) {
  return def;
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const r=Object.create(null),i=e=>globalThis.process?.env||globalThis._importMeta_.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?r:globalThis),o=new Proxy(r,{get(e,s){return i()[s]??r[s]},has(e,s){const E=i();return s in E||s in r},set(e,s,E){const B=i(true);return B[s]=E,true},deleteProperty(e,s){if(!s)return  false;const E=i(true);return delete E[s],true},ownKeys(){const e=i(true);return Object.keys(e)}}),t=typeof process<"u"&&process.env&&"production"||"",f=[["APPVEYOR"],["AWS_AMPLIFY","AWS_APP_ID",{ci:true}],["AZURE_PIPELINES","SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],["AZURE_STATIC","INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],["APPCIRCLE","AC_APPCIRCLE"],["BAMBOO","bamboo_planKey"],["BITBUCKET","BITBUCKET_COMMIT"],["BITRISE","BITRISE_IO"],["BUDDY","BUDDY_WORKSPACE_ID"],["BUILDKITE"],["CIRCLE","CIRCLECI"],["CIRRUS","CIRRUS_CI"],["CLOUDFLARE_PAGES","CF_PAGES",{ci:true}],["CLOUDFLARE_WORKERS","WORKERS_CI",{ci:true}],["CODEBUILD","CODEBUILD_BUILD_ARN"],["CODEFRESH","CF_BUILD_ID"],["DRONE"],["DRONE","DRONE_BUILD_EVENT"],["DSARI"],["GITHUB_ACTIONS"],["GITLAB","GITLAB_CI"],["GITLAB","CI_MERGE_REQUEST_ID"],["GOCD","GO_PIPELINE_LABEL"],["LAYERCI"],["HUDSON","HUDSON_URL"],["JENKINS","JENKINS_URL"],["MAGNUM"],["NETLIFY"],["NETLIFY","NETLIFY_LOCAL",{ci:false}],["NEVERCODE"],["RENDER"],["SAIL","SAILCI"],["SEMAPHORE"],["SCREWDRIVER"],["SHIPPABLE"],["SOLANO","TDDIUM"],["STRIDER"],["TEAMCITY","TEAMCITY_VERSION"],["TRAVIS"],["VERCEL","NOW_BUILDER"],["VERCEL","VERCEL",{ci:false}],["VERCEL","VERCEL_ENV",{ci:false}],["APPCENTER","APPCENTER_BUILD_ID"],["CODESANDBOX","CODESANDBOX_SSE",{ci:false}],["CODESANDBOX","CODESANDBOX_HOST",{ci:false}],["STACKBLITZ"],["STORMKIT"],["CLEAVR"],["ZEABUR"],["CODESPHERE","CODESPHERE_APP_ID",{ci:true}],["RAILWAY","RAILWAY_PROJECT_ID"],["RAILWAY","RAILWAY_SERVICE_ID"],["DENO-DEPLOY","DENO_DEPLOYMENT_ID"],["FIREBASE_APP_HOSTING","FIREBASE_APP_HOSTING",{ci:true}]];function b(){if(globalThis.process?.env)for(const e of f){const s=e[1]||e[0];if(globalThis.process?.env[s])return {name:e[0].toLowerCase(),...e[2]}}return globalThis.process?.env?.SHELL==="/bin/jsh"&&globalThis.process?.versions?.webcontainer?{name:"stackblitz",ci:false}:{name:"",ci:false}}const l=b();l.name;function n(e){return e?e!=="false":false}const I=globalThis.process?.platform||"",T=n(o.CI)||l.ci!==false,R=n(globalThis.process?.stdout&&globalThis.process?.stdout.isTTY);n(o.DEBUG);const a=t==="test"||n(o.TEST),h=t==="dev"||t==="development";n(o.MINIMAL)||T||a||!R;const A=/^win/i.test(I);!n(o.NO_COLOR)&&(n(o.FORCE_COLOR)||(R||A)&&o.TERM!=="dumb"||T);const C=(globalThis.process?.versions?.node||"").replace(/^v/,"")||null;Number(C?.split(".")[0])||null;const W=globalThis.process||Object.create(null),_={versions:{}};new Proxy(W,{get(e,s){if(s==="env")return o;if(s in e)return e[s];if(s in _)return _[s]}});const O=globalThis.process?.release?.name==="node",c=!!globalThis.Bun||!!globalThis.process?.versions?.bun,D=!!globalThis.Deno,L=!!globalThis.fastly,S=!!globalThis.Netlify,u=!!globalThis.EdgeRuntime,N=globalThis.navigator?.userAgent==="Cloudflare-Workers",F=[[S,"netlify"],[u,"edge-light"],[N,"workerd"],[L,"fastly"],[D,"deno"],[c,"bun"],[O,"node"]];function G(){const e=F.find(s=>s[0]);if(e)return {name:e[1]}}const P=G();P?.name||"";

function buildAssetsDir() {
	// TODO: support passing event to `useRuntimeConfig`
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	// TODO: support passing event to `useRuntimeConfig`
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

function parseAcceptLanguage(value) {
  return value.split(",").map((tag) => tag.split(";")[0]).filter(
    (tag) => !(tag === "*" || tag === "")
  );
}
function createPathIndexLanguageParser(index = 0) {
  return (path) => {
    const rawPath = typeof path === "string" ? path : path.pathname;
    const normalizedPath = rawPath.split("?")[0];
    const parts = normalizedPath.split("/");
    if (parts[0] === "") {
      parts.shift();
    }
    return parts.length > index ? parts[index] || "" : "";
  };
}

function getNitroOrigin$1(ctx = {}) {
  const isDev = ctx.isDev ?? h;
  const isPrerender = ctx.isPrerender ?? !!o.prerender;
  let host = "";
  let port = "";
  let protocol = o.NITRO_SSL_CERT && o.NITRO_SSL_KEY ? "https" : "http";
  if (isDev || isPrerender) {
    const devEnv = o.__NUXT_DEV__ || o.NUXT_VITE_NODE_OPTIONS;
    if (devEnv) {
      const parsed = JSON.parse(devEnv);
      const origin = parsed.proxy?.url || parsed.baseURL?.replace("/__nuxt_vite_node__", "");
      host = origin.replace(/^https?:\/\//, "").replace(/\/$/, "");
      protocol = origin.startsWith("https") ? "https" : "http";
    }
  }
  const hostIsLocalhost = !host || host.startsWith("localhost") || host.startsWith("127.");
  if (isDev && hostIsLocalhost && ctx.requestHost) {
    const reqHost = ctx.requestHost.split(":")[0] || "";
    if (reqHost && !reqHost.startsWith("localhost") && !reqHost.startsWith("127.")) {
      host = ctx.requestHost;
      protocol = ctx.requestProtocol || protocol;
    }
  }
  if (!host && ctx.requestHost) {
    host = ctx.requestHost;
    protocol = ctx.requestProtocol || protocol;
  }
  if (!host) {
    host = o.NITRO_HOST || o.HOST || "";
    if (isDev)
      port = o.NITRO_PORT || o.PORT || "3000";
  }
  if (host.includes(":")) {
    const i = host.lastIndexOf(":");
    port = host.slice(i + 1);
    host = host.slice(0, i);
  }
  host = o.NUXT_SITE_HOST_OVERRIDE || host;
  port = o.NUXT_SITE_PORT_OVERRIDE || port;
  if (host.startsWith("http://") || host.startsWith("https://")) {
    protocol = host.startsWith("https://") ? "https" : "http";
    host = host.replace(/^https?:\/\//, "");
  } else if (!host.includes("localhost") && !host.startsWith("127.")) {
    protocol = "https";
  }
  return `${protocol}://${host}${port ? `:${port}` : ""}/`;
}

function getNitroOrigin(e) {
  return getNitroOrigin$1({
    isDev: false,
    isPrerender: false,
    requestHost: e ? getRequestHost(e, { xForwardedHost: true }) : void 0,
    requestProtocol: e ? getRequestProtocol(e, { xForwardedProto: true }) : void 0
  });
}

function getSiteIndexable(e) {
  const { env, indexable } = getSiteConfig(e);
  if (typeof indexable !== "undefined")
    return String(indexable) === "true";
  return env === "production";
}

function useSiteConfig(e, _options) {
  return getSiteConfig(e, _options);
}

function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  let origin = withoutTrailingSlash(options.absolute ? options.siteUrl : "");
  if (base !== "/" && origin.endsWith(base)) {
    origin = origin.slice(0, origin.indexOf(base));
  }
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
const fileExtensions = [
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
  // Documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "md",
  "markdown",
  // Archives
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  // Audio
  "mp3",
  "wav",
  "flac",
  "ogg",
  "opus",
  "m4a",
  "aac",
  "midi",
  "mid",
  // Video
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  // Web
  "html",
  "css",
  "js",
  "json",
  "xml",
  "tsx",
  "jsx",
  "ts",
  "vue",
  "svelte",
  "xsl",
  "rss",
  "atom",
  // Programming
  "php",
  "py",
  "rb",
  "java",
  "c",
  "cpp",
  "h",
  "go",
  // Data formats
  "csv",
  "tsv",
  "sql",
  "yaml",
  "yml",
  // Fonts
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  // Executables/Binaries
  "exe",
  "msi",
  "apk",
  "ipa",
  "dmg",
  "iso",
  "bin",
  // Scripts/Config
  "bat",
  "cmd",
  "sh",
  "env",
  "htaccess",
  "conf",
  "toml",
  "ini",
  // Package formats
  "deb",
  "rpm",
  "jar",
  "war",
  // E-books
  "epub",
  "mobi",
  // Common temporary/backup files
  "log",
  "tmp",
  "bak",
  "old",
  "sav"
];
function isPathFile(path) {
  const lastSegment = path.split("/").pop();
  const ext = (lastSegment || path).match(/\.[0-9a-z]+$/i)?.[0];
  return ext && fileExtensions.includes(ext.replace(".", ""));
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  if (isPathFile($url.pathname))
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}

function createSitePathResolver(e, options = {}) {
  const siteConfig = getSiteConfig(e);
  const nitroOrigin = getNitroOrigin(e);
  const nuxtBase = useRuntimeConfig(e).app.baseURL || "/";
  return (path) => {
    return resolveSitePath(path, {
      ...options,
      siteUrl: options.canonical !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    });
  };
}
function withSiteUrl(e, path, options = {}) {
  const siteConfig = e.context.siteConfig?.get();
  let siteUrl = e.context.siteConfigNitroOrigin;
  if ((options.canonical !== false || false) && siteConfig.url)
    siteUrl = siteConfig.url;
  return resolveSitePath(path, {
    absolute: true,
    siteUrl,
    trailingSlash: siteConfig.trailingSlash,
    base: e.context.nitro.baseURL,
    withBase: options.withBase
  });
}

function withoutQuery$1(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher$1(e) {
  const { nitro, app } = useRuntimeConfig(e);
  const _routeRulesMatcher = toRouteMatcher(
    createRouter$1({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [withoutTrailingSlash(path), rules])
      )
    })
  );
  return (path) => {
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(withoutTrailingSlash(withoutQuery$1(path)), app.baseURL)
    ).reverse());
  };
}

function getSiteRobotConfig(e) {
  const query = getQuery(e);
  const hints = [];
  const { groups, debug } = useRuntimeConfigNuxtRobots(e);
  let indexable = getSiteIndexable(e);
  const queryIndexableEnabled = String(query.mockProductionEnv) === "true" || query.mockProductionEnv === "";
  if (debug || false) {
    const { _context } = getSiteConfig(e, { debug: debug || false });
    if (queryIndexableEnabled) {
      indexable = true;
      hints.push("You are mocking a production enviroment with ?mockProductionEnv query.");
    } else if (!indexable && _context.indexable === "nuxt-robots:config") {
      hints.push("You are blocking indexing with your Nuxt Robots config.");
    } else if (!queryIndexableEnabled && !_context.indexable) {
      hints.push(`Indexing is blocked in development. You can mock a production environment with ?mockProductionEnv query.`);
    } else if (!indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is blocked by site config set by ${_context.indexable}.`);
    } else if (indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is enabled from ${_context.indexable}.`);
    }
  }
  if (groups.some((g) => g.userAgent.includes("*") && g.disallow.includes("/"))) {
    indexable = false;
    hints.push("You are blocking all user agents with a wildcard `Disallow /`.");
  } else if (groups.some((g) => g.disallow.includes("/"))) {
    hints.push("You are blocking specific user agents with `Disallow /`.");
  }
  return { indexable, hints };
}

function getPathRobotConfig(e, options) {
  const runtimeConfig = useRuntimeConfig(e);
  const { robotsDisabledValue, robotsEnabledValue, isNuxtContentV2 } = useRuntimeConfigNuxtRobots(e);
  if (!options?.skipSiteIndexable) {
    if (!getSiteRobotConfig(e).indexable) {
      return {
        rule: robotsDisabledValue,
        indexable: false,
        debug: {
          source: "Site Config"
        }
      };
    }
  }
  const path = options?.path || e.path;
  let userAgent = options?.userAgent;
  if (!userAgent) {
    try {
      userAgent = getRequestHeader(e, "User-Agent");
    } catch {
    }
  }
  const nitroApp = useNitroApp();
  const groups = [
    // run explicit user agent matching first
    ...nitroApp._robots.ctx.groups.filter((g) => {
      if (userAgent) {
        return g.userAgent.some((ua) => ua.toLowerCase().includes(userAgent.toLowerCase()));
      }
      return false;
    }),
    // run wildcard matches second
    ...nitroApp._robots.ctx.groups.filter((g) => g.userAgent.includes("*"))
  ];
  for (const group of groups) {
    if (group._indexable === false) {
      return {
        indexable: false,
        rule: robotsDisabledValue,
        debug: {
          source: "/robots.txt",
          line: JSON.stringify(group)
        }
      };
    }
    const robotsTxtRule = matchPathToRule(path, group._rules || []);
    if (robotsTxtRule) {
      if (!robotsTxtRule.allow) {
        return {
          indexable: false,
          rule: robotsDisabledValue,
          debug: {
            source: "/robots.txt",
            line: `Disallow: ${robotsTxtRule.pattern}`
          }
        };
      }
      break;
    }
  }
  if (isNuxtContentV2 && nitroApp._robots?.nuxtContentUrls?.has(withoutTrailingSlash(path))) {
    return {
      indexable: false,
      rule: robotsDisabledValue,
      debug: {
        source: "Nuxt Content"
      }
    };
  }
  const { pageMetaRobots } = useRuntimeConfigNuxtRobots(e);
  const pageMetaRule = pageMetaRobots?.[withoutTrailingSlash(path)];
  if (typeof pageMetaRule !== "undefined") {
    const normalised = normaliseRobotsRouteRule({ robots: pageMetaRule });
    if (normalised && (typeof normalised.allow !== "undefined" || typeof normalised.rule !== "undefined")) {
      return {
        indexable: normalised.allow ?? false,
        rule: normalised.rule || (normalised.allow ? robotsEnabledValue : robotsDisabledValue),
        debug: {
          source: "Page Meta"
        }
      };
    }
  }
  nitroApp._robotsRuleMatcher = nitroApp._robotsRuleMatcher || createNitroRouteRuleMatcher$1(e);
  let robotRouteRules = nitroApp._robotsRuleMatcher(path);
  let routeRulesPath = path;
  if (runtimeConfig.public?.i18n?.locales && typeof robotRouteRules.robots === "undefined") {
    const { locales } = runtimeConfig.public.i18n;
    const locale = locales.find((l) => routeRulesPath.startsWith(`/${l.code}`));
    if (locale) {
      routeRulesPath = routeRulesPath.replace(`/${locale.code}`, "");
      robotRouteRules = nitroApp._robotsRuleMatcher(routeRulesPath);
    }
  }
  const routeRules = normaliseRobotsRouteRule(robotRouteRules);
  if (routeRules && (typeof routeRules.allow !== "undefined" || typeof routeRules.rule !== "undefined")) {
    return {
      indexable: routeRules.allow ?? false,
      rule: routeRules.rule || (routeRules.allow ? robotsEnabledValue : robotsDisabledValue),
      debug: {
        source: "Route Rules"
      }
    };
  }
  return {
    indexable: true,
    rule: robotsEnabledValue
  };
}

function useRuntimeI18n(nuxtApp, event) {
  {
    return useRuntimeConfig(event).public.i18n;
  }
}
function useI18nDetection(nuxtApp) {
  const detectBrowserLanguage = useRuntimeI18n().detectBrowserLanguage;
  const detect = detectBrowserLanguage || {};
  return {
    ...detect,
    enabled: !!detectBrowserLanguage,
    cookieKey: detect.cookieKey || "i18n_redirected"
  };
}
function resolveRootRedirect(config) {
  if (!config) {
    return void 0;
  }
  return {
    path: "/" + (isString(config) ? config : config.path).replace(/^\//, ""),
    code: !isString(config) && config.statusCode || 302
  };
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

function createLocaleConfigs(fallbackLocale) {
  const localeConfigs = {};
  for (const locale of localeCodes) {
    const fallbacks = getFallbackLocaleCodes(fallbackLocale, [locale]);
    const cacheable = isLocaleWithFallbacksCacheable(locale, fallbacks);
    localeConfigs[locale] = { fallbacks, cacheable };
  }
  return localeConfigs;
}
function getFallbackLocaleCodes(fallback, locales) {
  if (fallback === false) {
    return [];
  }
  if (isArray(fallback)) {
    return fallback;
  }
  let fallbackLocales = [];
  if (isString(fallback)) {
    if (locales.every((locale) => locale !== fallback)) {
      fallbackLocales.push(fallback);
    }
    return fallbackLocales;
  }
  const targets = [...locales, "default"];
  for (const locale of targets) {
    if (locale in fallback == false) {
      continue;
    }
    fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)];
  }
  return fallbackLocales;
}
function isLocaleCacheable(locale) {
  return localeLoaders[locale] != null && localeLoaders[locale].every((loader) => loader.cache !== false);
}
function isLocaleWithFallbacksCacheable(locale, fallbackLocales) {
  return isLocaleCacheable(locale) && fallbackLocales.every((fallbackLocale) => isLocaleCacheable(fallbackLocale));
}
function getDefaultLocaleForDomain(host) {
  return normalizedLocales.find((l) => !!l.defaultForDomains?.includes(host))?.code;
}
const isSupportedLocale = (locale) => localeCodes.includes(locale || "");

function useI18nContext(event) {
  if (event.context.nuxtI18n == null) {
    throw new Error("Nuxt I18n server context has not been set up yet.");
  }
  return event.context.nuxtI18n;
}
function tryUseI18nContext(event) {
  return event.context.nuxtI18n;
}
const getHost = (event) => getRequestURL(event, { xForwardedHost: true }).host;
async function initializeI18nContext(event) {
  const runtimeI18n = useRuntimeI18n(void 0, event);
  const defaultLocale = runtimeI18n.defaultLocale || "";
  const options = await setupVueI18nOptions(getDefaultLocaleForDomain(getHost(event)) || defaultLocale);
  const localeConfigs = createLocaleConfigs(options.fallbackLocale);
  const ctx = createI18nContext();
  ctx.vueI18nOptions = options;
  ctx.localeConfigs = localeConfigs;
  event.context.nuxtI18n = ctx;
  return ctx;
}
function createI18nContext() {
  return {
    messages: {},
    slp: {},
    localeConfigs: {},
    trackMap: {},
    vueI18nOptions: void 0,
    trackKey(key, locale) {
      this.trackMap[locale] ??= /* @__PURE__ */ new Set();
      this.trackMap[locale].add(key);
    }
  };
}

function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
  const matchedLocales = matchBrowserLocale(
    locales.map((l) => ({ code: l.code, language: l.language || l.code })),
    browserLocales
  );
  return matchedLocales.sort(compareBrowserLocale).at(0)?.code ?? "";
}

const appHead = {"link":[{"rel":"icon","href":"/favicon.ico","type":"image/x-icon"},{"rel":"shortcut icon","href":"/favicon.ico","type":"image/x-icon"},{"rel":"apple-touch-icon","sizes":"180x180","href":"/apple-touch-icon.png"},{"rel":"icon","type":"image/png","sizes":"96x96","href":"/favicon-96x96.png"},{"rel":"icon","type":"image/png","href":"/logo.png"},{"rel":"manifest","href":"/site.webmanifest"}],"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"name":"format-detection","content":"telephone=no"},{"name":"description","content":"Flybeth — Book cheap flights, luxury hotels, and vacation rentals. Aggregating the best deals from Hotelbeds, Amadeus, and Duffel for a seamless travel experience."},{"name":"keywords","content":"cheap flights, hotel booking, travel aggregator, vacation rentals, Flybeth, Hotelbeds, Amadeus travel, Duffel flights"},{"name":"author","content":"Flybeth"},{"property":"og:title","content":"Flybeth — Book Flights, Hotels & Stays"},{"property":"og:description","content":"Find the best travel deals globally. Book cheap flights, luxury hotels, and vacation rentals with Flybeth."},{"property":"og:type","content":"website"},{"property":"og:url","content":"https://flybeth.com"},{"property":"og:image","content":"/logo.png"},{"name":"twitter:card","content":"summary_large_image"},{"property":"twitter:url","content":"https://flybeth.com"},{"name":"twitter:title","content":"Flybeth — Online Flight & Hotel Booking"},{"name":"twitter:description","content":"Book verified travel deals online and access secure booking services with Flybeth."},{"name":"twitter:image","content":"/logo.png"},{"name":"title","content":"Flybeth - Your Gateway to Global Travel"},{"name":"description","content":"Find and book the best travel deals globally. Aggregated from top-tier providers like Hotelbeds, Amadeus, and Duffel."},{"name":"keywords","content":"flights, hotels, vacations, travel, flybeth"},{"property":"og:title","content":"Flybeth - Your Gateway to Global Travel"},{"property":"og:description","content":"Find and book the best travel deals globally. Aggregated from top-tier providers like Hotelbeds, Amadeus, and Duffel."},{"property":"og:image","content":"/logo.png"},{"name":"twitter:card","content":"summary_large_image"}],"style":[],"script":[{"src":"https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js","type":"text/javascript"}],"noscript":[],"title":"Flybeth | Premium Flights & Stays Aggregator","htmlAttrs":{"lang":"en"}};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const separator = "___";
const pathLanguageParser = createPathIndexLanguageParser(0);
const getLocaleFromRoutePath = (path) => pathLanguageParser(path);
const getLocaleFromRouteName = (name) => name.split(separator).at(1) ?? "";
function normalizeInput(input) {
  return typeof input !== "object" ? String(input) : String(input?.name || input?.path || "");
}
function getLocaleFromRoute(route) {
  const input = normalizeInput(route);
  return input[0] === "/" ? getLocaleFromRoutePath(input) : getLocaleFromRouteName(input);
}

function matchDomainLocale(locales, host, pathLocale) {
  const normalizeDomain = (domain = "") => domain.replace(/https?:\/\//, "");
  const matches = locales.filter(
    (locale) => normalizeDomain(locale.domain) === host || toArray(locale.domains).includes(host)
  );
  if (matches.length <= 1) {
    return matches[0]?.code;
  }
  return (
    // match by current path locale
    matches.find((l) => l.code === pathLocale)?.code || matches.find((l) => l.defaultForDomains?.includes(host) ?? l.domainDefault)?.code
  );
}

const getCookieLocale = (event, cookieName) => (getCookie(event, cookieName)) || void 0;
const getRouteLocale = (event, route) => getLocaleFromRoute(route);
const getHeaderLocale = (event) => findBrowserLocale(normalizedLocales, parseAcceptLanguage(getRequestHeader(event, "accept-language") || ""));
const getHostLocale = (event, path, domainLocales) => {
  const host = getRequestURL(event, { xForwardedHost: true }).host;
  const locales = normalizedLocales.map((l) => ({
    ...l,
    domain: domainLocales[l.code]?.domain ?? l.domain
  }));
  return matchDomainLocale(locales, host, getLocaleFromRoutePath(path));
};
const useDetectors = (event, config, nuxtApp) => {
  if (!event) {
    throw new Error("H3Event is required for server-side locale detection");
  }
  const runtimeI18n = useRuntimeI18n();
  return {
    cookie: () => getCookieLocale(event, config.cookieKey),
    header: () => getHeaderLocale(event) ,
    navigator: () => void 0,
    host: (path) => getHostLocale(event, path, runtimeI18n.domainLocales),
    route: (path) => getRouteLocale(event, path)
  };
};

// Generated by @nuxtjs/i18n
const pathToI18nConfig = {};
const i18nPathToPath = {};

const matcher = createRouterMatcher([], {});
for (const path of Object.keys(i18nPathToPath)) {
  matcher.addRoute({ path, component: () => "", meta: {} });
}
const getI18nPathToI18nPath = (path, locale) => {
  if (!path || !locale) {
    return;
  }
  const plainPath = i18nPathToPath[path];
  const i18nConfig = pathToI18nConfig[plainPath];
  if (i18nConfig && i18nConfig[locale]) {
    return i18nConfig[locale] === true ? plainPath : i18nConfig[locale];
  }
};
function isExistingNuxtRoute(path) {
  if (path === "") {
    return;
  }
  if (path.endsWith("/__nuxt_error")) {
    return;
  }
  const resolvedMatch = matcher.resolve({ path }, { path: "/", name: "", matched: [], params: {}, meta: {} });
  return resolvedMatch.matched.length > 0 ? resolvedMatch : void 0;
}
function matchLocalized(path, locale, defaultLocale) {
  if (path === "") {
    return;
  }
  const parsed = parsePath(path);
  const resolvedMatch = matcher.resolve(
    { path: parsed.pathname || "/" },
    { path: "/", name: "", matched: [], params: {}, meta: {} }
  );
  if (resolvedMatch.matched.length > 0) {
    const alternate = getI18nPathToI18nPath(resolvedMatch.matched[0].path, locale);
    const match = matcher.resolve(
      { params: resolvedMatch.params },
      { path: alternate || "/", name: "", matched: [], params: {}, meta: {} }
    );
    return withLeadingSlash(joinURL("", match.path));
  }
}

function* detect(detectors, detection, path) {
  if (detection.enabled) {
    yield { locale: detectors.cookie(), source: "cookie" };
    yield { locale: detectors.header(), source: "header" };
  }
  yield { locale: detection.fallbackLocale, source: "fallback" };
}
function createRedirectResponse(event, dest, code) {
  event.node.res.setHeader("location", dest);
  event.node.res.statusCode = sanitizeStatusCode(code, event.node.res.statusCode);
  return {
    headers: event.node.res.getHeaders(),
    statusCode: event.node.res.statusCode,
    body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${dest.replace(/"/g, "%22")}"></head></html>`
  };
}
const _LrfuAh8WVKZXezAKa9NsOzqhtwZcNLyJoTi7xFobuew = defineNitroPlugin(async (nitro) => {
  const runtimeI18n = useRuntimeI18n();
  const rootRedirect = resolveRootRedirect(runtimeI18n.rootRedirect);
  runtimeI18n.defaultLocale || "";
  try {
    const cacheStorage = useStorage("cache");
    const cachedKeys = await cacheStorage.getKeys("nitro:handlers:i18n");
    await Promise.all(cachedKeys.map((key) => cacheStorage.removeItem(key)));
  } catch {
  }
  const detection = useI18nDetection();
  const cookieOptions = {
    path: "/",
    domain: detection.cookieDomain || void 0,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: detection.cookieSecure
  };
  const createBaseUrlGetter = () => {
    isFunction(runtimeI18n.baseUrl) ? "" : runtimeI18n.baseUrl || "";
    if (isFunction(runtimeI18n.baseUrl)) {
      return () => "";
    }
    return (event, defaultLocale) => {
      return "";
    };
  };
  function resolveRedirectPath(event, path, pathLocale, defaultLocale, detector) {
    let locale = "";
    for (const detected of detect(detector, detection, event.path)) {
      if (detected.locale && isSupportedLocale(detected.locale)) {
        locale = detected.locale;
        break;
      }
    }
    locale ||= defaultLocale;
    function getLocalizedMatch(locale2) {
      const res = matchLocalized(path || "/", locale2);
      if (res && res !== event.path) {
        return res;
      }
    }
    let resolvedPath = void 0;
    let redirectCode = 302;
    const requestURL = getRequestURL(event);
    if (rootRedirect && requestURL.pathname === "/") {
      locale = detection.enabled && locale || defaultLocale;
      resolvedPath = isSupportedLocale(detector.route(rootRedirect.path)) && rootRedirect.path || matchLocalized(rootRedirect.path, locale);
      redirectCode = rootRedirect.code;
    } else if (runtimeI18n.redirectStatusCode) {
      redirectCode = runtimeI18n.redirectStatusCode;
    }
    switch (detection.redirectOn) {
      case "root":
        if (requestURL.pathname !== "/") {
          break;
        }
      // fallthrough (root has no prefix)
      case "no prefix":
        if (pathLocale) {
          break;
        }
      // fallthrough to resolve
      case "all":
        resolvedPath ??= getLocalizedMatch(locale);
        break;
    }
    if (requestURL.pathname === "/" && "no_prefix" === "prefix") ;
    return { path: resolvedPath, code: redirectCode, locale };
  }
  const baseUrlGetter = createBaseUrlGetter();
  nitro.hooks.hook("request", async (event) => {
    await initializeI18nContext(event);
  });
  nitro.hooks.hook("render:before", async (context) => {
    const { event } = context;
    const ctx = useI18nContext(event);
    const url = getRequestURL(event);
    const detector = useDetectors(event, detection);
    const localeSegment = detector.route(event.path);
    const pathLocale = isSupportedLocale(localeSegment) && localeSegment || void 0;
    const path = (pathLocale && url.pathname.slice(pathLocale.length + 1)) ?? url.pathname;
    if (!url.pathname.includes("/_i18n/kmuwHlf7") && !isExistingNuxtRoute(path)) {
      return;
    }
    const resolved = resolveRedirectPath(event, path, pathLocale, ctx.vueI18nOptions.defaultLocale, detector);
    if (resolved.path && resolved.path !== url.pathname) {
      ctx.detectLocale = resolved.locale;
      detection.useCookie && setCookie(event, detection.cookieKey, resolved.locale, cookieOptions);
      context.response = createRedirectResponse(
        event,
        joinURL(baseUrlGetter(event, ctx.vueI18nOptions.defaultLocale), resolved.path + url.search),
        resolved.code
      );
      return;
    }
  });
  nitro.hooks.hook("render:html", (htmlContext, { event }) => {
    tryUseI18nContext(event);
  });
});

const plugins = [
  _En4IBoy9b4vZKQWQ1fIR0UMA5JDHMe9dnvgFHOaukSA,
_KWmNDhuPCGApZ_cRRtZU5E1oPXKds5MHlj_FNJBUk,
_LrfuAh8WVKZXezAKa9NsOzqhtwZcNLyJoTi7xFobuew
];

const assets = {
  "/404.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"1585-A7ezaKvMaUf1i/AXr6VL1aB42Nw\"",
    "mtime": "2026-04-06T01:57:45.940Z",
    "size": 5509,
    "path": "../public/404.html"
  },
  "/_robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"18-j8OIsL9qGDmNZ+lHhp2tyH4XtaE\"",
    "mtime": "2026-04-06T01:57:46.276Z",
    "size": 24,
    "path": "../public/_robots.txt"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2026-04-06T01:57:46.276Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"1490-X2Wz86eA2myOnOuUhsa1Eupqd3k\"",
    "mtime": "2026-04-06T01:57:45.940Z",
    "size": 5264,
    "path": "../public/index.html"
  },
  "/logo.png": {
    "type": "image/png",
    "etag": "\"3726-TUnyO5UVx0VMXRb3ZzZ6l+O+5CM\"",
    "mtime": "2026-04-06T01:57:46.276Z",
    "size": 14118,
    "path": "../public/logo.png"
  },
  "/_nuxt/0_ZlnUP1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d4-ynL55eq9dRiPPvALUsNllLBIH5w\"",
    "mtime": "2026-04-06T01:57:46.195Z",
    "size": 980,
    "path": "../public/_nuxt/0_ZlnUP1.js"
  },
  "/_nuxt/6h7dVJpk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7b-ZhfKPCP9ZXB+kQR7rRAAOzXkep8\"",
    "mtime": "2026-04-06T01:57:46.185Z",
    "size": 123,
    "path": "../public/_nuxt/6h7dVJpk.js"
  },
  "/_nuxt/6mNsZxjX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"52b-0TYjzlpxU29EpAShonNmGTUmCz4\"",
    "mtime": "2026-04-06T01:57:46.185Z",
    "size": 1323,
    "path": "../public/_nuxt/6mNsZxjX.js"
  },
  "/_nuxt/A7eVVgD0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"34a-tfaT6//RfsSj3U2Cjc+fC3me/DA\"",
    "mtime": "2026-04-06T01:57:46.195Z",
    "size": 842,
    "path": "../public/_nuxt/A7eVVgD0.js"
  },
  "/_nuxt/AnimatedInput.DZT5yiBp.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"435-3ReQqSJGpDVaJWEduXLLqfQ8EHs\"",
    "mtime": "2026-04-06T01:57:46.195Z",
    "size": 1077,
    "path": "../public/_nuxt/AnimatedInput.DZT5yiBp.css"
  },
  "/_nuxt/B1weyKn0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7d-GkS5hMcxye4cXPVAXnQFzU0qr3s\"",
    "mtime": "2026-04-06T01:57:46.188Z",
    "size": 125,
    "path": "../public/_nuxt/B1weyKn0.js"
  },
  "/_nuxt/B7uzspx0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1db0-IwZHNWVhJbHFxAumepO+HBuV0Us\"",
    "mtime": "2026-04-06T01:57:46.187Z",
    "size": 7600,
    "path": "../public/_nuxt/B7uzspx0.js"
  },
  "/_nuxt/B8zQ4uL5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a6-wubee1S7LM5FTh6uDymB7i8JZNc\"",
    "mtime": "2026-04-06T01:57:46.188Z",
    "size": 166,
    "path": "../public/_nuxt/B8zQ4uL5.js"
  },
  "/_nuxt/BBTBR60h.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"178-ULHheXUrAvL5pf7xCtElVUoMqQk\"",
    "mtime": "2026-04-06T01:57:46.189Z",
    "size": 376,
    "path": "../public/_nuxt/BBTBR60h.js"
  },
  "/_nuxt/BFPpdZuN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d3-E3BG8XNez4zzHAi9RYZWs8pksTo\"",
    "mtime": "2026-04-06T01:57:46.194Z",
    "size": 979,
    "path": "../public/_nuxt/BFPpdZuN.js"
  },
  "/_nuxt/BFqbL22G.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3e33-vSfChkG3a0LEjFRqzBI2FB5jpVo\"",
    "mtime": "2026-04-06T01:57:46.200Z",
    "size": 15923,
    "path": "../public/_nuxt/BFqbL22G.js"
  },
  "/_nuxt/BKZelGG3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1cf-wpWI+jDQRjg8nVi1PY8RNGjDsv8\"",
    "mtime": "2026-04-06T01:57:46.197Z",
    "size": 463,
    "path": "../public/_nuxt/BKZelGG3.js"
  },
  "/_nuxt/BKlhfXc5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"237-wdjN+L7Zn6qagdZX3Sz77erAsV0\"",
    "mtime": "2026-04-06T01:57:46.197Z",
    "size": 567,
    "path": "../public/_nuxt/BKlhfXc5.js"
  },
  "/_nuxt/BLQViytc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"21d-rnm0gbgvDEYZL4SpbTCW5D0jaG4\"",
    "mtime": "2026-04-06T01:57:46.198Z",
    "size": 541,
    "path": "../public/_nuxt/BLQViytc.js"
  },
  "/_nuxt/BMV_GBXT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2a8-E3Zoj0ET9BKvjVjXvMX109pcrt0\"",
    "mtime": "2026-04-06T01:57:46.201Z",
    "size": 680,
    "path": "../public/_nuxt/BMV_GBXT.js"
  },
  "/_nuxt/BRVlBq5r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5e32-t0JPJqL8v6BO3jPTCgIQbAk2N2U\"",
    "mtime": "2026-04-06T01:57:46.201Z",
    "size": 24114,
    "path": "../public/_nuxt/BRVlBq5r.js"
  },
  "/_nuxt/BRoeIp-9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5084-RbMM06IaImocqHNftJ47SbPhWoA\"",
    "mtime": "2026-04-06T01:57:46.199Z",
    "size": 20612,
    "path": "../public/_nuxt/BRoeIp-9.js"
  },
  "/_nuxt/BRtwvr9Y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c4-kRzD9hyy03DwqL/XShK9OaxA85k\"",
    "mtime": "2026-04-06T01:57:46.199Z",
    "size": 196,
    "path": "../public/_nuxt/BRtwvr9Y.js"
  },
  "/_nuxt/BS3BV-oI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"262-/2oA7VuXUx0/3vt+Urdf2Gyu+D0\"",
    "mtime": "2026-04-06T01:57:46.201Z",
    "size": 610,
    "path": "../public/_nuxt/BS3BV-oI.js"
  },
  "/images/expert-avatar.png": {
    "type": "image/png",
    "etag": "\"9a264-ys8bbkspQQivxoNwTFJ7yo45quU\"",
    "mtime": "2026-04-06T01:57:46.277Z",
    "size": 631396,
    "path": "../public/images/expert-avatar.png"
  },
  "/_nuxt/BSfRLZm4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ce-oay0rE3i+8NY3tFbtWP/w39Du6U\"",
    "mtime": "2026-04-06T01:57:46.202Z",
    "size": 462,
    "path": "../public/_nuxt/BSfRLZm4.js"
  },
  "/_nuxt/BdgehyoU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ac-1xfW/HaRCu+BVQjKEHoYRgo842U\"",
    "mtime": "2026-04-06T01:57:46.203Z",
    "size": 684,
    "path": "../public/_nuxt/BdgehyoU.js"
  },
  "/_nuxt/BYdPxpTR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16151-KC3xkBd/TJCQPVgWHVQWbaSeVsc\"",
    "mtime": "2026-04-06T01:57:46.205Z",
    "size": 90449,
    "path": "../public/_nuxt/BYdPxpTR.js"
  },
  "/_nuxt/Bdlb37jW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3e60-c/tJaxgPb9lpYXMfTcnUHoYb1gE\"",
    "mtime": "2026-04-06T01:57:46.202Z",
    "size": 15968,
    "path": "../public/_nuxt/Bdlb37jW.js"
  },
  "/_nuxt/Bi4XCSLC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f6b-Urr5VyZ5HDgEmRVG1HEK/83j3ok\"",
    "mtime": "2026-04-06T01:57:46.210Z",
    "size": 16235,
    "path": "../public/_nuxt/Bi4XCSLC.js"
  },
  "/_nuxt/BmUaZR6R.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bc0-W7MgaTjZr8rXHDgKxcKPXST61+o\"",
    "mtime": "2026-04-06T01:57:46.206Z",
    "size": 3008,
    "path": "../public/_nuxt/BmUaZR6R.js"
  },
  "/_nuxt/BmfZWx-7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f58-1JrY6CtjitQoUi+te1J5Convr0A\"",
    "mtime": "2026-04-06T01:57:46.203Z",
    "size": 16216,
    "path": "../public/_nuxt/BmfZWx-7.js"
  },
  "/_nuxt/BrmmU_Gn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"34d-DIz1veJeNBpunUSMXi2U5p0rzso\"",
    "mtime": "2026-04-06T01:57:46.204Z",
    "size": 845,
    "path": "../public/_nuxt/BrmmU_Gn.js"
  },
  "/_nuxt/Bs1dElfw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d9-IkC+ke3St+Wjl9WVkBCWbkOVgtY\"",
    "mtime": "2026-04-06T01:57:46.205Z",
    "size": 473,
    "path": "../public/_nuxt/Bs1dElfw.js"
  },
  "/_nuxt/Btfl2djJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"59c3-vZskhS889BEVKVwy0QcWJOBQv0w\"",
    "mtime": "2026-04-06T01:57:46.205Z",
    "size": 22979,
    "path": "../public/_nuxt/Btfl2djJ.js"
  },
  "/_nuxt/BuDowK3u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"71-gu4Q2ITIXCxo+x/PWv3KGMCWBhA\"",
    "mtime": "2026-04-06T01:57:46.210Z",
    "size": 113,
    "path": "../public/_nuxt/BuDowK3u.js"
  },
  "/_nuxt/C-9C31KP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"115b-FleCd5SqM0bvg+DRbASAnaqTgjw\"",
    "mtime": "2026-04-06T01:57:46.205Z",
    "size": 4443,
    "path": "../public/_nuxt/C-9C31KP.js"
  },
  "/_nuxt/C0ZfF3r9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15c2-yRzRHMDzb8uZsTpNsnQWxkyZiaQ\"",
    "mtime": "2026-04-06T01:57:46.206Z",
    "size": 5570,
    "path": "../public/_nuxt/C0ZfF3r9.js"
  },
  "/_nuxt/C1AQW7tN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3717-cFjq72FVBDk+zWCNtKQ5lmZnVYs\"",
    "mtime": "2026-04-06T01:57:46.206Z",
    "size": 14103,
    "path": "../public/_nuxt/C1AQW7tN.js"
  },
  "/_nuxt/C1ys4Q06.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9f-dWpo8Oc9wNr6YqCF/4siXwyR7Ak\"",
    "mtime": "2026-04-06T01:57:46.209Z",
    "size": 159,
    "path": "../public/_nuxt/C1ys4Q06.js"
  },
  "/_nuxt/C4FlCogY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c71-GNzV31uQpXKM/Axssk+eEahmW3A\"",
    "mtime": "2026-04-06T01:57:46.207Z",
    "size": 3185,
    "path": "../public/_nuxt/C4FlCogY.js"
  },
  "/_nuxt/C4nXgLiG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d7b-TOZu1T3jhx3T/0FJJQSkU3sCADw\"",
    "mtime": "2026-04-06T01:57:46.207Z",
    "size": 3451,
    "path": "../public/_nuxt/C4nXgLiG.js"
  },
  "/_nuxt/C4vCk7C-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"272-68gHTHhibtwcP0r5hCQDZB0Ko1w\"",
    "mtime": "2026-04-06T01:57:46.209Z",
    "size": 626,
    "path": "../public/_nuxt/C4vCk7C-.js"
  },
  "/_nuxt/C6mAYNni.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e1c-7EKMJFJG/2pdyufEuHlthYhxx8I\"",
    "mtime": "2026-04-06T01:57:46.209Z",
    "size": 3612,
    "path": "../public/_nuxt/C6mAYNni.js"
  },
  "/_nuxt/C75gVXan.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18c-C4Q87TmBnyoLQqljmdcBspoaX+I\"",
    "mtime": "2026-04-06T01:57:46.210Z",
    "size": 396,
    "path": "../public/_nuxt/C75gVXan.js"
  },
  "/_nuxt/C88yoqYL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fe9-uSS9mMuxuL1AgJ4g5Eyil7V7NkM\"",
    "mtime": "2026-04-06T01:57:46.210Z",
    "size": 4073,
    "path": "../public/_nuxt/C88yoqYL.js"
  },
  "/_nuxt/CB5yFmfs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12a-wntNshxLkqm5CnGnpI09I2uAyj4\"",
    "mtime": "2026-04-06T01:57:46.210Z",
    "size": 298,
    "path": "../public/_nuxt/CB5yFmfs.js"
  },
  "/_nuxt/CBW34047.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ef-hd/0HhWe5uFmpS+VKwRNCYrLlVg\"",
    "mtime": "2026-04-06T01:57:46.214Z",
    "size": 239,
    "path": "../public/_nuxt/CBW34047.js"
  },
  "/_nuxt/CDR8ER8G.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"46a4-W6NPw9iFnyG5x60Ad/EeFkc3EC0\"",
    "mtime": "2026-04-06T01:57:46.214Z",
    "size": 18084,
    "path": "../public/_nuxt/CDR8ER8G.js"
  },
  "/_nuxt/CE-B83yC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49d1-HQ9n8X/qFBfXoroXUMJ3fOHBBhU\"",
    "mtime": "2026-04-06T01:57:46.215Z",
    "size": 18897,
    "path": "../public/_nuxt/CE-B83yC.js"
  },
  "/_nuxt/CE5bhg5k.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c0-17Riv8N/yiF4YfE/NL+7TdlZdiI\"",
    "mtime": "2026-04-06T01:57:46.211Z",
    "size": 192,
    "path": "../public/_nuxt/CE5bhg5k.js"
  },
  "/_nuxt/CEoZr-T3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13e-KdUTIafen4pgZM9BAVI9KeWD/3w\"",
    "mtime": "2026-04-06T01:57:46.215Z",
    "size": 318,
    "path": "../public/_nuxt/CEoZr-T3.js"
  },
  "/_nuxt/CGwAFi4J.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b4-CeXM9Kmjy+RRKRIN/j4vh/FTHTk\"",
    "mtime": "2026-04-06T01:57:46.214Z",
    "size": 692,
    "path": "../public/_nuxt/CGwAFi4J.js"
  },
  "/_nuxt/CIwUONJQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"54fc-LX5mTM7i3/7Upc3oUm/t1DT9dHk\"",
    "mtime": "2026-04-06T01:57:46.215Z",
    "size": 21756,
    "path": "../public/_nuxt/CIwUONJQ.js"
  },
  "/_nuxt/CQcVDHFN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"262-doviTd9CT2urtghBIWk7DZMa3E0\"",
    "mtime": "2026-04-06T01:57:46.215Z",
    "size": 610,
    "path": "../public/_nuxt/CQcVDHFN.js"
  },
  "/_nuxt/CRX4snV1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14a1-3IJwgYIu4EyA8GjcJ8JuvlFIoyI\"",
    "mtime": "2026-04-06T01:57:46.215Z",
    "size": 5281,
    "path": "../public/_nuxt/CRX4snV1.js"
  },
  "/_nuxt/CSuhWRhX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"156-klKA97sV42gBSx0uoha8feE2NBc\"",
    "mtime": "2026-04-06T01:57:46.215Z",
    "size": 342,
    "path": "../public/_nuxt/CSuhWRhX.js"
  },
  "/_nuxt/CVBAuo5E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c8-HzWZTYiwPkxJ3cJtABI5u6oxb/A\"",
    "mtime": "2026-04-06T01:57:46.217Z",
    "size": 712,
    "path": "../public/_nuxt/CVBAuo5E.js"
  },
  "/_nuxt/CXLfThH3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d2-QDm6JLxY0berNjtlQUCLCYe5opU\"",
    "mtime": "2026-04-06T01:57:46.217Z",
    "size": 210,
    "path": "../public/_nuxt/CXLfThH3.js"
  },
  "/_nuxt/CYYovMYD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1501-XIynX06/UVZpNPcZFWRBSCHLH/c\"",
    "mtime": "2026-04-06T01:57:46.217Z",
    "size": 5377,
    "path": "../public/_nuxt/CYYovMYD.js"
  },
  "/_nuxt/Cbg9_yby.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"722-bALeLp506pqUiu/1uptC6eI9raY\"",
    "mtime": "2026-04-06T01:57:46.217Z",
    "size": 1826,
    "path": "../public/_nuxt/Cbg9_yby.js"
  },
  "/_nuxt/ChuMEK6D.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"282-j+CFJ17Ak87a4bYBl1Iiiyk3Luk\"",
    "mtime": "2026-04-06T01:57:46.217Z",
    "size": 642,
    "path": "../public/_nuxt/ChuMEK6D.js"
  },
  "/_nuxt/CirxSdOW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"260-v+a6hPY+1GOELgF0dy4sSf6ls8o\"",
    "mtime": "2026-04-06T01:57:46.220Z",
    "size": 608,
    "path": "../public/_nuxt/CirxSdOW.js"
  },
  "/_nuxt/CityPicker.B8mISvr2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c5-C+85OFZwDLnwUmcYmuRrdh7ubCU\"",
    "mtime": "2026-04-06T01:57:46.219Z",
    "size": 453,
    "path": "../public/_nuxt/CityPicker.B8mISvr2.css"
  },
  "/_nuxt/CjrPA5ad.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eb4-km5tFClHDt8K6r7yMMxCoURAtAA\"",
    "mtime": "2026-04-06T01:57:46.220Z",
    "size": 3764,
    "path": "../public/_nuxt/CjrPA5ad.js"
  },
  "/_nuxt/Ck7kcBiy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3fc6-imOW7a5nf7t8DS2MRMjOHf3jCdU\"",
    "mtime": "2026-04-06T01:57:46.218Z",
    "size": 16326,
    "path": "../public/_nuxt/Ck7kcBiy.js"
  },
  "/_nuxt/CnC483Cn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"36e-jQfrDMKgvr0ZnuzIt7kzdSiBtgw\"",
    "mtime": "2026-04-06T01:57:46.218Z",
    "size": 878,
    "path": "../public/_nuxt/CnC483Cn.js"
  },
  "/_nuxt/ClMVDBbw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bed1-FLuW+y+Ye29AtHzDYZwR1nYasYs\"",
    "mtime": "2026-04-06T01:57:46.219Z",
    "size": 48849,
    "path": "../public/_nuxt/ClMVDBbw.js"
  },
  "/_nuxt/CuGfog6a.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15b-WRyfyUP1RULhnnAHl/tsi4nOKgM\"",
    "mtime": "2026-04-06T01:57:46.223Z",
    "size": 347,
    "path": "../public/_nuxt/CuGfog6a.js"
  },
  "/_nuxt/D-Gr92iP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3174-MsXGSTLzSD44vFpf4HM9CnU7+TI\"",
    "mtime": "2026-04-06T01:57:46.222Z",
    "size": 12660,
    "path": "../public/_nuxt/D-Gr92iP.js"
  },
  "/_nuxt/CxHO4dDF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"25fd-QNs8qYo/KB7lJMmn1UBVOhB2gDg\"",
    "mtime": "2026-04-06T01:57:46.220Z",
    "size": 9725,
    "path": "../public/_nuxt/CxHO4dDF.js"
  },
  "/_nuxt/D0PJBie6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8e6-mW1a3gnWfT2a0syITCwBMGRLiMw\"",
    "mtime": "2026-04-06T01:57:46.221Z",
    "size": 2278,
    "path": "../public/_nuxt/D0PJBie6.js"
  },
  "/_nuxt/D0RW1mI3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1fc-DJHPy0/f+edNNh/5dtFbwt5OWqk\"",
    "mtime": "2026-04-06T01:57:46.221Z",
    "size": 508,
    "path": "../public/_nuxt/D0RW1mI3.js"
  },
  "/_nuxt/D1GG9M-R.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"17d-iFSKaU+yADe6f/FN68SpKx1OT6c\"",
    "mtime": "2026-04-06T01:57:46.222Z",
    "size": 381,
    "path": "../public/_nuxt/D1GG9M-R.js"
  },
  "/_nuxt/D28dTzC6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b8-GGH0XhsQ2OGFmkSnRev3O7NH/ng\"",
    "mtime": "2026-04-06T01:57:46.225Z",
    "size": 440,
    "path": "../public/_nuxt/D28dTzC6.js"
  },
  "/_nuxt/D3FCseEj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b3-PJnKBYDx8gdod2tyZJgsmMK0uqE\"",
    "mtime": "2026-04-06T01:57:46.224Z",
    "size": 691,
    "path": "../public/_nuxt/D3FCseEj.js"
  },
  "/_nuxt/D7jRSLNA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a7-biseZyvZ9L80IM778s4pzZKUXGY\"",
    "mtime": "2026-04-06T01:57:46.223Z",
    "size": 423,
    "path": "../public/_nuxt/D7jRSLNA.js"
  },
  "/_nuxt/DAqLU3Rm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"23b-mRr/1Rl8RSaolCKD2lToFvZcw1o\"",
    "mtime": "2026-04-06T01:57:46.224Z",
    "size": 571,
    "path": "../public/_nuxt/DAqLU3Rm.js"
  },
  "/_nuxt/DB8OGUwo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11a-tGzhcKuDgEENY/yRfWfZYWwDwxw\"",
    "mtime": "2026-04-06T01:57:46.224Z",
    "size": 282,
    "path": "../public/_nuxt/DB8OGUwo.js"
  },
  "/_nuxt/DCOsjwCu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c68-4TVkuqEMQjcEQJ5WcSb6p4ToyDg\"",
    "mtime": "2026-04-06T01:57:46.226Z",
    "size": 3176,
    "path": "../public/_nuxt/DCOsjwCu.js"
  },
  "/_nuxt/DEMkvae7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ee3-rDMn6CvaBmjk3Y6QFO7/AOabOlA\"",
    "mtime": "2026-04-06T01:57:46.225Z",
    "size": 12003,
    "path": "../public/_nuxt/DEMkvae7.js"
  },
  "/_nuxt/DHwF6x_b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ddc-YsvM0WGv4dNZlOt7gifKWgu04cM\"",
    "mtime": "2026-04-06T01:57:46.225Z",
    "size": 7644,
    "path": "../public/_nuxt/DHwF6x_b.js"
  },
  "/_nuxt/DIguc_nY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7a8-7CtCBuvAyX3Ytpxly1v9Cw8xznY\"",
    "mtime": "2026-04-06T01:57:46.227Z",
    "size": 1960,
    "path": "../public/_nuxt/DIguc_nY.js"
  },
  "/_nuxt/DMIADY9E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2a6-lJJwAmj0WAKfIK/28E4TM4lm7Bk\"",
    "mtime": "2026-04-06T01:57:46.226Z",
    "size": 678,
    "path": "../public/_nuxt/DMIADY9E.js"
  },
  "/_nuxt/DN2Qgm_K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"293a-5kXqGuuJPvn2ozigcxX4wt3Dm5U\"",
    "mtime": "2026-04-06T01:57:46.228Z",
    "size": 10554,
    "path": "../public/_nuxt/DN2Qgm_K.js"
  },
  "/_nuxt/DOzYcHn4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"63-olafaI25kUHsqDjpN27Inxu/4eQ\"",
    "mtime": "2026-04-06T01:57:46.226Z",
    "size": 99,
    "path": "../public/_nuxt/DOzYcHn4.js"
  },
  "/_nuxt/DQ6kP-F6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"704-mG1YhGlnkIv72zzWeSF9PVwkTY8\"",
    "mtime": "2026-04-06T01:57:46.226Z",
    "size": 1796,
    "path": "../public/_nuxt/DQ6kP-F6.js"
  },
  "/_nuxt/DTBrLzbo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"689-0CFUzMZ2cZwtj6qWBt0bEuKD3RY\"",
    "mtime": "2026-04-06T01:57:46.226Z",
    "size": 1673,
    "path": "../public/_nuxt/DTBrLzbo.js"
  },
  "/_nuxt/DTHgsbHo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2214-DczD2Aj5N1EXtXWoEjMS/r8njGo\"",
    "mtime": "2026-04-06T01:57:46.227Z",
    "size": 8724,
    "path": "../public/_nuxt/DTHgsbHo.js"
  },
  "/_nuxt/DTQQTnIe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4251-RrTMUAgcsaQrAvBoY4Zeo8nRubk\"",
    "mtime": "2026-04-06T01:57:46.228Z",
    "size": 16977,
    "path": "../public/_nuxt/DTQQTnIe.js"
  },
  "/_nuxt/DYOf3hD_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d0-HLlvwkaRvXShELbAyB8c2B7Qi/k\"",
    "mtime": "2026-04-06T01:57:46.227Z",
    "size": 720,
    "path": "../public/_nuxt/DYOf3hD_.js"
  },
  "/_nuxt/DZQfXyQ6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"80f-1TGsdYww7aZvl6n98Di4FGOFGEc\"",
    "mtime": "2026-04-06T01:57:46.228Z",
    "size": 2063,
    "path": "../public/_nuxt/DZQfXyQ6.js"
  },
  "/_nuxt/DcOgWTMQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9610-IiCVUsLia4TkBrXWDr+sq7StJB0\"",
    "mtime": "2026-04-06T01:57:46.228Z",
    "size": 38416,
    "path": "../public/_nuxt/DcOgWTMQ.js"
  },
  "/_nuxt/DdyszQQe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"dfd-oEmjLeYNhIJWhZwt4Mt+JlXvfcU\"",
    "mtime": "2026-04-06T01:57:46.229Z",
    "size": 3581,
    "path": "../public/_nuxt/DdyszQQe.js"
  },
  "/_nuxt/DiteI1wF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b8-y8fu6ok7a4RwtJqPcrRPe8Wauic\"",
    "mtime": "2026-04-06T01:57:46.228Z",
    "size": 696,
    "path": "../public/_nuxt/DiteI1wF.js"
  },
  "/_nuxt/DkRq8DMS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"236-4+Nf75eV2Uso/c+A6GbIx/QOXn0\"",
    "mtime": "2026-04-06T01:57:46.229Z",
    "size": 566,
    "path": "../public/_nuxt/DkRq8DMS.js"
  },
  "/_nuxt/DkqV0FMV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a3-q8ArJj9F53/y2cYJcB+0AsxRyBo\"",
    "mtime": "2026-04-06T01:57:46.229Z",
    "size": 419,
    "path": "../public/_nuxt/DkqV0FMV.js"
  },
  "/_nuxt/DleiwOcP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"345-SYyRwnCalwoiAGqYjJH5CPXjP9g\"",
    "mtime": "2026-04-06T01:57:46.229Z",
    "size": 837,
    "path": "../public/_nuxt/DleiwOcP.js"
  },
  "/_nuxt/Dlv8qxmR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"75f-HHDWYi1zsA6r3K0jQkew0Fmhpw0\"",
    "mtime": "2026-04-06T01:57:46.229Z",
    "size": 1887,
    "path": "../public/_nuxt/Dlv8qxmR.js"
  },
  "/_nuxt/Dp5N4pcl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4752c-oC7gxHYZlI6855pKGb+YQmtwBKw\"",
    "mtime": "2026-04-06T01:57:46.231Z",
    "size": 292140,
    "path": "../public/_nuxt/Dp5N4pcl.js"
  },
  "/_nuxt/DqApJcXu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c3-SbBm0hu4TVU2iyRm+LrQf0YE1SE\"",
    "mtime": "2026-04-06T01:57:46.229Z",
    "size": 707,
    "path": "../public/_nuxt/DqApJcXu.js"
  },
  "/_nuxt/DqFymBlv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"245-DFg9MS22IWZmnlBGRm6qs8VcjJw\"",
    "mtime": "2026-04-06T01:57:46.230Z",
    "size": 581,
    "path": "../public/_nuxt/DqFymBlv.js"
  },
  "/_nuxt/Drs53lGo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b2-+IN+JBfi5Bupx3rKUV+altNE5DM\"",
    "mtime": "2026-04-06T01:57:46.230Z",
    "size": 434,
    "path": "../public/_nuxt/Drs53lGo.js"
  },
  "/_nuxt/Ds9Zbx0b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"426c-we8VeuvBWLpbgB37spCakPeSG1Y\"",
    "mtime": "2026-04-06T01:57:46.230Z",
    "size": 17004,
    "path": "../public/_nuxt/Ds9Zbx0b.js"
  },
  "/_nuxt/DscMCqLG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"218-xmQ0QJZlMuql3eNxLdf01K8eKYQ\"",
    "mtime": "2026-04-06T01:57:46.230Z",
    "size": 536,
    "path": "../public/_nuxt/DscMCqLG.js"
  },
  "/_nuxt/DychpdrQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2de-pWp+aaizM9HK5zF5AKQFyEPRGOY\"",
    "mtime": "2026-04-06T01:57:46.231Z",
    "size": 734,
    "path": "../public/_nuxt/DychpdrQ.js"
  },
  "/_nuxt/Dz__ba4C.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6af-UJtXJiwTceET1puCZfwrlss31Wg\"",
    "mtime": "2026-04-06T01:57:46.231Z",
    "size": 1711,
    "path": "../public/_nuxt/Dz__ba4C.js"
  },
  "/_nuxt/EmptyState.B5jMlKj6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"59d-Kh+thH4vMHJKyCr+QCtLNjwApyw\"",
    "mtime": "2026-04-06T01:57:46.232Z",
    "size": 1437,
    "path": "../public/_nuxt/EmptyState.B5jMlKj6.css"
  },
  "/_nuxt/FlightDateRangePicker.BzH3Nfs3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1dd-ImAqaOJndknDYcdoaIDsHAbRgrM\"",
    "mtime": "2026-04-06T01:57:46.232Z",
    "size": 477,
    "path": "../public/_nuxt/FlightDateRangePicker.BzH3Nfs3.css"
  },
  "/_nuxt/J7FCaBqN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d2a-52hftJkRCNnahEFIVr2Q11cVUYU\"",
    "mtime": "2026-04-06T01:57:46.232Z",
    "size": 15658,
    "path": "../public/_nuxt/J7FCaBqN.js"
  },
  "/_nuxt/JAm92DvA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"21b09-/ttkdCo69ZhEo48Pace1lD0TsdY\"",
    "mtime": "2026-04-06T01:57:46.232Z",
    "size": 137993,
    "path": "../public/_nuxt/JAm92DvA.js"
  },
  "/_nuxt/LocationPicker.D-Lass5K.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c5-SUqO+RTs21IOYHRcToK4acPGmzY\"",
    "mtime": "2026-04-06T01:57:46.233Z",
    "size": 453,
    "path": "../public/_nuxt/LocationPicker.D-Lass5K.css"
  },
  "/_nuxt/MFt3flXV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27f4-NimbdIjq/9GX4ygx9gn57cb6tCA\"",
    "mtime": "2026-04-06T01:57:46.233Z",
    "size": 10228,
    "path": "../public/_nuxt/MFt3flXV.js"
  },
  "/_nuxt/PhoneInput.Cn637h03.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f7-vUwMFTUD8xdeT5SI3n/rcNcGtHI\"",
    "mtime": "2026-04-06T01:57:46.233Z",
    "size": 247,
    "path": "../public/_nuxt/PhoneInput.Cn637h03.css"
  },
  "/_nuxt/QTd2z0XB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"376-5Ceq0HLQCcDYDPhnzFMnc86cTMs\"",
    "mtime": "2026-04-06T01:57:46.234Z",
    "size": 886,
    "path": "../public/_nuxt/QTd2z0XB.js"
  },
  "/_nuxt/SettingsSwitcher.CfIVuUoz.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c9-32GitGJ0n/S5eyX86cfln7sdfYM\"",
    "mtime": "2026-04-06T01:57:46.233Z",
    "size": 713,
    "path": "../public/_nuxt/SettingsSwitcher.CfIVuUoz.css"
  },
  "/_nuxt/SxQrIIur.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"269-Uy36CxU3GFday+PL9zDjuuW/LIs\"",
    "mtime": "2026-04-06T01:57:46.233Z",
    "size": 617,
    "path": "../public/_nuxt/SxQrIIur.js"
  },
  "/_nuxt/T1bVFdjZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"249-fH9Z3YPwWNeHaUFRJDcvuu2VAws\"",
    "mtime": "2026-04-06T01:57:46.233Z",
    "size": 585,
    "path": "../public/_nuxt/T1bVFdjZ.js"
  },
  "/_nuxt/Vm-romb7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"96a9-e8qQkyxyo32SEewQ3V8NE/iDKzg\"",
    "mtime": "2026-04-06T01:57:46.234Z",
    "size": 38569,
    "path": "../public/_nuxt/Vm-romb7.js"
  },
  "/_nuxt/VzmlIVuD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3626-nEAtvQOpUY6rdRaukjawx2Sb4uI\"",
    "mtime": "2026-04-06T01:57:46.234Z",
    "size": 13862,
    "path": "../public/_nuxt/VzmlIVuD.js"
  },
  "/_nuxt/X301dkmq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5e8-jdeLR5Kh+sd38Guv+CwQHBXh4hc\"",
    "mtime": "2026-04-06T01:57:46.234Z",
    "size": 1512,
    "path": "../public/_nuxt/X301dkmq.js"
  },
  "/_nuxt/ZFW35ZCj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cc-VKZucB8ZA2XOIR1ARLCMpZFx4WY\"",
    "mtime": "2026-04-06T01:57:46.235Z",
    "size": 204,
    "path": "../public/_nuxt/ZFW35ZCj.js"
  },
  "/_nuxt/YnWuKVc7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"168-JUVbz6i6Mz/Qp/5xyIyNnD4nANA\"",
    "mtime": "2026-04-06T01:57:46.234Z",
    "size": 360,
    "path": "../public/_nuxt/YnWuKVc7.js"
  },
  "/_nuxt/Dy-20Hoq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15c-6DpzwNqmD/Z0r+11k2IsdaESA8A\"",
    "mtime": "2026-04-06T01:57:46.231Z",
    "size": 348,
    "path": "../public/_nuxt/Dy-20Hoq.js"
  },
  "/_nuxt/_id_.D7PxxVfB.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"189-l5TTKpEQO3j6x9xWWrAKnXOJbSE\"",
    "mtime": "2026-04-06T01:57:46.235Z",
    "size": 393,
    "path": "../public/_nuxt/_id_.D7PxxVfB.css"
  },
  "/_nuxt/arik-air.C2j8kRdV.png": {
    "type": "image/png",
    "etag": "\"876f-hDCHzh2qGD3H2ynNV1Tm2XOrHU4\"",
    "mtime": "2026-04-06T01:57:46.235Z",
    "size": 34671,
    "path": "../public/_nuxt/arik-air.C2j8kRdV.png"
  },
  "/_nuxt/air-peace.Dd1k5Wx7.png": {
    "type": "image/png",
    "etag": "\"8374-NpzeoJoU9s2r40fD/98BUN0bR4E\"",
    "mtime": "2026-04-06T01:57:46.235Z",
    "size": 33652,
    "path": "../public/_nuxt/air-peace.Dd1k5Wx7.png"
  },
  "/_nuxt/bQSKPdHf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"291b-Qsarv9KVa+yjVk1pss9QL6hf9QQ\"",
    "mtime": "2026-04-06T01:57:46.236Z",
    "size": 10523,
    "path": "../public/_nuxt/bQSKPdHf.js"
  },
  "/_nuxt/c9EiEW0y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"664e-N4eNjkrOxevk0y1eAgNWE5SsLYw\"",
    "mtime": "2026-04-06T01:57:46.236Z",
    "size": 26190,
    "path": "../public/_nuxt/c9EiEW0y.js"
  },
  "/_nuxt/callback.BhgoAAES.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a-8oa5O3prphkr6rVHk7gTRUCLlLg\"",
    "mtime": "2026-04-06T01:57:46.236Z",
    "size": 58,
    "path": "../public/_nuxt/callback.BhgoAAES.css"
  },
  "/_nuxt/checkout.CmuuWayE.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"455c-Yp+D0CN//ctySTTOauMe6DIIKas\"",
    "mtime": "2026-04-06T01:57:46.237Z",
    "size": 17756,
    "path": "../public/_nuxt/checkout.CmuuWayE.css"
  },
  "/_nuxt/confirmation.CoGiLhJJ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"c65-6McBjDdxndcSvARTncwggxjT6Vw\"",
    "mtime": "2026-04-06T01:57:46.236Z",
    "size": 3173,
    "path": "../public/_nuxt/confirmation.CoGiLhJJ.css"
  },
  "/_nuxt/error-404._yXoGkXB.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"97e-UvhxUpGzrIO+HDYB4qU9Txgu35A\"",
    "mtime": "2026-04-06T01:57:46.237Z",
    "size": 2430,
    "path": "../public/_nuxt/error-404._yXoGkXB.css"
  },
  "/_nuxt/error-500.BENb_mjk.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"773-BFLUend+w1t3SP3QDB+Z0A0V5pI\"",
    "mtime": "2026-04-06T01:57:46.237Z",
    "size": 1907,
    "path": "../public/_nuxt/error-500.BENb_mjk.css"
  },
  "/_nuxt/explore.Dj_JYjVd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"90-96r30YA1O2p2aZxXjypCxvWjTfw\"",
    "mtime": "2026-04-06T01:57:46.237Z",
    "size": 144,
    "path": "../public/_nuxt/explore.Dj_JYjVd.css"
  },
  "/_nuxt/default.B0pxZfsw.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"895-Xe7a2EPxdFPgM/5lyILSBct028k\"",
    "mtime": "2026-04-06T01:57:46.236Z",
    "size": 2197,
    "path": "../public/_nuxt/default.B0pxZfsw.css"
  },
  "/_nuxt/fF_Qnf96.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"567-c4AzSQlyPGm7Is8l3Z4xiqnzlyc\"",
    "mtime": "2026-04-06T01:57:46.238Z",
    "size": 1383,
    "path": "../public/_nuxt/fF_Qnf96.js"
  },
  "/_nuxt/fly-emirates.do7YCofC.png": {
    "type": "image/png",
    "etag": "\"1f0e-TX9cx+sMAgy3u+KUGtB+odxR0MI\"",
    "mtime": "2026-04-06T01:57:46.238Z",
    "size": 7950,
    "path": "../public/_nuxt/fly-emirates.do7YCofC.png"
  },
  "/_nuxt/entry.B_GOTizT.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1be12-bCmVUsCOo5k3rsDApeMAONKFWjc\"",
    "mtime": "2026-04-06T01:57:46.237Z",
    "size": 114194,
    "path": "../public/_nuxt/entry.B_GOTizT.css"
  },
  "/_nuxt/help.BwTx792E.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b1-OlR2EzqbJkDdv0uEXEWl/lFEkVQ\"",
    "mtime": "2026-04-06T01:57:46.238Z",
    "size": 177,
    "path": "../public/_nuxt/help.BwTx792E.css"
  },
  "/_nuxt/index.C7BgeCPj.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"39f-S3db3iSa+zzOlul6XmPREFnFXpo\"",
    "mtime": "2026-04-06T01:57:46.239Z",
    "size": 927,
    "path": "../public/_nuxt/index.C7BgeCPj.css"
  },
  "/_nuxt/index.DvmmFTu2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fd-BNYKCfXB7+4NF0dAWKN/opKaMX4\"",
    "mtime": "2026-04-06T01:57:46.239Z",
    "size": 1021,
    "path": "../public/_nuxt/index.DvmmFTu2.css"
  },
  "/_nuxt/index.DMugbx9H.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"fab-81k7EfVu9yNcOKmgiJC2uDB3VAQ\"",
    "mtime": "2026-04-06T01:57:46.239Z",
    "size": 4011,
    "path": "../public/_nuxt/index.DMugbx9H.css"
  },
  "/_nuxt/index.JSItfHX1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"37c-KCohR2gdcgmOQ0IPrtpmHR/8bUM\"",
    "mtime": "2026-04-06T01:57:46.239Z",
    "size": 892,
    "path": "../public/_nuxt/index.JSItfHX1.css"
  },
  "/_nuxt/index.4ek7YLYT.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"411-lTzYMsCAIlUXWTM57v1QYDU94HM\"",
    "mtime": "2026-04-06T01:57:46.238Z",
    "size": 1041,
    "path": "../public/_nuxt/index.4ek7YLYT.css"
  },
  "/_nuxt/iql3hoCu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a8-0gFek4WK2g+zRub8Y12BljtD9Zw\"",
    "mtime": "2026-04-06T01:57:46.240Z",
    "size": 168,
    "path": "../public/_nuxt/iql3hoCu.js"
  },
  "/_nuxt/logo.CJ2BWGNK.png": {
    "type": "image/png",
    "etag": "\"3726-TUnyO5UVx0VMXRb3ZzZ6l+O+5CM\"",
    "mtime": "2026-04-06T01:57:46.239Z",
    "size": 14118,
    "path": "../public/_nuxt/logo.CJ2BWGNK.png"
  },
  "/_nuxt/lvTJxXoW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13f2-XVCNnasN3ibVATvnB4Irl2GIIu8\"",
    "mtime": "2026-04-06T01:57:46.239Z",
    "size": 5106,
    "path": "../public/_nuxt/lvTJxXoW.js"
  },
  "/_nuxt/o1Qhd3gx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3ffa-LNd2Kks7mWEyLaIbgRDAcFx25h0\"",
    "mtime": "2026-04-06T01:57:46.240Z",
    "size": 16378,
    "path": "../public/_nuxt/o1Qhd3gx.js"
  },
  "/_nuxt/oEBwxUAV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"38c-I/rZiN/KeQe0H5XVqdH0aB4EWaY\"",
    "mtime": "2026-04-06T01:57:46.240Z",
    "size": 908,
    "path": "../public/_nuxt/oEBwxUAV.js"
  },
  "/_nuxt/psdPekMs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2fe-UKumi7eDWJv/hBg94szjyHEjzU4\"",
    "mtime": "2026-04-06T01:57:46.241Z",
    "size": 766,
    "path": "../public/_nuxt/psdPekMs.js"
  },
  "/_nuxt/qatar-airways.CgwlY4Dw.webp": {
    "type": "image/webp",
    "etag": "\"2908-oaZCA4RAz/z/bSg24vMffuNSLgw\"",
    "mtime": "2026-04-06T01:57:46.241Z",
    "size": 10504,
    "path": "../public/_nuxt/qatar-airways.CgwlY4Dw.webp"
  },
  "/_nuxt/stPN1zgX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"44d2-spUJ8OMERbp97whj1miPRGkdkTQ\"",
    "mtime": "2026-04-06T01:57:46.242Z",
    "size": 17618,
    "path": "../public/_nuxt/stPN1zgX.js"
  },
  "/_nuxt/terms.Dj6aNtFJ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a-nZpUJpY1TYi2ll4mZ29ysFgLbe4\"",
    "mtime": "2026-04-06T01:57:46.242Z",
    "size": 58,
    "path": "../public/_nuxt/terms.Dj6aNtFJ.css"
  },
  "/_nuxt/turkish-airlines.C1ThlX6A.png": {
    "type": "image/png",
    "etag": "\"d0f5-OdvQjjyV6HUig2GvBBQncQ63TqQ\"",
    "mtime": "2026-04-06T01:57:46.242Z",
    "size": 53493,
    "path": "../public/_nuxt/turkish-airlines.C1ThlX6A.png"
  },
  "/_nuxt/v4fyLJLR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5e4-jwzh2eCrFJg3XwT8nFqGXdkV0k0\"",
    "mtime": "2026-04-06T01:57:46.245Z",
    "size": 1508,
    "path": "../public/_nuxt/v4fyLJLR.js"
  },
  "/_nuxt/y3ov00G2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"53e-UM7bYE1whHWGLwH3a5UDbBDF7vo\"",
    "mtime": "2026-04-06T01:57:46.243Z",
    "size": 1342,
    "path": "../public/_nuxt/y3ov00G2.js"
  },
  "/_nuxt/builds/meta/fd5a72ed-f4f1-4d16-9cd4-436913f307a8.json": {
    "type": "application/json",
    "etag": "\"58-hYfpDnEUbn7dSSgB8j50J9BvRNU\"",
    "mtime": "2026-04-06T01:57:46.121Z",
    "size": 88,
    "path": "../public/_nuxt/builds/meta/fd5a72ed-f4f1-4d16-9cd4-436913f307a8.json"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-zVmwKN1HxjLOWAkWgLkr2zBnAC4\"",
    "mtime": "2026-04-06T01:57:46.124Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/images/hero/traveler.png": {
    "type": "image/png",
    "etag": "\"98735-6oc7blwvoFcLSTjZfgGxB93X4Pg\"",
    "mtime": "2026-04-06T01:57:46.279Z",
    "size": 624437,
    "path": "../public/images/hero/traveler.png"
  },
  "/_nuxt/happy-trips.COv14QaB.jpg": {
    "type": "image/jpeg",
    "etag": "\"dc96b9-Byd93ELV8wT3+3l2QuCzgD7clHU\"",
    "mtime": "2026-04-06T01:57:46.271Z",
    "size": 14456505,
    "path": "../public/_nuxt/happy-trips.COv14QaB.jpg"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve$1 = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _IhMRL9 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _SxA8c9 = defineEventHandler(() => {});

const _Kk5VQL = eventHandler(async (e) => {
  if (e.context._initedSiteConfig)
    return;
  const runtimeConfig = useRuntimeConfig(e);
  const config = runtimeConfig["nuxt-site-config"];
  const nitroApp = useNitroApp();
  const siteConfig = e.context.siteConfig || createSiteConfigStack({
    debug: config.debug
  });
  const nitroOrigin = getNitroOrigin(e);
  e.context.siteConfigNitroOrigin = nitroOrigin;
  {
    siteConfig.push({
      _context: "nitro:init",
      _priority: -4,
      url: nitroOrigin
    });
  }
  siteConfig.push({
    _context: "runtimeEnv",
    _priority: 0,
    ...runtimeConfig.site || {},
    ...runtimeConfig.public.site || {},
    ...envSiteConfig(globalThis._importMeta_.env || {})
    // just in-case, shouldn't be needed
  });
  const buildStack = config.stack || [];
  buildStack.forEach((c) => siteConfig.push(c));
  if (e.context._nitro.routeRules.site) {
    siteConfig.push({
      _context: "route-rules",
      ...e.context._nitro.routeRules.site
    });
  }
  if (config.multiTenancy) {
    const host = parseURL(nitroOrigin).host;
    const tenant = config.multiTenancy?.find((t) => t.hosts.includes(host));
    if (tenant) {
      siteConfig.push({
        _context: `multi-tenancy:${host}`,
        _priority: 0,
        ...tenant.config
      });
    }
  }
  const ctx = { siteConfig, event: e };
  await nitroApp.hooks.callHook("site-config:init", ctx);
  e.context.siteConfig = ctx.siteConfig;
  e.context._initedSiteConfig = true;
});

const _9GXKum = defineEventHandler(async (e) => {
  const nitroApp = useNitroApp();
  const { indexable} = getSiteRobotConfig(e);
  const { credits, isNuxtContentV2, cacheControl } = useRuntimeConfigNuxtRobots(e);
  let robotsTxtCtx = {
    sitemaps: [],
    groups: [
      {
        allow: [],
        comment: [],
        userAgent: ["*"],
        disallow: ["/"]
      }
    ]
  };
  if (indexable) {
    robotsTxtCtx = await resolveRobotsTxtContext(e);
    robotsTxtCtx.sitemaps = [...new Set(
      asArray(robotsTxtCtx.sitemaps).map((s) => !s.startsWith("http") ? withSiteUrl(e, s, { withBase: true}) : s)
    )];
    if (isNuxtContentV2) {
      const contentWithRobotRules = await e.$fetch("/__robots__/nuxt-content.json", {
        headers: {
          Accept: "application/json"
        }
      });
      if (String(contentWithRobotRules).trim().startsWith("<!DOCTYPE")) {
        logger$1.error("Invalid HTML returned from /__robots__/nuxt-content.json, skipping.");
      } else {
        for (const group of robotsTxtCtx.groups) {
          if (group.userAgent.includes("*")) {
            group.disallow.push(...contentWithRobotRules);
            group.disallow = group.disallow.filter(Boolean);
          }
        }
      }
    }
  }
  let robotsTxt = generateRobotsTxt(robotsTxtCtx);
  if (credits) {
    robotsTxt = [
      `# START nuxt-robots (${indexable ? "indexable" : "indexing disabled"})`,
      robotsTxt,
      "# END nuxt-robots"
    ].filter(Boolean).join("\n");
  }
  setHeader(e, "Content-Type", "text/plain; charset=utf-8");
  setHeader(e, "Cache-Control", globalThis._importMeta_.test || !cacheControl ? "no-store" : cacheControl);
  const hookCtx = { robotsTxt, e };
  await nitroApp.hooks.callHook("robots:robots-txt", hookCtx);
  return hookCtx.robotsTxt;
});

const _24YfUX = defineEventHandler(async (e) => {
  if (e.path === "/robots.txt" || e.path.startsWith("/__") || e.path.startsWith("/api") || e.path.startsWith("/_nuxt"))
    return;
  const nuxtRobotsConfig = useRuntimeConfigNuxtRobots(e);
  if (nuxtRobotsConfig) {
    const { header } = nuxtRobotsConfig;
    const robotConfig = getPathRobotConfig(e, { skipSiteIndexable: Boolean(getQuery(e)?.mockProductionEnv) });
    if (header) {
      setHeader(e, "X-Robots-Tag", robotConfig.rule);
    }
    e.context.robots = robotConfig;
  }
});

const logger = createConsola({
  defaults: {
    tag: "@nuxt/sitemap"
  }
});
const merger = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value))
    obj[key] = Array.from(/* @__PURE__ */ new Set([...obj[key], ...value]));
  return obj[key];
});
function mergeOnKey(arr, key) {
  const seen = /* @__PURE__ */ new Map();
  let resultLength = 0;
  const result = Array.from({ length: arr.length });
  for (const item of arr) {
    const k = item[key];
    if (seen.has(k)) {
      const existingIndex = seen.get(k);
      result[existingIndex] = merger(item, result[existingIndex]);
    } else {
      seen.set(k, resultLength);
      result[resultLength++] = item;
    }
  }
  result.length = resultLength;
  return result;
}
function splitForLocales(path, locales) {
  const prefix = withLeadingSlash(path).split("/")[1];
  if (prefix && locales.includes(prefix))
    return [prefix, path.replace(`/${prefix}`, "")];
  return [null, path];
}
const StringifiedRegExpPattern = /\/(.*?)\/([gimsuy]*)$/;
function normalizeRuntimeFilters(input) {
  return (input || []).map((rule) => {
    if (rule instanceof RegExp || typeof rule === "string")
      return rule;
    const match = rule.regex.match(StringifiedRegExpPattern);
    if (match)
      return new RegExp(match[1], match[2]);
    return false;
  }).filter(Boolean);
}
function createPathFilter(options = {}) {
  const urlFilter = createFilter(options);
  return (loc) => {
    let path = loc;
    try {
      path = parseURL(loc).pathname;
    } catch {
      return false;
    }
    return urlFilter(path);
  };
}
function findPageMapping(pathWithoutPrefix, pages) {
  const stripped = pathWithoutPrefix[0] === "/" ? pathWithoutPrefix.slice(1) : pathWithoutPrefix;
  const pageKey = stripped.endsWith("/index") ? stripped.slice(0, -6) || "index" : stripped || "index";
  if (pages[pageKey])
    return { mappings: pages[pageKey], paramSegments: [] };
  const sortedKeys = Object.keys(pages).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (pageKey.startsWith(key + "/")) {
      const paramPath = pageKey.slice(key.length + 1);
      return { mappings: pages[key], paramSegments: paramPath.split("/") };
    }
  }
  return null;
}
function applyDynamicParams(customPath, paramSegments) {
  if (!paramSegments.length)
    return customPath;
  let i = 0;
  return customPath.replace(/\[[^\]]+\]/g, () => paramSegments[i++] || "");
}
function createFilter(options = {}) {
  const include = options.include || [];
  const exclude = options.exclude || [];
  if (include.length === 0 && exclude.length === 0)
    return () => true;
  const excludeRegex = exclude.filter((r) => r instanceof RegExp);
  const includeRegex = include.filter((r) => r instanceof RegExp);
  const excludeStrings = exclude.filter((r) => typeof r === "string");
  const includeStrings = include.filter((r) => typeof r === "string");
  const excludeMatcher = excludeStrings.length > 0 ? toRouteMatcher(createRouter$1({
    routes: Object.fromEntries(excludeStrings.map((r) => [r, true])),
    strictTrailingSlash: false
  })) : null;
  const includeMatcher = includeStrings.length > 0 ? toRouteMatcher(createRouter$1({
    routes: Object.fromEntries(includeStrings.map((r) => [r, true])),
    strictTrailingSlash: false
  })) : null;
  const excludeExact = new Set(excludeStrings);
  const includeExact = new Set(includeStrings);
  return function(path) {
    if (excludeRegex.some((r) => r.test(path)))
      return false;
    if (excludeExact.has(path))
      return false;
    if (excludeMatcher && excludeMatcher.matchAll(path).length > 0)
      return false;
    if (includeRegex.some((r) => r.test(path)))
      return true;
    if (includeExact.has(path))
      return true;
    if (includeMatcher && includeMatcher.matchAll(path).length > 0)
      return true;
    return include.length === 0;
  };
}

function xmlEscape(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function useSitemapRuntimeConfig(e) {
  const clone = JSON.parse(JSON.stringify(useRuntimeConfig(e).sitemap));
  for (const k in clone.sitemaps) {
    const sitemap = clone.sitemaps[k];
    sitemap.include = normalizeRuntimeFilters(sitemap.include);
    sitemap.exclude = normalizeRuntimeFilters(sitemap.exclude);
    clone.sitemaps[k] = sitemap;
  }
  return Object.freeze(clone);
}

const _Nql9XD = defineEventHandler(async (e) => {
  const fixPath = createSitePathResolver(e, { absolute: false, withBase: true });
  const { sitemapName: fallbackSitemapName, cacheMaxAgeSeconds, version, xslColumns, xslTips } = useSitemapRuntimeConfig();
  setHeader(e, "Content-Type", "application/xslt+xml");
  if (cacheMaxAgeSeconds)
    setHeader(e, "Cache-Control", `public, max-age=${cacheMaxAgeSeconds}, must-revalidate`);
  else
    setHeader(e, "Cache-Control", `no-cache, no-store`);
  const { name: siteName, url: siteUrl } = useSiteConfig(e);
  const referrer = getHeader(e, "Referer") || "/";
  const referrerPath = parseURL(referrer).pathname;
  const isNotIndexButHasIndex = referrerPath !== "/sitemap.xml" && referrerPath !== "/sitemap_index.xml" && referrerPath.endsWith(".xml");
  const sitemapName = parseURL(referrer).pathname.split("/").pop()?.split("-sitemap")[0] || fallbackSitemapName;
  const title = `${siteName}${sitemapName !== "sitemap.xml" ? ` - ${sitemapName === "sitemap_index.xml" ? "index" : sitemapName}` : ""}`.replace(/&/g, "&amp;");
  getQuery$1(referrer).canonical;
  const debugUrl = xmlEscape(withQuery("/__sitemap__/debug.json", { sitemap: sitemapName }));
  xmlEscape(referrerPath);
  xmlEscape(withQuery(referrerPath, { canonical: "" }));
  const fetchErrors = [];
  const xslQuery = getQuery(e);
  if (xslQuery.error_messages) {
    const errorMessages = xslQuery.error_messages;
    const errorUrls = xslQuery.error_urls;
    if (errorMessages) {
      const messages = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
      const urls = Array.isArray(errorUrls) ? errorUrls : errorUrls ? [errorUrls] : [];
      messages.forEach((msg, i) => {
        const errorParts = [xmlEscape(msg)];
        if (urls[i])
          errorParts.push(xmlEscape(urls[i]));
        fetchErrors.push(`<span class="error-item">${errorParts.join(" \u2014 ")}</span>`);
      });
    }
  }
  const hasRuntimeErrors = fetchErrors.length > 0;
  let columns = [...xslColumns];
  if (!columns.length) {
    columns = [
      { label: "URL", width: "50%" },
      { label: "Images", width: "25%", select: "count(image:image)" },
      { label: "Last Updated", width: "25%", select: "concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))" }
    ];
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
          :root {
            --accent: #00dc82;
            --accent-hover: #00b86b;
            --bg: #0a0a0a;
            --bg-elevated: #141414;
            --bg-subtle: #1a1a1a;
            --border: #262626;
            --border-subtle: #1f1f1f;
            --text: #e5e5e5;
            --text-muted: #737373;
            --text-faint: #525252;
            --error: #ef4444;
            --error-bg: rgba(239,68,68,0.1);
            --warning: #f59e0b;
          }
          * { box-sizing: border-box; }
          body {
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
            font-size: 13px;
            color: var(--text);
            background: var(--bg);
            margin: 0;
            padding: 0;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          a { color: inherit; transition: color 0.15s; }
          a:hover { color: var(--accent); }

          /* Debug bar (dev only) */
          .debug-bar {
            position: fixed;
            bottom: 0.75rem;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 0 1rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 100;
            font-size: 11px;
          }
          .debug-bar-brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-muted);
            text-decoration: none;
          }
          .debug-bar-brand:hover { color: var(--text); }
          .debug-bar-brand svg { flex-shrink: 0; }
          .debug-bar-hint {
            color: var(--text-faint);
            margin-right: auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .debug-bar-hint code {
            background: var(--bg-subtle);
            padding: 0.1rem 0.3rem;
            border-radius: 3px;
            font-size: 10px;
          }
          .mode-badge {
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
          }
          .mode-dev { background: rgba(245,158,11,0.15); color: var(--warning); }
          .mode-prod { background: rgba(0,220,130,0.12); color: var(--accent); }
          .mode-toggle {
            display: inline-flex;
            border-radius: 4px;
            overflow: hidden;
            background: var(--bg-subtle);
            padding: 2px;
            gap: 1px;
          }
          .mode-toggle a {
            padding: 0.2rem 0.4rem;
            font-size: 9px;
            font-weight: 500;
            text-decoration: none;
            color: var(--text-muted);
            border-radius: 2px;
            transition: all 0.15s;
          }
          .mode-toggle a:hover { color: var(--text); }
          .mode-toggle a.active {
            background: var(--accent);
            color: #0a0a0a;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-size: 10px;
            font-weight: 500;
            transition: all 0.15s;
          }
          .btn-primary {
            background: var(--accent);
            color: #0a0a0a;
          }
          .btn-primary:hover { background: var(--accent-hover); color: #0a0a0a; }
          .btn svg { width: 12px; height: 12px; }

          /* Error banner */
          .error-banner {
            background: var(--error-bg);
            border-bottom: 1px solid rgba(239,68,68,0.2);
            padding: 0.75rem 1.5rem;
            color: #fca5a5;
            font-size: 12px;
          }
          .error-banner strong { color: var(--error); }
          .error-item { display: block; margin-top: 0.375rem; color: #fca5a5; }
          .error-debug-link {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            margin-top: 0.625rem;
            padding: 0.25rem 0.5rem;
            background: var(--error);
            color: #fff;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            text-decoration: none;
            transition: background 0.15s;
          }
          .error-debug-link:hover { background: #dc2626; color: #fff; }

          /* Main content */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem;
          }
          .header {
            margin-bottom: 1.25rem;
          }
          .header h1 {
            font-size: 1rem;
            font-weight: 600;
            margin: 0 0 0.25rem 0;
            color: var(--text);
          }
          .header-meta {
            color: var(--text-muted);
            font-size: 12px;
          }
          .header-meta a {
            color: var(--text-muted);
            text-decoration: underline;
            text-decoration-color: var(--border);
            text-underline-offset: 2px;
          }
          .header-meta a:hover { color: var(--accent); text-decoration-color: var(--accent); }

          /* Table */
          .table-wrap {
            border: 1px solid var(--border);
            border-radius: 8px;
            overflow: hidden;
            background: var(--bg-elevated);
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            text-align: left;
            padding: 0.625rem 1rem;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            background: var(--bg-subtle);
            border-bottom: 1px solid var(--border);
          }
          td {
            padding: 0.5rem 1rem;
            border-bottom: 1px solid var(--border-subtle);
            font-size: 12px;
            color: var(--text);
          }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: rgba(255,255,255,0.02); }
          td a {
            text-decoration: none;
            word-break: break-all;
            color: var(--text);
          }
          td a:hover { color: var(--accent); }
          .inline-warning {
            font-size: 11px;
            color: var(--warning);
            margin-top: 0.25rem;
            line-height: 1.4;
          }
          .inline-warning::before {
            content: "\u26A0 ";
          }
          .count {
            display: inline-block;
            min-width: 1.25rem;
            padding: 0.125rem 0.375rem;
            background: var(--bg-subtle);
            border-radius: 4px;
            text-align: center;
            font-size: 11px;
            color: var(--text-muted);
            font-variant-numeric: tabular-nums;
          }
          .count:empty::before { content: "0"; }

          /* Light mode */
          @media (prefers-color-scheme: light) {
            :root {
              --accent: #00a963;
              --accent-hover: #008f54;
              --bg: #ffffff;
              --bg-elevated: #f5f5f5;
              --bg-subtle: #ebebeb;
              --border: #d4d4d4;
              --border-subtle: #e5e5e5;
              --text: #171717;
              --text-muted: #525252;
              --text-faint: #737373;
              --error: #dc2626;
              --error-bg: rgba(220,38,38,0.08);
              --warning: #b45309;
            }
            tr:hover td { background: rgba(0,0,0,0.02); }
            .btn-primary { color: #fff; }
            .btn-primary:hover { color: #fff; }
            .mode-toggle a.active { color: #fff; }
            .error-banner { color: #991b1b; }
            .error-item { color: #b91c1c; }
            .error-debug-link { color: #fff; }
            .error-debug-link:hover { color: #fff; }
          }

          .debug-bar-version {
            color: var(--text-faint);
            font-size: 10px;
          }

          /* Responsive */
          @media (max-width: 640px) {
            .debug-bar { padding: 0 0.75rem; gap: 0.5rem; width: 95%; }
            .debug-bar-brand span { display: none; }
            .debug-bar-hint { display: none; }
            .debug-bar-version { display: none; }
            .mode-badge { display: none; }
            .container { padding: 1rem; }
            th, td { padding: 0.5rem 0.75rem; }
          }
          ${""}
        </style>
      </head>
      <body>
        ${hasRuntimeErrors ? `<div class="error-banner">
            <strong>Sitemap Generation Errors</strong>
            ${fetchErrors.join("")}
            <a href="${debugUrl}" target="_blank" class="error-debug-link">View Debug Info \u2192</a>
          </div>` : ""}
        <div class="container">
          <div class="header">
            <h1>${xmlEscape(title)}</h1>
            <div class="header-meta">
              ${isNotIndexButHasIndex ? `Part of <a href="${xmlEscape(fixPath("/sitemap_index.xml"))}">${xmlEscape(fixPath("/sitemap_index.xml"))}</a> \xB7 ` : ""}
              <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
                <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps
              </xsl:if>
              <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
              </xsl:if>
            </div>
          </div>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style="width:70%">Sitemap</th>
                    <th style="width:30%">Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <xsl:variable name="sitemapURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <tr>
                      <td>
                        <a href="{$sitemapURL}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      <td>
                        <xsl:value-of
                          select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    ${columns.map((c) => `<th style="width:${c.width}">${c.label}</th>`).join("\n")}
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td>
                        <xsl:variable name="itemURL">
                          <xsl:value-of select="sitemap:loc"/>
                        </xsl:variable>
                        <a href="{$itemURL}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                        ${""}
                      </td>
                      ${columns.filter((c) => c.label !== "URL").map((c) => `<td><span class="count"><xsl:value-of select="${c.select}"/></span></td>`).join("\n")}
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
        </div>
        ${""}
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;
});

function withoutQuery(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher() {
  const { nitro, app } = useRuntimeConfig();
  const _routeRulesMatcher = toRouteMatcher(
    createRouter$1({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [path === "/" ? path : withoutTrailingSlash(path), rules])
      )
    })
  );
  return (pathOrUrl) => {
    const path = pathOrUrl[0] === "/" ? pathOrUrl : parseURL(pathOrUrl, app.baseURL).pathname;
    const pathWithoutQuery = withoutQuery(path);
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(pathWithoutQuery === "/" ? pathWithoutQuery : withoutTrailingSlash(pathWithoutQuery), app.baseURL)
    ).reverse());
  };
}

function resolve(s, resolvers) {
  if (typeof s === "undefined")
    return void 0;
  const str = typeof s === "string" ? s : s.toString();
  if (!resolvers)
    return str;
  if (hasProtocol(str, { acceptRelative: true, strict: false }))
    return resolvers.fixSlashes(str);
  return resolvers.canonicalUrlResolver(str);
}
function removeTrailingSlash(s) {
  return s.replace(/\/(\?|#|$)/, "$1");
}
function preNormalizeEntry(_e, resolvers) {
  const input = typeof _e === "string" ? { loc: _e } : { ..._e };
  if (input.url && !input.loc) {
    input.loc = input.url;
  }
  delete input.url;
  if (typeof input.loc !== "string") {
    input.loc = "";
  }
  const skipEncoding = input._encoded === true;
  const e = input;
  e.loc = removeTrailingSlash(e.loc);
  e._abs = hasProtocol(e.loc, { acceptRelative: false, strict: false });
  try {
    e._path = e._abs ? parseURL(e.loc) : parsePath(e.loc);
  } catch {
    e._path = null;
  }
  if (e._path) {
    const search = e._path.search;
    const qs = search && search.length > 1 ? stringifyQuery(parseQuery(search)) : "";
    const pathname = skipEncoding ? e._path.pathname : encodePath(e._path.pathname);
    e._relativeLoc = `${pathname}${qs.length ? `?${qs}` : ""}`;
    if (e._path.host) {
      e.loc = stringifyParsedURL(e._path);
    } else {
      e.loc = e._relativeLoc;
    }
  } else if (!skipEncoding && !isEncoded(e.loc)) {
    e.loc = encodeURI(e.loc);
  }
  if (e.loc === "")
    e.loc = `/`;
  e.loc = resolve(e.loc, resolvers);
  e._key = `${e._sitemap || ""}${withoutTrailingSlash(e.loc)}`;
  return e;
}
function isEncoded(url) {
  try {
    return url !== decodeURIComponent(url);
  } catch {
    return false;
  }
}
function normaliseEntry(_e, defaults, resolvers) {
  const e = defu(_e, defaults);
  if (e.lastmod) {
    const date = normaliseDate(e.lastmod);
    if (date)
      e.lastmod = date;
    else
      delete e.lastmod;
  }
  if (!e.lastmod)
    delete e.lastmod;
  e.loc = resolve(e.loc, resolvers);
  if (e.alternatives) {
    const alternatives = e.alternatives.map((a) => ({ ...a }));
    for (const alt of alternatives) {
      if (typeof alt.href === "string") {
        alt.href = resolve(alt.href, resolvers);
      } else if (typeof alt.href === "object" && alt.href) {
        alt.href = resolve(alt.href.href, resolvers);
      }
    }
    e.alternatives = mergeOnKey(alternatives, "hreflang");
  }
  if (e.images) {
    const images = e.images.map((i) => ({ ...i }));
    for (const img of images) {
      img.loc = resolve(img.loc, resolvers);
    }
    e.images = mergeOnKey(images, "loc");
  }
  if (e.videos) {
    const videos = e.videos.map((v) => ({ ...v }));
    for (const video of videos) {
      if (video.content_loc) {
        video.content_loc = resolve(video.content_loc, resolvers);
      }
    }
    e.videos = mergeOnKey(videos, "content_loc");
  }
  return e;
}
const IS_VALID_W3C_DATE = [
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  /^\d{4}-[01]\d-[0-3]\d$/,
  /^\d{4}-[01]\d$/,
  /^\d{4}$/
];
function isValidW3CDate(d) {
  return IS_VALID_W3C_DATE.some((r) => r.test(d));
}
function normaliseDate(d) {
  if (typeof d === "string") {
    const tIdx = d.indexOf("T");
    if (tIdx !== -1) {
      const t = d.slice(tIdx + 1);
      if (!t.includes("+") && !t.includes("-") && !t.includes("Z")) {
        d += "Z";
      }
    }
    if (!isValidW3CDate(d))
      return false;
    d = new Date(d);
    d.setMilliseconds(0);
    if (Number.isNaN(d.getTime()))
      return false;
  }
  const z = (n) => `0${n}`.slice(-2);
  const date = `${d.getUTCFullYear()}-${z(d.getUTCMonth() + 1)}-${z(d.getUTCDate())}`;
  if (d.getUTCHours() > 0 || d.getUTCMinutes() > 0 || d.getUTCSeconds() > 0) {
    return `${date}T${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}Z`;
  }
  return date;
}

function isValidString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function parseNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const num = Number.parseFloat(value.trim());
    return Number.isNaN(num) ? void 0 : num;
  }
  return void 0;
}
function parseInteger(value) {
  if (typeof value === "number") return Math.floor(value);
  if (typeof value === "string" && value.trim()) {
    const num = Number.parseInt(value.trim(), 10);
    return Number.isNaN(num) ? void 0 : num;
  }
  return void 0;
}
function extractUrlFromParsedElement(urlElement, warnings) {
  if (!isValidString(urlElement.loc)) {
    warnings.push({
      type: "validation",
      message: "URL entry missing required loc element",
      context: { url: String(urlElement.loc || "undefined") }
    });
    return null;
  }
  const urlObj = { loc: urlElement.loc };
  if (isValidString(urlElement.lastmod)) {
    urlObj.lastmod = urlElement.lastmod;
  }
  if (isValidString(urlElement.changefreq)) {
    const validFreqs = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
    if (validFreqs.includes(urlElement.changefreq)) {
      urlObj.changefreq = urlElement.changefreq;
    } else {
      warnings.push({
        type: "validation",
        message: "Invalid changefreq value",
        context: { url: urlElement.loc, field: "changefreq", value: urlElement.changefreq }
      });
    }
  }
  const priority = parseNumber(urlElement.priority);
  if (priority !== void 0 && !Number.isNaN(priority)) {
    if (priority < 0 || priority > 1) {
      warnings.push({
        type: "validation",
        message: "Priority value should be between 0.0 and 1.0, clamping to valid range",
        context: { url: urlElement.loc, field: "priority", value: priority }
      });
    }
    urlObj.priority = Math.max(0, Math.min(1, priority));
  } else if (urlElement.priority !== void 0) {
    warnings.push({
      type: "validation",
      message: "Invalid priority value",
      context: { url: urlElement.loc, field: "priority", value: urlElement.priority }
    });
  }
  if (urlElement.image) {
    const images = Array.isArray(urlElement.image) ? urlElement.image : [urlElement.image];
    const validImages = images.map((img) => {
      if (isValidString(img.loc)) {
        return { loc: img.loc };
      } else {
        warnings.push({
          type: "validation",
          message: "Image missing required loc element",
          context: { url: urlElement.loc, field: "image.loc" }
        });
        return null;
      }
    }).filter((img) => img !== null);
    if (validImages.length > 0) {
      urlObj.images = validImages;
    }
  }
  if (urlElement.video) {
    const videos = Array.isArray(urlElement.video) ? urlElement.video : [urlElement.video];
    const validVideos = videos.map((video) => {
      const missingFields = [];
      if (!isValidString(video.title)) missingFields.push("title");
      if (!isValidString(video.thumbnail_loc)) missingFields.push("thumbnail_loc");
      if (!isValidString(video.description)) missingFields.push("description");
      if (!isValidString(video.content_loc)) missingFields.push("content_loc");
      if (missingFields.length > 0) {
        warnings.push({
          type: "validation",
          message: `Video missing required fields: ${missingFields.join(", ")}`,
          context: { url: urlElement.loc, field: "video" }
        });
        return null;
      }
      const videoObj = {
        title: video.title,
        thumbnail_loc: video.thumbnail_loc,
        description: video.description,
        content_loc: video.content_loc
      };
      if (isValidString(video.player_loc)) {
        videoObj.player_loc = video.player_loc;
      }
      const duration = parseInteger(video.duration);
      if (duration !== void 0) {
        videoObj.duration = duration;
      } else if (video.duration !== void 0) {
        warnings.push({
          type: "validation",
          message: "Invalid video duration value",
          context: { url: urlElement.loc, field: "video.duration", value: video.duration }
        });
      }
      if (isValidString(video.expiration_date)) {
        videoObj.expiration_date = video.expiration_date;
      }
      const rating = parseNumber(video.rating);
      if (rating !== void 0) {
        if (rating < 0 || rating > 5) {
          warnings.push({
            type: "validation",
            message: "Video rating should be between 0.0 and 5.0",
            context: { url: urlElement.loc, field: "video.rating", value: rating }
          });
        }
        videoObj.rating = rating;
      } else if (video.rating !== void 0) {
        warnings.push({
          type: "validation",
          message: "Invalid video rating value",
          context: { url: urlElement.loc, field: "video.rating", value: video.rating }
        });
      }
      const viewCount = parseInteger(video.view_count);
      if (viewCount !== void 0) {
        videoObj.view_count = viewCount;
      } else if (video.view_count !== void 0) {
        warnings.push({
          type: "validation",
          message: "Invalid video view_count value",
          context: { url: urlElement.loc, field: "video.view_count", value: video.view_count }
        });
      }
      if (isValidString(video.publication_date)) {
        videoObj.publication_date = video.publication_date;
      }
      if (isValidString(video.family_friendly)) {
        const validValues = ["yes", "no"];
        if (validValues.includes(video.family_friendly)) {
          videoObj.family_friendly = video.family_friendly;
        } else {
          warnings.push({
            type: "validation",
            message: 'Invalid video family_friendly value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: "video.family_friendly", value: video.family_friendly }
          });
        }
      }
      if (isValidString(video.requires_subscription)) {
        const validValues = ["yes", "no"];
        if (validValues.includes(video.requires_subscription)) {
          videoObj.requires_subscription = video.requires_subscription;
        } else {
          warnings.push({
            type: "validation",
            message: 'Invalid video requires_subscription value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: "video.requires_subscription", value: video.requires_subscription }
          });
        }
      }
      if (isValidString(video.live)) {
        const validValues = ["yes", "no"];
        if (validValues.includes(video.live)) {
          videoObj.live = video.live;
        } else {
          warnings.push({
            type: "validation",
            message: 'Invalid video live value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: "video.live", value: video.live }
          });
        }
      }
      if (video.restriction && typeof video.restriction === "object") {
        const restriction = video.restriction;
        if (isValidString(restriction.relationship) && isValidString(restriction["#text"])) {
          const validRelationships = ["allow", "deny"];
          if (validRelationships.includes(restriction.relationship)) {
            videoObj.restriction = {
              relationship: restriction.relationship,
              restriction: restriction["#text"]
            };
          } else {
            warnings.push({
              type: "validation",
              message: 'Invalid video restriction relationship, should be "allow" or "deny"',
              context: { url: urlElement.loc, field: "video.restriction.relationship", value: restriction.relationship }
            });
          }
        }
      }
      if (video.platform && typeof video.platform === "object") {
        const platform = video.platform;
        if (isValidString(platform.relationship) && isValidString(platform["#text"])) {
          const validRelationships = ["allow", "deny"];
          if (validRelationships.includes(platform.relationship)) {
            videoObj.platform = {
              relationship: platform.relationship,
              platform: platform["#text"]
            };
          } else {
            warnings.push({
              type: "validation",
              message: 'Invalid video platform relationship, should be "allow" or "deny"',
              context: { url: urlElement.loc, field: "video.platform.relationship", value: platform.relationship }
            });
          }
        }
      }
      if (video.price) {
        const prices = Array.isArray(video.price) ? video.price : [video.price];
        const validPrices = prices.map((price) => {
          const priceValue = price["#text"];
          if (priceValue == null || typeof priceValue !== "string" && typeof priceValue !== "number") {
            warnings.push({
              type: "validation",
              message: "Video price missing value",
              context: { url: urlElement.loc, field: "video.price" }
            });
            return null;
          }
          const validTypes = ["rent", "purchase", "package", "subscription"];
          if (price.type && !validTypes.includes(price.type)) {
            warnings.push({
              type: "validation",
              message: `Invalid video price type "${price.type}", should be one of: ${validTypes.join(", ")}`,
              context: { url: urlElement.loc, field: "video.price.type", value: price.type }
            });
          }
          return {
            price: String(priceValue),
            currency: price.currency,
            type: price.type
          };
        }).filter((p) => p !== null);
        if (validPrices.length > 0) {
          videoObj.price = validPrices;
        }
      }
      if (video.uploader && typeof video.uploader === "object") {
        const uploader = video.uploader;
        if (isValidString(uploader.info) && isValidString(uploader["#text"])) {
          videoObj.uploader = {
            uploader: uploader["#text"],
            info: uploader.info
          };
        } else {
          warnings.push({
            type: "validation",
            message: "Video uploader missing required info or name",
            context: { url: urlElement.loc, field: "video.uploader" }
          });
        }
      }
      if (video.tag) {
        const tags = Array.isArray(video.tag) ? video.tag : [video.tag];
        const validTags = tags.filter(isValidString);
        if (validTags.length > 0) {
          videoObj.tag = validTags;
        }
      }
      return videoObj;
    }).filter((video) => video !== null);
    if (validVideos.length > 0) {
      urlObj.videos = validVideos;
    }
  }
  if (urlElement.link) {
    const links = Array.isArray(urlElement.link) ? urlElement.link : [urlElement.link];
    const alternatives = links.map((link) => {
      if (link.rel === "alternate" && isValidString(link.hreflang) && isValidString(link.href)) {
        return {
          hreflang: link.hreflang,
          href: link.href
        };
      } else {
        warnings.push({
          type: "validation",
          message: 'Alternative link missing required rel="alternate", hreflang, or href',
          context: { url: urlElement.loc, field: "link" }
        });
        return null;
      }
    }).filter((alt) => alt !== null);
    if (alternatives.length > 0) {
      urlObj.alternatives = alternatives;
    }
  }
  if (urlElement.news && typeof urlElement.news === "object") {
    const news = urlElement.news;
    if (isValidString(news.title) && isValidString(news.publication_date) && news.publication && isValidString(news.publication.name) && isValidString(news.publication.language)) {
      urlObj.news = {
        title: news.title,
        publication_date: news.publication_date,
        publication: {
          name: news.publication.name,
          language: news.publication.language
        }
      };
    } else {
      warnings.push({
        type: "validation",
        message: "News entry missing required fields (title, publication_date, publication.name, publication.language)",
        context: { url: urlElement.loc, field: "news" }
      });
    }
  }
  return Object.fromEntries(
    Object.entries(urlObj).filter(
      ([_, value]) => value != null && (!Array.isArray(value) || value.length > 0)
    )
  );
}
async function parseSitemapXml(xml) {
  const warnings = [];
  if (!xml) {
    throw new Error("Empty XML input provided");
  }
  const { XMLParser } = await import('fast-xml-parser');
  const parser = new XMLParser({
    isArray: (tagName) => ["url", "image", "video", "link", "tag", "price"].includes(tagName),
    removeNSPrefix: true,
    parseAttributeValue: false,
    ignoreAttributes: false,
    attributeNamePrefix: "",
    trimValues: true
  });
  try {
    const parsed = parser.parse(xml);
    if (!parsed?.urlset) {
      throw new Error("XML does not contain a valid urlset element");
    }
    if (!parsed.urlset.url) {
      throw new Error("Sitemap contains no URL entries");
    }
    const urls = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
    const validUrls = urls.map((url) => extractUrlFromParsedElement(url, warnings)).filter((url) => url !== null);
    if (validUrls.length === 0 && urls.length > 0) {
      warnings.push({
        type: "validation",
        message: "No valid URLs found in sitemap after validation"
      });
    }
    return { urls: validUrls, warnings };
  } catch (error) {
    if (error instanceof Error && (error.message === "Empty XML input provided" || error.message === "XML does not contain a valid urlset element" || error.message === "Sitemap contains no URL entries")) {
      throw error;
    }
    throw new Error(`Failed to parse XML: ${error instanceof Error ? error.message : String(error)}`);
  }
}

new XMLParser({
  isArray: (tagName) => tagName === "sitemap",
  removeNSPrefix: true,
  trimValues: true
});

function normalizeSourceInput(source) {
  if (typeof source === "string") {
    return { context: { name: "hook" }, fetch: source };
  }
  if (Array.isArray(source)) {
    return { context: { name: "hook" }, fetch: source };
  }
  return source;
}
async function tryFetchWithFallback(url, options, event) {
  const isExternalUrl = !url.startsWith("/");
  if (isExternalUrl) {
    const strategies = [
      // Strategy 1: Use globalThis.$fetch (original approach)
      () => globalThis.$fetch(url, options),
      // Strategy 2: If event is available, try using event context even for external URLs
      event ? () => event.$fetch(url, options) : null,
      // Strategy 3: Use native fetch as last resort
      () => $fetch(url, options)
    ].filter(Boolean);
    let lastError = null;
    for (const strategy of strategies) {
      try {
        return await strategy();
      } catch (error) {
        lastError = error;
        continue;
      }
    }
    throw lastError;
  }
  const fetchContainer = url.startsWith("/") && event ? event : globalThis;
  return await fetchContainer.$fetch(url, options);
}
async function fetchDataSource(input, event) {
  const context = typeof input.context === "string" ? { name: input.context } : input.context || { name: "fetch" };
  const url = typeof input.fetch === "string" ? input.fetch : input.fetch[0];
  const options = typeof input.fetch === "string" ? {} : input.fetch[1];
  const start = Date.now();
  const isExternalUrl = !url.startsWith("/");
  const timeout = isExternalUrl ? 1e4 : options.timeout || 5e3;
  const timeoutController = new AbortController();
  const abortRequestTimeout = setTimeout(() => timeoutController.abort(), timeout);
  try {
    let isMaybeErrorResponse = false;
    const isXmlRequest = parseURL(url).pathname.endsWith(".xml");
    const mergedHeaders = defu(
      options?.headers,
      {
        Accept: isXmlRequest ? "text/xml" : "application/json"
      },
      event && !isExternalUrl ? { host: getRequestHost(event, { xForwardedHost: true }) } : {}
    );
    const fetchOptions = {
      ...options,
      responseType: isXmlRequest ? "text" : "json",
      signal: timeoutController.signal,
      headers: mergedHeaders,
      // Use ofetch's built-in retry for external sources
      ...isExternalUrl && {
        retry: 2,
        retryDelay: 200
      },
      // @ts-expect-error untyped
      onResponse({ response }) {
        if (typeof response._data === "string" && response._data.startsWith("<!DOCTYPE html>"))
          isMaybeErrorResponse = true;
      }
    };
    const res = await tryFetchWithFallback(url, fetchOptions, event);
    const timeTakenMs = Date.now() - start;
    if (isMaybeErrorResponse) {
      return {
        ...input,
        context,
        urls: [],
        timeTakenMs,
        error: "Received HTML response instead of JSON"
      };
    }
    let urls = [];
    if (typeof res === "object") {
      urls = res.urls || res;
    } else if (typeof res === "string" && parseURL(url).pathname.endsWith(".xml")) {
      const result = await parseSitemapXml(res);
      urls = result.urls;
    }
    return {
      ...input,
      context,
      timeTakenMs,
      urls
    };
  } catch (_err) {
    const error = _err;
    if (isExternalUrl) {
      const errorInfo = {
        url,
        timeout,
        error: error.message,
        statusCode: error.response?.status,
        statusText: error.response?.statusText,
        method: options?.method || "GET"
      };
      logger.error("Failed to fetch external source.", errorInfo);
    } else {
      logger.error("Failed to fetch source.", { url, error: error.message });
    }
    return {
      ...input,
      context,
      urls: [],
      error: error.message,
      _isFailure: true
      // Mark as failure to prevent caching
    };
  } finally {
    if (abortRequestTimeout) {
      clearTimeout(abortRequestTimeout);
    }
  }
}
async function globalSitemapSources() {
  const m = await import('../virtual/global-sources.mjs');
  return [...m.sources];
}
async function childSitemapSources(definition) {
  if (!definition?._hasSourceChunk)
    return [];
  const m = await import('../virtual/child-sources.mjs');
  return [...m.sources[definition.sitemapName] || []];
}
async function resolveSitemapSources(sources, event) {
  return (await Promise.all(
    sources.map((source) => {
      const normalized = normalizeSourceInput(source);
      if ("urls" in normalized) {
        return {
          timeTakenMs: 0,
          ...normalized,
          urls: normalized.urls
        };
      }
      if (normalized.fetch)
        return fetchDataSource(normalized, event);
      return {
        ...normalized,
        error: "Invalid source"
      };
    })
  )).flat();
}

function sortInPlace(urls) {
  urls.sort((a, b) => {
    const aLoc = typeof a === "string" ? a : a.loc;
    const bLoc = typeof b === "string" ? b : b.loc;
    const aSegments = aLoc.split("/").length;
    const bSegments = bLoc.split("/").length;
    if (aSegments !== bSegments) {
      return aSegments - bSegments;
    }
    return aLoc.localeCompare(bLoc, void 0, { numeric: true });
  });
  return urls;
}

function parseChunkInfo(sitemapName, sitemaps, defaultChunkSize) {
  defaultChunkSize = defaultChunkSize || 1e3;
  if (typeof sitemaps.chunks !== "undefined" && !Number.isNaN(Number(sitemapName))) {
    return {
      isChunked: true,
      baseSitemapName: "sitemap",
      chunkIndex: Number(sitemapName),
      chunkSize: defaultChunkSize
    };
  }
  if (sitemapName.includes("-")) {
    const parts = sitemapName.split("-");
    const lastPart = parts.pop();
    if (!Number.isNaN(Number(lastPart))) {
      const baseSitemapName = parts.join("-");
      const baseSitemap = sitemaps[baseSitemapName];
      if (baseSitemap && (baseSitemap.chunks || baseSitemap._isChunking)) {
        const chunkSize = typeof baseSitemap.chunks === "number" ? baseSitemap.chunks : baseSitemap.chunkSize || defaultChunkSize;
        return {
          isChunked: true,
          baseSitemapName,
          chunkIndex: Number(lastPart),
          chunkSize
        };
      }
    }
  }
  return {
    isChunked: false,
    baseSitemapName: sitemapName,
    chunkIndex: void 0,
    chunkSize: defaultChunkSize
  };
}
function sliceUrlsForChunk(urls, sitemapName, sitemaps, defaultChunkSize = 1e3) {
  const chunkInfo = parseChunkInfo(sitemapName, sitemaps, defaultChunkSize);
  if (chunkInfo.isChunked && chunkInfo.chunkIndex !== void 0) {
    const startIndex = chunkInfo.chunkIndex * chunkInfo.chunkSize;
    const endIndex = (chunkInfo.chunkIndex + 1) * chunkInfo.chunkSize;
    return urls.slice(startIndex, endIndex);
  }
  return urls;
}

function escapeValueForXml(value) {
  if (value === true || value === false)
    return value ? "yes" : "no";
  return xmlEscape(String(value));
}
const yesNo = (v) => v === "yes" || v === true ? "yes" : "no";
const URLSET_OPENING_TAG = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
function buildUrlXml(url, NL, I1, I2, I3, I4) {
  let xml = `${I1}<url>${NL}`;
  if (url.loc) xml += `${I2}<loc>${xmlEscape(url.loc)}</loc>${NL}`;
  if (url.lastmod) xml += `${I2}<lastmod>${url.lastmod}</lastmod>${NL}`;
  if (url.changefreq) xml += `${I2}<changefreq>${url.changefreq}</changefreq>${NL}`;
  if (url.priority !== void 0) {
    const p = typeof url.priority === "number" ? url.priority : Number.parseFloat(url.priority);
    xml += `${I2}<priority>${p.toFixed(1)}</priority>${NL}`;
  }
  if (url.alternatives) {
    for (const alt of url.alternatives) {
      let attrs = "";
      for (const [k, v] of Object.entries(alt)) attrs += ` ${k}="${xmlEscape(String(v))}"`;
      xml += `${I2}<xhtml:link rel="alternate"${attrs} />${NL}`;
    }
  }
  if (url.images) {
    for (const img of url.images) {
      xml += `${I2}<image:image>${NL}${I3}<image:loc>${xmlEscape(img.loc)}</image:loc>${NL}`;
      if (img.title) xml += `${I3}<image:title>${xmlEscape(img.title)}</image:title>${NL}`;
      if (img.caption) xml += `${I3}<image:caption>${xmlEscape(img.caption)}</image:caption>${NL}`;
      if (img.geo_location) xml += `${I3}<image:geo_location>${xmlEscape(img.geo_location)}</image:geo_location>${NL}`;
      if (img.license) xml += `${I3}<image:license>${xmlEscape(img.license)}</image:license>${NL}`;
      xml += `${I2}</image:image>${NL}`;
    }
  }
  if (url.videos) {
    for (const video of url.videos) {
      xml += `${I2}<video:video>${NL}${I3}<video:title>${xmlEscape(video.title)}</video:title>${NL}`;
      if (video.thumbnail_loc) xml += `${I3}<video:thumbnail_loc>${xmlEscape(video.thumbnail_loc)}</video:thumbnail_loc>${NL}`;
      xml += `${I3}<video:description>${xmlEscape(video.description)}</video:description>${NL}`;
      if (video.content_loc) xml += `${I3}<video:content_loc>${xmlEscape(video.content_loc)}</video:content_loc>${NL}`;
      if (video.player_loc) xml += `${I3}<video:player_loc>${xmlEscape(video.player_loc)}</video:player_loc>${NL}`;
      if (video.duration !== void 0) xml += `${I3}<video:duration>${video.duration}</video:duration>${NL}`;
      if (video.expiration_date) xml += `${I3}<video:expiration_date>${video.expiration_date}</video:expiration_date>${NL}`;
      if (video.rating !== void 0) xml += `${I3}<video:rating>${video.rating}</video:rating>${NL}`;
      if (video.view_count !== void 0) xml += `${I3}<video:view_count>${video.view_count}</video:view_count>${NL}`;
      if (video.publication_date) xml += `${I3}<video:publication_date>${video.publication_date}</video:publication_date>${NL}`;
      if (video.family_friendly !== void 0) xml += `${I3}<video:family_friendly>${yesNo(video.family_friendly)}</video:family_friendly>${NL}`;
      if (video.restriction) xml += `${I3}<video:restriction relationship="${video.restriction.relationship || "allow"}">${xmlEscape(video.restriction.restriction)}</video:restriction>${NL}`;
      if (video.platform) xml += `${I3}<video:platform relationship="${video.platform.relationship || "allow"}">${xmlEscape(video.platform.platform)}</video:platform>${NL}`;
      if (video.requires_subscription !== void 0) xml += `${I3}<video:requires_subscription>${yesNo(video.requires_subscription)}</video:requires_subscription>${NL}`;
      if (video.price) {
        for (const price of video.price) {
          const c = price.currency ? ` currency="${price.currency}"` : "";
          const t = price.type ? ` type="${price.type}"` : "";
          xml += `${I3}<video:price${c}${t}>${xmlEscape(String(price.price ?? ""))}</video:price>${NL}`;
        }
      }
      if (video.uploader) {
        const info = video.uploader.info ? ` info="${xmlEscape(video.uploader.info)}"` : "";
        xml += `${I3}<video:uploader${info}>${xmlEscape(video.uploader.uploader)}</video:uploader>${NL}`;
      }
      if (video.live !== void 0) xml += `${I3}<video:live>${yesNo(video.live)}</video:live>${NL}`;
      if (video.tag) {
        const tags = Array.isArray(video.tag) ? video.tag : [video.tag];
        for (const t of tags) xml += `${I3}<video:tag>${xmlEscape(t)}</video:tag>${NL}`;
      }
      if (video.category) xml += `${I3}<video:category>${xmlEscape(video.category)}</video:category>${NL}`;
      if (video.gallery_loc) xml += `${I3}<video:gallery_loc>${xmlEscape(video.gallery_loc)}</video:gallery_loc>${NL}`;
      xml += `${I2}</video:video>${NL}`;
    }
  }
  if (url.news) {
    xml += `${I2}<news:news>${NL}${I3}<news:publication>${NL}`;
    xml += `${I4}<news:name>${xmlEscape(url.news.publication.name)}</news:name>${NL}`;
    xml += `${I4}<news:language>${xmlEscape(url.news.publication.language)}</news:language>${NL}`;
    xml += `${I3}</news:publication>${NL}`;
    if (url.news.title) xml += `${I3}<news:title>${xmlEscape(url.news.title)}</news:title>${NL}`;
    if (url.news.publication_date) xml += `${I3}<news:publication_date>${url.news.publication_date}</news:publication_date>${NL}`;
    xml += `${I2}</news:news>${NL}`;
  }
  xml += `${I1}</url>`;
  return xml;
}
function urlsToXml(urls, resolvers, { version, xsl, credits, minify }, errorInfo) {
  let xslHref = xsl ? resolvers.relativeBaseUrlResolver(xsl) : false;
  if (xslHref && errorInfo?.messages.length) {
    xslHref = withQuery(xslHref, {
      errors: "true",
      error_messages: errorInfo.messages,
      error_urls: errorInfo.urls
    });
  }
  const NL = minify ? "" : "\n";
  const I1 = minify ? "" : "    ";
  const I2 = minify ? "" : "        ";
  const I3 = minify ? "" : "            ";
  const I4 = minify ? "" : "                ";
  let xml = xslHref ? `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${escapeValueForXml(xslHref)}"?>${NL}` : `<?xml version="1.0" encoding="UTF-8"?>${NL}`;
  xml += URLSET_OPENING_TAG + NL;
  for (const url of urls) {
    xml += buildUrlXml(url, NL, I1, I2, I3, I4) + NL;
  }
  xml += "</urlset>";
  if (credits) {
    xml += `${NL}<!-- XML Sitemap generated by @nuxtjs/sitemap v${version} at ${(/* @__PURE__ */ new Date()).toISOString()} -->`;
  }
  return xml;
}

function resolveSitemapEntries(sitemap, urls, runtimeConfig, resolvers) {
  const {
    autoI18n,
    isI18nMapped
  } = runtimeConfig;
  const filterPath = createPathFilter({
    include: sitemap.include,
    exclude: sitemap.exclude
  });
  const _urls = urls.map((_e) => {
    const e = preNormalizeEntry(_e, resolvers);
    if (!e.loc || !filterPath(e.loc))
      return false;
    return e;
  }).filter(Boolean);
  let validI18nUrlsForTransform = [];
  const withoutPrefixPaths = {};
  if (autoI18n && autoI18n.strategy !== "no_prefix") {
    const localeCodes = autoI18n.locales.map((l) => l.code);
    const localeByCode = new Map(autoI18n.locales.map((l) => [l.code, l]));
    const isPrefixStrategy = autoI18n.strategy === "prefix";
    const isPrefixExceptOrAndDefault = autoI18n.strategy === "prefix_and_default" || autoI18n.strategy === "prefix_except_default";
    const xDefaultAndLocales = [{ code: "x-default", _hreflang: "x-default" }, ...autoI18n.locales];
    const defaultLocale = autoI18n.defaultLocale;
    const hasPages = !!autoI18n.pages;
    const hasDifferentDomains = !!autoI18n.differentDomains;
    validI18nUrlsForTransform = _urls.map((_e, i) => {
      if (_e._abs)
        return false;
      const split = splitForLocales(_e._relativeLoc, localeCodes);
      let localeCode = split[0];
      const pathWithoutPrefix = split[1];
      if (!localeCode)
        localeCode = defaultLocale;
      const e = _e;
      e._pathWithoutPrefix = pathWithoutPrefix;
      const locale = localeByCode.get(localeCode);
      if (!locale)
        return false;
      e._locale = locale;
      e._index = i;
      e._key = `${e._sitemap || ""}${e._path?.pathname || "/"}${e._path?.search || ""}`;
      withoutPrefixPaths[pathWithoutPrefix] = withoutPrefixPaths[pathWithoutPrefix] || [];
      if (!withoutPrefixPaths[pathWithoutPrefix].some((e2) => e2._locale.code === locale.code))
        withoutPrefixPaths[pathWithoutPrefix].push(e);
      return e;
    }).filter(Boolean);
    for (const e of validI18nUrlsForTransform) {
      if (!e._i18nTransform && !e.alternatives?.length) {
        const alternatives = (withoutPrefixPaths[e._pathWithoutPrefix] || []).map((u) => {
          const entries = [];
          if (u._locale.code === defaultLocale) {
            entries.push({
              href: u.loc,
              hreflang: "x-default"
            });
          }
          entries.push({
            href: u.loc,
            hreflang: u._locale._hreflang || defaultLocale
          });
          return entries;
        }).flat().filter(Boolean);
        if (alternatives.length)
          e.alternatives = alternatives;
      } else if (e._i18nTransform) {
        delete e._i18nTransform;
        if (hasDifferentDomains) {
          const defLocale = localeByCode.get(defaultLocale);
          e.alternatives = [
            {
              ...defLocale,
              code: "x-default"
            },
            ...autoI18n.locales.filter((l) => !!l.domain)
          ].map((locale) => {
            return {
              hreflang: locale._hreflang,
              href: joinURL(withHttps(locale.domain), e._pathWithoutPrefix)
            };
          });
        } else {
          const pageMatch = hasPages ? findPageMapping(e._pathWithoutPrefix, autoI18n.pages) : null;
          const pathSearch = e._path?.search || "";
          const pathWithoutPrefix = e._pathWithoutPrefix;
          for (const l of autoI18n.locales) {
            let loc = pathWithoutPrefix;
            if (pageMatch && pageMatch.mappings[l.code] !== void 0) {
              const customPath = pageMatch.mappings[l.code];
              if (customPath === false)
                continue;
              if (typeof customPath === "string") {
                loc = customPath[0] === "/" ? customPath : `/${customPath}`;
                loc = applyDynamicParams(loc, pageMatch.paramSegments);
                if (isPrefixStrategy || isPrefixExceptOrAndDefault && l.code !== defaultLocale)
                  loc = joinURL(`/${l.code}`, loc);
              }
            } else if (!hasDifferentDomains && !(isPrefixExceptOrAndDefault && l.code === defaultLocale)) {
              loc = joinURL(`/${l.code}`, pathWithoutPrefix);
            }
            const _sitemap = isI18nMapped ? l._sitemap : void 0;
            const alternatives = [];
            for (const locale of xDefaultAndLocales) {
              const code = locale.code === "x-default" ? defaultLocale : locale.code;
              const isDefault = locale.code === "x-default" || locale.code === defaultLocale;
              let href = pathWithoutPrefix;
              if (pageMatch && pageMatch.mappings[code] !== void 0) {
                const customPath = pageMatch.mappings[code];
                if (customPath === false)
                  continue;
                if (typeof customPath === "string") {
                  href = customPath[0] === "/" ? customPath : `/${customPath}`;
                  href = applyDynamicParams(href, pageMatch.paramSegments);
                  if (isPrefixStrategy || isPrefixExceptOrAndDefault && !isDefault)
                    href = joinURL("/", code, href);
                }
              } else if (isPrefixStrategy) {
                href = joinURL("/", code, pathWithoutPrefix);
              } else if (isPrefixExceptOrAndDefault && !isDefault) {
                href = joinURL("/", code, pathWithoutPrefix);
              }
              if (!filterPath(href))
                continue;
              alternatives.push({
                hreflang: locale._hreflang,
                href
              });
            }
            const { _index: _, ...rest } = e;
            const newEntry = preNormalizeEntry({
              _sitemap,
              ...rest,
              _key: `${_sitemap || ""}${loc || "/"}${pathSearch}`,
              _locale: l,
              loc,
              alternatives
            }, resolvers);
            if (e._locale.code === newEntry._locale.code) {
              _urls[e._index] = newEntry;
              e._index = void 0;
            } else {
              _urls.push(newEntry);
            }
          }
        }
      }
      if (isI18nMapped) {
        e._sitemap = e._sitemap || e._locale._sitemap;
        e._key = `${e._sitemap || ""}${e.loc || "/"}${e._path?.search || ""}`;
      }
      if (e._index)
        _urls[e._index] = e;
    }
  }
  return _urls;
}
async function buildSitemapUrls(sitemap, resolvers, runtimeConfig, nitro) {
  const {
    sitemaps,
    // enhancing
    autoI18n,
    isI18nMapped,
    isMultiSitemap,
    // sorting
    sortEntries,
    // chunking
    defaultSitemapsChunkSize
  } = runtimeConfig;
  const chunkSize = defaultSitemapsChunkSize || void 0;
  const chunkInfo = parseChunkInfo(sitemap.sitemapName, sitemaps, chunkSize);
  function maybeSort(urls2) {
    return sortEntries ? sortInPlace(urls2) : urls2;
  }
  function maybeSlice(urls2) {
    return sliceUrlsForChunk(urls2, sitemap.sitemapName, sitemaps, chunkSize);
  }
  if (autoI18n?.differentDomains) {
    const domain = autoI18n.locales.find((e) => e.language === sitemap.sitemapName || e.code === sitemap.sitemapName)?.domain;
    if (domain) {
      const _tester = resolvers.canonicalUrlResolver;
      resolvers.canonicalUrlResolver = (path) => resolveSitePath(path, {
        absolute: true,
        withBase: false,
        siteUrl: withHttps(domain),
        trailingSlash: _tester("/test/").endsWith("/"),
        base: "/"
      });
    }
  }
  let effectiveSitemap = sitemap;
  const baseSitemapName = chunkInfo.baseSitemapName;
  if (chunkInfo.isChunked && baseSitemapName !== sitemap.sitemapName && sitemaps[baseSitemapName]) {
    effectiveSitemap = sitemaps[baseSitemapName];
  }
  let sourcesInput = effectiveSitemap.includeAppSources ? [...await globalSitemapSources(), ...await childSitemapSources(effectiveSitemap)] : await childSitemapSources(effectiveSitemap);
  if (nitro && resolvers.event) {
    const ctx = {
      event: resolvers.event,
      sitemapName: baseSitemapName,
      sources: sourcesInput
    };
    await nitro.hooks.callHook("sitemap:sources", ctx);
    sourcesInput = ctx.sources;
  }
  const sources = await resolveSitemapSources(sourcesInput, resolvers.event);
  const failedSources = sources.filter((source) => source.error && source._isFailure).map((source) => ({
    url: typeof source.fetch === "string" ? source.fetch : source.fetch?.[0] || "unknown",
    error: source.error || "Unknown error"
  }));
  const resolvedCtx = {
    urls: sources.flatMap((s) => s.urls),
    sitemapName: sitemap.sitemapName,
    event: resolvers.event
  };
  await nitro?.hooks.callHook("sitemap:input", resolvedCtx);
  const enhancedUrls = resolveSitemapEntries(sitemap, resolvedCtx.urls, { autoI18n, isI18nMapped }, resolvers);
  if (isMultiSitemap) {
    const sitemapNames = Object.keys(sitemaps).filter((k) => k !== "index");
    const warnedSitemaps = nitro?._sitemapWarnedSitemaps || /* @__PURE__ */ new Set();
    for (const e of enhancedUrls) {
      if (typeof e._sitemap === "string" && !sitemapNames.includes(e._sitemap)) {
        if (!warnedSitemaps.has(e._sitemap)) {
          warnedSitemaps.add(e._sitemap);
          logger.error(`Sitemap \`${e._sitemap}\` not found in sitemap config. Available sitemaps: ${sitemapNames.join(", ")}. Entry \`${e.loc}\` will be omitted.`);
        }
      }
    }
    if (nitro) {
      nitro._sitemapWarnedSitemaps = warnedSitemaps;
    }
  }
  const filteredUrls = enhancedUrls.filter((e) => {
    if (e._sitemap === false)
      return false;
    if (isMultiSitemap && e._sitemap && sitemap.sitemapName) {
      if (sitemap._isChunking)
        return sitemap.sitemapName.startsWith(e._sitemap + "-");
      return e._sitemap === sitemap.sitemapName;
    }
    return true;
  });
  const sortedUrls = maybeSort(filteredUrls);
  const urls = maybeSlice(sortedUrls);
  return { urls, failedSources };
}

function useNitroUrlResolvers(e) {
  const canonicalQuery = getQuery(e).canonical;
  const isShowingCanonical = typeof canonicalQuery !== "undefined" && canonicalQuery !== "false";
  const siteConfig = getSiteConfig(e);
  return {
    event: e,
    fixSlashes: (path) => fixSlashes(siteConfig.trailingSlash, path),
    // we need these as they depend on the nitro event
    canonicalUrlResolver: createSitePathResolver(e, {
      canonical: isShowingCanonical || true,
      absolute: true,
      withBase: true
    }),
    relativeBaseUrlResolver: createSitePathResolver(e, { absolute: false, withBase: true })
  };
}
async function buildSitemapXml(event, definition, resolvers, runtimeConfig) {
  const { sitemapName } = definition;
  const nitro = useNitroApp();
  const { urls: sitemapUrls, failedSources } = await buildSitemapUrls(definition, resolvers, runtimeConfig, nitro);
  const routeRuleMatcher = createNitroRouteRuleMatcher();
  const { autoI18n } = runtimeConfig;
  let validCount = 0;
  for (let i = 0; i < sitemapUrls.length; i++) {
    const u = sitemapUrls[i];
    const path = u._path?.pathname || u.loc;
    if (!getPathRobotConfig(event, { path, skipSiteIndexable: true }).indexable)
      continue;
    let routeRules = routeRuleMatcher(path);
    if (autoI18n?.locales && autoI18n?.strategy !== "no_prefix") {
      const match = splitForLocales(path, autoI18n.locales.map((l) => l.code));
      const pathWithoutPrefix = match[1];
      if (pathWithoutPrefix && pathWithoutPrefix !== path)
        routeRules = defu(routeRules, routeRuleMatcher(pathWithoutPrefix));
    }
    if (routeRules.sitemap === false)
      continue;
    if (typeof routeRules.robots !== "undefined" && !routeRules.robots)
      continue;
    const hasRobotsDisabled = Object.entries(routeRules.headers || {}).some(([name, value]) => name.toLowerCase() === "x-robots-tag" && value.toLowerCase().includes("noindex"));
    if (routeRules.redirect || hasRobotsDisabled)
      continue;
    sitemapUrls[validCount++] = routeRules.sitemap ? defu(u, routeRules.sitemap) : u;
  }
  sitemapUrls.length = validCount;
  const locSize = sitemapUrls.length;
  const resolvedCtx = {
    urls: sitemapUrls,
    sitemapName,
    event
  };
  await nitro.hooks.callHook("sitemap:resolved", resolvedCtx);
  if (resolvedCtx.urls.length !== locSize) {
    resolvedCtx.urls = resolvedCtx.urls.map((e) => preNormalizeEntry(e, resolvers));
  }
  const maybeSort = (urls2) => runtimeConfig.sortEntries ? sortInPlace(urls2) : urls2;
  const defaults = definition.defaults || {};
  const normalizedPreDedupe = resolvedCtx.urls.map((e) => normaliseEntry(e, defaults, resolvers));
  const urls = maybeSort(mergeOnKey(normalizedPreDedupe, "_key").map((e) => normaliseEntry(e, defaults, resolvers)));
  if (definition._isChunking && definition.sitemapName.includes("-")) {
    const parts = definition.sitemapName.split("-");
    const lastPart = parts.pop();
    if (!Number.isNaN(Number(lastPart))) {
      const chunkIndex = Number(lastPart);
      const baseSitemapName = parts.join("-");
      if (urls.length === 0 && chunkIndex > 0) {
        throw createError$1({
          statusCode: 404,
          message: `Sitemap chunk ${chunkIndex} for "${baseSitemapName}" does not exist.`
        });
      }
    }
  }
  const errorInfo = failedSources.length > 0 ? {
    messages: failedSources.map((f) => f.error),
    urls: failedSources.map((f) => f.url)
  } : void 0;
  const sitemap = urlsToXml(urls, resolvers, runtimeConfig, errorInfo);
  const ctx = { sitemap, sitemapName, event };
  await nitro.hooks.callHook("sitemap:output", ctx);
  return ctx.sitemap;
}
const buildSitemapXmlCached = defineCachedFunction(
  buildSitemapXml,
  {
    name: "sitemap:xml",
    group: "sitemap",
    maxAge: 60 * 10,
    // Default 10 minutes
    base: "sitemap",
    // Use the sitemap storage
    getKey: (event, definition) => {
      const host = getHeader(event, "host") || getHeader(event, "x-forwarded-host") || "";
      const proto = getHeader(event, "x-forwarded-proto") || "https";
      const sitemapName = definition.sitemapName || "default";
      return `${sitemapName}-${proto}-${host}`;
    },
    swr: true
    // Enable stale-while-revalidate
  }
);
async function createSitemap(event, definition, runtimeConfig) {
  const resolvers = useNitroUrlResolvers(event);
  const shouldCache = typeof runtimeConfig.cacheMaxAgeSeconds === "number" && runtimeConfig.cacheMaxAgeSeconds > 0;
  const xml = shouldCache ? await buildSitemapXmlCached(event, definition, resolvers, runtimeConfig) : await buildSitemapXml(event, definition, resolvers, runtimeConfig);
  setHeader(event, "Content-Type", "text/xml; charset=UTF-8");
  if (runtimeConfig.cacheMaxAgeSeconds) {
    setHeader(event, "Cache-Control", `public, max-age=${runtimeConfig.cacheMaxAgeSeconds}, s-maxage=${runtimeConfig.cacheMaxAgeSeconds}, stale-while-revalidate=3600`);
    const now = /* @__PURE__ */ new Date();
    setHeader(event, "X-Sitemap-Generated", now.toISOString());
    setHeader(event, "X-Sitemap-Cache-Duration", `${runtimeConfig.cacheMaxAgeSeconds}s`);
    const expiryTime = new Date(now.getTime() + runtimeConfig.cacheMaxAgeSeconds * 1e3);
    setHeader(event, "X-Sitemap-Cache-Expires", expiryTime.toISOString());
    const remainingSeconds = Math.floor((expiryTime.getTime() - now.getTime()) / 1e3);
    setHeader(event, "X-Sitemap-Cache-Remaining", `${remainingSeconds}s`);
  } else {
    setHeader(event, "Cache-Control", `no-cache, no-store`);
  }
  event.context._isSitemap = true;
  return xml;
}

async function sitemapXmlEventHandler(e) {
  const runtimeConfig = useSitemapRuntimeConfig();
  const { sitemaps } = runtimeConfig;
  if ("index" in sitemaps)
    return sendRedirect(e, withBase("/sitemap_index.xml", useRuntimeConfig().app.baseURL), 301);
  return createSitemap(e, Object.values(sitemaps)[0], runtimeConfig);
}

const _nLt7XZ = defineEventHandler(sitemapXmlEventHandler);

const storage = prefixStorage(useStorage(), "i18n");
function cachedFunctionI18n(fn, opts) {
  opts = { maxAge: 1, ...opts };
  const pending = {};
  async function get(key, resolver) {
    const isPending = pending[key];
    if (!isPending) {
      pending[key] = Promise.resolve(resolver());
    }
    try {
      return await pending[key];
    } finally {
      delete pending[key];
    }
  }
  return async (...args) => {
    const key = [opts.name, opts.getKey(...args)].join(":").replace(/:\/$/, ":index");
    const maxAge = opts.maxAge ?? 1;
    const isCacheable = !opts.shouldBypassCache(...args) && maxAge >= 0;
    const cache = isCacheable && await storage.getItemRaw(key);
    if (!cache || cache.ttl < Date.now()) {
      pending[key] = Promise.resolve(fn(...args));
      const value = await get(key, () => fn(...args));
      if (isCacheable) {
        await storage.setItemRaw(key, { ttl: Date.now() + maxAge * 1e3, value, mtime: Date.now() });
      }
      return value;
    }
    return cache.value;
  };
}

const _getMessages = async (locale) => {
  return { [locale]: await getLocaleMessagesMerged(locale, localeLoaders[locale]) };
};
const _getMessagesCached = cachedFunctionI18n(_getMessages, {
  name: "messages",
  maxAge: 60 * 60 * 24,
  getKey: (locale) => locale,
  shouldBypassCache: (locale) => !isLocaleCacheable(locale)
});
const getMessages = _getMessagesCached;
const _getMergedMessages = async (locale, fallbackLocales) => {
  const merged = {};
  try {
    if (fallbackLocales.length > 0) {
      const messages = await Promise.all(fallbackLocales.map(getMessages));
      for (const message2 of messages) {
        deepCopy(message2, merged);
      }
    }
    const message = await getMessages(locale);
    deepCopy(message, merged);
    return merged;
  } catch (e) {
    throw new Error("Failed to merge messages: " + e.message);
  }
};
const getMergedMessages = cachedFunctionI18n(_getMergedMessages, {
  name: "merged-single",
  maxAge: 60 * 60 * 24,
  getKey: (locale, fallbackLocales) => `${locale}-[${[...new Set(fallbackLocales)].sort().join("-")}]`,
  shouldBypassCache: (locale, fallbackLocales) => !isLocaleWithFallbacksCacheable(locale, fallbackLocales)
});
const _getAllMergedMessages = async (locales) => {
  const merged = {};
  try {
    const messages = await Promise.all(locales.map(getMessages));
    for (const message of messages) {
      deepCopy(message, merged);
    }
    return merged;
  } catch (e) {
    throw new Error("Failed to merge messages: " + e.message);
  }
};
cachedFunctionI18n(_getAllMergedMessages, {
  name: "merged-all",
  maxAge: 60 * 60 * 24,
  getKey: (locales) => locales.join("-"),
  shouldBypassCache: (locales) => !locales.every((locale) => isLocaleCacheable(locale))
});

const _messagesHandler = defineEventHandler(async (event) => {
  const locale = getRouterParam(event, "locale");
  if (!locale) {
    throw createError$1({ status: 400, message: "Locale not specified." });
  }
  const ctx = useI18nContext(event);
  if (ctx.localeConfigs && locale in ctx.localeConfigs === false) {
    throw createError$1({ status: 404, message: `Locale '${locale}' not found.` });
  }
  const messages = await getMergedMessages(locale, ctx.localeConfigs?.[locale]?.fallbacks ?? []);
  deepCopy(messages, ctx.messages);
  return ctx.messages;
});
const _cachedMessageLoader = defineCachedFunction(_messagesHandler, {
  name: "i18n:messages-internal",
  maxAge: 60 * 60 * 24,
  getKey: (event) => [getRouterParam(event, "locale") ?? "null", getRouterParam(event, "hash") ?? "null"].join("-"),
  async shouldBypassCache(event) {
    const locale = getRouterParam(event, "locale");
    if (locale == null) {
      return false;
    }
    const ctx = tryUseI18nContext(event) || await initializeI18nContext(event);
    return !ctx.localeConfigs?.[locale]?.cacheable;
  }
});
const _messagesHandlerCached = defineCachedEventHandler(_cachedMessageLoader, {
  name: "i18n:messages",
  maxAge: 10,
  swr: false,
  getKey: (event) => [getRouterParam(event, "locale") ?? "null", getRouterParam(event, "hash") ?? "null"].join("-")
});
const _rDMkJV = _messagesHandlerCached;

const _lazy_1GvK8h = () => import('../routes/renderer.mjs');

const handlers = [
  { route: '', handler: _IhMRL9, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_1GvK8h, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _Kk5VQL, lazy: false, middleware: true, method: undefined },
  { route: '/robots.txt', handler: _9GXKum, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _24YfUX, lazy: false, middleware: true, method: undefined },
  { route: '/__sitemap__/style.xsl', handler: _Nql9XD, lazy: false, middleware: false, method: undefined },
  { route: '/sitemap.xml', handler: _nLt7XZ, lazy: false, middleware: false, method: undefined },
  { route: '/_i18n/:hash/:locale/messages.json', handler: _rDMkJV, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_1GvK8h, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b$1(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C$1(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { appRootTag as a, appRootAttrs as b, appSpaLoaderTag as c, appSpaLoaderAttrs as d, buildAssetsURL as e, getResponseStatus as f, getResponseStatusText as g, appId as h, defineRenderHandler as i, appTeleportTag as j, appTeleportAttrs as k, getQuery as l, createError$1 as m, appHead as n, destr as o, publicAssetsURL as p, getRouteRules as q, joinURL as r, useNitroApp as s, nodeServer as t, useRuntimeConfig as u };
//# sourceMappingURL=nitro.mjs.map
