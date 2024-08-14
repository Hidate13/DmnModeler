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
        if (typeof callback === 'function') {
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

  beforeEach(async () => {
    wrapper = mount(DmnModeler, {
      attachTo: document.body, // Ensure the component is attached to the DOM
    });
  });

  afterEach(() => {
    wrapper.unmount(); // Clean up after each test
    vi.resetAllMocks(); // Reset mocks after each test
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('#canvas').exists()).toBe(true);
    expect(wrapper.find('button#save-button').exists()).toBe(true);
    expect(wrapper.find('button#save-json-button').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it("Print to Console on button click", async () => {
    const printButton = wrapper.find('button#save-button');
    expect(printButton.text()).toBe("Print to Console");

    await printButton.trigger("click");

    // Add additional assertions to verify the expected outcome after button click
  });

  it("handles file selection", async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const file = new File(['dummy content'], 'example.dmn', { type: 'application/xml' });

    // Spy on the method responsible for handling file selection
    const handleFileSelectSpy = vi.spyOn(wrapper.vm, 'handleFileSelect');

    // Set the files property directly on the input element
    Object.defineProperty(fileInput.element, 'files', {
      value: [file],
    });

    // Trigger the change event
    await fileInput.trigger('change');

    // Verify that handleFileSelect was called
    expect(handleFileSelectSpy).toHaveBeenCalled();

    // Check if the event passed to handleFileSelect has the correct files
    const event = handleFileSelectSpy.mock.calls[0][0];
    expect(event.target.files[0]).toBe(file);
  });

  

  it("exports the diagram to console on button click", async () => {
    const exportButton = wrapper.find('button#save-button');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await exportButton.trigger('click');

    expect(consoleSpy).toHaveBeenCalledWith('DIAGRAM', '<xml>mock XML</xml>');
    consoleSpy.mockRestore();
  });

  it("saves the diagram as JSON on button click", async () => {
    // Find the button
    const saveJsonButton = wrapper.find("button#save-json-button");
    // console.log(saveJsonButton + "  <<<<test a saveJsonButton");
  
    // Spy on the saveAsJson method
    const saveAsJsonSpy = vi.spyOn(wrapper.vm, "saveAsJson").mockImplementation(() => Promise.resolve()); // Mock as a resolved promise
  
    // Trigger the button click
    await saveJsonButton.trigger("click");
  
    // Ensure saveAsJson was called
    expect(saveAsJsonSpy).toHaveBeenCalled();
  
    // Restore the spy
    saveAsJsonSpy.mockRestore();
  });
  

  // it("triggers file input click on Load DMN button click", async () => {
  //   const loadDmnButton = wrapper.find("button#load-dmn-button");
  //   const fileInput = wrapper.find('input[type="file"]');

  //   // Spy on the file input click method
  //   const fileInputClickSpy = vi.spyOn(fileInput.element, "click");

  //   await loadDmnButton.trigger("click");

  //   expect(fileInputClickSpy).toHaveBeenCalled();
  // });
});
