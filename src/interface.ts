export interface IStripeOption {
    size: number;
    color: string;
}

export interface IGenteratorConfig {
    stripe: Array<IStripeOption>;
    space: IStripeOption;
    orientation: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IRect extends ISize {
    x: number;
    y: number;
}
