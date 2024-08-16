import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/vue';
import Modeler from '@/views/Modeler.vue';

describe('Modeler', () => {
  it('should call exportToSVG on clicking the SVG button', async () => {
    const exportToSVG = vi.spyOn(Modeler.methods, 'exportToSVG').mockImplementation(() => {});
    const { getByTestId } = render(Modeler);

    const svgButton = getByTestId('export-svg-button');
    await fireEvent.click(svgButton);

    expect(exportToSVG).toHaveBeenCalled();
  });

  it('should call exportToJPEG on clicking the JPEG button', async () => {
    const exportToJPEG = vi.spyOn(Modeler.methods, 'exportToJPEG').mockImplementation(() => {});
    const { getByTestId } = render(Modeler);

    const jpegButton = getByTestId('export-jpeg-button');
    await fireEvent.click(jpegButton);

    expect(exportToJPEG).toHaveBeenCalled();
  });

  it('should call exportToPNG on clicking the PNG button', async () => {
    const exportToPNG = vi.spyOn(Modeler.methods, 'exportToPNG').mockImplementation(() => {});
    const { getByTestId } = render(Modeler);

    const pngButton = getByTestId('export-png-button');
    await fireEvent.click(pngButton);

    expect(exportToPNG).toHaveBeenCalled();
  });
});
