[![Build Docker Image](https://github.com/BenchmarkSims/maps-server/actions/workflows/docker.yml/badge.svg)](https://github.com/BenchmarkSims/maps-server/actions/workflows/docker.yml)

[![Build Dev Docker Image](https://github.com/BenchmarkSims/maps-server/actions/workflows/docker_dev.yml/badge.svg)](https://github.com/BenchmarkSims/maps-server/actions/workflows/docker_dev.yml) 

# Falcon BMS Collaboration Server (maps website)
A collaboration server to enable mission preparation for multiplayer missions inside Falcon BMS maps website

## How to use it

### Regular install
Instructions:
- Install node executable on your machine
- Download the files from the latest release /source folder
- Put the content into the folder you wish to run the application
- Run the following lines to run the server:
  ```
  cd my_application _folder
  npm install
  node my_application_folder/index.js PORT
  ```

The `PORT` parameter will default to 3000 but you can change it to whatever you need...

### Container
- Supported Linux OS: amd64, arm64, ppc64le

- ENV variables:
  - MAPS_SERVER_PORT (Default: 3000)

- Image run:
  `docker pull ghcr.io/benchmarksims/maps-server:latest`
  (other interesting tags: testing)


## License
The project presented here is under GNU GPL v3.

We encourage people to contribute to this project instead of creating a fork...
