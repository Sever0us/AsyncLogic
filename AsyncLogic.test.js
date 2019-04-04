const { AsyncLogic, AsyncOr, AsyncAnd, AsyncNot } = require('.')

const TRUE = jest.fn().mockResolvedValue(true);
const FALSE = jest.fn().mockResolvedValue(false);

for (const A of [TRUE, FALSE]) {

    // LAWS OF IDENTITY
    test(`Law of Identity. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
        const logic = new AsyncLogic(new AsyncOr(A, FALSE))
        const result = await logic.compute()
        expect(result).toBe(await A())
    })

    test(`Law of Identity. (AND operator, A:${A === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
        const logic = new AsyncLogic(new AsyncAnd(A, TRUE))
        const result = await logic.compute()
        expect(result).toBe(await A())
    })

    // LAWS OF ANNULMENT
    test(`Law of Annulment. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
        const logic = new AsyncLogic(new AsyncOr(A, TRUE))
        const result = await logic.compute()
        expect(result).toBe(true)
    })

    test(`Law of Annulment. (AND operator, A:${A === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
        const logic = new AsyncLogic(new AsyncAnd(A, FALSE))
        const result = await logic.compute()
        expect(result).toBe(false)
    })

    // LAWS OF IDEMPOTENTENCE
    test(`Law of Idempotence. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
        const logic = new AsyncLogic(new AsyncOr(A, A))
        const result = await logic.compute()
        expect(result).toBe(await A())
    })

    test(`Law of Idempotence. (AND operator, A:${A === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
        const logic = new AsyncLogic(new AsyncAnd(A, A))
        const result = await logic.compute()
        expect(result).toBe(await A())
    })

    // LAW OF DOUBLE NEGATION
    test(`Law of Double Negation. (NOT operator, A:${A === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
        const logic = new AsyncLogic(new AsyncNot( new AsyncNot(A)))
        const result = await logic.compute()
        expect(result).toBe(await A())
    })

    // LAW OF COMPLEMENTS
    test(`Law of Complements. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
        const logic = new AsyncLogic(new AsyncOr(A, new AsyncNot(A)))
        const result = await logic.compute()
        expect(result).toBe(true)
    })

    test(`Law of Complements. (AND operator, A:${A === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
        const logic = new AsyncLogic(new AsyncAnd(A, new AsyncNot(A)))
        const result = await logic.compute()
        expect(result).toBe(false)
    })


    for (const B of [TRUE, FALSE]) {
        // LAW OF COMMUTATIVITY
        test(`Law of Commutativity. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'} B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
            const logicLHS = new AsyncLogic(new AsyncOr(A, B))
            const resultLHS = await logicLHS.compute()
            const logicRHS = new AsyncLogic(new AsyncOr(B, A))
            const resultRHS = await logicRHS.compute()
            expect(resultLHS).toBe(resultRHS)
        })

        test(`Law of Commutativity. (AND operator, A:${A === TRUE ? 'TRUE' : 'FALSE'}) B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
            const logicLHS = new AsyncLogic(new AsyncAnd(A, B))
            const resultLHS = await logicLHS.compute()
            const logicRHS = new AsyncLogic(new AsyncAnd(B, A))
            const resultRHS = await logicRHS.compute()
            expect(resultLHS).toBe(resultRHS)
        })

        //DE MORGAN'S LAW
        test(`De Morgan's Law. (part one, A:${A === TRUE ? 'TRUE' : 'FALSE'}) B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
            const logicLHS = new AsyncLogic(new AsyncNot(new AsyncAnd(A, B)))
            const resultLHS = await logicLHS.compute()
            const logicRHS = new AsyncLogic(new AsyncOr(new AsyncNot(B), new AsyncNot(A)))
            const resultRHS = await logicRHS.compute()
            expect(resultLHS).toBe(resultRHS)
        })

        test(`De Morgan's Law. (part two, A:${A === TRUE ? 'TRUE' : 'FALSE'}) B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
            const logicLHS = new AsyncLogic(new AsyncNot(new AsyncOr(A, B)))
            const resultLHS = await logicLHS.compute()
            const logicRHS = new AsyncLogic(new AsyncAnd(new AsyncNot(B), new AsyncNot(A)))
            const resultRHS = await logicRHS.compute()
            expect(resultLHS).toBe(resultRHS)
        })

        //ABSORBATIVE LAW
        test(`Absorbative law. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'} B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
            const logic = new AsyncLogic(new AsyncAnd(A, new AsyncOr(A, B)))
            const result = await logic.compute()
            expect(result).toBe(await A())
        })

        test(`Absorbative law. (AND operator, A:${A === TRUE ? 'TRUE' : 'FALSE'}) B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
            const logic = new AsyncLogic(new AsyncOr(A, new AsyncAnd(A, B)))
            const result = await logic.compute()
            expect(result).toBe(await A())
        })

        for (const C of [TRUE, FALSE]) {
            // LAW OF DISTRIBUTION
            test(`Law of Distribution. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'} B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
                const logicLHS = new AsyncLogic(new AsyncOr(A, new AsyncAnd(B, C)))
                const resultLHS = await logicLHS.compute()
                const logicRHS = new AsyncLogic(new AsyncAnd(new AsyncOr(A, B), new AsyncOr(A, C)))
                const resultRHS = await logicRHS.compute()
                expect(resultLHS).toBe(resultRHS)
            })
    
            
            test(`Law of Distribution. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'} B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
                const logicLHS = new AsyncLogic(new AsyncAnd(A, new AsyncOr(B, C)))
                const resultLHS = await logicLHS.compute()
                const logicRHS = new AsyncLogic(new AsyncOr(new AsyncAnd(A, B), new AsyncAnd(A, C)))
                const resultRHS = await logicRHS.compute()
                expect(resultLHS).toBe(resultRHS)
            })

            // LAW OF ASSOCIATION
            test(`Law of Association. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'} B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
                const logicLHS = new AsyncLogic(new AsyncAnd(A, new AsyncAnd(B, C)))
                const resultLHS = await logicLHS.compute()
                const logicRHS = new AsyncLogic(new AsyncAnd(new AsyncAnd(A, B), C))
                const resultRHS = await logicRHS.compute()
                expect(resultLHS).toBe(resultRHS)
            })
    
            
            test(`Law of Association. (OR operator, A:${A === TRUE ? 'TRUE' : 'FALSE'} B:${B === TRUE ? 'TRUE' : 'FALSE'})`, async () => {
                const logicLHS = new AsyncLogic(new AsyncOr(A, new AsyncOr(B, C)))
                const resultLHS = await logicLHS.compute()
                const logicRHS = new AsyncLogic(new AsyncOr(new AsyncOr(A, B), C))
                const resultRHS = await logicRHS.compute()
                expect(resultLHS).toBe(resultRHS)
            })
        }
    }
}



// Does not perform boolean coercion
test(`Or operator does not perform boolean coercion`, async () => {
    const truthy = jest.fn().mockResolvedValue('truthy');
    const falsy = jest.fn().mockResolvedValue(null);

    const logic = new AsyncLogic(new AsyncOr(truthy, falsy))
    const result = await logic.compute()
    expect(result).toBe('truthy')
})

test(`And operator does not perform boolean coercion`, async () => {
    const truthy = jest.fn().mockResolvedValue('truthy');

    const logic = new AsyncLogic(new AsyncAnd(truthy, truthy))
    const result = await logic.compute()
    expect(result).toBe('truthy')
})

// Preserves chaining behaviour from standard booleans
test(`Or preserves chaining behaviour from standard booleans`, async () => {
    const truthy1 = jest.fn().mockResolvedValue('truthy1');
    const truthy2 = jest.fn().mockResolvedValue('truthy2');
    const falsy = jest.fn().mockResolvedValue(null);

    const logic = new AsyncLogic(new AsyncOr(falsy, falsy, falsy, truthy1, truthy2, falsy))
    const result = await logic.compute()
    expect(result).toBe('truthy1')
})

test(`And preserves chaining behaviour from standard booleans`, async () => {
    const truthy = jest.fn().mockResolvedValue('truthy');
    const falsy1 = jest.fn().mockResolvedValue(undefined);
    const falsy2 = jest.fn().mockResolvedValue(null);

    const logic = new AsyncLogic(new AsyncAnd(truthy, truthy, truthy, falsy1, falsy2, truthy))
    const result = await logic.compute()
    expect(result).toBe(undefined)
})