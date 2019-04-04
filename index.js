const { flatten } = require('lodash')


class AsyncLogic {
    /**
     * The root async logic environment which should be instantiated around any Async logical operators 
     * @constructor
     * @param {AsyncOr|AsyncAnd|AsyncNot} child - The root operator for an async logic operator
     */
    constructor(child){
        this.child = child;
        this.promises = [...this.child.getPromises()]
    }
    
    /**
     * The method to call to execute the comparison and return the appropriate reference value.
     * @async
     */
    async compute() {
        await Promise.all(this.promises)
        return await this.child.compute()
    }
}

class AsyncLogicalOperator {
    /**
     * The superclass for all other async logic operators. Cannot be used directly.
     * @constructor
     * @package
     * @param {function|async-function|AsyncOr|AsyncAnd|AsyncNot} children - Operands can either be functions which return a value to be evaluated or a nested logic operator
     */
    constructor( ...children ){
        // Make sure children which are not aysnc logic ops are called
        this.children = [ ...children ].map( (child) => {
            if ( child instanceof AsyncLogicalOperator ) return child
            else return child()
        })

        this.promises = flatten(
            this.children.map( (child) => {
                if ( child instanceof AsyncLogicalOperator ) return child.getPromises()
                else return child
            })
        )
    }

    /**
     * Utility function which returns the list of promises for the operators children
     * @package
     */
    getPromises() {
        return this.promises
    }

    /**
     * Utility function which computes the logical result of the operators children
     * @package
     * @async
     */
    async compute() {
        return this.children
            .map( async (child) => {
                if ( child instanceof AsyncLogicalOperator ) return await child.compute()
                else return await child
            })
            .reduce(this.operand)
    }
}

class AsyncOr extends AsyncLogicalOperator {
    /**
     * The AsyncOr class takes more than one input and asynchronously computes the chained logical or
     * @constructor
     * @public
     * @override
     * @extends AsyncLogicalOperator
     * @param {function|async-function|AsyncOr|AsyncAnd|AsyncNot} children - Operands can either be functions which return a value to be evaluated or a nested logic operator
     */
    constructor( ...children ){
        super(...children)
    }

    /**
     * Utility function which defines the behaviour of the operand
     * @async
     * @public
     */
    async operand ( accumulator, current ){
        return await accumulator || await current
    }
}

class AsyncAnd extends AsyncLogicalOperator {
    /**
     * The AsyncAnd class takes more than one input and asynchronously computes the chained logical and
     * @constructor
     * @public
     * @override
     * @extends AsyncLogicalOperator
     * @param {function|async-function|AsyncOr|AsyncAnd|AsyncNot} children - Operands can either be functions which return a value to be evaluated or a nested logic operator
     */
    constructor( ...children ){
        super(...children)
    }

    /**
     * Utility function which defines the behaviour of the operand
     * @async
     * @public
     */
    async operand ( accumulator, current ){
        return await accumulator && await current
    }
}

class AsyncNot extends AsyncLogicalOperator {
    /**
     * The AsyncNot class takes one input and asynchronously computes its logical inverse
     * @constructor
     * @public
     * @override
     * @extends AsyncLogicalOperator
     * @param {function|async-function|AsyncOr|AsyncAnd|AsyncNot} children - Operand must be one either a function which return a value to be evaluated or a nested logic operator
     */
    constructor( ...children ){
        super(...children)
        // Make sure children which are not aysnc logic ops are called
        this.children = [ ...children ].map( (child) => {
            if ( child instanceof AsyncLogicalOperator ){ 
                return child
            }
            else{ 
                return child()
            }
        })

        if (this.children.length !== 1) throw new Error('AsyncNot can only support one child')

        this.promises = flatten(
            this.children.map( (child) => {
                if ( child instanceof AsyncLogicalOperator ) return child.getPromises()
                else return child
            })
        )
    }
    /**
     * Utility function which defines the behaviour of the operand
     * @async
     * @package
     */
    async compute() {
        const child =  this.children[0]
        if ( child instanceof AsyncLogicalOperator ) return !(await child.compute())
        else return !(await child)
    }
}

module.exports = {
    AsyncLogic,
    AsyncOr,
    AsyncAnd,
    AsyncNot
}