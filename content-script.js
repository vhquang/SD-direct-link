"use strict";

browser.runtime.onMessage.addListener(request => {
  alert("[From extension]: " + request.msg);
  return Promise.resolve();
});
