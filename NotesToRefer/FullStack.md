Axios is same as the fetch function with more advanced features

What is CORS policy?
->  Cross-Origin Resource Sharing is basically the policy that determines who is allowed to access the  request to the server. URL and Port different??
    
->  CORS npm package also exits which enables us to whitelist specific IP, Domain and Port

What is Proxy ?
-> This will solve the CORS policy issue.
-> The urls like `http://localhost:400` get changed after being deployed. Hence we need to add a proxy to the request. It is an object that will append before the key given to it. 
Different bundler have different proxy settings/config options which needs to be configured accordingly.

```javascript
proxy: {
    '/api': 'http://localhost:3000'
}
```
"In react/frontend Folder" -> npm run build -- build a dist folder containing all the static assets which are than later moved to backend folder and then served as middleware Which is considered a bad practice because if we want to do any update in frontend we should again delete the dist folder and then move from frontend to backend.