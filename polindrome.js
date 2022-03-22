//number 1    
function solution(str) {
    let strFromParentArray = str.toLowerCase().split('');
    let childArray = strFromParentArray.join('');
    let reverseChildArray = [...childArray].reverse().join('');
    let isPalindrom = childArray == reverseChildArray;
    if (isPalindrom) return reverseChildArray.split(' ').length;
    else return 0;
}

console.log(solution("katak")); //output: 1
console.log(solution("kasur ini rusak")); //output: 3


//number 2
function solution2(str) {
    let strFromParentArray = str.toLowerCase().split('');
    let childArray = strFromParentArray.join('');
    let reverseChildArray = [...childArray].reverse().join('');
    let isPalindrom = childArray == reverseChildArray;
    if (isPalindrom) {
        childArray = childArray.split(" ");
        reverseChildArray = reverseChildArray.split(" ");
        if (childArray[0] === reverseChildArray[0]) {
            return childArray[0];
        } else {
            return false;
        }
    } else {
        return false;
    }
}

console.log(solution2("katak")); //output : katak   
console.log(solution2("kasur ini rusak")); //output : kasur