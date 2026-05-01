import{G as r}from"./CrkV2OLu.js";const i={searchLive(e){return r.post("/experiences/search/live",e)},getDetails(e,s){return r.get(`/experiences/${e}`,{params:{provider:s}})}};export{i as a};
