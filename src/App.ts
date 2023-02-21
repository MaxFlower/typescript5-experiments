function errorHandler(fn: any, context: ClassMethodDecoratorContext) {
    console.log('----errorHandler----');
    try {
        // @ts-ignore
        const result = function (this, ...args) {
            return `${this._name} said: ${fn.call(this, ...args)}`
        }
        return result;
    } catch(_) {
        console.error('Error in method ', context.name)
        return () => '';
    }
}
function logger(fn: any, context: ClassMethodDecoratorContext) {
    console.log('----logger----')

    console.error('Run method ', context.name)
    // @ts-ignore
    const result = function (this, ...args) {
        return `${this._name} said: ${fn.call(this, ...args)}`
    }

    console.error('Done computing ', context.name)
    return result;
}

// decorator with argument
function addPrefix(prefix: string) {
    return function actualDecorator(originalMethod: any, _: ClassMethodDecoratorContext) {
        return function replacementMethod(this: any, ...args: any[]) {
            return `${prefix} posted message:  ${originalMethod.call(this, ...args)}`;
        }
    }
}

class Pet {
    private readonly _name: string
    constructor(name: string) {
        this._name = name;
    }

    @addPrefix('Cat')
    @logger        // order #2
    @errorHandler  // order #1
    sayHi() {
        return `Hi, I am ${this._name}`;
    }
}

const tomCat = new Pet('Tom');
console.log(tomCat.sayHi());
