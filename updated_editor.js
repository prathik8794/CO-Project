'use strict'
let editr = ace.edit('editor');
editr.setShowPrintMargin(false);
document.querySelector('.submitButton')?.addEventListener('click',
function(){
    let compiler = new Compiler();
    // compiler.initialiseRegisters();
    // compiler.compileCode();

    let PipeLine = new pipelining(compiler);
    PipeLine.Run();
    console.log(PipeLine.compiler.Registers);
    console.log(PipeLine.compiler.memory);
    // console.log(compiler.arrayOfStrings);
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
    else if(s ==="lw" || s==="sw") return "memoryInstruction";
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
        this.Instruction="";
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
// console.log(lexer.list);
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
        jal label                  
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
        this.arrayOfObjects=[];
        this.Labels={};
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
        // startAddress ={};
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
            if(parseInt(lexer.list[3]["rhs"])<=(Math.pow(2,32))-1)
                this.Registers[reg0] = parseInt(lexer.list[3]["rhs"]);
            
        }
        else{
            if(parseInt(lexer.list[3]["rhs"])<=(Math.pow(2,32))-1)
                this.Registers[reg0] = this.Registers[reg1]+parseInt(lexer.list[5]["rhs"]);
        }
    }
    extractCode(){
        // let content1  = editor.session.getLine(0);
        let i = 0; 
        while(i < editor.session.getLength()){  //here we are getting the total lines present in the code and saving all the lines in a array of strings
            let content1 = editor.session.getLine(i)
            i++;
            this.arrayOfStrings.push(content1);
        }
    }
    Do_Branch_Instruction(lexer,pointer){
        /*
        0: Token {lhs: 'branchInstruction', rhs: 'beq'}
        1: Token {lhs: 'register', rhs: 'a0'}
        2: Token {lhs: 'comma', rhs: ','}
        3: Token {lhs: 'register', rhs: 'a1'}
        4: Token {lhs: 'comma', rhs: ','}
        5: Token {lhs: 'label', rhs: 'label'}
        */
       let flag = false;
       switch(lexer.list[0]["rhs"]){
            case "beq":
                        flag = (lexer.list[1]['rhs'] === lexer.list[3]['rhs']);
                        break;
            case "bne":
                        flag = (lexer.list[1]['rhs'] !== lexer.list[3]['rhs']);
                        break;
            case "blt":
                        flag = (lexer.list[1]['rhs'] < lexer.list[3]['rhs']);
                        break;
            case "ble":
                        flag = (lexer.list[1]['rhs'] <= lexer.list[3]['rhs']);
                        break;
            case "bgt":
                        flag = (lexer.list[1]['rhs'] > lexer.list[3]['rhs']);
                        break;
            case "bge":
                        flag = (lexer.list[1]['rhs'] >= lexer.list[3]['rhs']);
                        break;
       }
       if(flag){
           let tempString = 'j '+lexer.list[5]['rhs'];
           let dummyLex = new Lexer(tempString);
           dummyLex.pointerChange();
           return this.Do_Jump_Instruction(dummyLex,pointer);
       }
       else
           return pointer;

    }
    Do_Jump_Instruction(lexer,pointer){
        if((lexer.list[1]["rhs"]) in this.Labels){
            return this.Labels[lexer.list[1]["rhs"]];
        }
        else {
            for(let i=pointer+1;i<this.arrayOfStrings.length;i++){
                let lex = new Lexer(this.arrayOfStrings[i]);
                lex.pointerChange();
                if(lex.list.length===0) continue;
                if((lex.list[0]["rhs"])===lexer.list[1]["rhs"])
                    {
                        return i;
                    }
            }
        }
    }
    Do_Label_Instruction(lexer,address){
        this.Labels[lexer.list[0]["rhs"]] = address;
    }
    Do_Memory_Instruction(lexer){
        //lw a0,0(address)  lw a0 , 0 ( address )
        //                  0  1  2 3 4 5       6
    
        //Instruction Decode
        let ins= (lexer.list[0]['rhs']==='lw')?'lw':'sw';
        //Register Fetch
        let val = this.Registers[lexer.list[1]['rhs']];
        let random_list =this.convertToBinary(val); //this list contains the value of the register a0 in the form of a array of 4 chunks of 8bits each
        //Execution 
        let mem_pointer = this.getAddress(lexer.list[5]['rhs']);
        mem_pointer = mem_pointer+parseInt(lexer.list[3]['rhs']);
        //Memory and writeback
        if(ins==='sw'){
            for(let i=0;i<=3;i++)
                this.memory[mem_pointer+i] = random_list[3-i];
        }
        else{
            let temp = "";
            for(let i=(mem_pointer+3);i>=mem_pointer;i--){
                temp = temp+this.memory[i];
            }
            let converted_value = parseInt(temp,2);
            console.log(temp);
            //writeback
            this.Registers[lexer.list[1]['rhs']] = converted_value;
        }
        // console.log(random_list);
        // console.log(this.memory);

    }
    Do_Declaration_Instruction(lexer){

    }
    getAddress(val){
        if(val in this.Registers){
            return this.Registers[val];
        }
        else{
                //this part of the code takes care when the label name is inserted instead of the memory address in the register
        }
    }

    convertToBinary(val){
        let val_binary = val.toString(2);
        if(val_binary.length<32){
            let temp = 32-val_binary.length;
            for(let i=0;i<temp;i++){
                val_binary='0'+val_binary;
            }
        }
        let random_list =[];
        random_list.push(val_binary.substring(0,8));
        random_list.push(val_binary.substring(8,16));
        random_list.push(val_binary.substring(16,24));
        random_list.push(val_binary.substring(24,32));
        return random_list;
    }
    arrayOfObjectsCreation(){
        //assuming that the extract code is already being called
        for(let i=0;i<this.arrayOfStrings.length;i++){
            let temp = this.arrayOfStrings[i]; 
            let lexer = new Lexer(temp);
            lexer.pointerChange();
            this.arrayOfObjects.push(lexer);
        }
    }
    compileCode(){
        this.extractCode();
        this.arrayOfObjectsCreation();
        console.log(this.arrayOfObjects);
        //assume that the arrayOfStrings array already contains all the lines of code
        for(let linePointer=0;linePointer<this.arrayOfStrings.length;linePointer++){
            let temp = this.arrayOfStrings[linePointer];
            if(temp==="") break;
            // let lexer = new Lexer(temp);
            // lexer.pointerChange();
            let lexer = this.arrayOfObjects[linePointer];
            switch(lexer.list[0]["lhs"]){
                case "rinstruction":
                                    this.Do_R_Instruction(lexer);  
                                    break;
                case "immediateInstruction":
                                    this.Do_I_Instruction(lexer);       
                                    break;
                case "branchInstruction":
                                    linePointer = this.Do_Branch_Instruction(lexer,linePointer);
                                    break;
                case "jumpAndLink":
                                    this.Registers['ra'] = linePointer+1;
                                    // this.Do_Jal_Instruction(lexer);
                                    linePointer = this.Do_Jump_Instruction(lexer,linePointer);
                                    break;
                case "jump":
                                    linePointer = this.Do_Jump_Instruction(lexer,linePointer);
                                    break;
                case "label":
                                    this.Do_Label_Instruction(lexer,linePointer);
                                    break;
                case "memoryInstruction":
                                    this.Do_Memory_Instruction(lexer);
                                    break;
                case "dot":
                                    this.Do_Declaration_Instruction(lexer);
                                    break;
            }
        }
    }
}
class InstructionObjects{
    constructor(lexer,compiler_pipeline,arrayOfStrings){
        this.arrayOfStrings = arrayOfStrings;
        this.ExecuteResult=0;
        this.lexer = lexer;
        this.InstructionType ="";
        this.compiler_pipeline = compiler_pipeline;
        // compiler.initialiseRegisters();   //assuming that the compiler would have already initialised registers
        this.reg0="";
        this.reg1 ="";
        this.reg2="";
        this.immediateValue=0;
        this.WriteBackValue=0;
        this.BranchOutCome;
        this.Labels={};

    }
    convertToBinary(val){
        let val_binary = val.toString(2);
        if(val_binary.length<32){
            let temp = 32-val_binary.length;
            for(let i=0;i<temp;i++){
                val_binary='0'+val_binary;
            }
        }
        let random_list =[];
        random_list.push(val_binary.substring(0,8));
        random_list.push(val_binary.substring(8,16));
        random_list.push(val_binary.substring(16,24));
        random_list.push(val_binary.substring(24,32));
        return random_list;
    }
    getAddress(val){
        if(!isNaN(val)){
            console.log(val);
            return parseInt(val);
        }
        else if(val in this.compiler_pipeline.Registers){
            return this.compiler_pipeline.Registers[val];
        }
        else{
                //this part of the code takes care when the label name is inserted instead of the memory address in the register
        }
    }
    doInstructionDecode(lPointer){
        // console.log(this.lexer);

        if(this.lexer===undefined){
            // console.log(this.lexer);
            return;
        }
        switch(this.lexer.list[0]["lhs"]){
            case "rinstruction": 
                                this.InstructionType = "rinstruction";   //Instruction Decode 
                                this.reg0 = this.lexer.list[1]["rhs"];
                                this.reg1 = this.lexer.list[3]["rhs"];   //register fetch
                                this.reg2 = this.lexer.list[5]["rhs"];
                                break;
            case "immediateInstruction":    
                                this.InstructionType = "immediateInstruction";
                                if(this.lexer.list[0]["rhs"]==="li"){
                                    this.reg0 = this.lexer.list[1]["rhs"];
                                    this.immediateValue = parseInt(this.lexer.list[3]["rhs"]);
                                }
                                else {
                                    this.reg0 = this.lexer.list[1]["rhs"];
                                    this.reg1 = this.lexer.list[3]["rhs"];
                                    this.immediateValue = parseInt(this.lexer.list[5]["rhs"]);
                                }
                                break;
            case "branchInstruction":
                                //blt a0,a1, label
                                this.InstructionType = "branchInstruction";
                                this.reg0 = this.lexer.list[1]['rhs'];
                                this.reg1 = this.lexer.list[3]['rhs'];
                                switch(this.lexer.list[0]["rhs"]){
                                    case "beq":
                                                this.BranchOutCome = (this.lexer.list[1]['rhs'] === this.lexer.list[3]['rhs']);
                                                break;
                                    case "bne":
                                                this.BranchOutCome = (this.lexer.list[1]['rhs'] !== this.lexer.list[3]['rhs']);
                                                break;
                                    case "blt":
                                                this.BranchOutCome = (this.lexer.list[1]['rhs'] < this.lexer.list[3]['rhs']);
                                                break;
                                    case "ble":
                                                this.BranchOutCome = (this.lexer.list[1]['rhs'] <= this.lexer.list[3]['rhs']);
                                                break;
                                    case "bgt":
                                                this.BranchOutCome = (this.lexer.list[1]['rhs'] > this.lexer.list[3]['rhs']);
                                                break;
                                    case "bge":
                                                this.BranchOutCome = (this.lexer.list[1]['rhs'] >= this.lexer.list[3]['rhs']);
                                                break;
                               }
                                break;
            case "jumpAndLink":
                                this.InstructionType = "jumpAndLink";
                                break;
            case "jump":
                                this.InstructionType = "jump";
                                if((this.lexer.list[1]["rhs"]) in this.Labels){
                                    return this.Labels[this.lexer.list[1]["rhs"]];
                                }
                                else {
                                    for(let i=lPointer;i<this.arrayOfStrings.length;i++){
                                        let lex = new Lexer(this.arrayOfStrings[i]);
                                        lex.pointerChange();
                                        if(lex.list.length===0) continue;
                                        if((lex.list[0]["rhs"])===this.lexer.list[1]["rhs"])
                                            {                
                                                return i;
                                            }
                                    }
                                }
                                break;
            case "label":
                                this.InstructionType = "label";
                                this.Labels[this.lexer.list[0]['rhs']] = lPointer;
                                break;
            case "memoryInstruction":
                                //lw a0,0(address)
                                this.InstructionType = "memoryInstruction";
                                        //Instruction Decode
                                // let ins= (lexer.list[0]['rhs']==='lw')?'lw':'sw';
                                //Register Fetch
                                this.reg0 = this.compiler_pipeline.Registers[this.lexer.list[1]['rhs']];
                                break;
            case "dot":
                                this.InstructionType = "dot";
                                break;
        }
    }
    doExecute(){
        if(this.InstructionType==="rinstruction"){
            switch(this.lexer.list[0]["rhs"]){
                case "add":
                            this.ExecuteResult = this.compiler_pipeline.Registers[this.reg1]+this.compiler_pipeline.Registers[this.reg2];
                            break;
                case "sub":
                            this.ExecuteResult = this.compiler_pipeline.Registers[this.reg1]-this.compiler_pipeline.Registers[this.reg2];
                            break;
                case "mul":
                            this.ExecuteResult = this.compiler_pipeline.Registers[this.reg1]*this.compiler_pipeline.Registers[this.reg2];
                            break;
                case "div":
                            this.ExecuteResult = Math.floor(this.compiler_pipeline.Registers.Registers[this.reg1]/this.compiler_pipeline.Registers.Registers[this.reg2]);
                            break;
            }
        }
        else if(this.InstructionType ==="immediateInstruction"){
            if(this.lexer.list[0]["rhs"]==="li"){
                this.ExecuteResult = 0+parseInt(this.lexer.list[3]["rhs"]);
            }
            else{
                this.ExecuteResult = this.compiler_pipeline.Registers[this.reg1]+parseInt(this.lexer.list[5]["rhs"]);
            }
        }
        else if(this.InstructionType === "memoryInstruction"){
            // lw a0,0(0)
            this.ExecuteResult = this.getAddress(this.lexer.list[5]['rhs']);
            this.ExecuteResult = this.ExecuteResult+parseInt(this.lexer.list[3]['rhs']);
            
        }
        else if(this.InstructionType ==="jump"){
            return;
        }
        else if(this.InstructionType ==="branchInstruction"){



        }
    }
    doMemory(){
        if(this.InstructionType ==="memoryInstruction"){
            let random_list =this.convertToBinary(this.reg0);
            if(this.lexer.list[0]["rhs"]==='sw'){
                for(let i=0;i<=3;i++)
                    this.compiler_pipeline.memory[this.ExecuteResult+i] = random_list[3-i];
            }
            else{
                let temp1 = "";
                for(let i=(this.ExecuteResult+3);i>=this.ExecuteResult;i--){
                    temp1 = temp1+this.compiler_pipeline.memory[i];
                }
                let converted_value = parseInt(temp1,2);
                this.WriteBackValue = converted_value;
                //writeback
            }
        }
    }
    doWriteBack(){
        if(this.InstructionType==="rinstruction"){
                this.compiler_pipeline.Registers[this.reg0] = this.ExecuteResult;
        }
        else if(this.InstructionType ==="immediateInstruction"){
                if(this.lexer.list[0]["rhs"]==="li"){
                    this.compiler_pipeline.Registers[this.reg0] = this.ExecuteResult;
                }
                else{
                    this.compiler_pipeline.Registers[this.reg0] = this.ExecuteResult;
                }
        }
        else if(this.InstructionType === "memoryInstruction"){
            if(this.lexer.list[0]["rhs"]==="lw"){
                console.log(this.WriteBackValue);
                this.compiler_pipeline.Registers[this.lexer.list[1]['rhs']] = this.WriteBackValue;
            }
        }
    }
}
class pipelining{
    constructor(compiler){
        this.compiler = compiler;
        this.clock =1;
        this.dependencyList=[];
        this.completedInstruction=[];
        this.IF = null;
        this.IF_buffer = "";
        this.ID_RF = null;
        this.ID_RF_buffer ="";
        this.EX =null;
        this.EX_buffer ="";
        this.MEM=null;
        this.MEM_buffer ="";
        this.WB=null;
        this.WB_buffer ="";
        this.currentInstructionPointer=0;
    }
    Run(){
        // let compiler = new Compiler();
        this.compiler.initialiseRegisters();
        // compiler.compileCode();
        this.compiler.extractCode();
        this.compiler.arrayOfObjectsCreation();
        //we can use this.extract code to extract all the code to the arrayOfStrings
        let LinePointer =0;
        while(this.completedInstruction.length<this.compiler.arrayOfStrings.length){ //we might have to change the condition for while loop so look into it
            //this newInstruction will contain say add a0,a0,a1
            //addi a0,a0,5
            if(this.WB!==null){
                this.WB.doWriteBack();
                this.completedInstruction.push(this.WB);
                this.WB=null;              
            }
            if(this.MEM!==null){
                this.MEM.doMemory();
                let temp = this.MEM;
                this.WB = temp;
                
                this.MEM=null;
            }
            if(this.EX!==null){
                this.EX.doExecute();
                let temp = this.EX;
                this.MEM=temp;
                this.EX=null;
            }
            if(this.ID_RF!==null){
                    this.ID_RF.doInstructionDecode(this.currentInstructionPointer);
                    let temp = this.ID_RF;
                    this.EX=temp;
                    this.ID_RF=null;
            }
            if(this.IF!==null){
                if(this.IF.lexer.list[0]['rhs']==="j"){
                    let temp = this.currentInstructionPointer;//1
                    this.currentInstructionPointer = this.IF.doInstructionDecode(this.currentInstructionPointer);
                    temp--;
                    if(this.currentInstructionPointer>temp){
                        for(let j=temp;j<=this.currentInstructionPointer;j++){
                            this.completedInstruction.push("*")
                        }
                        this.IF=null;
                    }
                    else{
                        // for(let j=temp;j>this.currentInstructionPointer;j--){
                        //     this.completedInstruction.pop();
                        // }
                        console.log(this.completedInstruction);
                        console.log(this.currentInstructionPointer);
                        return;
                        while(this.completedInstruction.length!==(this.currentInstructionPointer+1))
                        {
                            console.log('hello world');
                            this.completedInstruction.pop();
                        }
                        this.IF=null;
                    }
                    this.currentInstructionPointer++;
                    console.log(this.currentInstructionPointer);

                }
                else{
                let temp = this.IF;
                this.ID_RF = temp;
                this.IF=null;
                }
            }
            if(this.IF===null){
                if(this.currentInstructionPointer<this.compiler.arrayOfStrings.length)
                {      
                    
                    // this.IF = compiler.arrayOfStrings[currentInstructionPointer];   //let this be the instruction fetch phase, because the instruction is fetched in this phase;
                    while(this.compiler.arrayOfStrings[this.currentInstructionPointer]===""){
                        this.completedInstruction.push("");
                        this.currentInstructionPointer++;
                    }
                    if(this.currentInstructionPointer>=this.compiler.arrayOfStrings.length) continue;
                    this.IF = new InstructionObjects(this.compiler.arrayOfObjects[this.currentInstructionPointer],this.compiler,this.compiler.arrayOfStrings);  
                    this.currentInstructionPointer++;
                }
            }
            this.clock++;
        }
        

    }

}
 
