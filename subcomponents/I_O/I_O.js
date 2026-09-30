import readline from "node:readline";

import { dataMemory } from "../cpu/cpu_components/DataMemory.js";
// import { output_r } from "../cpu/cpu_components/register.js";
// import { clock_rate } from "../cpu/cpu.js";

export let input_register = {
	"STATUS": 0,
	"DATA": null
}

export let output_register = {
	"DATA": null
}

let keyboard_buffer = []
// let output_buffer = []

readline.emitKeypressEvents(process.stdin);

process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  
  if (key.ctrl && key.name === 'c') {
    process.exit(); 
  }
  
  keyboard_buffer.push(str)

});

setInterval(() => {
	if (input_register.STATUS === 0 && keyboard_buffer.length > 0){
		input_register.STATUS = 1
		input_register.DATA = keyboard_buffer.shift()
	}

	if (dataMemory[198] != 0){
		output_register.DATA = dataMemory[198]
		dataMemory[198] = 0
	}
}, 10)