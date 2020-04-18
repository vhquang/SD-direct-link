"use strict";

browser.runtime.onMessage.addListener(request => {
  console.log(request);
  alert("[From extension]: " + request.msg);
  return Promise.resolve();
});
