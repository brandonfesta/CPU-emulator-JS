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
		this.program_counter += 1
		if (this.instruction_register == null){
			return
		}
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
			this.instruction_i = register.sp

			this.instruction_r2 = null
		} else if(this.instruction_operation == instruction_set.POP){
			this.instruction_r1 = this.decoded_instruction[1]
			this.instruction_i = register.sp

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
			if (this.instruction_i >= 0 && this.instruction_i < 200){
				console.log(this.program_counter)
				console.log("memory old value: " + dataMemory[this.instruction_i])
				dataMemory[this.instruction_i] = register[this.instruction_r1]
				console.log("memory new value: " + dataMemory[this.instruction_i])
			}
			return
		}

		if (this.instruction_operation == instruction_set.LOAD){
			if (this.instruction_i >= 0 && this.instruction_i < 200){
				console.log(this.program_counter)
				console.log("register old value: " + register[this.instruction_r1])
				register[this.instruction_r1] = dataMemory[this.instruction_i]
				console.log("register new value: " + register[this.instruction_r1])
			}
			return
		}

		if (this.instruction_operation == instruction_set.PUSH){
			if (this.instruction_i >= 200 && this.instruction_i < 256){
				console.log(this.program_counter)
				console.log("dataMemory old value: " + dataMemory[this.instruction_i])
				dataMemory[this.instruction_i] = register[this.instruction_r1]
				register.sp++
				console.log("dataMemory new value: " + dataMemory[this.instruction_i])
			}
			return
		}

		if (this.instruction_operation == instruction_set.POP){
			if (this.instruction_i >= 200 && this.instruction_i < 256){
				console.log(this.program_counter)
				console.log("register old value: " + register[this.instruction_r1])
				register[this.instruction_r1] = dataMemory[this.instruction_i - 1]
				register.sp--
				console.log("register new value: " + register[this.instruction_r1])
			}
			return
		}

		const new_alu = new ALU(this.instruction_operation, this.instruction_r1, this.instruction_r2)
		new_alu.execute()
		register[this.instruction_r1] = new_alu.result

		console.log(this.program_counter)
		console.log(`result: ${new_alu.result}`)
		console.log("r1: " + register[this.instruction_r1] + ", r2: " + register[this.instruction_r2])
	}
}

export const control_unit = new Control_unit()