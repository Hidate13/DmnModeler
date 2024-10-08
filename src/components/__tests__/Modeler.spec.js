import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import DmnModeler from "@/views/Modeler.vue";

// Mocking dmn-js library
vi.mock("dmn-js/lib/Modeler", () => {
  return {
    default: class {
      constructor() {
        this.container = null;
      }
      saveXML(options, callback) {
        if (typeof callback === "function") {
          callback(null, "<xml>mock XML</xml>");
        }
      }
      importXML(dmnXML) {
        return Promise.resolve();
      }
      getActiveView() {
        return { type: "drd" };
      }
      getActiveViewer() {
        return { get: () => ({ zoom: () => {} }) };
      }
    },
  };
});

// Mocking window.alert
global.alert = vi.fn();

describe("DmnModeler.vue", () => {
  let wrapper;
  const mockFetchResponse = "./EmptyDiagram.dmn";
  const mockImportXML = vi.fn(); // Define the mock function
  let importXMLSpy;

  beforeEach(async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockFetchResponse),
      })
    );

    wrapper = mount(DmnModeler, {
      global: {
        mocks: {
          dmnModeler: {
            importXML: mockImportXML, // Ensure this is correctly set up
          },
        },
      },
      attachTo: document.body,
    });

    // Spy on the importXML method of the dmnModeler instance
    importXMLSpy = vi.spyOn(wrapper.vm.dmnModeler, "importXML");

  });

  afterEach(() => {
    wrapper.unmount(); // Clean up after each test
    vi.resetAllMocks(); // Reset mocks after each test
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("#canvas").exists()).toBe(true);
    expect(wrapper.find("button#save-button").exists()).toBe(true);
    expect(wrapper.find("button#save-json-button").exists()).toBe(true);
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("Print to Console on button click", async () => {
    // Find the button element with the id 'save-button'
    const printButton = wrapper.find("button#save-button");

    // Assert that the button has the expected text "Print to Console"
    expect(printButton.text()).toBe("Print to Console");

    // Mock the dmnModeler and its saveXML method
    const saveXMLMock = vi
      .fn()
      .mockResolvedValue({ xml: "<xml>mock XML</xml>" });
    wrapper.vm.dmnModeler = { saveXML: saveXMLMock };

    // Mock the console.log function to intercept and verify console output
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Trigger the button click
    await printButton.trigger("click");

    // Verify that saveXML was called
    expect(saveXMLMock).toHaveBeenCalled();

    // Check if the correct console log occurred
    expect(consoleSpy).toHaveBeenCalledWith("DIAGRAM", "<xml>mock XML</xml>");

    // Restore console.log to its original implementation
    consoleSpy.mockRestore();
  });

  it("handles file selection", async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const file = new File(["dummy content"], "example.dmn", {
      type: "application/xml",
    });

    // Spy on the method responsible for handling file selection
    const handleFileSelectSpy = vi.spyOn(wrapper.vm, "handleFileSelect");

    // Set the files property directly on the input element
    Object.defineProperty(fileInput.element, "files", {
      value: [file],
    });

    // Trigger the change event
    await fileInput.trigger("change");

    // Verify that handleFileSelect was called
    expect(handleFileSelectSpy).toHaveBeenCalled();

    // Check if the event passed to handleFileSelect has the correct files
    const event = handleFileSelectSpy.mock.calls[0][0];
    expect(event.target.files[0]).toBe(file);
  });

  it("exports the diagram to console on button click", async () => {
    const wrapper = mount(DmnModeler);

    // Mock the saveXML method
    const mockXML = "<xml>mock XML</xml>";
    wrapper.vm.dmnModeler.saveXML = vi.fn(() =>
      Promise.resolve({ xml: mockXML })
    );

    // Spy on console.log
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Find and click the button
    const exportButton = wrapper.find("button#save-button");
    await exportButton.trigger("click");

    // Check if console.log was called with the correct arguments
    expect(consoleSpy).toHaveBeenCalledWith("DIAGRAM", mockXML);

    // Restore console.log
    consoleSpy.mockRestore();
  });

  it("should reset the diagram to default successfully", async () => {
        // Trigger the resetDiagram method
    await wrapper.vm.resetDiagram();
    // Wait for promises to resolve
    await wrapper.vm.$nextTick();

    // Check if fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith(wrapper.vm.diagramUrl);

    // Optionally, check how many times importXML was called
    expect(importXMLSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch errors", async () => {
    mockImportXML ;

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await wrapper.vm.resetDiagram();

    expect(global.fetch).toHaveBeenCalledWith(wrapper.vm.diagramUrl);
    expect(mockImportXML).not.toHaveBeenCalled();
  });
  
});
