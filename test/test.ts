import * as Assert from 'assert';
import { assert } from 'console';
import main from '../src/index';

describe("Main",()=>{
    it("should return 0",()=>{
        Assert.strictEqual(main(),0);
    });
});