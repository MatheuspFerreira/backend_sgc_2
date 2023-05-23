export default function createPagination (logList:any, limitPerPage:number) {

    let novoArray:any= [];
    let i = 0;
    const novoLog:any = []
    
    logList.map((current:any) => {
        if(!current.length) {
            novoLog.push(current)
                
        }else if(current.length > 0) {
            for (let i = 0; i < current.length; i++) {
                novoLog.push(current[i])                   
            }              
        }
        return novoLog
    })
    while (i < novoLog.length) {
        novoArray.push(novoLog.slice(i, i + limitPerPage));
        i += limitPerPage;
    }
              
    return novoArray
}