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
        callback(null, "<xml>mock XML</xml>");
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
  let wrapper

  beforeEach(async () => {
    wrapper = mount(DmnModeler)
    // await nextTick() // Ensure the component is fully rendered
  })

  afterEach(() => {
    vi.resetAllMocks(); // Reset mocks after each test
  })

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("#canvas").exists()).toBe(true);
  });

  it("Print to Console on button click", async () => {
    const printButton = wrapper.find('button#save-button')
    // console.log(wrapper.html()); // Inspect the rendered HTML

    const loadButton = wrapper.find("button#save-button");
        // Verify the button text
    expect(printButton.text()).toBe("Print to Console");

    await loadButton.trigger("click");

    // Add additional assertions to verify the expected outcome after button click
  });

  // it('handles file selection', async () => {
  //   const fileInput = wrapper.find('input[type="file"]')
  //   const file = new File(['dummy content'], 'example.dmn', { type: 'application/dmn+xml' })

  //   const handleFileSelectSpy = vi.spyOn(wrapper.vm, 'handleFileSelect')
  //   await fileInput.setValue(file)

  //   const event = { target: { files: [file] } }
  //   await wrapper.vm.handleFileSelect(event)

  //   expect(handleFileSelectSpy).toHaveBeenCalled()
  //   expect(handleFileSelectSpy).toHaveBeenCalledWith(event)
  // })

  // it('exports the diagram to console on button click', async () => {
  //   const exportButton = wrapper.find('button#save-button')
  //   const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

  //   await exportButton.trigger('click')

  //   expect(consoleSpy).toHaveBeenCalledWith('DIAGRAM', '<xml>mock XML</xml>')
  //   consoleSpy.mockRestore()
  // })

  // it('saves the diagram as JSON on button click', async () => {
  //   const saveJsonButton = wrapper.find('button#save-json-button')
  //   const downloadSpy = vi.spyOn(document, 'createElement')
  //   downloadSpy.mockImplementation(() => ({ click: () => {}, href: '', download: '' }))

  //   await saveJsonButton.trigger('click')

  //   expect(downloadSpy).toHaveBeenCalledWith('a')
  // })
});
