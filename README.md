<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">

  <a href="https://github.com/map-bgp/browserbook">
    <img src="logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Browserbook</h3>

<p align="center">
    A Decentralized Peer-to-Peer Exchange Powered by WebAssembly
    <br />
    <a href="https://github.com/map-bgp/browserbook"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/map-bgp/browserbook/issues">Report Bug</a>
    ·
    <a href="https://github.com/map-bgp/browserbook/issues">Request Feature</a>
</p>

</p>


<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>


## About The Project

Browserbook is a decentralized ethereum exchange powered by the 0x order protocol and WebRTC. Orders discovery is
performed asynchronously and without a centralized order book. Instead, clients, or peers, each maintain a copy of the 
order book directly, and communicate between each other in order to ensure consistency. 
Thanks to the power of WebAssembly, clients can be run directly in the browser, providing a seamless user experience 
without the need for complicated dependencies. The front end application, as well as the ensuing WASM binary, 
are loaded from the IPFS network, to ensure true decentralization.

### Built With

Browserbook depends on a lot other awesome projects. Much of the backend code relies on the work of the discontinued 
mesh-browser project from 0x labs. 

* [0xProject](https://github.com/0xProject)
* [Ganache](https://github.com/trufflesuite/ganache)
* [Truffle](https://github.com/trufflesuite/truffle)
* [IPFS](https://github.com/ipfs)

## Getting Started

To get a local copy up and running please read the following.

The overall directory hierarchy resembles the following

```
-- browserbook
   |-- browserbook
       |-- browserbook-mesh
           |-- go.mod
           |-- main.go
           |-- ...
       |-- client
           |-- src
           |-- package.json
           |-- webpack.config.js
           |-- ...
       |-- oms-go
   |-- server
       |-- dist
       |-- index.js
       |-- package.json
       |-- ...
```

`browserbook-mesh` contains the main golang code that compiles to the wasm binary served to the client

`client` contains the front end application that is bundled and served to the client

`oms-go` is a spike implementation of our more advanced order book features. It is incomplete and will be integrated into `browserbook-mesh` at a later time

`server` is a simple [Express](https://github.com/expressjs/express) application that serves the wasm binary during development. In production this is performed by the IPFS network

### Prerequisites

The project depends on certain prerequisites. 

First, ensure that [Node.js](https://github.com/nodejs/node) __v12__ (we use __v12.22.1__) is installed and available to the command line.
We highly recommend using [NVM](https://github.com/nvm-sh/nvm) to manage your node installations.

You will also need to ensure that [golang](https://github.com/golang/go) is installed. The repository has been tested and works with __golang 1.16__.

[comment]: <> (### Installation)

[comment]: <> (1. Clone the repo)

[comment]: <> (   ```sh)

[comment]: <> (   git clone https://github.com/map-bgp/browserbook.git)

[comment]: <> (   ```)

[comment]: <> (2. Run build script)

[comment]: <> (   ```sh)

[comment]: <> (   ./gradlew build)

[comment]: <> (   ```)

[comment]: <> (Please note the appropriate platform prefix based upon your OS:)

[comment]: <> (MAC OS X: `./gradlew`)

[comment]: <> (Linux: `./gradlew`)

[comment]: <> (Windows: `./gradlew.bat`)

[comment]: <> (<!-- USAGE EXAMPLES -->)

[comment]: <> (## Usage)

[comment]: <> (Start the server with)

[comment]: <> (```sh)

[comment]: <> (./gradlew bootRun)

[comment]: <> (```)

[comment]: <> (Gradle is also compatible with all mainstream IDE's, with run support baked in natively or via extensions.)

[comment]: <> (The team recommends [IntelliJ]&#40;https://www.jetbrains.com/idea/download/#section=mac&#41;.)

[comment]: <> (Make sure to set the following environment variables or the build will fail:)

[comment]: <> (* `AWS_ACCESS_KEY`)

[comment]: <> (* `AWS_SECRET_KEY`)

[comment]: <> (* `DB_URL` of the form `jdbc:postgresql://{hostname}:{port}/{db_name}`. You need to have a database instance running locally or use the provided test database we provide you)

[comment]: <> (* `DB_USERNAME`)

[comment]: <> (* `DB_PASSWORD`)

[comment]: <> (* `DUMMY_UPLOAD` set to `true` to preserve image upload bandwith during troubleshooting and local development)

[comment]: <> (* `CLOUDINARY_CLOUD_NAME`)

[comment]: <> (* `CLOUDINARY_ACCESS_KEY`)

[comment]: <> (* `CLOUDINARY_SECRET_KEY`)

[comment]: <> (* `CLOUDINARY_ACTIVE`)

[comment]: <> (* `DB_INIT_BEHAVIOR` set to `create-drop` for local development or `none` for persistent storage. Do not use any other option besides `none` if you connect to the test database)

[comment]: <> (You now have a local server process running. To verify your endpoints, see the official Postman.)

[comment]: <> (### Component Heirarchy)

[comment]: <> (The system is comprised of entities and their relationships. HTTP requests flow over the respective controllers which delegate their logical implementations to the service layer. The service layers then interact with the appropriate entities and return an appropriate model back to the controller, where an HTTP response is generated.)

[comment]: <> (Users familiar with Spring should feel comfortable with our repository structure as it follows common idioms.)

[comment]: <> (The application class itself can be reached [here]&#40;https://github.com/sopra-fs21-group-20/closet-server/blob/main/src/main/java/ch/uzh/ifi/hase/soprafs21/Application.java&#41;.)

[comment]: <> (## Testing)

[comment]: <> (```sh)

[comment]: <> (./gradlew test)

[comment]: <> (```)

[comment]: <> (Note to see the test report you need to navigate to `./build/reports/tests/test/index.html`)

[comment]: <> (You should see something like this:)

[comment]: <> (<a href="https://github.com/map-bgp/browserbook">)

[comment]: <> (    <img src="testreport.png" alt="Test Report">)

[comment]: <> (</a>)

[comment]: <> (<!-- _For more examples, please refer to the [Documentation]&#40;https://example.com&#41;_ -->)

[comment]: <> (<!-- ROADMAP -->)

[comment]: <> (## Roadmap)

[comment]: <> (The current highest priority contributions are:)

[comment]: <> (* Further testing and refinement of the core engine)

[comment]: <> (* Integration of a proprietary background removal extension)

[comment]: <> (* Extension of the community features)

[comment]: <> (Please see the [open issues]&#40;https://github.com/map-bgp/browserbook/issues&#41; for a further list of proposed features &#40;and known issues&#41;.)

[comment]: <> (<!-- CONTRIBUTING -->)

[comment]: <> (## Contributing)

[comment]: <> (1. Fork the Project)

[comment]: <> (2. Create your Feature Branch &#40;`git checkout -b feature/AmazingFeature`&#41;)

[comment]: <> (3. Commit your Changes &#40;`git commit -m 'Add some AmazingFeature'`&#41;)

[comment]: <> (4. Push to the Branch &#40;`git push origin feature/AmazingFeature`&#41;)

[comment]: <> (5. Open a Pull Request)

[comment]: <> (<!-- LICENSE -->)

[comment]: <> (## License)

[comment]: <> (Distributed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International Public License. See `LICENSE` for more information.)

[comment]: <> (<!-- CONTACT -->)

[comment]: <> (## Contact)

[comment]: <> (This implementation is the work of the entire MyOutfit team, specifically the backend team Corey Bothwell, Silvan Kübler, and Nicolas Peyer.)

[comment]: <> (They can be reached via their respective GitHub accounts.)

[comment]: <> (Project Link: [https://github.com/map-bgp/browserbook]&#40;https://github.com/map-bgp/browserbook&#41;)

[comment]: <> (<!-- ACKNOWLEDGEMENTS -->)

[comment]: <> (## Acknowledgements)

[comment]: <> (* [University of Zurich Institut for Informatik S.E.A.L.]&#40;https://www.ifi.uzh.ch/en/seal.html&#41;)

[comment]: <> (<!-- MARKDOWN LINKS & IMAGES -->)

[comment]: <> (<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->)

[comment]: <> ([stars-shield]: https://img.shields.io/github/stars/map-bgp/browserbook.svg?style=plastic)

[comment]: <> ([stars-url]: https://github.com/map-bgp/browserbook/stargazers)

[comment]: <> ([issues-shield]: https://img.shields.io/github/issues//map-bgp/browserbook.svg?style=plastic)

[comment]: <> ([issues-url]: https://github.com/map-bgp/browserbook/issues)

[comment]: <> ([license-shield]: https://img.shields.io/github/license/map-bgp/browserbook.svg?style=plastic)

[comment]: <> ([license-url]: https://github.com/map-bgp/browserbook/blob/master/LICENSE.txt)