import { ram } from "../../ram/ram.js"
import { ALU } from "./ALU.js"
import { register } from "./register.js"
import { instruction_set } from "./instruction_set.js"
import { dataMemory } from "./DataMemory.js"
import { input_register, output_register, output_buffer } from "../../I_O/I_O.js"

class Control_unit {
	constructor() {
		this.program_counter = 0
		this.instruction_register = null
		this.decoded_instruction = null
		this.instruction_operation = null
		this.instruction_r1 = null
		this.instruction_r2 = null
		this.instruction_i = null
	}

	instruction_cycle(){
		this.check_input()
		this.fetch()
		if (this.instruction_register == null){
			return
		}
		this.program_counter += 1
		this.decode()
		this.execute()

	}

	fetch(){
		if (this.program_counter >= ram.length){
			this.instruction_register = null
			return
		}

		let instruction = ram[this.program_counter]

		this.instruction_register = instruction

	}

	decode(){
		if(this.instruction_register == null){
			return
		}

		let tokens = []
		let current = ""
		let inString = false

		for (let char of this.instruction_register) {
			if (char === '"') {
				inString = !inString
				continue
			}

			if (char === " " && !inString) {
				if (current !== "") {
					tokens.push(current)
					current = ""
				}
			} else {
				current += char
			}
		}

		if (current !== "") {
			tokens.push(current)
		}

		this.decoded_instruction = tokens
		this.instruction_operation = this.decoded_instruction[0]

		if (this.instruction_operation == instruction_set.JUMP){
			this.instruction_i = Number(this.decoded_instruction[1])

			this.instruction_r1 = null
			this.instruction_r2 = null

		} else if(this.instruction_operation == instruction_set.JUMP_IF_ZERO){
			this.instruction_r1 = this.decoded_instruction[1]
			this.instruction_i = Number(this.decoded_instruction[2])

			this.instruction_r2 = null

		} else if(this.instruction_operation == instruction_set.JUMP_IF_NOT_ZERO){
			this.instruction_r1 = this.decoded_instruction[1]
			this.instruction_i = Number(this.decoded_instruction[2])

			this.instruction_r2 = null
		} else if(this.instruction_operation == instruction_set.STORE) {
			this.instruction_r1 = this.decoded_instruction[1]
			this.instruction_i = this.decoded_instruction[2]

			this.instruction_r2 = null
		} else if(this.instruction_operation == instruction_set.LOAD) {
			this.instruction_r1 = this.decoded_instruction[1]
			this.instruction_i = this.decoded_instruction[2]

			this.instruction_r2 = null
		} else if(this.instruction_operation == instruction_set.PUSH){
			this.instruction_r1 = this.decoded_instruction[1]

			this.instruction_i = null
			this.instruction_r2 = null
		} else if(this.instruction_operation == instruction_set.POP){
			this.instruction_r1 = this.decoded_instruction[1]

			this.instruction_i = null
			this.instruction_r2 = null
		} else if (this.instruction_operation == instruction_set.CALL){
			this.instruction_i = this.decoded_instruction[1]

			this.instruction_r1 = null
			this.instruction_r2 = null
		} else if (this.instruction_operation == instruction_set.RET){

			this.instruction_i = null
			this.instruction_r1 = null
			this.instruction_r2 = null
		} else if(this.instruction_operation == instruction_set.OUT){

			this.instruction_i = null
			this.instruction_r1 = null
			this.instruction_r2 = null
		} else if(this.instruction_operation == instruction_set.OS_OUT){
			this.instruction_i = this.decoded_instruction[1]

			this.instruction_r1 = null
			this.instruction_r2 = null
		}
		else {
			this.instruction_r1 = this.decoded_instruction[1]
			this.instruction_r2 = this.decoded_instruction[2]

			this.instruction_i = null
		}
	}

	execute(){
		if (this.instruction_register == null){
			return
		}

		if (this.instruction_operation == instruction_set.JUMP){
			this.program_counter = this.instruction_i
			return
		}

		if (this.instruction_operation == instruction_set.JUMP_IF_ZERO){
			if(register[this.instruction_r1] == 0){
				this.program_counter = this.instruction_i
			}
			return
		}

		if (this.instruction_operation == instruction_set.JUMP_IF_NOT_ZERO){
			if(register[this.instruction_r1] != 0){
				this.program_counter = this.instruction_i
			}
			return
		}

		if (this.instruction_operation == instruction_set.STORE){
			if (this.instruction_i >= 0 && this.instruction_i <= 196){
				dataMemory[this.instruction_i] = register[this.instruction_r1]
			}
			return
		}

		if (this.instruction_operation == instruction_set.LOAD){
			if (this.instruction_i >= 0 && this.instruction_i <= 196){
				register[this.instruction_r1] = dataMemory[this.instruction_i]
			}
			return
		}

		if (this.instruction_operation == instruction_set.PUSH){
			if (register.sp >= 199 && register.sp < 255){
				register.sp++
				dataMemory[register.sp] = register[this.instruction_r1]
			}
			return
		}

		if (this.instruction_operation == instruction_set.POP){
			if (register.sp >= 199 && register.sp <= 255){
				register[this.instruction_r1] = dataMemory[register.sp]
				register.sp--
			}
			return
		}

		if (this.instruction_operation == instruction_set.CALL){
			if (register.sp >= 200 && register.sp < 255){
				
				register.sp++
				dataMemory[register.sp] = this.program_counter
				this.program_counter = Number(this.instruction_i)
			}
			return
		}

		if (this.instruction_operation == instruction_set.RET){
			if (register.sp >= 200 && register.sp <= 255){
				this.program_counter = dataMemory[register.sp]
				register.sp--
			}
			return
		}

		if (this.instruction_operation == instruction_set.OUT){
			if (output_register.DATA != null){
				if(output_register.DATA == "return"){
					console.log("")
					return
				}

				register.output_r = output_register.DATA
				process.stdout.write(register.output_r);
				output_register.DATA = null
			}
			return
		}

		if (this.instruction_operation == instruction_set.OS_OUT){
			for (let i = 0; i < this.instruction_i.length; i++){
				output_buffer.push(this.instruction_i[i])
			}
			return
		}


		const new_alu = new ALU(this.instruction_operation, this.instruction_r1, this.instruction_r2)
		new_alu.execute()
		register[this.instruction_r1] = new_alu.result

	}

	check_input(){
		if (output_buffer.length !== 0){
			return
		}

		if (register.input_r != null && dataMemory[198] === 0){
			dataMemory[198] = register.input_r
			register.input_r = null
			return
		}

		if (input_register.STATUS === 0){
			return
		}

		if (register.input_r === null && input_register.STATUS === 1){
			register.input_r = input_register.DATA
			
			input_register.STATUS = 0
			input_register.DATA = null
		}

	}
}

export const control_unit = new Control_unit()