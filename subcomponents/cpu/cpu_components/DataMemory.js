
export const dataMemory_specifics = {
	"dataMemory_cells": 256,
	"dataMemory_stack_cells": 56
}

// 0-197 = general memory
// 198 = input memory
// 199-255 = stack memory

export let dataMemory = Array(256).fill(0);