export let ram = [
    "CALL 2",      // Salta alla funzione alla riga 2
    "JUMP 100",    // Fine programma principale (salta nel vuoto)
    "PUSH r1",     // RIGA 2 (Inizio Funzione): Salva subito r1 nello stack
    "POP r1",      // Ripristina r1
    "RET"          // Torna indietro
]