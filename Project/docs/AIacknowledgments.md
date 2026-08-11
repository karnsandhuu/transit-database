# AI Acknowledgements

AI has been used throughout this project to generate data for populating tables, provide suggestions for architectural and code refactoring, assist with code review and debugging, and generate project documentation.

## Populating Tables

AI was provided with the revised database schema and asked to generate data for populating each table according to user-defined requirements.

For example, the AI was given requirements such as:

> There needs to be at least 2 passengers in each passenger category.

The generated data was then reviewed by the student and modified to ensure that it satisfied the project requirements and database constraints.

## Refactoring Suggestions

AI was used to provide both architectural refactoring suggestions and code-level refactoring suggestions.

### Architectural Refactoring

The original application structure from the demo project was described to the AI, along with requirements for parallel implementation of modules and backend testing. The AI provided several possible architectural structures.

The student evaluated these suggestions and selected an appropriate structure. The demo project was then refactored and tested by the student according to the selected design.

### Code Refactoring, Code Review, and Debugging

For code refactoring, code review, and debugging, the student provided code that they had written to the AI. The AI reviewed the code and identified potential bugs, code quality issues, refactoring opportunities, and naming improvements.

The student then reviewed the suggestions and made appropriate changes to the code.

## Generating Documentation

To support group collaboration and improve development efficiency, AI was used to assist in generating project documentation. The documentation generated with AI assistance includes:

* `ARCHITECTURE.md`
* `SETUP.md`
* `TESTING.md`
* Documentation within the `APIs` folder
* Documentation within the `specs` folder

### Specs Documentation

For documentation in the `specs` folder, the student provided their implementation code to the AI along with a short description of the purpose and functionality of the code.

The AI generated function specification documentation based on the provided information. The student then reviewed and edited the generated documentation.

### API Documentation

For documentation in the `APIs` folder, the student provided the relevant controller code together with the previously generated specification documentation.

The AI used these materials to generate API documentation describing the endpoints, requests, responses, and functionality. The student then reviewed and edited the generated documentation.

### `ARCHITECTURE.md` and `TESTING.md`

`ARCHITECTURE.md` and `TESTING.md` were initially generated with AI assistance during the architectural refactoring process.

As development progressed, these documents were co-edited by the student and AI to reflect issues encountered while running and testing the program, as well as changes made to the application's architecture and testing procedures.

### `SETUP.md`

`SETUP.md` was generated with AI assistance based on the setup instructions provided in Tutorial 6. The generated documentation was then reviewed and edited by the student.
