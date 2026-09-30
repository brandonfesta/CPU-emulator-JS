import readline from "node:readline";

// import { clock_rate } from "../cpu/cpu.js";

export let input_register = {
	"STATUS": 0,
	"DATA": null
}

export let output_register = {
	"DATA": null
}

let keyboard_buffer = []

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
}, 100)