import { control_unit } from "./cpu_components/control_unit.js";

export const clock_rate = 100;

// for now no LSU
setInterval(() => {
    control_unit.instruction_cycle();
}, clock_rate);