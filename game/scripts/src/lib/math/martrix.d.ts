interface matrix {
    data:number[][];
    _new(this:any,rows:number|Array<Array<number>>, columns?:number, value?:number):matrix;
    add(this:void,m1:matrix,m2:matrix):matrix
    sub(this:void,m1:matrix,m2:matrix):matrix
    mul(this:void,m1:matrix,m2:matrix):matrix
    div(this:void,m1:matrix,m2:matrix):matrix
    mulnum(this:void,m1:matrix,num:number):matrix
    divnum(this:void,m1:matrix,num:number):matrix
    pow(this:void,m1:matrix,num:number):matrix
    det(this:void,m1:matrix):number
    dogauss(this:void,m1:matrix):matrix
    invert(this:void,m1:matrix):matrix
    sqrt(this:void,m1:matrix):matrix
    root(this:void,m1:matrix,root:number,iters:number):matrix
    normf(this:void,m1:matrix):number
    normmax(this:void,m1:matrix):number
    round(this:void,m1:matrix,idp:number):matrix
    random(this:void,m1:matrix,start:number,stop:number,idp:number):matrix
    type(this:void,m1:matrix):string
    copy(this:void,m1:matrix):matrix
    transpose(this:void,m1:matrix):matrix
    subm(this:void,m1:matrix,i1:number,j1:number,i2:number,j2:number):matrix
    concath(this:void,m1:matrix,m2:matrix):matrix
    concatv(this:void,m1:matrix,m2:matrix):matrix
    rotl(this:void,m1:matrix):matrix
    rotr(this:void,m1:matrix):matrix
    tostring(this:void,m1:matrix,formatstr:string):string
    print(...args);
    latex(this:void,m1:matrix,align:string):string
    rows(this:void,m1:matrix):number
    columns(this:void,m1:matrix):number
    getelement(this:void,m1:matrix,i:number,j:number):number
    setelement(this:void,m1:matrix,i:number,j:number,value:number):matrix
    ipairs(this:void,m1:matrix):matrix
    scalar(this:void,m1:matrix,m2:matrix):number
    cross(this:void,m1:matrix,m2:matrix):matrix
    len(this:void,m1:matrix):number
    replace(this:void,m1:matrix,func:(any)=>void,...args):matrix
    elementstostrings(this:void,m1:matrix):string
    solve(this:void,m1:matrix):matrix
    apply_sigmoid_to_matrix(this:void,m1:matrix):matrix
    sigmoid(this:void,num:number):number
}


export var matrix:matrix; 