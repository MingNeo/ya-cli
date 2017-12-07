const path = require('path');
const rf = require('fs');
const deepAssign = require('deep-assign');

/**
 * package.json单独处理，更新时合并
 * @param {*} contents
 * @param {*} data
 * @param {*} dest
 */
module.exports = function generPackageJson(contents, data, dest) {
  let localContents = rf.readFileSync(dest, 'utf-8');
  const localPackage = JSON.parse(localContents);
  const newPackage = JSON.parse(contents);
  deepAssign(newPackage, localPackage, data);
  return JSON.stringify(newPackage, null, 2);
};
