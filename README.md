# Architecture principles
## Type Safety

Critical bugs reported during the application runtime. Most of the time the bug involved calling a function with wrong parameters. 

Although it can be solved by rigorous unit tests, but let's face it, we can not assure 100% test coverage and even then 100% cases being considered.
 
So, it can turn out to be a million-dollar mistake. When I switched to TypeScript from plain Javascript then this problem got resolved.

## Separation of Concern

## Feature Encapsulation

This means that we group the files related to a single feature together. This has helped me to reuse my codebase across projects. Let's face it we do not write everything again and again but rather copy-paste the code once perfected to all the required places. If all the things are clubbed together then it's super easy to achieve this safely. This also helps in building a logical structure in mind to find a particular file while writing code that needs it as a dependency.

## Better Error Handling
This is very important for the application to be consistent with errors and the corresponding API responses. So, adopting the separation of concern principle and also the uniformity in the API responses.
## Better Response Handling
The same reason as provided in the above error handling example is also valid for the response handling. 
## Better Promise Management
The callback is replaced by Promises and now the Promise chain is replaced by the async/await. This greatly enhances the coding experience. One problem with this implementation is to write the ugly try/catch block.
## Robust Unit Tests
The primary purpose of Unit-test is not to detect incorrect grammar but to validate behaviors of logics.

## Simple Deployability
Dockerfile and docker-compose.yml to simplify the deployment of the application. It is also possible to manually deploy the application. 
