<template>
  <div id="app">
    <div ref="dmnContainer" id="canvas" class="full-height"></div>
    <!--  meta data -->
    <div class="metadata">
      <br />
      <p><strong>Author:</strong> {{ metadata.author }}</p>
      <p><strong>Date:</strong> {{ metadata.date }}</p>
    </div>
    <!-- Buttons for actions -->
  </div>
  <div class="button-row">
    <div id="main-button">
      <button id="save-button" @click="exportDiagram">Print to Console</button>
      <button id="save-json-button" @click="saveAsJson">Save as JSON</button>
      <button id="load-dmn-button" @click="loadDmnFile">Load DMN</button>
      <button id="reset-diagram-button" @click="resetDiagram">
        Reset Diagram
      </button>
    </div>
    <input
    type="file"
    ref="fileInput"
    style="display: none"
    @change="handleFileSelect"
    accept=".dmn"
    />
  </div>
  <div class="button-row">
    <div id="export-button">
      <button id="export-svg-button" @click="exportToSVG">Export as SVG</button>
      <button id="export-jpeg-button" @click="exportToJPEG">
        Export to JPEG
      </button>
      <button id="export-png-button" @click="exportToPNG">Export to PNG</button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import DmnJS from "dmn-js/lib/Modeler";
import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js/dist/assets/dmn-js-shared.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-decision-table-controls.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-font/css/dmn.css";
import domtoimage from "dom-to-image";

export default {
  name: "DmnModeler",
  data() {
    return {
      dmnModeler: null,
      metadata: {
        author: "Wahyu Hidayat",
        date: new Date().toLocaleDateString(),
      },
      diagramUrl: "./EmptyDiagram.dmn",
      /* 
        //this is for testing:  playwright
        diagramUrl: new URL('./EmptyDiagram.dmn', import.meta.url).href, */
    };
  },
  mounted() {
    this.initializeDmnModeler();
    this.loadExternalDiagram();
  },
  methods: {
    exportToPNG() {
      const canvas = document.getElementById("canvas");

      if (!canvas) {
        console.error("Canvas element not found.");
        return;
      }

      // Temporarily hide elements with specific classes
      const elementsToHide = document.querySelectorAll('.djs-palette.open, .dmn-definitions');
      elementsToHide.forEach(el => el.style.visibility = 'hidden');

      domtoimage
        .toPng(canvas)
        .then(function (dataUrl) {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "diagram.png";
          link.click();

          // Restore the hidden elements
          elementsToHide.forEach(el => el.style.visibility = '');
        })
        .catch(function (error) {
          console.error("Error exporting to PNG:", error);

          // Restore the hidden elements in case of error
          elementsToHide.forEach(el => el.style.visibility = '');
        });
    },
    exportToJPEG() {
      const canvas = document.getElementById("canvas");

      if (!canvas) {
        console.error("Canvas element not found.");
        return;
      }

      // Temporarily hide elements with specific classes
      const elementsToHide = document.querySelectorAll(
        ".djs-palette.open, .dmn-definitions"
      );
      elementsToHide.forEach((el) => (el.style.visibility = "hidden"));

      domtoimage
        .toJpeg(canvas)
        .then(function (dataUrl) {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "diagram.jpg";
          link.click();

          // Restore the hidden elements
          elementsToHide.forEach((el) => (el.style.visibility = ""));
        })
        .catch(function (error) {
          console.error("Error exporting to JPEG:", error);

          // Restore the hidden elements in case of error
          elementsToHide.forEach((el) => (el.style.visibility = ""));
        });
    },
    exportToSVG() {
      const canvas = document.getElementById("canvas");

      if (!canvas) {
        console.error("Canvas element not found.");
        return;
      }

      // Temporarily hide elements with specific classes
      const elementsToHide = document.querySelectorAll(
        ".djs-palette.open, .dmn-definitions"
      );
      elementsToHide.forEach((el) => (el.style.display = "none"));

      // Convert canvas to SVG
      domtoimage
        .toSvg(canvas)
        .then(function (dataUrl) {
          // Create a link element to download the SVG
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "diagram.svg";
      document.body.appendChild(link); // Append link to body
      link.click();
      document.body.removeChild(link); 

          // Restore the hidden elements
          elementsToHide.forEach((el) => (el.style.display = ""));
        })
        .catch(function (error) {
          console.error("Error exporting to SVG:", error);

          // Restore the hidden elements in case of error
          elementsToHide.forEach((el) => (el.style.display = ""));
        });
    },
    async resetDiagram() {
      try {
        const response = await fetch(this.diagramUrl);
        if (!response.ok) {
          throw new Error("Failed to load the default diagram.");
        }
        const dmnXML = await response.text();
        await this.dmnModeler.importXML(dmnXML);
        console.log("Diagram has been reset to default.");
      } catch (error) {
        console.error("Error resetting diagram:", error);
      }
    },
    initializeDmnModeler() {
      this.dmnModeler = new DmnJS({
        container: "#canvas",
        keyboard: {
          bindTo: window,
        },
      });
    },
    loadExternalDiagram() {
      fetch(this.diagramUrl)
        .then((response) => response.text())
        .then((dmnXML) => {
          this.openDiagram(dmnXML);
        })
        .catch((error) => console.error("Error loading DMN diagram:", error));
    },
    exportDiagram() {
      if (!this.dmnModeler) {
        console.error("DMN Modeler is not initialized");
        return;
      }
      this.dmnModeler
        .saveXML({ format: true })
        .then((result) => {
          const xml = result.xml;
          alert("Diagram exported. Check the developer tools!");
          console.log("DIAGRAM", xml);
        })
        .catch((err) => {
          console.error("Could not save DMN diagram", err);
        });
    },
    openDiagram(dmnXML) {
      console.log("Opening diagram...");
      this.dmnModeler
        .importXML(dmnXML)
        .then(() => {
          console.log("Diagram imported successfully");
          const activeView = this.dmnModeler.getActiveView();
          console.log("Active View:", activeView); // Check if active view is correctly retrieved
          if (activeView.type === "drd") {
            const activeEditor = this.dmnModeler.getActiveViewer();
            const canvas = activeEditor.get("canvas");
            console.log("Canvas:", canvas); // Check if canvas is correctly retrieved
            if (canvas) {
              canvas.zoom("fit-viewport");
            } else {
              console.error("Canvas is undefined or null");
            }
          } else {
            console.error('Active view type is not "drd"');
          }
        })
        .catch((err) => {
          console.error("Could not import DMN diagram", err);
          alert("Error importing DMN diagram: " + err.message);
        });
    },
    saveAsJson() {
      // Get the current definitions from the DMN modeler
      const definitions = this.dmnModeler.getDefinitions();

      // Combine metadata and definitions
      const data = {
        metadata: this.metadata,
        definitions: definitions,
      };

      // Create a Blob from the JSON data
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(jsonBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "diagram.json";
      link.click();
      URL.revokeObjectURL(url);
    },
    loadDmnFile() {
      console.log("Load DMN button clicked");
      if (this.$refs.fileInput) {
        this.$refs.fileInput.click();
      } else {
        console.error("File input reference is undefined");
      }
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dmnXML = e.target.result;
          // console.log("Loaded DMN XML:", dmnXML); // Verify if the XML is correct
          this.openDiagram(dmnXML);
        };
        reader.readAsText(file);
      }
    },
  },
};
</script>

<style scoped>
.metadata{
  position: absolute;
}
.app {
  display: flex;
  justify-content: center;
  margin: 1rem;
}

#canvas {
  height: 65vh; /* Set viewport height */
  width: 100%;
  border-style: inset;
}
.full-height {
  margin: 0;
  padding: 0;
}

.button-row {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
