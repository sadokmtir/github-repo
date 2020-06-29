import {Transform, TransformCallback} from 'stream';

export default class StreamTransformer extends Transform {
    private index: number;

    public constructor() {
        super({writableObjectMode: true});
        this.index = 0;
    }

    _transform(data: any, encoding: string, done: TransformCallback) {
        if (!(this.index++)) {
            this.push('[');
        } else {
            this.push(',');
        }
        for (let i = 0; i < data.length; i++) {
            this.push(JSON.stringify(data[i]));
            if (i !== data.length - 1) {
                this.push(',');
            }
        }
        done();
    }

    _flush(done: TransformCallback) {
        if (!(this.index++)) {
            this.push('[]');
        } else {
            this.push(']');
        }
        done();
    }
}
