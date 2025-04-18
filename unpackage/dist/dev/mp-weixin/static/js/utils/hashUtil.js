/**
 * Hash utilities for generating hash codes and checksums
 */

/**
 * Generates a simple hash code from a string
 * @param {string} str - The string to hash
 * @param {boolean} [caseSensitive=true] - Whether the hash should be case sensitive
 * @return {number} A numeric hash code
 */
function simpleHash(str, caseSensitive = true) {
    if (!str) return 0;
    
    // Convert to lowercase if not case sensitive
    const processedStr = caseSensitive ? str : str.toLowerCase();
    
    let hash = 0;
    for (let i = 0; i < processedStr.length; i++) {
      const char = processedStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
  
  /**
   * Generates a hash code from any JavaScript value (string, number, object, array)
   * @param {*} value - The value to hash
   * @return {number} A numeric hash code
   */
  function hashCode(value) {
    const type = typeof value;
  
    if (value === null || value === undefined) {
      return 0;
    }
  
    if (type === 'string') {
      return simpleHash(value);
    }
  
    if (type === 'number') {
      return simpleHash(value.toString());
    }
  
    if (type === 'boolean') {
      return value ? 1 : 0;
    }
  
    if (Array.isArray(value)) {
      return simpleHash(value.map(item => hashCode(item)).join('|'));
    }
  
    if (type === 'object') {
      // Sort keys to ensure consistent hashing regardless of property order
      const sortedKeys = Object.keys(value).sort();
      const keyValuePairs = sortedKeys.map(key => `${key}:${hashCode(value[key])}`);
      return simpleHash(keyValuePairs.join('|'));
    }
  
    // Fall back to string conversion for other types
    return simpleHash(String(value));
  }
  
  /**
   * Generates a hexadecimal hash string (MD5-like but simpler)
   * @param {*} value - The value to hash
   * @param {number} [length=8] - The desired length of the hex string
   * @return {string} A hexadecimal hash string
   */
  function hexHash(value, length = 8) {
    const hash = hashCode(value);
    // Convert to hex string and pad if needed
    let hexString = hash.toString(16);
    
    // Ensure the hex string is at least the requested length
    while (hexString.length < length) {
      hexString = '0' + hexString;
    }
    
    // Trim if longer than requested length
    return hexString.slice(0, length);
  }
  
  /**
   * Check if two values have the same hash
   * @param {*} value1 - First value to compare
   * @param {*} value2 - Second value to compare
   * @return {boolean} True if the hash codes are the same
   */
  function hashEquals(value1, value2) {
    return hashCode(value1) === hashCode(value2);
  }
  
  export default {
    simpleHash,
    hashCode,
    hexHash,
    hashEquals
  };