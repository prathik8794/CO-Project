'use strict'
let editr = ace.edit('editor');
let arrayOfStrings=[];  //<<<-------this will contain the code line by line
let memory = []; //this is the memory which is 4kB big
for(let i=0;i<=4096;i++){
    memory[i] = 0;
}
let linePointer = 0;
let Registers ={};    //this is all the registers in the risc-v
initialiseRegisters();
document.querySelector('.submitButton')?.addEventListener('click',
function(){
    
    initialiseRegisters();
    arrayOfStrings =[];
    memory =[];
    let content1  = editor.session.getLine(0);
    let i = 0; 
    while(i < editor.session.getLength()){
        content1 = editor.session.getLine(i)
        i++;
        arrayOfStrings.push(content1);
    }
    for(let linePointer=0;linePointer<arrayOfStrings.length;linePointer++){ //--> j changed to linePointer
        if(arrayOfStrings[linePointer]==="")continue
        else if(IsLabel(arrayOfStrings[linePointer])){
            continue;
        }
        let currIndex =linePointer
        let regs=returnRegisters(arrayOfStrings[currIndex]);
        let instruction = returnFunction(arrayOfStrings[currIndex]);
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
        else{
        rInstruction(instruction,regs[0],regs[1],regs[2]);
        }
    }
    console.log(Registers);
    
}
)


//<<--------------------------write testing code after this---------------------->>






// <<-----------------------------------functions-------------------------------------->>
function initialiseRegisters(){
    Registers['zero'] = 0;
    Registers['ra'] = 0;
    Registers['sp'] = 0;
    Registers['gp'] =0;
    Registers['tp'] =0;
    Registers['t0'] =0;
    Registers['t1'] = 0;
    Registers['t2'] =0;
    Registers['s0'] =0;
    Registers['fp'] =0;
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
        let temp1 = 't'+3;
        Registers[temp1] =0;
    }

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
    for(let i=(temp+1);i<=s.length;i++){
        if(s.charAt(i)=="," || i == s.length) {
            regs.push(temp1);
            temp1 ="";
        }
        else{
            temp1 = temp1+s.charAt(i);
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
        case "lw":
            break;
        case "sw":
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