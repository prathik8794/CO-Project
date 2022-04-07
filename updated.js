'use strict'
let editr = ace.edit('editor');
editr.setShowPrintMargin(false);
document.querySelector('.submitButton')?.addEventListener('click',
function(){
    let compiler = new Compiler();
    compiler.initialiseRegisters();
    compiler.compileCode();
}
)


//#############registers#################
let registers =[];
registers.push('zero');
registers.push('ra');
registers.push('sp');
registers.push('gp');
registers.push('tp');
for(let i=0;i<32;i++){
    let temp = 'x'+parseInt(i);
    registers.push(temp);
}
for(let i=0;i<8;i++){
    let temp = 'a'+parseInt(i);
    registers.push(temp);
}
for(let i=0;i<12;i++){
    let temp = 's'+parseInt(i);
    registers.push(temp);
}
for(let i=0;i<7;i++){
    let temp = 't'+parseInt(i);
    registers.push(temp);
}

//########################################################################################
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
//##########################################################################################



function matchToken(s){
    if(s===" ") return "whitespace";
    else if(registers.includes(s)) return "register";
    else if(s === ",") return "comma";
    else if(s === ":") return "colon";
    else if(s === "(") return "leftParan";
    else if(s === ")") return "rightParan";
    else if(s === ".") return "dot";
    else if(s === "add" || s=== "sub" || s==="mul" || s=== "div") return "rinstruction";
    else if(s=== "addi" || s==="li") return "immediateInstruction"
    else if(s === "bne" || s==="beq" ||s ==="bgt" || s==="bge" || s==="blt" || s ==="ble") return "branchInstruction";
    else if(s === "jal") return "jumpAndLink";
    else if(s=== "j") return "jump";
    else if(s=== "jr") return "jr";
    else if(s ==="lw" || s==="sw") return "memoryInstructions";
    else if(s ==="global" || s==="data"|| s==="text") return "declarations"; 
    else if(s=== "#") return "comment";    
    else if(!isNaN(s)){
        return "number";
    }
    else{  //here we are attaching a label
        return "label";
    }
}

class Token{
    constructor(r){
        
        this.lhs = matchToken(r); 
        this.rhs = r;
    }
}
class Lexer{
    constructor(s){
        this.expression = s;
        this.obj ={};
        this.list=[]; //this will contain  the lexed strings
        this.pointer =0;
        this.letters=[];
        this.numbers=['0','1','2','3','4','5','6','7','8','9'];
        for(let i=65;i<=90;i++){
            this.letters.push(String.fromCharCode(i));
        }
        for(let i=97;i<=122;i++){
            this.letters.push(String.fromCharCode(i));
        }
    }
    pointerChange(){
        while(this.pointer<this.expression.length){
            this.lex();
        }
    }
    advance(){
        if(this.expression.length>this.pointer)
            this.pointer++;
        else 
            this.pointer =-1;
    }
    makeWord(){
        let temp="";
        while((this.letters.includes(this.expression.charAt(this.pointer)) || this.numbers.includes(this.expression.charAt(this.pointer))) && this.pointer!==-1 ){
            temp+=this.expression.charAt(this.pointer);
            this.advance();
        }
        let token = new Token(temp);
        this.list.push(token);
    }
    makeNumber(){
        let temp="";
        while(this.numbers.includes(this.expression.charAt(this.pointer)) && this.pointer!==-1){
            temp+= this.expression.charAt(this.pointer);
            this.advance();
        }
        let token = new Token(temp);
        this.list.push(token);
    }
    lex(){
        if(this.expression.charAt(this.pointer)===" "){
            this.advance();
        }
        else if(this.expression.charAt(this.pointer)==="."){
            let temp = this.expression.charAt(this.pointer);
            let token = new Token(temp);
            this.list.push(token);
            this.advance();
        }
        else if(this.expression.charAt(this.pointer)===","){
            // this.obj[matchToken(s.charAt(this.pointer))] = s.charAt(this.pointer);
            let temp = this.expression.charAt(this.pointer);
            let token = new Token(temp);
            this.list.push(token);
            this.advance();
        }
        else if(this.expression.charAt(this.pointer)===":"){
            // this.obj[matchToken(s.charAt(this.pointer))] = s.charAt(this.pointer);
            let temp = this.expression.charAt(this.pointer);
            let token = new Token(temp);
            this.list.push(token);
            this.advance();
        }
        else if(this.expression.charAt(this.pointer)==="("){
            // this.obj[matchToken(s.charAt(this.pointer))] = s.charAt(this.pointer);
            let temp = this.expression.charAt(this.pointer);
            let token = new Token(temp);
            this.list.push(token);
            this.advance();
        }
        else if(this.expression.charAt(this.pointer)===")"){
            // this.obj[matchToken(s.charAt(this.pointer))] = s.charAt(this.pointer);
            let temp = this.expression.charAt(this.pointer);
            let token = new Token(temp);
            this.list.push(token);
            this.advance();
        }
        else if (this.letters.includes(this.expression.charAt(this.pointer))){
            this.makeWord()
        }
        else if(this.numbers.includes(this.expression.charAt(this.pointer))){
            this.makeNumber();
        }
    }
}
let temp = " li a0,100";
let lexer = new Lexer(temp);
lexer.pointerChange();
console.log(lexer.list);
/*  rinstruction reg1,reg2,reg3:    (rinstruction: "add","sub","mul","div")
                add a0,a0,a1
                sub a0,a0,a1
                mul a0,a0,a1
                div a0,a0,a1
    Iinstruction reg1,reg2,value:    
        addi a0,a0,5
    branchInstruction reg0,reg1,label:  (branchInstruction: beq,bne,bgt,bge,blt,ble)
        bne a0,a1,label
    jumpAndLink label:
        jal label                  (keyword).(whitespace)*.(identifier)
    jump label:
        j label
        jr ra
    label instruction:
        label:
    memoryInstrucion reg1,value(label):
        lw a0,0(address)
        sw a0,0(address)
    Others:
        .global
        .text
        .data
*/
//##########################################################################################

class Compiler{
    constructor(){
        this.arrayOfStrings=[]; //this will contain the entire code line by line.
        this.Registers={}; //this will contain all the registers along with their stored values
        this.memory=[];
        for(let i=0;i<4096;i++){
            this.memory.push(0);
        }
    }
    initialiseRegisters(){
        // this.memory=[];
        for(let i=0;i<4096;i++){
            // memory.push(0);
            this.memory[i] = 0;
        }
        startAddress ={};
        this.Registers['zero'] = 0; 
        this.Registers['ra'] = 0; 
        this.Registers['sp'] = 0; 
        this.Registers['gp'] =0; 
        this.Registers['tp'] =0; 
        this.Registers['t0'] =0; 
        this.Registers['t1'] = 0; 
        this.Registers['t2'] =0;
        this.Registers['s0'] =0; 
        this.Registers['s1'] =0; 
        for(let i=0;i<8;i++){ 
            let temp1 = 'a'+i;
            this.Registers[temp1] = 0;
        }
        for(let i=2;i<12;i++){ 
            let temp1 = 's'+i;
            this.Registers[temp1] = 0;
        }
        for(let i=3;i<7;i++){
            let temp1 = 't'+i;
            this.Registers[temp1] =0;
        }
    }
    Do_R_Instruction(lexer){
        //**example */
        /* add a0,a1,a2
            [
                Token { lhs: 'rinstruction', rhs: 'add' },
                Token { lhs: 'register', rhs: 'a0' },
                Token { lhs: 'comma', rhs: ',' },
                Token { lhs: 'register', rhs: 'a1' },
                Token { lhs: 'comma', rhs: ',' },
                Token { lhs: 'register', rhs: 'a2' }
            ]
        */
        let reg0,reg1,reg2;
        reg0 = lexer.list[1]["rhs"];
        reg1 = lexer.list[3]["rhs"];
        reg2 = lexer.list[5]["rhs"];

        switch(lexer.list[0]["rhs"]){
            case "add":
                        this.Registers[reg0] = this.Registers[reg1]+this.Registers[reg2];
                        break;
            case "sub":
                        this.Registers[reg0] = this.Registers[reg1]-this.Registers[reg2];
                        break;
            case "mul":
                        this.Registers[reg0] = this.Registers[reg1]*this.Registers[reg2];
                        break;
            case "div":
                        this.Registers[reg0] = Math.floor(this.Registers[reg1]/this.Registers[reg2]);
                        break;
        }

    }
    Do_I_Instruction(lexer){
        let reg0,reg1;
        if(lexer.list[0]["rhs"]==="li"){
            reg0 = lexer.list[1]["rhs"];
        }
        else {
            reg0 = lexer.list[1]["rhs"];
            reg1 = lexer.list[3]["rhs"];
        }

        if(lexer.list[0]["rhs"]==="li"){
            this.Registers[reg0] = parseInt(lexer.list[3]["rhs"]);
        }
        else{
            this.Registers[reg0] = this.Registers[reg1]+parseInt(lexer.list[5]["rhs"]);
        }
    }
    extractCode(){
        // let content1  = editor.session.getLine(0);
        let i = 0; 
        while(i < editor.session.getLength()){  //here we are getting the total lines present in the code and saving all the lines in a array of strings
            content1 = editor.session.getLine(i)
            i++;
            this.arrayOfStrings.push(content1);
        }
    }
    compileCode(){
        extractCode();
        //assume that the arrayOfStrings array already contains all the lines of code
        for(let linePointer=0;linePointer<this.arrayOfStrings;linePointer++){
            let temp = this.arrayOfStrings[linePointer];
            let lexer = new Lexer(temp);
            lexer.pointerChange();
            switch(lexer.list[0]["lhs"]){
                case "rinstruction":
                                    Do_R_Instruction(lexer);
                                    break;
                case "Iinstruction":
                                    Do_I_Instruction(lexer);
                                    break;
                case "branchInstruction":
                                    Do_Branch_Instruction(lexer);
                                    break;
                case "jumpAndLink":
                                    Do_Jal_Instruction(lexer);
                                    break;
                case "jump":
                                    Do_Jump_Instruction(lexer);
                                    break;
                case "label":
                                    Do_Label_Instruction(lexer);
                                    break;
                case "memoryInstruction":
                                    Do_Memory_Instruction(lexer);
                                    break;
                case "dot":
                                    Do_Declaration_Instruction(lexer);
                                    break;
            }
        }
    }
}
 
