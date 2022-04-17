'use strict'
let editr = ace.edit('editor');
editr.setShowPrintMargin(false);
let arrayOfStrings=[];  //<<<-------this will contain the code line by line
let memory = []; //this is the memory which is 4kB big
for(let i=0;i<4096;i++){
    memory.push(0);
}
let linePointer = 0;
let Registers ={};    //this is all the registers in the risc-v
let startAddress ={};
initialiseRegisters();
updateRegisters();
let memoryPointer =0;
let isData = false;
document.querySelector('.submitButton')?.addEventListener('click',
function(){
    memoryPointer =0;
    initialiseRegisters();
    arrayOfStrings =[];
    let content1  = editor.session.getLine(0);
    let i = 0; 
    while(i < editor.session.getLength()){  //here we are getting the total lines present in the code and saving all the lines in a array of strings
        content1 = editor.session.getLine(i)
        i++;
        arrayOfStrings.push(content1);
    }
    for(let linePointer=0;linePointer<arrayOfStrings.length;linePointer++){ //--> j changed to linePointer
        if(arrayOfStrings[linePointer]==="")continue //this part of the code prevents the compiling the lines with no code in it
        else if(IsLabel(arrayOfStrings[linePointer])){ //this part of the code checks if the line is label or not if it is a label then the compiler ignores it
            let dataType = DataType(arrayOfStrings[linePointer]); //~~~done~~~
            // let Label = getLabel(arrayOfStrings[linePointer]);
            if(dataType === ".word"){
                let noOfElements = sizeOfArray(arrayOfStrings[linePointer]);
                let elements = getElementsOfArray(arrayOfStrings[linePointer]);
                startAddress[returnFunction(arrayOfStrings[linePointer])] = memoryPointer;
                for(let q = 0;q<noOfElements;q++){
                    memory[memoryPointer] =elements[q]
                    // memoryPointer++;
                    memoryPointer = memoryPointer+4;
                }
                // console.log(startAddress);
                        }
            continue;
        }
        let currIndex =linePointer //this currIndex variable keeps track of the line that we are compiling
        let instruction = returnFunction(arrayOfStrings[currIndex]);
        let regs =[];
        if(instruction === "lw" || instruction === "sw"){
             regs = splitMemoryInstructions(arrayOfStrings[currIndex]);
        }
        else if(isDotDeclaration(arrayOfStrings[currIndex])){
            if(instruction === ".main" || instruction === ".text") isData = false;
            else if(instruction === ".data") isData = true;
            continue;
        }
        else {
             regs=returnRegisters(arrayOfStrings[currIndex]);
        }

        if(instruction === 'j'){
            linePointer = rInstruction(instruction,returnLabel(arrayOfStrings[currIndex]));
        }
        else if(IsBranch(instruction)){
            let temporaryPointer = rInstruction(instruction,regs[0],regs[1],regs[2]);
            if(temporaryPointer === "labelNotFound"){
                console.log("labelNotFound");
                return;
            }
            if(temporaryPointer ===-1) continue;
            else{
                linePointer = temporaryPointer;
                continue;
            }
        }
        else if(instruction === "lw" || instruction === "sw"){
            rInstruction(instruction,regs[0],regs[1],regs[2]);
        }
        else{
        rInstruction(instruction,regs[0],regs[1],regs[2]);
        }
    }
    //console.log(Registers);
    //onsole.log(memory);
    updateRegisters();
    console.log(memory);
}
)
document.querySelector('.resetButton').addEventListener('click',function(){
    initialiseRegisters();
    updateRegisters();
    location.reload();
})
//<<--------------------------write testing code after this---------------------->>






// <<-----------------------------------functions-------------------------------------->>
function updateRegisters(){
    let regss = Object.keys(Registers);
    document.querySelector('.s1').textContent = 0;
    for(let temp of regss){
        let temp1 = "."+temp;
        document.querySelector(temp1).textContent = Registers[temp]; 
    }
}
function initialiseRegisters(){
    memory=[];
    for(let i=0;i<4096;i++){
        memory.push(0);
    }
   startAddress ={};
    Registers['zero'] = 0; 
    Registers['ra'] = 0; 
    Registers['sp'] = 0; 
    Registers['gp'] =0; 
    Registers['tp'] =0; 
    Registers['t0'] =0; 
    Registers['t1'] = 0; 
    Registers['t2'] =0;
    Registers['s0'] =0; 
    Registers['s1'] =0; 
    for(let i=0;i<8;i++){ 
        let temp1 = 'a'+i;
        Registers[temp1] = 0;
    }
    for(let i=2;i<12;i++){ 
        let temp1 = 's'+i;
        Registers[temp1] = 0;
    }
    for(let i=3;i<7;i++){
        let temp1 = 't'+i;
        Registers[temp1] =0;
    }

    // 
}
function returnFunction(s){
    let temp = "";
    let spaceCheck = false;
    for(let i=0;i<s.length;i++){
        if(s.charAt(i)!=" ") spaceCheck = true; //taken care of indentations
        if(spaceCheck){
            if(s.charAt(i) === "#") return;   // changed the format
            if(s.charAt(i)!=" "){
                temp = temp+s.charAt(i);
            }
            else{
                return temp;
            }
        }

    }
}

function returnLabel(s){
        let temp = "";
        let jIndex = null
        for(let i=0;i<s.length;i++){
            if(s.charAt(i)=='j'){
                jIndex = i;
                break;
            }
        }
        for(let i=jIndex+2;i<s.length;i++){
            if(s.charAt(i)!=" "){
                temp=temp+s.charAt(i);
            }
        }
        return temp;
}

function returnRegisters(s){
    let regs =[];
    let temp;
    let initialSpaceCheck = false;
    for(let i=0;i<s.length;i++){
        if(s.charAt(i)!== " ") initialSpaceCheck = true;  //taken care of indentations
        if(initialSpaceCheck){
        if(s.charAt(i) !== " "){
            continue;
        }
        else{
            temp = i;
            break;
        }
    }
    }    
    let temp1 ="";
    initialSpaceCheck = false;
    for(let i=(temp+1);i<=s.length;i++){
        if(s.charAt(i)!==" ") initialSpaceCheck = true;
        if(initialSpaceCheck){
        if(s.charAt(i)=="," || i == s.length) {
            regs.push(temp1);
            temp1 ="";
        }
        else{
            temp1 = temp1+s.charAt(i);
        }
    }
    }
    return regs;
}




function rInstruction(operation, register1=null,register2=null,register3=null){
    switch(operation){
        case "add":
            Registers[register1] = Registers[register2]+Registers[register3];
            break;
        case "sub":
            Registers[register1] = Registers[register2] - Registers[register3];
            break;
        case "mul":
            Registers[register1] = Registers[register2] * Registers[register3];
            break;
        case "div":
            Registers[register1] = Math.floor(Registers[register2] / Registers[register3]);
            break;
        case "addi":
            Registers[register1] = Registers[register2] + parseInt(register3);
            break;
        case "jal":
            break;
        case "lw": //for this instruction the register1 will contain the register to which we write the value and the register 2 will contain the value of the offset and the register 3 will contain the base address in the memory
            let addedAddress;
            // register2 = Math.floor(parseInt(register2)/4);
            if(typeof register3 === Number){
                console.log("hello")
                 addedAddress = parseInt(register2)+parseInt(register3); 
            }
            else{
                addedAddress = parseInt(register2) + Registers[register3];
            }//adding the offset plus the base address
            Registers[register1] = parseInt(memory[addedAddress]);
            break;
        case "sw": //the format for this is similar to that of the load word
            let addedAddress1;
            // register2 = Math.floor(parseInt(register2)/4);
            if(typeof register3 === Number){
                console.log("hello")
                addedAddress1 = parseInt(register2)+parseInt(register3); 
            }
            else{
                addedAddress1 = parseInt(register2) + Registers[register3];
            }//adding the offset plus the base address
            // let addedAddress1 = parseInt(register2)+parseInt(register3);
            memory[addedAddress1] = Registers[register1];
            break;
        case "j":
            let i = 0;
            for(i=0;i<arrayOfStrings.length;i++){
                if(arrayOfStrings[i]==(register1+":")){
                    break;
                }
            }
            //i --> length of arrayOfStrings or 
            return i;
            break;
        case "beq":
            if(Registers[register1] === Registers[register2]){
                for(let i=0;i<arrayOfStrings.length;i++){
                    if(arrayOfStrings[i] === (register3+":")){
                        return i;
                    }
                }
                return('labelNotFound');
            }
            return -1;
            break;
        case "bne":
            if(Registers[register1] !== Registers[register2]){
                for(let i=0;i<arrayOfStrings.length;i++){
                    if(arrayOfStrings[i] === (register3+":")){
                        return i;
                    }
                }
                return('labelNotFound');
            }
            return -1;
            break;
        case 'bgt':
            if(Registers[register1] > Registers[register2]){
                for(let i=0;i<arrayOfStrings.length;i++){
                    // if(arrayOfStrings[i] === (register3+":")){
                    //     return i;
                    // }
                    if(doesLabelExists((arrayOfStrings[i]),(register3+":"))){
                        return i;
                    }
                }
                return('labelNotFound');
            }
            return -1;
            break;
        case 'bge':
            if(Registers[register1] >= Registers[register2]){
                for(let i=0;i<arrayOfStrings.length;i++){
                    if(arrayOfStrings[i] === (register3+":")){
                        return i;
                    }
                }
                return('labelNotFound');
            }
            return -1;
            break;
        case 'blt':
            if(Registers[register1] < Registers[register2]){
                for(let i=0;i<arrayOfStrings.length;i++){
                    if(arrayOfStrings[i] === (register3+":")){
                        return i;
                    }
                }
                return('labelNotFound');
            }
            return -1;
            break;
        case 'ble':
            if(Registers[register1] <= Registers[register2]){
                for(let i=0;i<arrayOfStrings.length;i++){
                    if(arrayOfStrings[i] === (register3+":")){
                        return i;
                    }
                }
                return('labelNotFound');
            }
            return -1;
            break;
    }
}
function doesLabelExists(wholeLine,label){
    let spaceCheck = false;    
    let temp="";
    for(let i=0;i<wholeLine.length;i++){
        if(wholeLine.charAt(i)!= " "){
            spaceCheck = true;
        }
        if(spaceCheck){
            temp = temp+wholeLine.charAt(i);
        }
    }

    return((temp)===(label));
}
function IsBranch(s){
    if(s==='beq' || s==='bne' || s==='bgt' || s==='bge' || s==='blt' || s==='ble'){
        return true;
    }
    return false;
}
function IsLabel(s){
    let temp ="";
    for(let i=0;i<s.length;i++){
        if(s.charAt(i)!==" " && s.charAt(i) !==":"){
            temp = temp+s.charAt(i);
            continue;
        }
        if(s.charAt(i) ===":" && temp.length!==0){
            return true;
        }

    }
    return false;
}
function isEcall(s){
    let temp ="";
    let isSpace = false;
    for(let i=0;i<s.length;i++){
        if(s.charAt(i)!=" ") isSpace = true;
        if(isSpace && s.charAt(i)==" ") break;
        if(isSpace){
            temp = temp+s.charAt(i);
        }  
    }
    if(temp==="ecall") return true;
    return false;
}
function isDotDeclaration(s){
    let temp = "";
    let isSpace = false;
    for(let i=0;i<s.length;i++){
        if(s.charAt(i)!=" ") isSpace = true;
        if(isSpace && s.charAt(i)==" ") break;
        if(isSpace){
            temp = temp+s.charAt(i);
        }  
    }
    switch(temp){
        case ".data": return true;
        case ".text": return true;
        case ".global": return true;
    }
    return false;
}
function splitMemoryInstructions(s){
    let temp = "";
    let first;
    let iSpace = false;
    let checker="";
    for(let i=0;i<s.length;i++){
        if(checker==="lw" || checker =="sw"){
            first = i;
            break;
        }
        if(s.charAt(i)!=" ") iSpace = true;
        if(iSpace){
            checker = checker+s.charAt(i);
        }
    }
    iSpace = false;
    for(let i=first;i<s.length;i++){
        if(s.charAt(i)==","){
            first = i;
            break;
        }
        if(s.charAt(i)!=" ") iSpace = true;
        if(iSpace){
            temp = temp+s.charAt(i);
        }
    }
    iSpace = false;
    let temp1="";
    for(let i=first+1;i<s.length;i++){
        if(s.charAt(i)=="("){
            first = i;
            break;
        }
        if(s.charAt(i)!=" ") iSpace = true;
        if(iSpace){
            temp1 = temp1 + s.charAt(i);
        }
    }
    iSpace = false;
    let temp2 ="";
    for(let i=first+1;i<s.length;i++){
        if(s.charAt(i)==")"){
            first = i;
            break;
        }
        if(s.charAt(i)!=" ") iSpace = true;
        if(iSpace){
            temp2 = temp2 + s.charAt(i);
        }
    }
    let regssss =[];
    regssss.push(temp);
    regssss.push(temp1);
    regssss.push(temp2);
    return regssss;

}
function Lable(s){
    let temp = "";
    let isSpace = false;
    for(let i=0;i<s.length;i++){
        if(s.charAt(i)!=" ") isSpace = true;
        if(isSpace && s.charAt(i)==" ") break;
        if(isSpace){
            temp = temp+s.charAt(i);
        }  
        if(s.charAt(i)===":") return temp;
    }
}
function sizeOfArray(s){
    let isSpace = false;
    let temp ="";
    let size =0;
    let first;
    for(let i=0;i<s.length;i++){
        if(s.charAt(i)!== " ") isSpace = true;
        if(isSpace && s.charAt(i) === " "){
            first = i;
            break;
        }
    }
    isSpace = false;
    for(let i=first;i<s.length;i++){
        if(s.charAt(i)!== " ") isSpace = true;
        if(isSpace && s.charAt(i) === " "){
            first = i;
            break;
        }
    }
    for(let i=first;i<s.length;i++){
        if(s.charAt(i)=== ","){  //counting the number of commas and return the number of commas +1;
            size++;
        }
    }
    size++;
    return size;
}
function getElementsOfArray(s){
    let isSpace = false;
    let temp ="";
    let size =[];
    let first;
    for(let i=0;i<s.length;i++){
        if(s.charAt(i)!== " ") isSpace = true;
        if(isSpace && s.charAt(i) === " "){
            first = i;
            break;
        }
    }
    isSpace = false;
    for(let i=first;i<s.length;i++){
        if(s.charAt(i)!== " ") isSpace = true;
        if(isSpace && s.charAt(i) === " "){
            first = i;
            break;
        }
    }
    isSpace = false;
    for(let i=first;i<s.length;i++){
        if(s.charAt(i)!==" ")isSpace = true;
        if(isSpace){
            if(s.charAt(i)===","){
                size.push(parseInt(temp));
                temp="";
                continue;
            }
            else{
                temp = temp+s.charAt(i);
            }
        }
    }
    size.push(parseInt(temp));
    return size;
}
function DataType(s){
    let isSpace = false;
    let temp ="";
    let size =0;
    let first;
    for(let i=0;i<s.length;i++){
        if(s.charAt(i)!== " ") isSpace = true;
        if(isSpace && s.charAt(i) === " "){
            first = i;
            break;
        }
    }
    isSpace = false;
    for(let i=first;i<s.length;i++){
        if(s.charAt(i)!== " ") isSpace = true;
        if(isSpace){
            if(s.charAt(i) !==" "){
                temp = temp+s.charAt(i);

            } 
            else{
                return temp;
            }

        }
    }
    return temp;
} 
