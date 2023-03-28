const NodeCache = require('node-cache');
const cache = new NodeCache();

function cacheMiddleware(req, res, next) {
  const key = req.originalUrl || req.url;
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log('Serving from cache:', key);
    return res.send(cachedData);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body);
      res.sendResponse(body);
    };
    next();
  }
}


module.exports = cacheMiddleware;