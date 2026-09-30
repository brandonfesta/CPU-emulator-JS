
export const dataMemory_specifics = {
	"dataMemory_cells": 256,
	"dataMemory_stack_cells": 56
}

// 0-196 = general memory
// 197 = output
// 198 = input memory
// 199-255 = stack memory

export let dataMemory = Array(256).fill(0);
// dataMemory[197] = "M"