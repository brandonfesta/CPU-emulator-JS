export let ram = [
    "PUSH r1",    // Salva un dato nel programma principale
    "CALL 4",     // Salta alla funzione che risiede alla riga 4
    "POP r1",     // Quando torna, riprendi il dato
    "JUMP 20",    // Fine programma principale (salta nel vuoto)
    "PUSH r2",    // Riga 4 (Inizio Funzione): la funzione usa lo stack
    "POP r2",     // La funzione pulisce lo stack
    "RET"         // Torna indietro
]