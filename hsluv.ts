export class Hsluv {
    private static hexChars: string = "0123456789abcdef";
    private static refY: number = 1.0;
    private static refU: number = 0.19783000664283;
    private static refV: number = 0.46831999493879;
    private static kappa: number = 903.2962962;
    private static epsilon: number = 0.0088564516;
    private static m_r0: number = 3.240969941904521;
    private static m_r1: number = -1.537383177570093;
    private static m_r2: number = -0.498610760293;
    private static m_g0: number = -0.96924363628087;
    private static m_g1: number = 1.87596750150772;
    private static m_g2: number = 0.041555057407175;
    private static m_b0: number = 0.055630079696993;
    private static m_b1: number = -0.20397695888897;
    private static m_b2: number = 1.056971514242878;

    // RGB
    public hex: string = '#000000';
    public rgb_r: number = 0;
    public rgb_g: number = 0;
    public rgb_b: number = 0;

    // CIE XYZ
    public xyz_x: number = 0;
    public xyz_y: number = 0;
    public xyz_z: number = 0;

    // CIE LUV
    public luv_l: number = 0;
    public luv_u: number = 0;
    public luv_v: number = 0;

    // CIE LUV LCh
    public lch_l: number = 0;
    public lch_c: number = 0;
    public lch_h: number = 0;

    // HSLuv
    public hsluv_h: number = 0;
    public hsluv_s: number = 0;
    public hsluv_l: number = 0;

    // HPLuv
    public hpluv_h: number = 0;
    public hpluv_p: number = 0;
    public hpluv_l: number = 0;

    // 6 lines in slope-intercept format: R < 0, R > 1, G < 0, G > 1, B < 0, B > 1
    public r0s: number = 0;
    public r0i: number = 0;
    public r1s: number = 0;
    public r1i: number = 0;

    public g0s: number = 0;
    public g0i: number = 0;
    public g1s: number = 0;
    public g1i: number = 0;

    public b0s: number = 0;
    public b0i: number = 0;
    public b1s: number = 0;
    public b1i: number = 0;

    private static fromLinear(c: number): number {
        if (c <= 0.0031308) {
            return 12.92 * c;
        } else {
            return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
        }
    }

    private static toLinear(c: number): number {
        if (c > 0.04045) {
            return Math.pow((c + 0.055) / 1.055, 2.4);
        } else {
            return c / 12.92;
        }
    }

    private static yToL(Y: number): number {
        if (Y <= Hsluv.epsilon) {
            return Y / Hsluv.refY * Hsluv.kappa;
        } else {
            return 116 * Math.pow(Y / Hsluv.refY, 1 / 3) - 16;
        }
    }

    private static lToY(L: number): number {
        if (L <= 8) {
            return Hsluv.refY * L / Hsluv.kappa;
        } else {
            return Hsluv.refY * Math.pow((L + 16) / 116, 3);
        }
    }

    private static rgbChannelToHex(chan: number): string {
        const c = Math.round(chan * 255);
        const digit2 = c % 16;
        const digit1 = (c - digit2) / 16 | 0;
        return Hsluv.hexChars.charAt(digit1) + Hsluv.hexChars.charAt(digit2);
    }

    private static hexToRgbChannel(hex: string, offset: number): number {
        const digit1 = Hsluv.hexChars.indexOf(hex.charAt(offset));
        const digit2 = Hsluv.hexChars.indexOf(hex.charAt(offset + 1));
        const n = digit1 * 16 + digit2;
        return n / 255.0;
    }

    private static distanceFromOriginAngle(slope: number, intercept: number, angle: number): number {
        const d = intercept / (Math.sin(angle) - slope * Math.cos(angle));
        if (d < 0) {
            return Infinity;
        } else {
            return d;
        }
    }

    private static distanceFromOrigin(slope: number, intercept: number): number {
        return Math.abs(intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
    }

    private static min6(f1: number, f2: number, f3: number, f4: number, f5: number, f6: number): number {
        return Math.min(f1, Math.min(f2, Math.min(f3, Math.min(f4, Math.min(f5, f6)))));
    }

    public rgbToHex(): void {
        this.hex = "#";
        this.hex += Hsluv.rgbChannelToHex(this.rgb_r);
        this.hex += Hsluv.rgbChannelToHex(this.rgb_g);
        this.hex += Hsluv.rgbChannelToHex(this.rgb_b);
    }

    public hexToRgb(): void {
        this.hex = this.hex.toLowerCase();
        this.rgb_r = Hsluv.hexToRgbChannel(this.hex, 1);
        this.rgb_g = Hsluv.hexToRgbChannel(this.hex, 3);
        this.rgb_b = Hsluv.hexToRgbChannel(this.hex, 5);
    }

    public xyzToRgb(): void {
        this.rgb_r = Hsluv.fromLinear(Hsluv.m_r0 * this.xyz_x + Hsluv.m_r1 * this.xyz_y + Hsluv.m_r2 * this.xyz_z);
        this.rgb_g = Hsluv.fromLinear(Hsluv.m_g0 * this.xyz_x + Hsluv.m_g1 * this.xyz_y + Hsluv.m_g2 * this.xyz_z);
        this.rgb_b = Hsluv.fromLinear(Hsluv.m_b0 * this.xyz_x + Hsluv.m_b1 * this.xyz_y + Hsluv.m_b2 * this.xyz_z);
    }

    public rgbToXyz(): void {
        const lr = Hsluv.toLinear(this.rgb_r);
        const lg = Hsluv.toLinear(this.rgb_g);
        const lb = Hsluv.toLinear(this.rgb_b);
        this.xyz_x = 0.41239079926595 * lr + 0.35758433938387 * lg + 0.18048078840183 * lb;
        this.xyz_y = 0.21263900587151 * lr + 0.71516867876775 * lg + 0.072192315360733 * lb;
        this.xyz_z = 0.019330818715591 * lr + 0.11919477979462 * lg + 0.95053215224966 * lb;
    }

    public xyzToLuv(): void {
        const divider = this.xyz_x + 15 * this.xyz_y + 3 * this.xyz_z;
        let varU = 4 * this.xyz_x;
        let varV = 9 * this.xyz_y;
        if (divider !== 0) {
            varU /= divider;
            varV /= divider;
        } else {
            varU = NaN;
            varV = NaN;
        }
        this.luv_l = Hsluv.yToL(this.xyz_y);
        if (this.luv_l === 0) {
            this.luv_u = 0;
            this.luv_v = 0;
        } else {
            this.luv_u = 13 * this.luv_l * (varU - Hsluv.refU);
            this.luv_v = 13 * this.luv_l * (varV - Hsluv.refV);
        }
    }

    public luvToXyz(): void {
        if (this.luv_l === 0) {
            this.xyz_x = 0;
            this.xyz_y = 0;
            this.xyz_z = 0;
            return;
        }
        const varU = this.luv_u / (13 * this.luv_l) + Hsluv.refU;
        const varV = this.luv_v / (13 * this.luv_l) + Hsluv.refV;
        this.xyz_y = Hsluv.lToY(this.luv_l);
        this.xyz_x = 0 - 9 * this.xyz_y * varU / ((varU - 4) * varV - varU * varV);
        this.xyz_z = (9 * this.xyz_y - 15 * varV * this.xyz_y - varV * this.xyz_x) / (3 * varV);
    }

    public luvToLch(): void {
        this.lch_l = this.luv_l;
        this.lch_c = Math.sqrt(this.luv_u * this.luv_u + this.luv_v * this.luv_v);
        if (this.lch_c < 0.00000001) {
            this.lch_h = 0;
        } else {
            const hrad = Math.atan2(this.luv_v, this.luv_u);
            this.lch_h = hrad * 180.0 / Math.PI;
            if (this.lch_h < 0) {
                this.lch_h = 360 + this.lch_h;
            }
        }
    }


    public lchToLuv(): void {
        const hrad = this.lch_h / 180.0 * Math.PI;
        this.luv_l = this.lch_l;
        this.luv_u = Math.cos(hrad) * this.lch_c;
        this.luv_v = Math.sin(hrad) * this.lch_c;
    }

    public calculateBoundingLines(l: number): void {
        const sub1 = Math.pow(l + 16, 3) / 1560896;
        const sub2 = sub1 > Hsluv.epsilon ? sub1 : l / Hsluv.kappa;
        const s1r = sub2 * (284517 * Hsluv.m_r0 - 94839 * Hsluv.m_r2);
        const s2r = sub2 * (838422 * Hsluv.m_r2 + 769860 * Hsluv.m_r1 + 731718 * Hsluv.m_r0);
        const s3r = sub2 * (632260 * Hsluv.m_r2 - 126452 * Hsluv.m_r1);
        const s1g = sub2 * (284517 * Hsluv.m_g0 - 94839 * Hsluv.m_g2);
        const s2g = sub2 * (838422 * Hsluv.m_g2 + 769860 * Hsluv.m_g1 + 731718 * Hsluv.m_g0);
        const s3g = sub2 * (632260 * Hsluv.m_g2 - 126452 * Hsluv.m_g1);
        const s1b = sub2 * (284517 * Hsluv.m_b0 - 94839 * Hsluv.m_b2);
        const s2b = sub2 * (838422 * Hsluv.m_b2 + 769860 * Hsluv.m_b1 + 731718 * Hsluv.m_b0);
        const s3b = sub2 * (632260 * Hsluv.m_b2 - 126452 * Hsluv.m_b1);
        this.r0s = s1r / s3r;
        this.r0i = s2r * l / s3r;
        this.r1s = s1r / (s3r + 126452);
        this.r1i = (s2r - 769860) * l / (s3r + 126452);
        this.g0s = s1g / s3g;
        this.g0i = s2g * l / s3g;
        this.g1s = s1g / (s3g + 126452);
        this.g1i = (s2g - 769860) * l / (s3g + 126452);
        this.b0s = s1b / s3b;
        this.b0i = s2b * l / s3b;
        this.b1s = s1b / (s3b + 126452);
        this.b1i = (s2b - 769860) * l / (s3b + 126452);
    }

    public calcMaxChromaHpluv(): number {
        const r0 = Hsluv.distanceFromOrigin(this.r0s, this.r0i);
        const r1 = Hsluv.distanceFromOrigin(this.r1s, this.r1i);
        const g0 = Hsluv.distanceFromOrigin(this.g0s, this.g0i);
        const g1 = Hsluv.distanceFromOrigin(this.g1s, this.g1i);
        const b0 = Hsluv.distanceFromOrigin(this.b0s, this.b0i);
        const b1 = Hsluv.distanceFromOrigin(this.b1s, this.b1i);
        return Hsluv.min6(r0, r1, g0, g1, b0, b1);
    }

    public calcMaxChromaHsluv(h: number): number {
        const hueRad = h / 360 * Math.PI * 2;
        const r0 = Hsluv.distanceFromOriginAngle(this.r0s, this.r0i, hueRad);
        const r1 = Hsluv.distanceFromOriginAngle(this.r1s, this.r1i, hueRad);
        const g0 = Hsluv.distanceFromOriginAngle(this.g0s, this.g0i, hueRad);
        const g1 = Hsluv.distanceFromOriginAngle(this.g1s, this.g1i, hueRad);
        const b0 = Hsluv.distanceFromOriginAngle(this.b0s, this.b0i, hueRad);
        const b1 = Hsluv.distanceFromOriginAngle(this.b1s, this.b1i, hueRad);
        return Hsluv.min6(r0, r1, g0, g1, b0, b1);
    }

    public hsluvToLch(): void {
        if (this.hsluv_l > 99.9999999) {
            this.lch_l = 100;
            this.lch_c = 0;
        } else if (this.hsluv_l < 0.00000001) {
            this.lch_l = 0;
            this.lch_c = 0;
        } else {
            this.lch_l = this.hsluv_l;
            this.calculateBoundingLines(this.hsluv_l);
            const max = this.calcMaxChromaHsluv(this.hsluv_h);
            this.lch_c = max / 100 * this.hsluv_s;
        }
        this.lch_h = this.hsluv_h;
    }

    public lchToHsluv(): void {
        if (this.lch_l > 99.9999999) {
            this.hsluv_s = 0;
            this.hsluv_l = 100;
        } else if (this.lch_l < 0.00000001) {
            this.hsluv_s = 0;
            this.hsluv_l = 0;
        } else {
            this.calculateBoundingLines(this.lch_l);
            const max = this.calcMaxChromaHsluv(this.lch_h);
            this.hsluv_s = this.lch_c / max * 100;
            this.hsluv_l = this.lch_l;
        }
        this.hsluv_h = this.lch_h;
    }

    public hpluvToLch(): void {
        if (this.hpluv_l > 99.9999999) {
            this.lch_l = 100;
            this.lch_c = 0;
        } else if (this.hpluv_l < 0.00000001) {
            this.lch_l = 0;
            this.lch_c = 0;
        } else {
            this.lch_l = this.hpluv_l;
            this.calculateBoundingLines(this.hpluv_l);
            const max = this.calcMaxChromaHpluv();
            this.lch_c = max / 100 * this.hpluv_p;
        }
        this.lch_h = this.hpluv_h;
    }

    public lchToHpluv(): void {
        if (this.lch_l > 99.9999999) {
            this.hpluv_p = 0;
            this.hpluv_l = 100;
        } else if (this.lch_l < 0.00000001) {
            this.hpluv_p = 0;
            this.hpluv_l = 0;
        } else {
            this.calculateBoundingLines(this.lch_l);
            const max = this.calcMaxChromaHpluv();
            this.hpluv_p = this.lch_c / max * 100;
            this.hpluv_l = this.lch_l;
        }
        this.hpluv_h = this.lch_h;
    }

    public hsluvToRgb(): void {
        this.hsluvToLch();
        this.lchToLuv();
        this.luvToXyz();
        this.xyzToRgb();
    }

    public hpluvToRgb(): void {
        this.hpluvToLch();
        this.lchToLuv();
        this.luvToXyz();
        this.xyzToRgb();
    }

    public hsluvToHex(): void {
        this.hsluvToRgb();
        this.rgbToHex();
    }

    public hpluvToHex(): void {
        this.hpluvToRgb();
        this.rgbToHex();
    }

    public rgbToHsluv(): void {
        this.rgbToXyz();
        this.xyzToLuv();
        this.luvToLch();
        this.lchToHpluv();
        this.lchToHsluv();
    }

    public rgbToHpluv(): void {
        this.rgbToXyz();
        this.xyzToLuv();
        this.luvToLch();
        this.lchToHpluv();
        this.lchToHpluv();
    }

    public hexToHsluv(): void {
        this.hexToRgb();
        this.rgbToHsluv();
    }

    public hexToHpluv(): void {
        this.hexToRgb();
        this.rgbToHpluv();
    }
}
