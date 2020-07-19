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

let basicPatternCvs: HTMLCanvasElement;
let basicPatternCtx: CanvasRenderingContext2D | null;

function initBasicPattern(
    stripeWidth: number,
    config: IGenteratorConfig,
): HTMLCanvasElement | null {
    if (!basicPatternCtx) {
        basicPatternCvs = document.createElement('canvas');
        basicPatternCtx = basicPatternCvs.getContext('2d');
        if (!basicPatternCtx) {
            // console.error('Error: Can not get canvas context!!!');
            return null;
        }
    }
    // set basic pattern canvas size
    basicPatternCvs.width = stripeWidth;
    const patternCvsHeight = stripeWidth / 2;
    basicPatternCvs.height = patternCvsHeight;

    // clear
    basicPatternCtx.clearRect(0, 0, basicPatternCvs.width, basicPatternCvs.height);

    let stripeOption: IStripeOption;
    let startX: number = 0;

    for (let i = 0; i < config.stripe.length; i += 1) {
        stripeOption = config.stripe[i];
        basicPatternCtx!.fillStyle = stripeOption.color;
        basicPatternCtx!.fillRect(startX, 0, stripeOption.size, stripeWidth);
        startX += stripeOption.size;

        basicPatternCtx!.fillStyle = config.space.color;
        basicPatternCtx!.fillRect(startX, 0, config.space.size, stripeWidth);
        startX += config.space.size;
    }
    return basicPatternCvs;
}

function renderPatternCanvas(
    bPatternCvs: HTMLCanvasElement,
    patternSize: ISize,
    renderRect: IRect,
    theta: number,
    needFlip: boolean = false,
): HTMLCanvasElement | null {
    const patternCvs = document.createElement('canvas');
    const patternCtx = patternCvs.getContext('2d');

    const pattern = patternCtx!.createPattern(bPatternCvs, 'repeat');
    if (!pattern) {
        // console.error('Error: Can not create pattern!!!');
        return null;
    }

    patternCvs.width = patternSize.width;
    patternCvs.height = patternSize.height;

    patternCtx!.save();

    patternCtx!.translate(renderRect.x, renderRect.y);
    patternCtx!.rotate((theta * Math.PI) / 180);
    patternCtx!.fillStyle = pattern;
    patternCtx!.fillRect(0, 0, renderRect.width, renderRect.height);

    patternCtx!.restore();

    if (needFlip) {
        // 水平翻转
        patternCtx!.scale(-1, 1);
        patternCtx!.drawImage(patternCvs, -patternCvs.width, 0);
    }

    return patternCvs;
}

export default function create(config: IGenteratorConfig): HTMLCanvasElement | null {
    const orientation = config.orientation > 90 ? 180 - config.orientation : config.orientation;
    const needFlip = config.orientation > 90;
    const theta: number = Math.abs(90 - orientation);
    const stripeWidth: number = config.stripe.reduce(
        (acc: number, curr: IStripeOption) => acc + curr.size + config.space.size,
        0,
    );

    // 1、首先，计算出条纹纹理图的大小
    let patternSize: ISize;
    if (orientation === 0 || orientation === 90) {
        patternSize = { width: stripeWidth, height: stripeWidth };
    } else {
        patternSize = calcPatternSize(stripeWidth, theta);
    }

    // 2、其次，计算出绘制这个纹理图的位置和大小(由于进行了角度旋转)
    const renderRect: IRect = calcRenderSize(patternSize, orientation);

    // 3、生成初始纹理
    const bPatternCvs: HTMLCanvasElement | null = initBasicPattern(stripeWidth, config);
    if (!bPatternCvs) {
        return null;
    }

    // 4、生成最终纹理
    const rPattern: HTMLCanvasElement | null = renderPatternCanvas(
        bPatternCvs,
        patternSize,
        renderRect,
        theta,
        needFlip,
    );
    if (!rPattern) {
        return null;
    }

    return rPattern;
}
