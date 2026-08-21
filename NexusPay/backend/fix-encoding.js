/**
 * Fix double-encoded UTF-8 that went through Windows-1252.
 * The corruption chain: UTF-8 bytes → interpreted as CP1252 → re-encoded as UTF-8.
 * This script reverses that process at the byte level.
 */
const fs = require('fs');
const path = require('path');

// Windows-1252 byte → Unicode codepoint mapping for 0x80-0x9F range
// (these differ from ISO-8859-1)
const CP1252_MAP = {
  0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E,
  0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6,
  0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152,
  0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C,
  0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A,
  0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178,
};

// Build reverse map: Unicode codepoint → original CP1252 byte
const REVERSE_CP1252 = {};
for (const [byte, cp] of Object.entries(CP1252_MAP)) {
  REVERSE_CP1252[cp] = parseInt(byte);
}
// For bytes 0xA0-0xFF, the codepoint equals the byte value (same as Latin-1)
for (let b = 0xA0; b <= 0xFF; b++) {
  REVERSE_CP1252[b] = b;
}
// For bytes 0x00-0x7F, codepoint equals byte  
for (let b = 0x00; b <= 0x7F; b++) {
  REVERSE_CP1252[b] = b;
}

/**
 * Given a UTF-8 file content string, find sequences that are double-encoded
 * and decode them back to proper UTF-8.
 */
function fixDoubleEncoded(content) {
  let result = '';
  let i = 0;
  let fixed = 0;

  while (i < content.length) {
    const cp0 = content.codePointAt(i);
    const charLen0 = cp0 > 0xFFFF ? 2 : 1;

    // Check if this could be the start of a double-encoded sequence
    // Original byte in 0xC0-0xFF range → means it was a multi-byte UTF-8 lead byte
    const origByte0 = REVERSE_CP1252[cp0];

    if (origByte0 !== undefined && origByte0 >= 0xC0 && origByte0 <= 0xFF) {
      // Try to reconstruct the original UTF-8 sequence
      let numContinuation;
      if (origByte0 >= 0xF0) numContinuation = 3;      // 4-byte sequence
      else if (origByte0 >= 0xE0) numContinuation = 2;  // 3-byte sequence  
      else if (origByte0 >= 0xC0) numContinuation = 1;  // 2-byte sequence
      
      let valid = true;
      const origBytes = [origByte0];
      let j = i + charLen0;
      
      for (let k = 0; k < numContinuation && j < content.length; k++) {
        const cpN = content.codePointAt(j);
        const charLenN = cpN > 0xFFFF ? 2 : 1;
        const origByteN = REVERSE_CP1252[cpN];
        
        if (origByteN !== undefined && origByteN >= 0x80 && origByteN <= 0xBF) {
          origBytes.push(origByteN);
          j += charLenN;
        } else {
          valid = false;
          break;
        }
      }

      if (valid && origBytes.length === numContinuation + 1) {
        // Reconstruct the original character from its UTF-8 bytes
        const buf = Buffer.from(origBytes);
        const decoded = buf.toString('utf8');
        
        // Verify it decoded to a valid character (not replacement char)
        if (!decoded.includes('\uFFFD') && decoded.length > 0) {
          result += decoded;
          i = j;
          fixed++;
          continue;
        }
      }
    }

    // No match - copy character as-is
    result += String.fromCodePoint(cp0);
    i += charLen0;
  }

  return { result, fixed };
}

function walkDir(dir, exts) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walkDir(full, exts));
    else if (exts.some(e => entry.name.endsWith(e))) results.push(full);
  }
  return results;
}

const frontendDir = path.join(__dirname, '..', 'frontend');
const files = walkDir(frontendDir, ['.html', '.js', '.css']);
let total = 0;

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const { result, fixed } = fixDoubleEncoded(content);
  if (fixed > 0) {
    fs.writeFileSync(f, result, 'utf8');
    console.log(`FIXED ${path.relative(frontendDir, f)}: ${fixed} sequences`);
    total += fixed;
  }
}
console.log(`\nTotal: ${total} double-encoded sequences fixed across all files`);
