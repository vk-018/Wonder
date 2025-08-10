class ExpressError extends Error{             //Express eroor inhereting values from already created error class
    constructor(status,message){
       super();
       this.status=status;
       this.message=message;
    }
}


export default ExpressError

