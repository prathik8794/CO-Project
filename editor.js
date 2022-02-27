let editr = ace.edit('editor');
let content1  = editor.session.getLine(0);
// document.querySelector('.simple').textContent = "surya";
// console.log(content1);
// console.log(content1);
arrayOfStrings=[];
// const branchInstruction = function(a,b,c){ bge $s1,$s2
//     if(a === "bge"){
//         return s1>=s2;

//     }


// }
let i =0
while(content1 !== ""){
    content1 = editor.session.getLine(i)
    i++;
    arrayOfStrings.push(content1);
}
console.log(arrayOfStrings);
// //let String = editr.getValue()
// // let selectionRange = editr.getSelectionRange();
// // editr.selection.moveCursorToPosition({row: 0, column: 0});
// let String = editr.$lines[1];
// console.log(String);

