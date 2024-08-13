export default {
    saveXML: jest.fn().mockResolvedValue('<xml></xml>'),
    importXML: jest.fn().mockResolvedValue(),
    getActiveView: jest.fn().mockReturnValue({ type: 'drd' }),
    getActiveViewer: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue({ zoom: jest.fn() }),
    }),
  }
  