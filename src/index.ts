import {
    IStripeOption, IGenteratorConfig, ISize, IRect,
} from './interface';

function cos(theta: number): number {
    return Math.cos((theta * Math.PI) / 180);
}

function sin(theta: number): number {
    return Math.sin((theta * Math.PI) / 180);
}

function calcPatternSize(stripeWidth: number, theta: number): ISize {
    return {
        width: stripeWidth / cos(theta),
        height: stripeWidth / sin(theta),
    };
}

function calcRenderSize(patternSize: ISize, theta: number): IRect {
    const pw = patternSize.width;
    const ph = patternSize.height;
    const x = pw * cos(theta) * cos(theta);
    const y = pw * cos(theta) * sin(theta);
    const w = ph * cos(theta) + pw * sin(theta);
    const h = pw * cos(theta) + ph * sin(theta);
    return {
        x,
        y: -y,
        width: w,
        height: h,
    };
}

export default class StripeGenerator {
    cvs: HTMLCanvasElement;

    ctx: CanvasRenderingContext2D | null;

    patternCvs: HTMLCanvasElement;

    patternCtx: CanvasRenderingContext2D | null;

    constructor() {
        this.cvs = document.createElement('canvas');
        this.patternCvs = document.createElement('canvas');
        this.ctx = this.cvs.getContext('2d');
        this.patternCtx = this.patternCvs.getContext('2d');

        document.body.appendChild(this.patternCvs);
        document.body.appendChild(this.cvs);

        if (!this.ctx || !this.patternCtx) {
            throw new Error('Error: Can not get canvas context!!!');
        }
    }

    create(config: IGenteratorConfig) {
        const theta: number = 90 - config.orientation;
        const stripeWidth: number = config.stripe.reduce(
            (acc: number, curr: IStripeOption) => acc + curr.size + config.space.size,
            0,
        );

        // 1、首先，计算出条纹纹理图的大小
        const patternSize: ISize = calcPatternSize(stripeWidth, theta);
        this.cvs.width = patternSize.width;
        this.cvs.height = patternSize.height;

        // 2、其次，计算出绘制这个纹理图的大小(由于进行了角度旋转)
        const renderRect: IRect = calcRenderSize(patternSize, config.orientation);

        // 3、生成绘制纹理
        const pattern: CanvasPattern = this.generatePattern(stripeWidth, config);

        // 4、最后绘制生成纹理图
        // this.renderPattern();

        this.ctx!.translate(renderRect.x, renderRect.y);
        this.ctx!.rotate((theta * Math.PI) / 180);
        this.ctx!.fillStyle = pattern;
        this.ctx!.fillRect(0, 0, renderRect.width, renderRect.height);

        return this.cvs;
    }

    generatePattern(stripeWidth: number, config: IGenteratorConfig): CanvasPattern {
        this.patternCvs.width = stripeWidth;
        const patternCvsHeight = stripeWidth / 2;
        this.patternCvs.height = patternCvsHeight;

        let stripeOption: IStripeOption;
        let startX: number = 0;

        for (let i = 0; i < config.stripe.length; i += 1) {
            stripeOption = config.stripe[i];
            this.patternCtx!.fillStyle = stripeOption.color;
            this.patternCtx!.fillRect(startX, 0, stripeOption.size, stripeWidth);
            startX += stripeOption.size;

            this.patternCtx!.fillStyle = config.space.color;
            this.patternCtx!.fillRect(startX, 0, config.space.size, stripeWidth);
            startX += config.space.size;
        }
        const pattern = this.ctx!.createPattern(this.patternCvs, 'repeat');
        if (!pattern) {
            throw new Error('Error: Can not create pattern!!!');
        }
        return pattern;
    }

    // renderPattern() {
    // }
}
