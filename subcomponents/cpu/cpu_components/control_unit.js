import { ram } from "../../ram/ram.js"
import { ALU } from "./ALU.js"
import { register } from "./register.js"
import { instruction_set } from "./instruction_set.js"
import { dataMemory } from "./DataMemory.js"

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

		this.decoded_instruction = this.instruction_register.split(" ")

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

		console.log(this.program_counter)

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
			if (this.instruction_i >= 0 && this.instruction_i < 200){
				console.log("memory old value: " + dataMemory[this.instruction_i])
				dataMemory[this.instruction_i] = register[this.instruction_r1]
				console.log("memory new value: " + dataMemory[this.instruction_i])
			}
			return
		}

		if (this.instruction_operation == instruction_set.LOAD){
			if (this.instruction_i >= 0 && this.instruction_i < 200){
				console.log("register old value: " + register[this.instruction_r1])
				register[this.instruction_r1] = dataMemory[this.instruction_i]
				console.log("register new value: " + register[this.instruction_r1])
			}
			return
		}

		if (this.instruction_operation == instruction_set.PUSH){
			if (register.sp >= 200 && register.sp < 256){
				console.log("dataMemory old value: " + dataMemory[register.sp])
				register.sp++
				dataMemory[register.sp] = register[this.instruction_r1]
				console.log("dataMemory new value: " + dataMemory[register.sp])
			}
			return
		}

		if (this.instruction_operation == instruction_set.POP){
			if (register.sp >= 200 && register.sp <= 256){
				console.log("register old value: " + register[this.instruction_r1])
				register[this.instruction_r1] = dataMemory[register.sp]
				register.sp--
				console.log("register new value: " + register[this.instruction_r1])
			}
			return
		}

		if (this.instruction_operation == instruction_set.CALL){
			if (register.sp >= 200 && register.sp < 256){
				
				console.log("old program counter: " + this.program_counter)
				register.sp++
				dataMemory[register.sp] = this.program_counter
				this.program_counter = Number(this.instruction_i)
				console.log("new program counter: " + this.program_counter)
			}
			return
		}

		if (this.instruction_operation == instruction_set.RET){
			if (register.sp >= 200 && register.sp <= 256){
				console.log("old program counter: " + this.program_counter)
				this.program_counter = dataMemory[register.sp]
				register.sp--
				console.log("new program counter: " + this.program_counter)
			}
			return
		}


		const new_alu = new ALU(this.instruction_operation, this.instruction_r1, this.instruction_r2)
		new_alu.execute()
		register[this.instruction_r1] = new_alu.result

		console.log(`result: ${new_alu.result}`)
		console.log("r1: " + register[this.instruction_r1] + ", r2: " + register[this.instruction_r2])
	}
}

export const control_unit = new Control_unit()