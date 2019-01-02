import UAParser from 'ua-parser-js';

const parser = new UAParser();

const device = parser.getDevice();

function isMobile() {
  return (device.type === 'mobile' || device.type === 'tablet');
}

export default { isMobile };
