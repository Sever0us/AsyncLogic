# AsyncLogic
An Asynchronous framework for logical operands in NodeJS.

[See full API docs here](https://theinsomnolent.github.io/AsyncLogic/)


## Installing
To install `AsyncLogic` simply run:
```bash
$ yarn add @me3d/async-logic
```
or
```bash
$ npm install @me3d/async-logic
```

## Using AsyncLogic
### Importing
AsyncLogic's base components can be imported into your Node project using:
```javascript
const { AsyncLogic, AsyncOr, AsyncAnd, AsyncNot } = require('@me3d/async-logic')
```

### Setting up a basic AsyncLogic environment
A basic async environment can be constructed with:
1. An `AsyncLogic` instance
2. At least one async operator such as `AsyncOr`
3. At least two async input functions to evaluate
```javascript
const result = await new AsyncLogic(
    new AsyncOr(
        asyncFunctionOne,
        asyncFunctionTwo
    )
).compute()
```

### Multi-input operators
Operators can support an arbitrary number of inputs. 
```javascript
const result = await new AsyncLogic(
    new AsyncAnd(
        asyncFunctionOne,
        asyncFunctionTwo,
        asyncFunctionThree,
        asyncFunctionFour,
        asyncFunctionFive
    )
).compute()
```


### Nesting operators
Operators can easily be nested as follows:
```javascript
const result = await new AsyncLogic(
    new AsyncAnd(
        asyncFunctionOne,
        new AsyncOr(
            asyncFunctionTwo,
            asyncFunctionThree
        )
    )
).compute()
```
