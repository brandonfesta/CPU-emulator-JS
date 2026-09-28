export let ram = [
	"ADD r1 r2",       // r1 = 30
    "STORE r1 10",     // RAM[10] = 30
    "ADD r1 r3",       // r1 cambia
    "LOAD r1 10",      // r1 torna a 30
    "STORE r1 20",     // RAM[20] = 30
    "LOAD r2 20"       // r2 = 30
]