
const { deepStrictEqual } = require('assert');
const fs = require('fs-extra');
const path = require(`path`);
const readline = require('readline-sync');

const base = path.join(`.`, `Saves`);
const ss = `skyrimSaves`;
const currentSaveFile = path.join(`.`, base, `currentSave`);

let saves = [];
try {
  saves = fs.readdirSync(path.join(`.`, ss));
} catch (e) {
  saves = [];
}

if (saves.length === 0) {
  const newName = readline.question(`No saves found. Enter same of current save to copy: `);
  const newPath = path.join(`.`, ss, newName);

  // Make the new save path
  fs.mkdirSync(newPath);

  // Copy the save
  fs.copySync(base, newPath);
} else {
  // See if base save is has been backed up before, and back it up again
  try {
    const existing = fs.readFileSync(currentSaveFile, {encoding: 'utf8'});

    console.log(`Backing up existing save: ${existing}`);
    if (saves.includes(existing)) {
      fs.rmSync(currentSaveFile);
      const backupPath = path.join(`.`, ss, existing);
      fs.removeSync(backupPath);
      fs.mkdirSync(backupPath);

      console.log(`Backing up: ${base} -> ${backupPath}`);
      fs.copySync(base, backupPath);
    }

  } catch (e) {
    // No existing save
  }
}

let option;

console.log(``);

option = readline.question(`Which save to load:\n\n${saves.map((save, i) => `\t${i + 1}: ${save}`).join(`\n`)}\n\tnew: New save\n\nOption: `);

if (option === 'new') {
  const newName = readline.question(`Enter new save name: `);
  
  if (newName) {
    // First delete the base save
    fs.emptyDirSync(base);

    // Make the new save path
    fs.mkdirSync(path.join(`.`, ss, newName));

    // Then write what the current save is to the base Saves
    fs.writeFileSync(currentSaveFile, newName);

    console.log(`New save created: ${newName}`);
  }
} else {
  const optNumber = Number(option || 1);

  if (optNumber > 0 && optNumber <= saves.length) {
    const selectedSave = saves[optNumber - 1];
    const selectedPath = path.join(`.`, ss, selectedSave);

    // First delete the base save
    fs.emptyDirSync(base);
    
    try {
      // Then copy over the current backup
      console.log(`Restoring: ${selectedPath} -> ${base}`);
      fs.copySync(selectedPath, base);
      
      // Then write what the current save is to the base Saves
      fs.writeFileSync(currentSaveFile, selectedSave);

    } catch (e) {
      console.log(`Failed to move backup to base!`);
    }
  }
}

console.log(`Launching game...`);

open('steam://rungameid/489830');