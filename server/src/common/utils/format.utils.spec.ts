import FormatUtils from './FormatUtils';

describe('FormatUtils', () => {
  describe('iso8601ToNumber', () => {
    it('should return the number as duration in seconds (PT14M33S => 873)', async () => {
      expect(FormatUtils.iso8601ToSeconds('PT14M33S')).toBe(873);
    });
    it('should return the number as duration in seconds (PT1H10M30S => 4230)', async () => {
      expect(FormatUtils.iso8601ToSeconds('PT1H10M30S')).toBe(4230);
    });
    it('should return the number as duration in seconds (PT30S => 30)', async () => {
      expect(FormatUtils.iso8601ToSeconds('PT30S')).toBe(30);
    });
    it('should return the number as duration in seconds (PT10M00S => 600)', async () => {
      expect(FormatUtils.iso8601ToSeconds('PT10M00S')).toBe(600);
    });
  });
});
