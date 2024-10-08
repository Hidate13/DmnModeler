
# **DMN Modeler**

## **Overview**

**DMN Modeler** is a Vue.js application designed for creating, editing, and managing DMN (Decision Model and Notation) diagrams. It integrates the `dmn-js` library for DMN modeling and supports functionalities such as saving, loading, and exporting diagrams in various formats.

## **Project Structure**

- **`src/`**: Contains the source code for the DMN Modeler.
  - **`views/Moedeler.vue`**: Main Page to use DMN Editor.
  - **`App.vue`**: The root component that includes the DMNEditor component.
  - **`main.js`**: The entry point of the application, where the Vue instance is created and mounted.
  - **`Main.css`**: Global styles for the application.


- **`__tests__/`**: Contains test files for Vitest.
  - **`BtnTest.spec.js`**: Unit and integration tests using Vitest.
  - **`Modeler.spec.js`**: Unit and integration tests using Vitest.

- **`e2e/`**: Contains test files for for Playwright.
  - **`ModelerPW.test.js`**: End-to-end tests using Playwright.

 **`additional`**: 
  - **`MyDiagram.dmn`**: Default DMN diagram to try how to retrieve file (.dmn).
  - **`EmptyDiagram.dmn`**: Template for an empty DMN diagram to reset the editor.



## **Dependencies**

- **Vue.js**: Framework used for building the UI.
- **`dmn-js`**: Library for DMN modeling.
- **`dom-to-image`**: Library for converting DOM nodes to images (used for exporting diagrams).
- **`html2canvas`**: Library for capturing screenshots of the diagram (alternative to `dom-to-image`).
- **`@vue/test-utils`**: Utilities for testing Vue components.
- **`Vitest`**: A fast unit test framework powered by Vite.
- **`@playwright/test`**: A library for browser automation, used to run end-to-end tests.
- **`fs`**: Node.js module for interacting with the file system.
- **`path`**: Node.js module for working with file and directory paths.

## **Setup**

### **1. Clone the Repository**

Clone the repository to your local machine using Git. Replace `<repository-url>` with the URL of your Git repository.

```bash
git clone https://github.com/Hidate13/dmn-modeler.git
cd dmn-modeler
```

### **2. Prerequisites**

1. **Node.js**: Ensure Node.js is installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

### **3. Install Dependencies**

Install the necessary dependencies using npm:

```bash
npm install
```

### **4. Running the Project**

To start the development server and run the application, use:

```bash
npm run dev
```

### **5. Running Tests**

- **Vitest**: Run unit and integration tests with Vitest:

  ```bash
  npx vitest run
  ```

- **Playwright**: Run end-to-end tests with Playwright:

  ```bash
  npx playwright test --ui
  ```
