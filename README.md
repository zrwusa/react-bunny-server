#Features
<table>
<thead><tr><th>Feature</th><th>Desc</th></tr></thead>
<tbody>
<tr><td>JWT Auth</td><td>  </td></tr>
<tr><td>RESTFul Server</td><td></td></tr>
<tr><td>Https localhost Self Signed Certification</td><td></td></tr>
</tbody>
</table>

# Architecture principles

## Separation of Concern

## Feature Encapsulation

This means that we group the files related to a single feature together. This has helped me to reuse my codebase across projects. Let's face it we do not write everything again and again but rather copy-paste the code once perfected to all the required places. If all the things are clubbed together then it's super easy to achieve this safely. This also helps in building a logical structure in mind to find a particular file while writing code that needs it as a dependency.

## Better Error Handling
This is very important for the application to be consistent with errors and the corresponding API responses. So, adopting the separation of concern principle and also the uniformity in the API responses.
## Better Response Handling
The same reason as provided in the above error handling example is also valid for the response handling. 
## Better Promise Management
The callback is replaced by Promises and now the Promise chain is replaced by the async/await. This greatly enhances the coding experience. One problem with this implementation is to write the ugly try/catch block.
<!--## Robust Unit Tests
The primary purpose of Unit-test is not to detect incorrect grammar but to validate behaviors of logics.-->

<!--## Simple Deployability
Dockerfile and docker-compose.yml to simplify the deployment of the application. It is also possible to manually deploy the application.-->


#Development

##Dev HTTPS
If you want to mock a dev https deployment environment
```sh
sudo yarn dev:certs
```
Then modify the isHttps value to true which located in the src/config file

If you want to change the domain,just locate to options.conf -> DNS.* ,you can add your domain or just modify DNS.4

Then you have to modify the host file of your system.

If you want to access throw https from other devices,eg. iOS you just drag dev-certs/dev.bunnyCA.pem to iOS simulator.
