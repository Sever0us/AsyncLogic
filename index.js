const { flatten } = require('lodash')


class AsyncLogic {
    constructor(child){
        this.child = child;
        this.promises = [...this.child.getPromises()]
    }
    
    async compute() {
        await Promise.all(this.promises)
        return await this.child.compute()
    }
}

class AsyncLogicalOperator {
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

    getPromises() {
        return this.promises
    }

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
    async operand ( accumulator, current ){
        return await accumulator || await current
    }
}

class AsyncAnd extends AsyncLogicalOperator {
    async operand ( accumulator, current ){
        return await accumulator && await current
    }
}

class AsyncNot extends AsyncLogicalOperator {
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