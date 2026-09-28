import { instruction_set } from "./instruction_set.js"
import { register } from "./register.js"

export class ALU {
	constructor(operation, r1, r2) {
		this.operation = operation
		this.r1 = register[r1]
		this.r2 = register[r2]
		this.result = 0

	}

	execute() {
		if(this.operation == instruction_set.ADD){
			this.result = this.add()
		} else if (this.operation == instruction_set.SUB){
			this.result = this.sub()
		} else if (this.operation == instruction_set.MUL){
			this.result = this.mul()
		} else if (this.operation == instruction_set.DIV){
			this.result = this.div()
		}
	}

	add() {
		return this.r1 + this.r2
	}

	sub(){
		return this.r1 - this.r2
	}

	mul(){
		return this.r1 * this.r2
	}

	div(){
		return this.r1 / this.r2
	}
}