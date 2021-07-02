## 0x Mesh Browser Example

This directory contains an example of how to run Mesh in the browser.

### Running the Example

To run the example, first build the mesh-browser package("/packages/mesh-browser") by running the below yarn command. Maybe needs to change the "tsconfig.json".

```
yarn install && yarn build
```

Then make changes in the "src/index.ts" files for the endpoint URL or startAsync() functions. All the .ts script in src are bundled by the webpack package in "dist/bundle.js"(check the webpack.config.js file) after yarn build.

After the changes run the yarn install and build for mesh-webpack-example folder.

```
yarn install && yarn build
```

Then simply serve the **./dist** directory using the web server
of your choice and navigate to the page in your browser. For example, you could
use `goexec`:

```
go get -u github.com/shurcooL/goexec
goexec 'http.ListenAndServe(":8000", http.FileServer(http.Dir("./dist")))'
```

Then navigate to [localhost:8000](http://localhost:8000) in your browser (Chrome
or Firefox are recommended).